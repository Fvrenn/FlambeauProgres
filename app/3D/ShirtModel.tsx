import { useRef, useEffect, useState } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type ShirtModelProps = {
  scale?: [number, number, number];
  position?: [number, number, number];
  rotate?: boolean;
  selectedBadgeId?: string | null;
};

const ROTATION_ACTIVE = -Math.PI * 0.32;
const ROTATION_INIT = 0;
const SCALE_INIT = 1;
const SCALE_ZOOM = 1.9;
const POSITION_INIT: [number, number, number] = [0, 0, 0];
const POSITION_ZOOM: [number, number, number] = [-0.1, -1.33, 0];

export default function ShirtModel({
  scale = [1, 1, 1],
  position = [0, 0, 0],
  rotate = false,
  selectedBadgeId = null,
}: ShirtModelProps) {
  const { scene } = useGLTF("/3D/Shirt-badge7.glb");
  const ref = useRef<THREE.Group>(null);
  const badgeMeshes = useRef<Map<string, THREE.Mesh[]>>(new Map());
  const initialized = useRef(false);

  const [currentRotation, setCurrentRotation] = useState(ROTATION_INIT);
  const [currentScale, setCurrentScale] = useState(SCALE_INIT);
  const [currentPosition, setCurrentPosition] = useState<[number, number, number]>(POSITION_INIT);

  const targetRotation = rotate ? ROTATION_ACTIVE : ROTATION_INIT;
  const targetScale = rotate ? SCALE_ZOOM : SCALE_INIT;
  const targetPosition = rotate ? POSITION_ZOOM : POSITION_INIT;

  // Initialisation une seule fois
  useEffect(() => {
    if (scene && !initialized.current) {
      scene.traverse((child) => {
        if (child.name.includes('badge_')) {
          const badgeId = child.name.replace('badge_', '');
          const meshes: THREE.Mesh[] = [];
          
          child.traverse((meshChild) => {
            if (meshChild instanceof THREE.Mesh) {
              const material = meshChild.material;
              
              if (material && (material instanceof THREE.MeshStandardMaterial || material instanceof THREE.MeshBasicMaterial)) {
                // Clone le matériau et sauvegarde les propriétés originales
                const clonedMaterial = material.clone();
                meshChild.material = clonedMaterial;
                
                // Stockage dans userData pour éviter la Map externe
                meshChild.userData.originalColor = material.color.clone();
                meshChild.userData.originalOpacity = material.opacity;
                if (material instanceof THREE.MeshStandardMaterial) {
                  meshChild.userData.originalEmissive = material.emissive.clone();
                }
                
                meshes.push(meshChild);
              }
            }
          });
          
          badgeMeshes.current.set(badgeId, meshes);
        }
      });
      initialized.current = true;
    }
  }, [scene]);

  // Application des filtres
  useEffect(() => {
    badgeMeshes.current.forEach((meshes, badgeId) => {
      const isSelected = selectedBadgeId === badgeId;
      
      meshes.forEach((mesh) => {
        const material = mesh.material as THREE.MeshStandardMaterial | THREE.MeshBasicMaterial;
        
        if (isSelected) {
          // Restaurer les couleurs originales
          material.color.copy(mesh.userData.originalColor);
          material.opacity = mesh.userData.originalOpacity;
          material.transparent = mesh.userData.originalOpacity < 1;
          
          if (material instanceof THREE.MeshStandardMaterial && mesh.userData.originalEmissive) {
            material.emissive.copy(mesh.userData.originalEmissive);
          }
        } else {
          // Appliquer le filtre gris
          material.color.setHex(0x808080);
          material.opacity = 0.6;
          material.transparent = true;
          
          if (material instanceof THREE.MeshStandardMaterial) {
            material.emissive.setHex(0x000000);
          }
        }
        
        material.needsUpdate = true;
      });
    });
  }, [selectedBadgeId]);

  // Animation optimisée
  useFrame(() => {
    if (!ref.current) return;
    
    const lerpFactor = 0.1;
    const threshold = 0.001;

    // Rotation
    if (Math.abs(currentRotation - targetRotation) > threshold) {
      const nextRotation = THREE.MathUtils.lerp(currentRotation, targetRotation, lerpFactor);
      ref.current.rotation.y = nextRotation;
      setCurrentRotation(nextRotation);
    }

    // Scale
    if (Math.abs(currentScale - targetScale) > threshold) {
      const nextScale = THREE.MathUtils.lerp(currentScale, targetScale, lerpFactor);
      ref.current.scale.setScalar(nextScale);
      setCurrentScale(nextScale);
    }

    // Position
    const positionNeedsUpdate = currentPosition.some((current, i) => 
      Math.abs(current - targetPosition[i]) > threshold
    );
    
    if (positionNeedsUpdate) {
      const newPosition = currentPosition.map((current, i) => 
        THREE.MathUtils.lerp(current, targetPosition[i], lerpFactor)
      ) as [number, number, number];
      
      ref.current.position.set(...newPosition);
      setCurrentPosition(newPosition);
    }
  });

  return <primitive ref={ref} object={scene} />;
}