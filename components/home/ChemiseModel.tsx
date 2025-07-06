'use client';

import { Canvas } from '@react-three/fiber';
import { useGLTF, Center, Bounds } from '@react-three/drei';
import { Suspense } from 'react';
import { useControls } from 'leva';

// Composant pour charger et afficher le modèle 3D avec effet mat
function ChemiseGLB() {
  const { scene } = useGLTF('/chemise/chemise.glb');
  
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
    <primitive 
      object={scene} 
      scale={1}
      position={[0, 0, 0]}
    //   rotation={[0.1, -1, 0]}
    />
  );
}

// Composant principal exporté avec GUI pour ajuster les lumières
export const ChemiseModel = () => {
  // GUI Controls pour ajuster les lumières en temps réel
  const controls = useControls({
    // Ambient Light
    ambientIntensity: { value: 0.8, min: 0, max: 2, step: 0.1 },
    ambientColor: '#ffffff',
    
    // Directional Light
    directionalIntensity: { value: 2.0, min: 0, max: 3, step: 0.1 },
    directionalX: { value: 10.0, min: -10, max: 10, step: 0.5 },
    directionalY: { value: 10.0, min: -10, max: 10, step: 0.5 },
    directionalZ: { value: 7.0, min: -10, max: 10, step: 0.5 },
    directionalColor: '#ffffff',
    enableShadows: false,
    
    // Spot Light
    enableSpotLight: true,
    spotIntensity: { value: 80, min: 0, max: 100, step: 5 },
    spotX: { value: -2.0, min: -10, max: 10, step: 0.5 },
    spotY: { value: 6.0, min: -10, max: 10, step: 0.5 },
    spotZ: { value: 2.0, min: -10, max: 10, step: 0.5 },
    spotAngle: { value: 0.6, min: 0, max: Math.PI / 2, step: 0.1 },
    spotPenumbra: { value: 0.0, min: 0, max: 1, step: 0.1 },
    
    // Point Light
    enablePointLight: true,
    pointIntensity: { value: 10, min: 0, max: 50, step: 5 },
    pointX: { value: 4.0, min: -10, max: 10, step: 0.5 },
    pointY: { value: -1.5, min: -10, max: 10, step: 0.5 },
    pointZ: { value: 1.0, min: -10, max: 10, step: 0.5 },
    pointDistance: { value: 10, min: 0, max: 20, step: 1 }
  });

  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 5], fov: 20 }} shadows={controls.enableShadows}>
        {/* Éclairage contrôlable via GUI */}
        
        {/* Ambient Light */}
        <ambientLight 
          intensity={controls.ambientIntensity} 
          color={controls.ambientColor} 
        />
        
        {/* Directional Light */}
        <directionalLight 
          position={[controls.directionalX, controls.directionalY, controls.directionalZ]} 
          intensity={controls.directionalIntensity}
          color={controls.directionalColor}
          castShadow={controls.enableShadows}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        
        {/* Spot Light (conditionnel) */}
        {controls.enableSpotLight && (
          <spotLight
            position={[controls.spotX, controls.spotY, controls.spotZ]}
            intensity={controls.spotIntensity}
            angle={controls.spotAngle}
            penumbra={controls.spotPenumbra}
            color="#ffffff"
            castShadow={controls.enableShadows}
          />
        )}
        
        {/* Point Light (conditionnel) */}
        {controls.enablePointLight && (
          <pointLight
            position={[controls.pointX, controls.pointY, controls.pointZ]}
            intensity={controls.pointIntensity}
            color="#ffffff"
            distance={controls.pointDistance}
            decay={2}
          />
        )}
        
        {/* Modèle 3D avec gestion du chargement */}
        <Suspense fallback={null}>
          <Bounds 
            fit 
            clip 
            observe 
            margin={1.1} 
            maxDuration={0}
            interpolateFunc={(t) => t}
          >
            <Center>
              <ChemiseGLB />
            </Center>
          </Bounds>
        </Suspense>
      </Canvas>
    </div>
  );
};

// Préchargement du modèle
useGLTF.preload('/chemise/chemise.glb');
