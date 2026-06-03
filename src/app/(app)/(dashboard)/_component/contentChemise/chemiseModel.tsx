"use client";

/* eslint-disable react/no-unknown-property -- props React Three Fiber (position, intensity, ...) non reconnues par eslint-plugin-react */

import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Center } from "@react-three/drei";
import { Suspense, useRef, useLayoutEffect } from "react";
import * as THREE from "three";

const LIGHTING_CONFIG = {
  ambient: { intensity: 0.8, color: "#ffffff" },
  directional: {
    position: [10, 10, 7] as [number, number, number],
    intensity: 2.0,
  },
  spot: {
    position: [-2, 6, 2] as [number, number, number],
    intensity: 80,
    angle: 0.6,
  },
  point: {
    position: [4, -1.5, 1] as [number, number, number],
    intensity: 10,
    distance: 10,
  },
};

// Configuration des animations
const ANIMATION_CONFIG = {
  selected: {
    rotation: [0.1, -1.4, 0] as [number, number, number],
    scale: 2,
    position: [-0.2, -3, 0] as [number, number, number],
  },
  default: {
    rotation: [0, -0.3, 0] as [number, number, number],
    scale: 1.0,
    position: [0, 0, 0] as [number, number, number],
  },
  lerpSpeed: 5,
};

const MATERIAL_CONFIG = {
  base: { roughness: 0.8, metalness: 0.1, envMapIntensity: 0.3 },
  badgeActive: { color: "#ffffff", roughness: 0.3, metalness: 0.2, opacity: 1 },
  badgeInactive: {
    color: "#9c9c9c",
    roughness: 0.3,
    metalness: 0,
    opacity: 0.4,
  },
};

function ChemiseGLB({ selectedBadge }: { selectedBadge?: string | null }) {
  const { scene } = useGLTF("/chemise/chemise.glb");
  const meshRef = useRef<THREE.Group>(null);

  // Animation de rotation, scale et position
  useFrame((state, delta) => {
    if (!meshRef.current) return;

    const isSelected = !!selectedBadge;
    const target = isSelected
      ? ANIMATION_CONFIG.selected
      : ANIMATION_CONFIG.default;
    const lerpFactor = delta * ANIMATION_CONFIG.lerpSpeed;

    // Rotation
    meshRef.current.rotation.x = THREE.MathUtils.lerp(
      meshRef.current.rotation.x,
      target.rotation[0],
      lerpFactor,
    );
    meshRef.current.rotation.y = THREE.MathUtils.lerp(
      meshRef.current.rotation.y,
      target.rotation[1],
      lerpFactor,
    );
    meshRef.current.rotation.z = THREE.MathUtils.lerp(
      meshRef.current.rotation.z,
      target.rotation[2],
      lerpFactor,
    );

    // Scale
    const newScale = THREE.MathUtils.lerp(
      meshRef.current.scale.x,
      target.scale,
      lerpFactor,
    );

    meshRef.current.scale.set(newScale, newScale, newScale);

    // Position
    meshRef.current.position.x = THREE.MathUtils.lerp(
      meshRef.current.position.x,
      target.position[0],
      lerpFactor,
    );
    meshRef.current.position.y = THREE.MathUtils.lerp(
      meshRef.current.position.y,
      target.position[1],
      lerpFactor,
    );
    meshRef.current.position.z = THREE.MathUtils.lerp(
      meshRef.current.position.z,
      target.position[2],
      lerpFactor,
    );
  });

  useLayoutEffect(() => {
    scene.traverse((child: any) => {
      if (child.isMesh && child.material) {
        Object.assign(child.material, MATERIAL_CONFIG.base);
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene]);

  // Gestion des badges : grisage et mise en surbrillance
  useLayoutEffect(() => {
    scene.traverse((obj: any) => {
      if (obj.type === "Group" && obj.name.startsWith("badge_")) {
        const isActive =
          selectedBadge &&
          obj.name.toLowerCase() === `badge_${selectedBadge.toLowerCase()}`;
        const materialConfig = isActive
          ? MATERIAL_CONFIG.badgeActive
          : MATERIAL_CONFIG.badgeInactive;

        obj.traverse((child: any) => {
          if (child.isMesh && child.material) {
            child.material = child.material.clone();
            child.material.color.set(materialConfig.color);
            child.material.roughness = materialConfig.roughness;
            child.material.metalness = materialConfig.metalness;
            child.material.envMapIntensity = 1;
            child.material.opacity = materialConfig.opacity;
            child.material.transparent = !isActive;
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
      }
    });
  }, [scene, selectedBadge]);

  return (
    <group ref={meshRef}>
      <primitive object={scene} position={[0, 0, 0]} scale={2} />
    </group>
  );
}

interface ChemiseModelProps {
  selectedBadge?: string | null;
}

export const ChemiseModel = ({ selectedBadge }: ChemiseModelProps) => {
  const { ambient, directional, spot, point } = LIGHTING_CONFIG;

  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 5], fov: 20 }} shadows={false}>
        <ambientLight color={ambient.color} intensity={ambient.intensity} />
        <directionalLight
          color="#ffffff"
          intensity={directional.intensity}
          position={directional.position}
        />
        <spotLight
          angle={spot.angle}
          color="#ffffff"
          intensity={spot.intensity}
          penumbra={0}
          position={spot.position}
        />
        <pointLight
          color="#ffffff"
          decay={2}
          distance={point.distance}
          intensity={point.intensity}
          position={point.position}
        />

        <Suspense fallback={null}>
          <Center>
            <ChemiseGLB selectedBadge={selectedBadge} />
          </Center>
        </Suspense>
      </Canvas>
    </div>
  );
};

useGLTF.preload("/chemise/chemise.glb");
