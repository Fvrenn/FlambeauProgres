import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Stage, Center } from "@react-three/drei";
import ShirtModel from "../../app/3D/ShirtModel";

export default function ThreeScene({ rotate = false }) {
  return (
    <div className="object_3D" style={{ width: "374px", height: "100%" }}>
      <Canvas
        camera={
          rotate
            ? { position: [6.1, 0.5, 3], fov: 23 }
            : { position: [1.1, 0.5, 3], fov: 45 }
        }
        shadows
      >
        <Stage
          environment="city"
          intensity={2}
          shadows
          adjustCamera={false}
          preset="rembrandt"
        >
          <Center scale={3.1}>
            <ShirtModel position={[0, -0.2, 0]} rotate={rotate} />
          </Center>
        </Stage>
      </Canvas>
    </div>
  );
}