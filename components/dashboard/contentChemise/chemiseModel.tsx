"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Center } from "@react-three/drei";
import { Suspense, useRef } from "react";
import * as THREE from "three";

function ChemiseGLB({ selectedBadge }: { selectedBadge?: string | null }) {
  const { scene } = useGLTF("/chemise/chemise.glb");
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      const isSelected = !!selectedBadge;
      const targetRotation = isSelected ? [0.1, -1.4, 0] : [0, -0.3, 0];
      const targetScale = isSelected ? 2 : 1.0;
      const targetPosition = isSelected ? [-0.2, -3, 0] : [0, 0, 0];

      meshRef.current.rotation.x = THREE.MathUtils.lerp(
        meshRef.current.rotation.x,
        targetRotation[0],
        delta * 5
      );
      meshRef.current.rotation.y = THREE.MathUtils.lerp(
        meshRef.current.rotation.y,
        targetRotation[1],
        delta * 5
      );
      meshRef.current.rotation.z = THREE.MathUtils.lerp(
        meshRef.current.rotation.z,
        targetRotation[2],
        delta * 5
      );

      const currentScale = meshRef.current.scale.x;
      const newScale = THREE.MathUtils.lerp(
        currentScale,
        targetScale,
        delta * 5
      );
      meshRef.current.scale.set(newScale, newScale, newScale);

      meshRef.current.position.x = THREE.MathUtils.lerp(
        meshRef.current.position.x,
        targetPosition[0],
        delta * 5
      );
      meshRef.current.position.y = THREE.MathUtils.lerp(
        meshRef.current.position.y,
        targetPosition[1],
        delta * 5
      );
      meshRef.current.position.z = THREE.MathUtils.lerp(
        meshRef.current.position.z,
        targetPosition[2],
        delta * 5
      );
    }
  });

  scene.traverse((child: any) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  return (
    <group ref={meshRef}>
      <primitive object={scene} scale={2} position={[0, 0, 0]} />
    </group>
  );
}

// Interface pour les props du composant principal
interface ChemiseModelProps {
  selectedBadge?: string | null;
}

// Composant principal exporté avec paramètres fixes et animation
export const ChemiseModel = ({ selectedBadge }: ChemiseModelProps) => {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 20 }}
        shadows={false}
      >
        {/* Éclairage avec paramètres fixes */}

        {/* Ambient Light */}
        <ambientLight intensity={0.8} color="#ffffff" />

        {/* Directional Light */}
        <directionalLight
          position={[10, 10, 7]}
          intensity={2.0}
          color="#ffffff"
          castShadow={false}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />

        {/* Spot Light */}
        <spotLight
          position={[-2, 6, 2]}
          intensity={80}
          angle={0.6}
          penumbra={0}
          color="#ffffff"
          castShadow={false}
        />

        {/* Point Light */}
        <pointLight
          position={[4, -1.5, 1]}
          intensity={10}
          color="#ffffff"
          distance={10}
          decay={2}
        />

        {/* Modèle 3D avec gestion du chargement et animation */}
        <Suspense fallback={null}>
          <Center>
            <ChemiseGLB selectedBadge={selectedBadge} />
          </Center>
        </Suspense>
      </Canvas>
    </div>
  );
};

// Préchargement du modèle
useGLTF.preload("/chemise/chemise.glb");