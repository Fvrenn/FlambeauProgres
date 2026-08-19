"use client";

/* eslint-disable react/no-unknown-property -- React Three Fiber props (position, intensity, ...) unknown to eslint-plugin-react */

import type { Branche } from "@/lib/wordpress-profile";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Center } from "@react-three/drei";
import {
  Suspense,
  useRef,
  useLayoutEffect,
  useMemo,
  useEffect,
  useState,
} from "react";
import { MathUtils, Group, Mesh, MeshStandardMaterial } from "three";

import {
  evaluerAvancementBarettes,
  getChemiseVisibility,
  type EtapeAvancement,
} from "@/lib/chemise-parts";

const CAMERA_CONFIG = {
  fov: 20,
  distance: { mobile: 3.5, desktop: 5 },
};

const MOBILE_QUERY = "(max-width: 767px)";

const LIGHTING_CONFIG = {
  ambient: { intensity: 0.8, color: "#ffffff" },
  directional: {
    position: [10, 10, 7] as [number, number, number],
    intensity: 2.0,
  },
  spot: {
    position: [-2, 6, 2] as [number, number, number],
    intensity: 80,
    angle: 0.6,
  },
  point: {
    position: [4, -1.5, 1] as [number, number, number],
    intensity: 10,
    distance: 10,
  },
};

const ANIMATION_CONFIG = {
  desktop: {
    default: {
      rotation: [0, -0.3, 0] as [number, number, number],
      scale: 1.0,
      position: [0, 0, 0] as [number, number, number],
    },
    selected: {
      rotation: [0.1, -1.4, 0] as [number, number, number],
      scale: 2,
      position: [-0.2, -3, 0] as [number, number, number],
    },
  },
  mobile: {
    default: {
      rotation: [0, -0.3, 0] as [number, number, number],
      scale: 1.0,
      position: [0, -0.17, 0] as [number, number, number],
    },
    selected: {
      rotation: [0.1, -1.4, 0] as [number, number, number],
      scale: 1.45,
      position: [-0.14, -1.25, 0] as [number, number, number],
    },
  },
  lerpSpeed: 5,
};

const MATERIAL_CONFIG = {
  base: { roughness: 0.8, metalness: 0.1, envMapIntensity: 0.3 },
  badgeActive: { color: "#ffffff", roughness: 0.3, metalness: 0.2, opacity: 1 },
  badgeInactive: {
    color: "#9c9c9c",
    roughness: 0.3,
    metalness: 0,
    opacity: 0.4,
  },
};

function ChemiseGLB({
  selectedBadge,
  branche,
  etapes,
  isMobile,
}: {
  selectedBadge?: string | null;
  branche?: Branche | null;
  etapes?: EtapeAvancement[];
  isMobile: boolean;
}) {
  const { scene } = useGLTF("/chemise/chemise.glb", "/draco/");
  const meshRef = useRef<Group>(null);

  useFrame((_, delta) => {
    const group = meshRef.current;

    if (!group) return;

    const config = isMobile
      ? ANIMATION_CONFIG.mobile
      : ANIMATION_CONFIG.desktop;
    const target = selectedBadge ? config.selected : config.default;
    const lerpFactor = delta * ANIMATION_CONFIG.lerpSpeed;

    group.rotation.x = MathUtils.lerp(
      group.rotation.x,
      target.rotation[0],
      lerpFactor,
    );
    group.rotation.y = MathUtils.lerp(
      group.rotation.y,
      target.rotation[1],
      lerpFactor,
    );
    group.rotation.z = MathUtils.lerp(
      group.rotation.z,
      target.rotation[2],
      lerpFactor,
    );

    const newScale = MathUtils.lerp(group.scale.x, target.scale, lerpFactor);

    group.scale.set(newScale, newScale, newScale);

    group.position.x = MathUtils.lerp(
      group.position.x,
      target.position[0],
      lerpFactor,
    );
    group.position.y = MathUtils.lerp(
      group.position.y,
      target.position[1],
      lerpFactor,
    );
    group.position.z = MathUtils.lerp(
      group.position.z,
      target.position[2],
      lerpFactor,
    );
  });

  useLayoutEffect(() => {
    scene.traverse((child) => {
      if (child instanceof Mesh && child.material) {
        Object.assign(child.material, MATERIAL_CONFIG.base);
      }
    });
  }, [scene]);

  const { etape1Validee, etape2Validee } = useMemo(
    () => evaluerAvancementBarettes(etapes ?? []),
    [etapes],
  );

  const nodeVisibility = useMemo(
    () => getChemiseVisibility(branche ?? null, etape1Validee, etape2Validee),
    [branche, etape1Validee, etape2Validee],
  );

  useLayoutEffect(() => {
    scene.traverse((obj) => {
      const visible = nodeVisibility.get(obj.name);

      if (visible !== undefined) {
        obj.visible = visible;
      }
    });
  }, [scene, nodeVisibility]);

  useLayoutEffect(() => {
    scene.traverse((obj) => {
      if (obj.type === "Group" && obj.name.startsWith("badge_")) {
        const isActive =
          !!selectedBadge &&
          obj.name.toLowerCase() === `badge_${selectedBadge.toLowerCase()}`;
        const materialConfig = isActive
          ? MATERIAL_CONFIG.badgeActive
          : MATERIAL_CONFIG.badgeInactive;

        obj.traverse((child) => {
          if (child instanceof Mesh && child.material) {
            const material = (child.material as MeshStandardMaterial).clone();

            material.color.set(materialConfig.color);
            material.roughness = materialConfig.roughness;
            material.metalness = materialConfig.metalness;
            material.opacity = materialConfig.opacity;
            material.transparent = !isActive;
            child.material = material;
          }
        });
      }
    });
  }, [scene, selectedBadge]);

  return (
    <group ref={meshRef}>
      <primitive object={scene} position={[0, 0, 0]} scale={2} />
    </group>
  );
}

interface ChemiseModelProps {
  selectedBadge?: string | null;
  branche?: Branche | null;
  etapes?: EtapeAvancement[];
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const query = window.matchMedia(MOBILE_QUERY);
    const sync = () => setIsMobile(query.matches);

    sync();
    query.addEventListener("change", sync);

    return () => query.removeEventListener("change", sync);
  }, []);

  return isMobile;
}

function CameraRig({ distance }: { distance: number }) {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(0, 0, distance);
    camera.updateProjectionMatrix();
  }, [camera, distance]);

  return null;
}

function detectLowEndDevice() {
  if (typeof navigator === "undefined") return false;
  const isMobile = /Mobi|Android/i.test(navigator.userAgent);
  const cores = navigator.hardwareConcurrency ?? 8;

  return isMobile && cores <= 4;
}

export const ChemiseModel = ({
  selectedBadge,
  branche,
  etapes,
}: ChemiseModelProps) => {
  const { ambient, directional, spot, point } = LIGHTING_CONFIG;
  const isLowEnd = useMemo(detectLowEndDevice, []);
  const isMobile = useIsMobile();
  const distance = isMobile
    ? CAMERA_CONFIG.distance.mobile
    : CAMERA_CONFIG.distance.desktop;

  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, distance], fov: CAMERA_CONFIG.fov }}
        dpr={isLowEnd ? [1, 1.5] : [1, 2]}
        gl={{ antialias: !isLowEnd, powerPreference: "high-performance" }}
        shadows={false}
      >
        <CameraRig distance={distance} />
        <ambientLight color={ambient.color} intensity={ambient.intensity} />
        <directionalLight
          color="#ffffff"
          intensity={directional.intensity}
          position={directional.position}
        />
        <spotLight
          angle={spot.angle}
          color="#ffffff"
          intensity={spot.intensity}
          penumbra={0}
          position={spot.position}
        />
        <pointLight
          color="#ffffff"
          decay={2}
          distance={point.distance}
          intensity={point.intensity}
          position={point.position}
        />

        <Suspense fallback={null}>
          <Center>
            <ChemiseGLB
              branche={branche}
              etapes={etapes}
              isMobile={isMobile}
              selectedBadge={selectedBadge}
            />
          </Center>
        </Suspense>
      </Canvas>
    </div>
  );
};

useGLTF.preload("/chemise/chemise.glb");
