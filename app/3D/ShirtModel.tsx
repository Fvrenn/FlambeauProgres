"use client";
import { useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three-stdlib'
import { useGLTF } from '@react-three/drei'

type ShirtModelProps = {
  scale?: [number, number, number]
  position?: [number, number, number]
}

export default function ShirtModel({ scale = [1, 1, 1], position = [0, 0, 0] }: ShirtModelProps) {
  const { scene } = useGLTF('/3D/Shirt3.glb')
  return <primitive object={scene} scale={scale} position={position} />
}