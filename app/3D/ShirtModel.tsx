import { useRef, useEffect, useState } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

type ShirtModelProps = {
  scale?: [number, number, number];
  position?: [number, number, number];
  rotate?: boolean;
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
}: ShirtModelProps) {
  const { scene } = useGLTF("/3D/chemise.glb");
  const ref = useRef<any>(null);

  const [currentRotation, setCurrentRotation] = useState(ROTATION_INIT);
  const [currentScale, setCurrentScale] = useState(SCALE_INIT);
  const [currentPosition, setCurrentPosition] = useState<[number, number, number]>(POSITION_INIT);

  const targetRotation = rotate ? ROTATION_ACTIVE : ROTATION_INIT;
  const targetScale = rotate ? SCALE_ZOOM : SCALE_INIT;
  const targetPosition = rotate ? POSITION_ZOOM : POSITION_INIT;

  useFrame(() => {
    if (ref.current) {
      const lerpFactor = 0.1; // Facteur d'interpolation pour une animation fluide

      // Animation rotation
      if (Math.abs(currentRotation - targetRotation) > 0.001) {
        const nextRotation = currentRotation + (targetRotation - currentRotation) * lerpFactor;
        ref.current.rotation.y = nextRotation;
        setCurrentRotation(nextRotation);
      }

      // Animation scale
      if (Math.abs(currentScale - targetScale) > 0.001) {
        const nextScale = currentScale + (targetScale - currentScale) * lerpFactor;
        ref.current.scale.set(nextScale, nextScale, nextScale);
        setCurrentScale(nextScale);
      }

      // Animation position
      const newPosition: [number, number, number] = [...currentPosition];
      let positionChanged = false;

      for (let i = 0; i < 3; i++) {
        if (Math.abs(currentPosition[i] - targetPosition[i]) > 0.001) {
          newPosition[i] = currentPosition[i] + (targetPosition[i] - currentPosition[i]) * lerpFactor;
          positionChanged = true;
        }
      }

      if (positionChanged) {
        ref.current.position.set(...newPosition);
        setCurrentPosition(newPosition);
      }
    }
  });

  return (
    <primitive
      ref={ref}
      object={scene}
    />
  );
}