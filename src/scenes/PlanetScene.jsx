import { useRef, useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF, PerspectiveCamera } from '@react-three/drei';
import { gsap } from 'gsap';
import { Vector3, Euler, MathUtils } from 'three';

import StarField from '../components/effects/StarField';
import Nebula from '../components/effects/Nebula';
import Planet, { PLANET_CONFIGS } from '../components/planets/Planet';
import Spaceship from '../components/spaceship/Spaceship';
import backgroundModelUrl from '../components/effects/background.glb?url';

useGLTF.preload(backgroundModelUrl);

// ---------- constants (unchanged) ----------
const PLANET_TYPES = ['webdev', 'cybersec', 'cloud', 'electronics', 'leadership'];
const MIN_ORBIT_RADIUS = 30;
const MAX_ORBIT_RADIUS = 100;
const ORBIT_VERTICAL_SPREAD = 1.2;
const SINGLE_RING_VARIATION = 2.0;

// Rebalanced: webdev was sitting right on the ship's spawn axis (angle 0, radius 30,
// z=0) and electronics was cramped against leadership on the far side of the ring.
// Angles are now offset by +26° and radius has a small per-planet jitter so the ring
// reads as a real orbit instead of a flat pentagon. Heights unchanged in spirit, just
// re-ordered to match.
const ORBIT_ANGLE_OFFSET = Math.PI * (26 / 180); // shifts the whole ring off the spawn axis
const ORBIT_RADIUS_JITTER = [0, 6, -4, 10, -6];   // per-planet radius nudge (webdev..leadership)
const ORBIT_HEIGHTS = [0.9, -0.4, 0.7, -0.5, 0.4];

const WIDE_CAM = { x: 0, y: 18, z: 220 };
const WIDE_LOOK = { x: 0, y: 1.8, z: -90 };

const CAMERA_FOLLOW_OFFSET = { x: 0.4, y: 2.2, z: 10.5 };
const CAMERA_OVERVIEW_OFFSET = { x: 0, y: 3.2, z: 16 };

const FLIGHT_SPEED = 0.32;
const ARRIVAL_RADIUS_XY = 2.4;
const ARRIVAL_RADIUS_Z = 8;
const Z_MIN = -1000;
const Z_MAX = 10;
const X_LIMIT = 300;
const Y_LIMIT = 100;

// How many consecutive frames the "nearest planet" has to agree before we actually
// fire onSelectPlanet. This kills the flicker-triggered re-selection that was
// restarting the GSAP camera/ship tweens every frame near a planet's boundary.
const SELECT_HYSTERESIS_FRAMES = 6;
// Only rescan for the nearest planet every N frames instead of every frame — the
// approach targets don't move fast enough to need a check at full framerate.
const AUTO_SELECT_SCAN_INTERVAL = 3;

const KEY_MAP = {
  KeyW: 'forward', ArrowUp: 'forward',
  KeyS: 'back', ArrowDown: 'back',
  KeyA: 'left', ArrowLeft: 'left',
  KeyD: 'right', ArrowRight: 'right',
  KeyR: 'up',
  KeyF: 'down',
  Space: 'boost',
};

// ---------- helpers (now accept an optional target Vector3 to write into,
// so hot-path callers can reuse a scratch vector instead of allocating) ----------
function getOrbitPosition(planet, time = 0, target = new Vector3()) {
  const angle = planet.angle + planet.orbitSpeed * time;
  const x = planet.radius * Math.cos(angle);
  const z = planet.radius * Math.sin(angle);
  const y = Math.max(-1.8, Math.min(1.8, planet.y + Math.sin(time * 0.35 + planet.index) * 0.45));
  return target.set(x, y, z);
}

const _approachCenter = new Vector3();
const _approachDir = new Vector3();
function getApproachTarget(planet, shipPosition, time = 0, target = new Vector3()) {
  const center = getOrbitPosition(planet, time, _approachCenter);
  _approachDir.set(shipPosition.x - center.x, shipPosition.y - center.y, shipPosition.z - center.z);

  if (_approachDir.lengthSq() < 0.0001) {
    _approachDir.set(0, 0, -1);
  } else {
    _approachDir.normalize();
  }

  const radius = PLANET_CONFIGS[planet.type]?.radius || 2.0;
  return target.copy(center).addScaledVector(_approachDir, radius + 8);
}

// ---------- main component ----------
export default function PlanetScene({
  activePlanet,
  onSelectPlanet,
  onZoomOut,
  onReady = () => {}
}) {

  const camRef = useRef();
  const shipRef = useRef();
  const bgRef = useRef();
  const { gl } = useThree();

  // ----- LOAD BACKGROUND MODEL -----
  const { scene: bgScene } = useGLTF(backgroundModelUrl);
  const readyRef = useRef(false);

  useEffect(() => {
    if (!bgScene || readyRef.current) return;
    readyRef.current = true;
    onReady();
  }, [bgScene, onReady]);

  const shipPosRef = useRef({ x: 0, y: -0.2, z: 4 });
  const prevShipPos = useRef({ x: 0, y: -0.2, z: 4 });

  const pressedKeys = useRef(new Set());
  const manualControlActive = useRef(false);
  const lastAutoSelected = useRef(null);
  // hysteresis bookkeeping for auto-select
  const pendingSelectIndex = useRef(null);
  const pendingSelectStreak = useRef(0);
  const frameCounter = useRef(0);

  const shipRotation = useRef({ yaw: Math.PI, pitch: 0 });
  const shipEuler = useMemo(() => new Euler(0, 0, 0, 'YXZ'), []);
  const shipDirection = useMemo(() => new Vector3(0, 0, -1), []);
  const shipCamOffset = useMemo(() => new Vector3(0, 2.6, 12), []);
  const focusPoint = useRef(new Vector3(0, 0, 0));
  const shipVelocity = useRef(new Vector3());
  const cameraTarget = useRef(new Vector3(0, 0, 0));

  // Scratch vectors reused every frame instead of `new Vector3()` per call —
  // this was the main source of per-frame GC churn while flying/hovering.
  const scratch = useRef({
    forward: new Vector3(),
    right: new Vector3(),
    up: new Vector3(0, 1, 0),
    moveDirection: new Vector3(),
    planetPos: new Vector3(),
    lookAtTarget: new Vector3(),
    desiredCamPos: new Vector3(),
    focus: new Vector3(),
    approachTarget: new Vector3(),
    shipPosFallback: new Vector3(0, -1, 4),
  }).current;

  const planetOrbitData = useMemo(() => {
    return PLANET_TYPES.map((type, index) => ({
      type,
      index,
      radius: MathUtils.lerp(
        MIN_ORBIT_RADIUS,
        MAX_ORBIT_RADIUS,
        index / Math.max(PLANET_TYPES.length - 1, 1)
      ) + (ORBIT_RADIUS_JITTER[index] ?? 0),
      angle: ORBIT_ANGLE_OFFSET + index * (Math.PI * 2 / PLANET_TYPES.length),
      y: ORBIT_HEIGHTS[index] ?? (index % 2 ? 0.8 : -0.8),
      orbitSpeed: 0.012 + index * 0.0035,
    }));
  }, []);
  const rotationActive = useRef(false);
  const prevMouse = useRef({ x: 0, y: 0 });

  const MOUSE_SENSITIVITY = 0.0026;
  const PARALLAX_SCALE = 0.35;

  useEffect(() => {
    const canvas = gl.domElement;

    const onPointerDown = (e) => {
      rotationActive.current = true;
      prevMouse.current.x = e.clientX;
      prevMouse.current.y = e.clientY;
      canvas.style.cursor = 'grabbing';
      canvas.style.touchAction = 'none';
    };

    const onPointerMove = (e) => {
      if (!rotationActive.current) return;
      const dx = e.clientX - prevMouse.current.x;
      const dy = e.clientY - prevMouse.current.y;
      shipRotation.current.yaw -= dx * MOUSE_SENSITIVITY;
      shipRotation.current.pitch = Math.max(-0.35, Math.min(0.25, shipRotation.current.pitch - dy * MOUSE_SENSITIVITY));
      prevMouse.current.x = e.clientX;
      prevMouse.current.y = e.clientY;
    };

    const onPointerUp = () => {
      rotationActive.current = false;
      canvas.style.cursor = 'grab';
      canvas.style.touchAction = 'auto';
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    return () => {
      canvas.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };
  }, [gl]);

  // ----- Keyboard listeners -----
  useEffect(() => {
    const handleKeyDown = (e) => {
      const action = KEY_MAP[e.code];
      if (!action) return;
      e.preventDefault();

      if (!manualControlActive.current) {
        manualControlActive.current = true;
        gsap.killTweensOf(shipPosRef.current);
      }

      pressedKeys.current.add(action);
    };

    const handleKeyUp = (e) => {
      const action = KEY_MAP[e.code];
      if (!action) return;
      pressedKeys.current.delete(action);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // ----- Initial camera / ship setup (unchanged) -----
  useEffect(() => {
    if (camRef.current) {
      camRef.current.position.set(WIDE_CAM.x, WIDE_CAM.y, WIDE_CAM.z);
      camRef.current.lookAt(WIDE_LOOK.x, WIDE_LOOK.y, WIDE_LOOK.z);
      camRef.current.fov = 52;
      camRef.current.updateProjectionMatrix();
    }

    if (shipRef.current) {
      gsap.fromTo(
        shipRef.current.position,
        { y: -15, z: 15 },
        { y: -1, z: 4, duration: 2.2, ease: 'back.out(1.1)' }
      );
    }

    if (bgRef.current) {
      bgRef.current.rotation.y = Math.PI * 0.5;
    }
  }, []);

  // ----- Planet selection animation (unchanged) -----
  useEffect(() => {
    manualControlActive.current = false;

    if (activePlanet === null) {
      gsap.to(shipPosRef.current, {
        x: 0,
        y: -0.2,
        z: 4,
        duration: 2,
        ease: 'power2.inOut',
      });
      gsap.to(cameraTarget.current, {
        x: 0,
        y: 0,
        z: 0,
        duration: 1.8,
        ease: 'power2.out',
      });
      return;
    }

    const planet = planetOrbitData[activePlanet];
    if (!planet) return;

    const time = performance.now() * 0.001;
    const planetPos = getOrbitPosition(planet, time);
    const offset = new Vector3(0, 6, 18);
    const targetCam = planetPos.clone().add(offset);

    const target = getApproachTarget(planet, shipPosRef.current, time);
    shipVelocity.current.set(0, 0, 0);

    gsap.to(shipPosRef.current, {
      x: target.x,
      y: target.y,
      z: target.z,
      duration: 2.2,
      ease: 'power2.inOut',
    });

    gsap.killTweensOf(camRef.current.position);
    gsap.killTweensOf(cameraTarget.current);
    gsap.to(camRef.current.position, {
      x: targetCam.x,
      y: targetCam.y,
      z: targetCam.z,
      duration: 2.2,
      ease: 'power3.inOut',
    });
    gsap.to(cameraTarget.current, {
      x: planetPos.x,
      y: planetPos.y,
      z: planetPos.z,
      duration: 2.2,
      ease: 'power3.inOut',
    });
  }, [activePlanet, planetOrbitData]);

  // ----- Main frame loop (reuses scratch vectors, throttled + debounced auto-select) -----
  useFrame((state, delta) => {
    frameCounter.current++;

    const keys = pressedKeys.current;
    const baseSpeed = FLIGHT_SPEED * (delta * 60);
    const boostFactor = keys.has('boost') ? 1.8 : 1;
    const thrust = baseSpeed * boostFactor;

    shipEuler.set(shipRotation.current.pitch, shipRotation.current.yaw, 0);
    scratch.forward.set(0, 0, -1).applyEuler(shipEuler);
    scratch.right.set(1, 0, 0).applyEuler(shipEuler);
    shipDirection.set(0, 0, -1).applyEuler(shipEuler);

    scratch.moveDirection.set(0, 0, 0);
    if (keys.has('forward')) scratch.moveDirection.add(scratch.forward);
    if (keys.has('back')) scratch.moveDirection.sub(scratch.forward);
    if (keys.has('left')) scratch.moveDirection.sub(scratch.right);
    if (keys.has('right')) scratch.moveDirection.add(scratch.right);
    if (keys.has('up')) scratch.moveDirection.add(scratch.up);
    if (keys.has('down')) scratch.moveDirection.sub(scratch.up);

    if (scratch.moveDirection.lengthSq() > 0.0001) {
      manualControlActive.current = true;
      shipVelocity.current.copy(scratch.moveDirection.normalize().multiplyScalar(thrust));
    } else {
      shipVelocity.current.multiplyScalar(0.92);
      if (shipVelocity.current.length() < 0.01) shipVelocity.current.set(0, 0, 0);
    }

    shipPosRef.current.x += shipVelocity.current.x;
    shipPosRef.current.y += shipVelocity.current.y;
    shipPosRef.current.z += shipVelocity.current.z;

    shipPosRef.current.x = Math.max(-X_LIMIT, Math.min(X_LIMIT, shipPosRef.current.x));
    shipPosRef.current.y = Math.max(-Y_LIMIT, Math.min(Y_LIMIT, shipPosRef.current.y));
    shipPosRef.current.z = Math.max(Z_MIN, Math.min(Z_MAX, shipPosRef.current.z));

    if (shipRef.current) {
      shipRef.current.position.x += (shipPosRef.current.x - shipRef.current.position.x) * 0.12;
      shipRef.current.position.y += (shipPosRef.current.y - shipRef.current.position.y) * 0.12;
      shipRef.current.position.z += (shipPosRef.current.z - shipRef.current.position.z) * 0.12;

      shipRef.current.rotation.set(shipRotation.current.pitch, shipRotation.current.yaw, 0);
    }

    const shipPos = shipRef.current?.position || scratch.shipPosFallback;
    const time = state.clock.getElapsedTime();
    const targetPlanet = activePlanet !== null ? planetOrbitData[activePlanet] : null;
    const isPlanetView = targetPlanet !== null;

    if (isPlanetView) {
      const planetPos = getOrbitPosition(targetPlanet, time, scratch.planetPos);
      scratch.lookAtTarget.copy(planetPos).add({ x: 0, y: 0.5, z: 0 });
      cameraTarget.current.lerp(scratch.lookAtTarget, 0.16);
      scratch.desiredCamPos.copy(planetPos).add({ x: 0, y: 6, z: 18 });
      camRef.current.position.lerp(scratch.desiredCamPos, 0.12);
      camRef.current.lookAt(cameraTarget.current);
    } else {
      scratch.focus.copy(shipPos).addScaledVector(shipDirection, 14).add({ x: 0, y: 2.2, z: 0 });
      cameraTarget.current.lerp(scratch.focus, 0.08);
      scratch.desiredCamPos.copy(shipCamOffset).applyEuler(shipEuler).add(shipPos).add({ x: 0, y: 0.25, z: 0 });
      camRef.current.position.lerp(scratch.desiredCamPos, 0.1);
      camRef.current.lookAt(cameraTarget.current);
    }

    // 5. Auto‑select planet when close — throttled to every N frames, and debounced
    // so a single flickering frame near a boundary doesn't restart the selection
    // tweens. This was the main cause of the freeze-on-hover near planet edges.
    if (manualControlActive.current && frameCounter.current % AUTO_SELECT_SCAN_INTERVAL === 0) {
      let nearestIndex = null;
      for (let i = 0; i < planetOrbitData.length; i++) {
        const target = getApproachTarget(planetOrbitData[i], shipPosRef.current, time, scratch.approachTarget);
        const dxy = Math.hypot(shipPos.x - target.x, shipPos.y - target.y);
        const dz = Math.abs(shipPos.z - target.z);
        if (dxy < ARRIVAL_RADIUS_XY && dz < ARRIVAL_RADIUS_Z) {
          nearestIndex = i;
          break;
        }
      }

      if (nearestIndex === pendingSelectIndex.current) {
        pendingSelectStreak.current++;
      } else {
        pendingSelectIndex.current = nearestIndex;
        pendingSelectStreak.current = 1;
      }

      if (
        pendingSelectStreak.current >= SELECT_HYSTERESIS_FRAMES &&
        nearestIndex !== lastAutoSelected.current
      ) {
        lastAutoSelected.current = nearestIndex;
        onSelectPlanet(nearestIndex);
      }
    }
  });

  // ---------- JSX ----------
  return (
    <group>
      <PerspectiveCamera
        ref={camRef}
        makeDefault
        fov={52}
        near={0.1}
        far={6000}
        position={[WIDE_CAM.x, WIDE_CAM.y, WIDE_CAM.z]}
      />

      <StarField count={10000} />
      <Nebula />

      <hemisphereLight skyColor="#a0c8ff" groundColor="#443355" intensity={0.42} />
      <ambientLight intensity={0.35} color="#ffffff" />

      {bgScene && (
        <primitive
          ref={bgRef}
          object={bgScene}
          position={[0, -8, -160]}
          scale={[5, 5, 5]}
          rotation={[0, Math.PI * 0.3, 0]}
        />
      )}

      <directionalLight position={[-15, 20, 25]} color="#fff8e8" intensity={1.6} />
      <directionalLight position={[20, -10, -20]} color="#334466" intensity={0.6} />

      <pointLight position={[-40, 20, -40]} color="#5533ff" intensity={1.2} distance={180} />
      <pointLight position={[40, -15, -110]} color="#ff3322" intensity={1} distance={180} />
      <pointLight position={[0, 30, -190]} color="#ffaa00" intensity={1} distance={150} />

      {planetOrbitData.map((planet) => (
        <Planet
          key={planet.type}
          type={planet.type}
          index={planet.index}
          active={activePlanet === planet.index}
          orbitRadius={planet.radius}
          orbitAngle={planet.angle}
          orbitY={planet.y}
          orbitSpeed={planet.orbitSpeed}
          onClick={() => {
            if (activePlanet !== planet.index) {
              onSelectPlanet(planet.index);
            }
          }}
        />
      ))}

      <group ref={shipRef} position={[0, -1, 4]}>
        <Spaceship
          position={[0, 0, 0]}
          rotation={[0.1, Math.PI, 0.05]}
          scale={0.7}
        />
      </group>
    </group>
  );
}