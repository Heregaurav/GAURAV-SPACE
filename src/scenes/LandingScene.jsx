import { useRef, useEffect, useState } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { gsap } from 'gsap';
import StarField from '../components/effects/StarField';
import Nebula from '../components/effects/Nebula';
import Spaceship from '../components/spaceship/Spaceship';
import Avatar from '../components/spaceship/Avatar';
import Planet from '../components/planets/Planet';
import guysittingModelUrl from '../components/spaceship/guysitting.glb?url';
import * as THREE from 'three';

/*
  LAUNCH SEQUENCE PHASES
  ─────────────────────────────────────────────
  0  'idle'      – astronaut floats beside ship on platform, camera orbits slowly
  1  'boarding'  – astronaut walks/floats up into hatch; camera tilts up
  2  'hatch'     – hatch closes (1s pause), engine pre-ignition glow builds
  3  'ignition'  – engines fire fully, platform clamps release
  4  'launch'    – ship accelerates upward; camera pulls back & tilts up
  5  'warp'      – speed-lines + stretch, then scene cuts to PlanetScene
*/

// ── Main scene ────────────────────────────────────────────────────────────
export default function LandingScene({ onLaunch }) {
  const { camera } = useThree();
  const shipGroupRef   = useRef();   
  const avatarRef      = useRef();   
  const [phase, setPhase] = useState('idle'); 

  const shipY = useRef(-0.5);
  /* 💡 FIXED: Balanced at -0.8 to perfectly frame the left-aligned avatar and right-aligned ship */
  const targetX = useRef(-0.8);

  // scroll-driven camera mapping refs and safe bounds
  const baseCam = useRef(new THREE.Vector3(0, 1.5, 10));
  const baseFov = useRef(60);
  const scrollY = useRef(0);
  const SCROLL_MAX_DOWN = 12; // reduced travel to stay inside nebula
  const SCROLL_MAX_BACK = 8;  // reduce z translation
  const SCROLL_MAX_X = 0.6;   // lateral shift limit
  const FOV_DELTA = 6;        // subtle FOV widening on scroll

  useEffect(() => {
    // initial cinematic camera position — slightly tighter FOV to avoid edges
    camera.position.set(4, 2, 13);
    camera.fov = baseFov.current;
    camera.updateProjectionMatrix();
    camera.lookAt(targetX.current, 0, 0);
    gsap.to(camera.position, {
      x: 1.5, y: 1.0, z: 10.5,
      duration: 3.2, ease: 'power2.inOut',
    });

    // record base camera and set listener
    baseCam.current = camera.position.clone();
    baseFov.current = camera.fov || 60;
    const onScroll = () => { scrollY.current = window.scrollY || window.pageYOffset; };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ── Phase sequencer ──────────────────────────────────────────────────
  const startLaunchSequence = () => {
    if (phase !== 'idle') return;
    setPhase('launch');

    gsap.to(camera.position, {
      x: 2.4, y: 3.5, z: 8.5,
      duration: 0.8,
      ease: 'power2.out',
    });

    gsap.to(shipY, {
      current: 4,
      duration: 0.8,
      ease: 'power2.in',
    });

    if (onLaunch) onLaunch();
  };

  useFrame(() => {
    // map page scroll into camera movement only while idle (normal browsing)
    if (phase === 'idle' && baseCam.current) {
      const docH = Math.max(1, document.body.scrollHeight - window.innerHeight);
      const t = Math.min(1, (scrollY.current || 0) / docH);

      // compute clamped desired camera within safe bounds
      const desired = new THREE.Vector3().copy(baseCam.current);
      const dy = t * SCROLL_MAX_DOWN;
      const dz = t * SCROLL_MAX_BACK;
      const dx = t * SCROLL_MAX_X;
      desired.y = THREE.MathUtils.clamp(baseCam.current.y - dy, baseCam.current.y - SCROLL_MAX_DOWN, baseCam.current.y + 2);
      desired.z = THREE.MathUtils.clamp(baseCam.current.z + dz, baseCam.current.z, baseCam.current.z + SCROLL_MAX_BACK);
      desired.x = THREE.MathUtils.clamp(baseCam.current.x + dx, baseCam.current.x - 1, baseCam.current.x + SCROLL_MAX_X);

      // smooth interpolate camera position
      camera.position.lerp(desired, 0.08);

      // gently widen FOV as we move to keep scene framed and avoid edges
      const targetFov = THREE.MathUtils.clamp(baseFov.current + t * FOV_DELTA, baseFov.current, baseFov.current + FOV_DELTA);
      camera.fov += (targetFov - camera.fov) * 0.06;
      camera.updateProjectionMatrix();
    }
    const target = new THREE.Vector3(targetX.current, shipY.current, 0);
    camera.lookAt(target);

    if (shipGroupRef.current) {
      shipGroupRef.current.position.y = shipY.current;
    }
  });

  const isEngineOn = phase === 'ignition' || phase === 'launch';

  return (
    <group>
      <StarField count={6200} />
      <Nebula />
      <FloatingDebris />
        {/* a large planet continuation that exists below the hero so the About
          content scrolls 'through' the same world instead of starting on a
          separate plane */}
        <Planet type="cloud" orbitRadius={0} orbitAngle={0} orbitY={-28} orbitSpeed={0} index={0} scale={7} />

      {/* ── LIGHTING ── */}
      <ambientLight intensity={0.35} color="#cce0ff" />
      <directionalLight position={[-6, 8, 6]} color="#fff5e0" intensity={1.6} castShadow />
      <directionalLight position={[8, -3, 4]} color="#334466" intensity={0.5} />
      <pointLight position={[-8, 4, 0]} color="#7755ff" intensity={0.8} distance={20} />
      <pointLight position={[ 8, -3, 0]} color="#00aaff" intensity={0.6} distance={18} />

      {/* ── HERO CHARACTER ── */}
      {phase !== 'launch' && (
        <group ref={avatarRef}>
          <Avatar
            modelUrl={guysittingModelUrl}
            position={[-2.8, -1.25, 0]}
            scale={1.9}
            phase={phase}
          />
        </group>
      )}

      {/* ── SHIP GROUP ── */}
      <group ref={shipGroupRef} position={[0, shipY.current, 0]}>
        <Spaceship
          position={[1.1, 0.4, -0.5]} 
          rotation={[0.05, -0.4, 0.02]} 
          scale={1.1}
          launching={isEngineOn}
        />
        <IgnitionExhaust active={isEngineOn} launching={phase === 'launch'} />
      </group>

      {/* ── LAUNCH POLES ── */}
      {[-1.8, 3.0].map((x, i) => (
        <group key={i} position={[x, -0.7, 0.0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.05, 0.05, 3.2, 8]} />
            <meshStandardMaterial color="#0a1628" metalness={0.9} roughness={0.1} />
          </mesh>
          <mesh position={[0, 1.7, 0]}>
            <sphereGeometry args={[0.09, 10, 10]} />
            <meshBasicMaterial
              color={i === 0 ? '#00d4ff' : '#bb44ff'}
              blending={THREE.AdditiveBlending} />
          </mesh>
          <pointLight position={[0, 1.8, 0]} color={i === 0 ? '#00d4ff' : '#bb44ff'} intensity={0.6} distance={5} />
        </group>
      ))}

      {/* ── LAUNCH BUTTON ── */}
      {phase === 'idle' && (
        <mesh
          /* 💡 FIXED: Shifted to -2.0 to stay centered directly in front of the new avatar position */
          position={[-2.0, -1.95, 3.0]} 
          onClick={startLaunchSequence}
          onPointerOver={() => (document.body.style.cursor = 'pointer')}
          onPointerOut={() => (document.body.style.cursor = 'auto')}
        >
          <cylinderGeometry args={[0.35, 0.35, 0.12, 24]} />
          <meshStandardMaterial color="#cc2200" emissive="#cc2200" emissiveIntensity={0.6} metalness={0.4} roughness={0.3} />
        </mesh>
      )}
    </group>
  );
}

function FloatingDebris() {
  const ref = useRef();
  const count = 250;
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 40;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 25 - 5;
  }

  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.elapsedTime * 0.015;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.035} color="#88ccff" transparent opacity={0.35} blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  );
}

function IgnitionExhaust({ active, launching }) {
  const ref1 = useRef();
  const ref2 = useRef();

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (!active) return;
    const sc = launching ? 2.8 : 1.4;
    const fl = 0.85 + Math.sin(t * 25) * 0.15;
    if (ref1.current) ref1.current.scale.setScalar(fl * sc);
    if (ref2.current) ref2.current.scale.setScalar(fl * sc * 0.7);
  });

  if (!active) return null;

  return (
    <group position={[1.1, 0, -0.5]}>
      <mesh ref={ref1} position={[-0.28, -2.65, 0]}>
        <coneGeometry args={[0.12, launching ? 2.5 : 0.9, 10]} />
        <meshBasicMaterial color="#ff8800" transparent opacity={0.9} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh position={[-0.28, launching ? -3.8 : -3.0, 0]}>
        <coneGeometry args={[0.22, launching ? 3.0 : 1.2, 10]} />
        <meshBasicMaterial color="#ff4400" transparent opacity={0.5} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh ref={ref2} position={[0.28, -2.65, 0]}>
        <coneGeometry args={[0.12, launching ? 2.5 : 0.9, 10]} />
        <meshBasicMaterial color="#ff8800" transparent opacity={0.9} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh position={[0.28, launching ? -3.8 : -3.0, 0]}>
        <coneGeometry args={[0.22, launching ? 3.0 : 1.2, 10]} />
        <meshBasicMaterial color="#ff4400" transparent opacity={0.5} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <pointLight position={[0, -2.8, 0]} color="#ff6600" intensity={launching ? 8 : 3} distance={6} />
    </group>
  );
}
