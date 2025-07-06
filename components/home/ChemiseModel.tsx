'use client';

import { Canvas } from '@react-three/fiber';
import { useGLTF, Center, Bounds } from '@react-three/drei';
import { Suspense } from 'react';

// Composant pour charger et afficher le modèle 3D - approche simple et directe
function ChemiseGLB() {
  const { scene } = useGLTF('/chemise/chemise.glb');
  
  return (
    <primitive 
      object={scene} 
      scale={1}
      position={[0, 0, 0]}
    />
  );
}

// Composant principal exporté - approche simplifiée selon la doc R3F
export const ChemiseModel = () => {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 5], fov: 20 }}>
        {/* Éclairage - approche directe comme dans la doc */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[2, 2, 5]} intensity={1} />
        
        {/* Modèle 3D avec gestion du chargement */}
        <Suspense fallback={null}>
          <Bounds fit clip observe margin={1.1}>
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
