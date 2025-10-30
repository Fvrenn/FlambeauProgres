"use client";

import { Canvas } from "@react-three/fiber";
import { useGLTF, Center } from "@react-three/drei";
import { Suspense, useLayoutEffect, useMemo } from "react";
import * as THREE from "three";

// Composant pour charger et afficher le modèle 3D
function ChemiseGLB({ selectedBadge }: { selectedBadge?: string | null }) {
  const { scene } = useGLTF("/chemise/chemise.glb");

  // On clone la scène pour pouvoir la modifier sans affecter le cache de useGLTF
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  // Appliquer un effet mat aux matériaux du modèle une seule fois
  useMemo(() => {
    clonedScene.traverse((child: any) => {
      if (child.isMesh && child.material) {
        // On s'assure de cloner les matériaux une seule fois pour pouvoir les modifier indépendamment
        child.material = child.material.clone();
        child.material.roughness = 0.8;
        child.material.metalness = 0.1;
        child.material.envMapIntensity = 0.3;
      }
    });
  }, [clonedScene]);

  useLayoutEffect(() => {
    clonedScene.traverse((obj: any) => {
      if (obj.type === "Group" && obj.name.startsWith("badge_")) {
        const isActive = selectedBadge && obj.name === `badge_${selectedBadge}`;
        obj.traverse((child: any) => {
          if (child.isMesh && child.material) {
            // On ne clone plus, on modifie directement les propriétés
            if (isActive) {
              child.material.color.set("#ffffff");
              child.material.roughness = 0.3;
              child.material.metalness = 0.2;
              child.material.envMapIntensity = 1;
              child.material.opacity = 1;
              child.material.transparent = false;
            } else {
              child.material.color.set("#9c9c9c");
              child.material.roughness = 0.3;
              child.material.metalness = 0;
              child.material.envMapIntensity = 1;
              child.material.opacity = 0.4;
              child.material.transparent = true;
            }
          }
        });
      }
    });
  }, [clonedScene, selectedBadge]);

  return (
    <primitive 
      object={clonedScene} 
      scale={2} 
      position={[0, 0, 0]} 
      rotation={[0, -0.3, 0]} 
    />
  );
}

// Interface pour les props du composant principal
interface ChemiseModelProps {
  selectedBadge?: string | null;
}

// Composant principal exporté
export const ChemiseModel = ({ selectedBadge }: ChemiseModelProps) => {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 5], fov: 20 }}>
        {/* Éclairage ambiant */}
        <ambientLight intensity={0.8} color="#ffffff" />

        {/* Lumière directionnelle */}
        <directionalLight
          position={[10, 10, 7]}
          intensity={2.0}
          color="#ffffff"
        />

        {/* Spot Light */}
        <spotLight
          position={[-2, 6, 2]}
          intensity={80}
          angle={0.6}
          penumbra={0}
          color="#ffffff"
        />

        {/* Point Light */}
        <pointLight
          position={[4, -1.5, 1]}
          intensity={10}
          color="#ffffff"
          distance={10}
          decay={2}
        />

        {/* Modèle 3D */}
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