"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";

/**
 * "Volute" — a GPU particle flow-field evoking fluid swept through an
 * impeller. All motion happens in the vertex shader (differential rotation
 * + curl-like wobble), so the per-frame CPU cost is a single uniform
 * update. Brand colours: azure #2584C5 → green #72BF44.
 */

const PARTICLE_COUNT = 6500;

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uPixelRatio;
  attribute float aSeed;
  attribute float aRadius;
  varying float vMix;
  varying float vFade;

  void main() {
    float seed = aSeed;
    float radius = aRadius;

    // Differential rotation: inner particles sweep faster, like flow
    // accelerating through an impeller eye.
    float speed = 0.22 / (0.35 + radius);
    float angle = seed * 6.28318 + uTime * speed;

    // Slow breathing of the disc + curl-like vertical wobble.
    float wobble = sin(uTime * 0.35 + seed * 12.0) * 0.085;
    float r = radius + sin(uTime * 0.18 + seed * 31.0) * 0.06;

    vec3 pos = vec3(
      cos(angle) * r,
      (sin(seed * 43.0) * 0.42 + wobble) * (1.35 - radius * 0.5),
      sin(angle) * r
    );

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    float size = (1.3 - radius * 0.45) * (0.8 + 0.4 * sin(seed * 91.0));
    gl_PointSize = size * uPixelRatio * (28.0 / -mvPosition.z);

    vMix = smoothstep(0.2, 2.4, radius);
    vFade = 0.55 + 0.45 * sin(uTime * 0.5 + seed * 17.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  varying float vMix;
  varying float vFade;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    float alpha = smoothstep(0.5, 0.05, d) * vFade;
    if (alpha < 0.01) discard;
    vec3 color = mix(uColorA, uColorB, vMix);
    gl_FragColor = vec4(color, alpha * 0.85);
  }
`;

function FlowField() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const groupRef = useRef<THREE.Group>(null);
  const { pointer } = useThree();

  const { positions, seeds, radii } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const seeds = new Float32Array(PARTICLE_COUNT);
    const radii = new Float32Array(PARTICLE_COUNT);
    for (let i = 0; i < PARTICLE_COUNT; i += 1) {
      // Bias particles toward an annulus, thinning toward the rim.
      const t = Math.random();
      radii[i] = 0.45 + Math.pow(t, 0.65) * 2.1;
      seeds[i] = Math.random();
      positions[i * 3] = 0;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = 0;
    }
    return { positions, seeds, radii };
  }, []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPixelRatio: { value: 1 },
      uColorA: { value: new THREE.Color("#4aa8e8") },
      uColorB: { value: new THREE.Color("#72bf44") },
    }),
    [],
  );

  useFrame((state, delta) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value += delta;
      materialRef.current.uniforms.uPixelRatio.value = state.gl.getPixelRatio();
    }
    if (groupRef.current) {
      // Gentle parallax toward the pointer.
      groupRef.current.rotation.y +=
        (pointer.x * 0.25 - groupRef.current.rotation.y) * 0.02;
      groupRef.current.rotation.x +=
        (0.42 + pointer.y * 0.12 - groupRef.current.rotation.x) * 0.02;
    }
  });

  return (
    <group ref={groupRef} rotation={[0.42, 0, 0]}>
      <points frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-aSeed" args={[seeds, 1]} />
          <bufferAttribute attach="attributes-aRadius" args={[radii, 1]} />
        </bufferGeometry>
        <shaderMaterial
          ref={materialRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 1.1, 4.2], fov: 50 }}
      dpr={[1, 1.75]}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      style={{ position: "absolute", inset: 0 }}
      aria-hidden
    >
      <FlowField />
    </Canvas>
  );
}
