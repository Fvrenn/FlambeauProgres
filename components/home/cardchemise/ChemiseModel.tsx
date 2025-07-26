"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Center, Bounds } from "@react-three/drei";
import { Suspense, useRef } from "react";
import * as THREE from "three";

// Composant pour charger et afficher le modèle 3D avec effet mat, rotation et scale animés
function ChemiseGLB({ isSelected }: { isSelected: boolean }) {
  const { scene } = useGLTF("/chemise/chemise.glb");
  const meshRef = useRef<THREE.Group>(null);

  // Animation de rotation, scale et position
  useFrame((state, delta) => {
    if (meshRef.current) {
      const targetRotation = isSelected ? [0.1, -1.4, 0] : [0, 0, 0];
      const targetScale = isSelected ? 2 : 1.0;
      // Position cible quand sélectionné (ajuste ici selon ton besoin)
      const targetPosition = isSelected ? [0, -3, 0] : [0, 0, 0];

      // Interpolation douce vers la rotation cible
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

      // Interpolation douce vers la position cible
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

  // Appliquer un effet mat aux matériaux du modèle
  scene.traverse((child: any) => {
    if (child.isMesh && child.material) {
      // Réduire la brillance pour un effet plus mat
      child.material.roughness = 0.8; // Plus rugueux = moins brillant
      child.material.metalness = 0.1; // Moins métallique = plus mat
      child.material.envMapIntensity = 0.3; // Réduction des réflections

      // Activer les ombres
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
  // Paramètres d'éclairage fixes basés sur vos derniers réglages
  const lightingConfig = {
    // Ambient Light
    ambientIntensity: 0.8,
    ambientColor: "#ffffff",

    // Directional Light
    directionalIntensity: 2.0,
    directionalX: 10.0,
    directionalY: 10.0,
    directionalZ: 7.0,
    directionalColor: "#ffffff",
    enableShadows: false,

    // Spot Light
    enableSpotLight: true,
    spotIntensity: 80,
    spotX: -2.0,
    spotY: 6.0,
    spotZ: 2.0,
    spotAngle: 0.6,
    spotPenumbra: 0.0,

    // Point Light
    enablePointLight: true,
    pointIntensity: 10,
    pointX: 4.0,
    pointY: -1.5,
    pointZ: 1.0,
    pointDistance: 10,
  };

  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 20 }}
        shadows={lightingConfig.enableShadows}
      >
        {/* Éclairage avec paramètres fixes */}

        {/* Ambient Light */}
        <ambientLight
          intensity={lightingConfig.ambientIntensity}
          color={lightingConfig.ambientColor}
        />

        {/* Directional Light */}
        <directionalLight
          position={[
            lightingConfig.directionalX,
            lightingConfig.directionalY,
            lightingConfig.directionalZ,
          ]}
          intensity={lightingConfig.directionalIntensity}
          color={lightingConfig.directionalColor}
          castShadow={lightingConfig.enableShadows}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />

        {/* Spot Light (conditionnel) */}
        {lightingConfig.enableSpotLight && (
          <spotLight
            position={[
              lightingConfig.spotX,
              lightingConfig.spotY,
              lightingConfig.spotZ,
            ]}
            intensity={lightingConfig.spotIntensity}
            angle={lightingConfig.spotAngle}
            penumbra={lightingConfig.spotPenumbra}
            color="#ffffff"
            castShadow={lightingConfig.enableShadows}
          />
        )}

        {/* Point Light (conditionnel) */}
        {lightingConfig.enablePointLight && (
          <pointLight
            position={[
              lightingConfig.pointX,
              lightingConfig.pointY,
              lightingConfig.pointZ,
            ]}
            intensity={lightingConfig.pointIntensity}
            color="#ffffff"
            distance={lightingConfig.pointDistance}
            decay={2}
          />
        )}

        {/* Modèle 3D avec gestion du chargement et animation */}
        <Suspense fallback={null}>
          <Center>
            <ChemiseGLB isSelected={!!selectedBadge} />
          </Center>
        </Suspense>
      </Canvas>
    </div>
  );
};

// Préchargement du modèle
useGLTF.preload("/chemise/chemise.glb");