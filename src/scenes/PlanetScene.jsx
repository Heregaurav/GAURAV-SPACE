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
const ORBIT_HEIGHTS = [0.8, -0.4, 0.7, -0.2, 0.4];

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

const KEY_MAP = {
  KeyW: 'forward', ArrowUp: 'forward',
  KeyS: 'back', ArrowDown: 'back',
  KeyA: 'left', ArrowLeft: 'left',
  KeyD: 'right', ArrowRight: 'right',
  KeyR: 'up',
  KeyF: 'down',
  Space: 'boost',
};

// ---------- helper ----------
function getOrbitPosition(planet, time = 0) {
  const angle = planet.angle + planet.orbitSpeed * time;
  const x = planet.radius * Math.cos(angle);
  const z = planet.radius * Math.sin(angle);
  const y = Math.max(-1.8, Math.min(1.8, planet.y + Math.sin(time * 0.35 + planet.index) * 0.45));
  return new Vector3(x, y, z);
}

function getApproachTarget(planet, shipPosition, time = 0) {
  const center = getOrbitPosition(planet, time);
  const shipPoint = new Vector3(shipPosition.x, shipPosition.y, shipPosition.z);
  const approachDir = shipPoint.clone().sub(center);

  if (approachDir.lengthSq() < 0.0001) {
    approachDir.set(0, 0, -1);
  } else {
    approachDir.normalize();
  }

  const radius = PLANET_CONFIGS[planet.type]?.radius || 2.0;
  return center.clone().add(approachDir.multiplyScalar(radius + 8));
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
  const shipRotation = useRef({ yaw: Math.PI, pitch: 0 });
  const shipEuler = useMemo(() => new Euler(0, 0, 0, 'YXZ'), []);
  const shipDirection = useMemo(() => new Vector3(0, 0, -1), []);
  const shipCamOffset = useMemo(() => new Vector3(0, 2.6, 12), []);
  const focusPoint = useRef(new Vector3(0, 0, 0));
  const shipVelocity = useRef(new Vector3());
  const cameraTarget = useRef(new Vector3(0, 0, 0));
  const planetOrbitData = useMemo(() => {
    return PLANET_TYPES.map((type, index) => ({
      type,
      index,
      radius: MathUtils.lerp(
        MIN_ORBIT_RADIUS,
        MAX_ORBIT_RADIUS,
        index / Math.max(PLANET_TYPES.length - 1, 1)
      ),
      angle: index * (Math.PI * 2 / PLANET_TYPES.length),
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

  // ----- Main frame loop (updated with direct velocity control) -----
  useFrame((state, delta) => {
    const keys = pressedKeys.current;
    const baseSpeed = FLIGHT_SPEED * (delta * 60);
    const boostFactor = keys.has('boost') ? 1.8 : 1;
    const thrust = baseSpeed * boostFactor;

    shipEuler.set(shipRotation.current.pitch, shipRotation.current.yaw, 0);
    const forward = new Vector3(0, 0, -1).applyEuler(shipEuler);
    const right = new Vector3(1, 0, 0).applyEuler(shipEuler);
    const up = new Vector3(0, 1, 0);
    shipDirection.set(0, 0, -1).applyEuler(shipEuler);

    const moveDirection = new Vector3();
    if (keys.has('forward')) moveDirection.add(forward);
    if (keys.has('back')) moveDirection.sub(forward);
    if (keys.has('left')) moveDirection.sub(right);
    if (keys.has('right')) moveDirection.add(right);
    if (keys.has('up')) moveDirection.add(up);
    if (keys.has('down')) moveDirection.sub(up);

    if (moveDirection.lengthSq() > 0.0001) {
      manualControlActive.current = true;
      shipVelocity.current.copy(moveDirection.normalize().multiplyScalar(thrust));
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

    const shipPos = shipRef.current?.position || new Vector3(0, -1, 4);
    const time = state.clock.getElapsedTime();
    const targetPlanet = activePlanet !== null ? planetOrbitData[activePlanet] : null;
    const isPlanetView = targetPlanet !== null;

    if (isPlanetView) {
      const planetPos = getOrbitPosition(targetPlanet, time);
      const lookAtTarget = planetPos.clone().add(new Vector3(0, 0.5, 0));
      cameraTarget.current.lerp(lookAtTarget, 0.16);
      const desiredCamPos = planetPos.clone().add(new Vector3(0, 6, 18));
      camRef.current.position.lerp(desiredCamPos, 0.12);
      camRef.current.lookAt(cameraTarget.current);
    } else {
      const focus = shipPos.clone().add(shipDirection.clone().multiplyScalar(14)).add(new Vector3(0, 2.2, 0));
      cameraTarget.current.lerp(focus, 0.08);
      const desiredCamPos = shipPos.clone().add(shipCamOffset.clone().applyEuler(shipEuler)).add(new Vector3(0, 0.25, 0));
      camRef.current.position.lerp(desiredCamPos, 0.1);
      camRef.current.lookAt(cameraTarget.current);
    }

    // 5. Auto‑select planet when close
    if (manualControlActive.current) {
      let nearestIndex = null;
      for (let i = 0; i < planetOrbitData.length; i++) {
        const target = getApproachTarget(planetOrbitData[i], shipPosRef.current, time);
        const dxy = Math.hypot(shipPos.x - target.x, shipPos.y - target.y);
        const dz = Math.abs(shipPos.z - target.z);
        if (dxy < ARRIVAL_RADIUS_XY && dz < ARRIVAL_RADIUS_Z) {
          nearestIndex = i;
          break;
        }
      }
      if (nearestIndex !== lastAutoSelected.current) {
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