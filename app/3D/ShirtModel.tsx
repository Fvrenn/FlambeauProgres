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
const SCALE_ZOOM = 1.7;

const POSITION_INIT: [number, number, number] = [0, 0, 0];
const POSITION_ZOOM: [number, number, number] = [-0.1, -1.1, 0];
export default function ShirtModel({
  scale = [1, 1, 1],
  position = [0, 0, 0],
  rotate = false,
}: ShirtModelProps) {
  const { scene } = useGLTF("/3D/chemise.glb");
  const ref = useRef<any>(null);
  const [targetRotation, setTargetRotation] = useState(ROTATION_INIT);
  const [currentRotation, setCurrentRotation] = useState(ROTATION_INIT);
  const [currentScale, setCurrentScale] = useState(SCALE_INIT);
  const [targetScale, setTargetScale] = useState(SCALE_INIT);
  const [targetPosition, setTargetPosition] =
    useState<[number, number, number]>(POSITION_INIT);
  const [currentPosition, setCurrentPosition] =
    useState<[number, number, number]>(POSITION_INIT);
  useEffect(() => {
    setTargetRotation(rotate ? ROTATION_ACTIVE : ROTATION_INIT);
    setTargetScale(rotate ? SCALE_ZOOM : SCALE_INIT);
    setTargetPosition(rotate ? POSITION_ZOOM : POSITION_INIT); 
  }, [rotate]);

  useFrame(() => {
    if (ref.current) {
      // Animation rotation
      const step = 0.03;
      let nextRotation = currentRotation;

      if (Math.abs(currentRotation - targetRotation) > 0.01) {
        if (currentRotation < targetRotation) {
          nextRotation = Math.min(currentRotation + step, targetRotation);
        } else {
          nextRotation = Math.max(currentRotation - step, targetRotation);
        }
        ref.current.rotation.y = nextRotation;
        setCurrentRotation(nextRotation);
      }

      // Animation zoom
      const scaleStep = 0.02;
      let nextScale = currentScale;
      if (Math.abs(currentScale - targetScale) > 0.01) {
        if (currentScale < targetScale) {
          nextScale = Math.min(currentScale + scaleStep, targetScale);
        } else {
          nextScale = Math.max(currentScale - scaleStep, targetScale);
        }
        ref.current.scale.set(nextScale, nextScale, nextScale);
        setCurrentScale(nextScale);
      }
    }

    const posStep = 0.02;
    let nextPosition: [number, number, number] = [...currentPosition] as [
      number,
      number,
      number
    ];
    for (let i = 0; i < 3; i++) {
      if (Math.abs(currentPosition[i] - targetPosition[i]) > 0.01) {
        if (currentPosition[i] < targetPosition[i]) {
          nextPosition[i] = Math.min(
            currentPosition[i] + posStep,
            targetPosition[i]
          );
        } else {
          nextPosition[i] = Math.max(
            currentPosition[i] - posStep,
            targetPosition[i]
          );
        }
      }
    }
    ref.current.position.set(...nextPosition);
    setCurrentPosition(nextPosition);
  });

  useEffect(() => {
    if (ref.current) {
      ref.current.rotation.y = currentRotation;
      ref.current.scale.set(currentScale, currentScale, currentScale);
    }
  }, [ref, currentRotation, currentScale]);

  return <primitive ref={ref} object={scene} position={currentPosition} />;
}
