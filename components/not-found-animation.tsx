import dynamic from "next/dynamic";
import { Canvas, useFrame } from "@react-three/fiber";
import { TrackballControls, Environment } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";
import { useTheme } from "nextra-theme-docs";

const CANVAS_STYLES = {
  width: "100%",
  height: "50vh",
  minHeight: "400px",
  maxHeight: "600px",
} as const;

function MetallicKnot() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { resolvedTheme } = useTheme();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.25;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.15;
    }
  });

  return (
    <mesh ref={meshRef}>
      <torusKnotGeometry args={[0.8, 0.2, 200, 32]} />
      <meshPhysicalMaterial
        color={resolvedTheme === "dark" ? "#E11312" : "#0A60B5"}
        metalness={0.9}
        roughness={0.1}
        clearcoat={1}
        clearcoatRoughness={0.1}
        reflectivity={1}
        envMapIntensity={2}
      />
    </mesh>
  );
}

function NotFoundAnimationComponent() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.5,
      }}
      style={CANVAS_STYLES}
    >
      <ambientLight intensity={0.2} />
      <ambientLight intensity={0.1} color="#E01211" />
      <spotLight
        position={[10, 10, 10]}
        angle={0.15}
        penumbra={1}
        intensity={1}
        color="#ffffff"
      />
      <spotLight
        position={[-10, -10, -10]}
        angle={0.15}
        penumbra={1}
        intensity={0.5}
        color="#E01211"
      />
      <MetallicKnot />
      <TrackballControls noZoom={true} rotateSpeed={4} />
      <Environment preset="sunset" />
    </Canvas>
  );
}

export const NotFoundAnimation = dynamic(
  () => Promise.resolve(NotFoundAnimationComponent),
  {
    ssr: false,
    loading: () => <div style={CANVAS_STYLES} />,
  }
);
