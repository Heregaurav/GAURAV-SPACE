import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { Box3, Vector3 } from 'three';
import * as THREE from 'three';

const UNIFORM_PLANET_SIZE = 20;

export const PLANET_CONFIGS = {
  webdev: {
    label: 'Web Dev',
    body: 'Earth',
    radius: 2.0,
    atmosphere: '#1a8fff',
    glowColor: '#1a8fff',
    glowColor2: '#00ccff',
    glowOpacity: 0.35,
    rotationSpeed: 0.003,
    modelScale: 1,
  },
  cybersec: {
    label: 'Cyber Sec',
    body: 'Mars',
    radius: 2.0,
    atmosphere: '#ff4400',
    glowColor: '#ff3300',
    glowColor2: '#ff6622',
    glowOpacity: 0.32,
    rotationSpeed: 0.0028,
    modelScale: 1,
  },
  cloud: {
    label: 'Cloud',
    body: 'Jupiter',
    radius: 2.0,
    atmosphere: '#e0a055',
    glowColor: '#e09040',
    glowColor2: '#ffcc77',
    glowOpacity: 0.28,
    rotationSpeed: 0.007,
    modelScale: 1,
  },
  electronics: {
    label: 'Electronics',
    body: 'Moon',
    radius: 2.0,
    atmosphere: '#aaaaaa',
    glowColor: '#cccccc',
    glowColor2: '#ffffff',
    glowOpacity: 0.15,
    rotationSpeed: 0.001,
    modelScale: 1,
  },
  leadership: {
    label: 'Leadership',
    body: 'Saturn',
    radius: 2.0,
    atmosphere: '#e0b855',
    glowColor: '#e0b030',
    glowColor2: '#ffdd88',
    glowOpacity: 0.3,
    rotationSpeed: 0.005,
    modelScale: 1,
    hasRings: true,
  },
};

// Distance thresholds (world units) for swapping the real GLTF model out for a
// cheap procedural sphere. These were dead refs before (high was hardcoded
// visible=true always) — wiring them up is most of the general frame-cost win.
const LOD_MEDIUM_DISTANCE = 220;
const LOD_LOW_DISTANCE = 450;
const LOD_CULL_DISTANCE = 1200;

export default function Planet({ type, orbitRadius, orbitAngle, orbitY, orbitSpeed, index, active, anySelected, onClick, scale = 1 }) {
  const cfg = PLANET_CONFIGS[type] || PLANET_CONFIGS.webdev;

  const groupRef = useRef();
  const highRef = useRef();
  const mediumRef = useRef();
  const lowRef = useRef();
  const modelRef = useRef();
  const glow1Ref = useRef();
  const glow2Ref = useRef();
  const activeRingRef = useRef();
  const { camera } = useThree();

  const gltf = useGLTF(`/${type}.glb`);
  const loadedScene = useMemo(() => {
    if (!gltf?.scene) return null;

    const sceneClone = gltf.scene.clone();
    sceneClone.updateMatrixWorld(true);

    const box = new Box3().setFromObject(sceneClone);
    const center = new Vector3();
    box.getCenter(center);
    sceneClone.position.sub(center);

    const size = new Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z, 1);
    const normalizedScale = UNIFORM_PLANET_SIZE / maxDim;
    sceneClone.scale.setScalar(normalizedScale * (cfg.modelScale || 1));
    sceneClone.updateMatrixWorld(true);

    sceneClone.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        // This is the actual fix for the hover freeze: without this, the
        // raycaster tests every triangle of the imported model on every
        // pointer move. The invisible proxy sphere below is what should be
        // handling hit-testing instead — it's cheap and roughly matches the
        // model's silhouette. Planets with heavier geometry (e.g. Mars
        // terrain, Saturn's rings) were hitching worse simply because the
        // raycaster had more triangles to test against.
        child.raycast = () => null;
      }
    });

    return sceneClone;
  }, [gltf, cfg.modelScale]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (modelRef.current) {
      modelRef.current.rotation.y += cfg.rotationSpeed;
    }

    if (glow1Ref.current) {
      glow1Ref.current.material.opacity =
        (active ? cfg.glowOpacity + 0.12 : cfg.glowOpacity * 0.15) +
        Math.sin(t * 1.8 + index) * 0.03;
    }

    if (glow2Ref.current) {
      glow2Ref.current.material.opacity =
        (active ? 0.2 : 0.01) + Math.sin(t * 1.1 + index) * 0.01;
    }

    if (activeRingRef.current) {
      activeRingRef.current.visible = active;
    }

    if (groupRef.current) {
      const angle = orbitAngle + orbitSpeed * t;
      const x = orbitRadius * Math.cos(angle);
      const z = orbitRadius * Math.sin(angle);
      const y = orbitY + Math.sin(t * 0.45 + index) * 0.6;
      groupRef.current.position.set(x, y, z);
      groupRef.current.scale.setScalar(active ? scale * 1.1 : scale * 0.96);

      const cameraDistance = camera.position.distanceTo(groupRef.current.position);

      // Real LOD switching now — previously high was forced visible=true
      // regardless of distance, so every planet always rendered full detail
      // (shadows included) no matter how far away it was.
      const showHigh = cameraDistance <= LOD_MEDIUM_DISTANCE;
      const showMedium = !showHigh && cameraDistance <= LOD_LOW_DISTANCE;
      const showLow = !showHigh && !showMedium;

      if (highRef.current) highRef.current.visible = showHigh;
      if (mediumRef.current) mediumRef.current.visible = showMedium;
      if (lowRef.current) lowRef.current.visible = showLow;

      groupRef.current.visible = cameraDistance <= LOD_CULL_DISTANCE;
    }
  });

  return (
    <group>
      <group ref={groupRef}>
        <group ref={highRef}>
          {loadedScene ? (
            <group ref={modelRef}>
              <primitive object={loadedScene} />
              {/* This proxy sphere is now the ONLY thing that's clickable/hoverable —
                  cheap 24x24 sphere instead of the full model geometry. */}
              <mesh
                position={[0, 0, 0]}
                onClick={(e) => { e.stopPropagation(); onClick(); }}
                onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; }}
                onPointerOut={() => { document.body.style.cursor = 'auto'; }}
              >
                <sphereGeometry args={[cfg.radius * 1.35, 24, 24]} />
                <meshBasicMaterial transparent opacity={0} />
              </mesh>
              <mesh
                ref={activeRingRef}
                visible={active}
                scale={[1.06, 1.06, 1.06]}
                raycast={() => null}
              >
                <sphereGeometry args={[UNIFORM_PLANET_SIZE * 0.52, 32, 32]} />
                <meshBasicMaterial
                  color="#ffffff"
                  transparent
                  opacity={0.05}
                  side={THREE.BackSide}
                  depthWrite={false}
                />
              </mesh>
            </group>
          ) : null}
        </group>

        <group ref={mediumRef} visible={false}>
          <mesh
            onClick={(e) => { e.stopPropagation(); onClick(); }}
            onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; }}
            onPointerOut={() => { document.body.style.cursor = 'auto'; }}
          >
            <sphereGeometry args={[UNIFORM_PLANET_SIZE * 0.88 * (cfg.modelScale || 1), 16, 16]} />
            <meshStandardMaterial color={cfg.glowColor} roughness={0.7} metalness={0.1} />
          </mesh>
        </group>

        <group ref={lowRef} visible={false}>
          <mesh
            onClick={(e) => { e.stopPropagation(); onClick(); }}
            onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; }}
            onPointerOut={() => { document.body.style.cursor = 'auto'; }}
          >
            <sphereGeometry args={[UNIFORM_PLANET_SIZE * 0.74 * (cfg.modelScale || 1), 8, 8]} />
            <meshBasicMaterial color={cfg.atmosphere} transparent opacity={0.45} />
          </mesh>
        </group>
      </group>

      {!loadedScene && (
        <mesh ref={glow2Ref} raycast={() => null}>
          <sphereGeometry args={[cfg.radius * 1.45, 16, 16]} />
          <meshBasicMaterial color={cfg.glowColor2} transparent opacity={0.08} side={THREE.BackSide} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      )}

      {!loadedScene && (
        <mesh ref={glow1Ref} raycast={() => null}>
          <sphereGeometry args={[cfg.radius * 1.14, 24, 24]} />
          <meshBasicMaterial color={cfg.atmosphere} transparent opacity={cfg.glowOpacity} side={THREE.BackSide} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      )}

      {active && !loadedScene && (
        <mesh raycast={() => null} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[cfg.radius * 1.5, cfg.radius * 1.58, 64]} />
          <meshBasicMaterial color={cfg.glowColor2} transparent opacity={0.7} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      )}

      <pointLight raycast={() => null} color={cfg.glowColor} intensity={active ? 2.5 : 0.1} distance={cfg.radius * 10} />
    </group>
  );
}