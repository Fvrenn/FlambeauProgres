"use client";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Stage, Center } from "@react-three/drei";
import ShirtModel from "../../app/3D/ShirtModel";

export default function ThreeScene() {
  return (
   <div className="object_3D" style={{ width: "374px", height: "100%" }}>
      <Canvas 
        camera={{ position: [1.1, 0.5, 3], fov: 45 }} 
        shadows
      >
        {/* Stage configuré pour maximiser l'utilisation de l'espace */}
        <Stage 
          environment="city"
          intensity={2}
          shadows
          adjustCamera={false} 
          preset="rembrandt"
        >
          <Center scale={3.1}>
            <ShirtModel 
              position={[0, -0.2, 0]} // Léger ajustement vertical
            />
          </Center>
        </Stage>
      </Canvas>
    </div>
  );
}