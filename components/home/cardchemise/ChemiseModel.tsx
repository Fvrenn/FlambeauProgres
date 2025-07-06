'use client';

import { Canvas } from '@react-three/fiber';
import { useGLTF, Center, Bounds } from '@react-three/drei';
import { Suspense } from 'react';
// import { useControls } from 'leva'; // GUI commentée pour production

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

// Composant principal exporté avec paramètres fixes (GUI désactivée)
export const ChemiseModel = () => {
  // Paramètres d'éclairage fixes basés sur vos derniers réglages
  const lightingConfig = {
    // Ambient Light
    ambientIntensity: 0.8,
    ambientColor: '#ffffff',
    
    // Directional Light
    directionalIntensity: 2.0,
    directionalX: 10.0,
    directionalY: 10.0,
    directionalZ: 7.0,
    directionalColor: '#ffffff',
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
    pointDistance: 10
  };

  /* GUI LEVA - Décommentez cette section pour réactiver la GUI
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
  */

  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 5], fov: 20 }} shadows={lightingConfig.enableShadows}>
        {/* Éclairage avec paramètres fixes */}
        
        {/* Ambient Light */}
        <ambientLight 
          intensity={lightingConfig.ambientIntensity} 
          color={lightingConfig.ambientColor} 
        />
        
        {/* Directional Light */}
        <directionalLight 
          position={[lightingConfig.directionalX, lightingConfig.directionalY, lightingConfig.directionalZ]} 
          intensity={lightingConfig.directionalIntensity}
          color={lightingConfig.directionalColor}
          castShadow={lightingConfig.enableShadows}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        
        {/* Spot Light (conditionnel) */}
        {lightingConfig.enableSpotLight && (
          <spotLight
            position={[lightingConfig.spotX, lightingConfig.spotY, lightingConfig.spotZ]}
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
            position={[lightingConfig.pointX, lightingConfig.pointY, lightingConfig.pointZ]}
            intensity={lightingConfig.pointIntensity}
            color="#ffffff"
            distance={lightingConfig.pointDistance}
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
