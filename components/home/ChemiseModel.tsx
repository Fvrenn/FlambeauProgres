'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { Suspense } from 'react';

// Composant pour charger et afficher le modèle 3D
function ChemiseGLB() {
  const { scene } = useGLTF('/chemise/chemise.glb');
  
  return (
    <primitive 
      object={scene} 
      scale={[1, 1, 1]} 
      position={[0, 0, 0]} 
      rotation={[0, 0, 0]}
    />
  );
}

// Composant de chargement simple
function Loader() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
    </div>
  );
}

// Composant principal exporté
export const ChemiseModel = () => {
  return (
    <div className="w-full h-32">
      <Canvas
        camera={{ 
          position: [0, 0, 5], 
          fov: 45 
        }}
        style={{ background: 'transparent' }}
      >
        {/* Éclairage */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        
        {/* Modèle 3D avec gestion du chargement */}
        <Suspense fallback={null}>
          <ChemiseGLB />
        </Suspense>
        
        {/* Contrôles de caméra */}
        <OrbitControls 
          enableZoom={true}
          enablePan={false}
          enableRotate={true}
          autoRotate={true}
          autoRotateSpeed={2}
        />
      </Canvas>
    </div>
  );
};

// Préchargement du modèle
useGLTF.preload('/chemise/chemise.glb');
