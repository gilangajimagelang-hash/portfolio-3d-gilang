'use client'

import { useEffect, useMemo, useRef, useState, type RefObject } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import {
  Edges,
  Environment,
  Float,
  Lightformer,
  MeshTransmissionMaterial,
  PerformanceMonitor,
  Sparkles,
} from '@react-three/drei'
import * as THREE from 'three'

type Quality = 'high' | 'low'
type Pointer = { x: number; y: number }

export type HeroSceneProps = {
  reducedMotion: boolean
  compact: boolean
  active: boolean
  onContextLost: () => void
}

const damp = THREE.MathUtils.damp

function useWindowPointer(enabled: boolean) {
  const pointer = useRef<Pointer>({ x: 0, y: 0 })
  useEffect(() => {
    if (!enabled) return
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [enabled])
  return pointer
}

function CameraRig({
  pointer,
  reducedMotion,
  baseZ,
}: {
  pointer: RefObject<Pointer>
  reducedMotion: boolean
  baseZ: number
}) {
  const camera = useThree((s) => s.camera)

  useFrame((state, delta) => {
    if (reducedMotion) return
    const t = state.clock.elapsedTime
    const p = pointer.current
    const tx = p.x * 0.8 + Math.sin(t * 0.13) * 0.3
    const ty = p.y * 0.5 + Math.cos(t * 0.11) * 0.18
    const tz = baseZ + Math.sin(t * 0.09) * 0.25
    camera.position.x = damp(camera.position.x, tx, 1.4, delta)
    camera.position.y = damp(camera.position.y, ty, 1.4, delta)
    camera.position.z = damp(camera.position.z, tz, 0.9, delta)
    camera.lookAt(0, 0, 0)
  })

  return null
}

function GlassMaterial({ quality }: { quality: Quality }) {
  if (quality === 'low') {
    return (
      <meshPhysicalMaterial
        color="#d6ecff"
        transmission={1}
        thickness={0.8}
        roughness={0.06}
        ior={1.45}
        metalness={0}
        clearcoat={1}
        envMapIntensity={1.6}
        transparent
      />
    )
  }
  return (
    <MeshTransmissionMaterial
      backside
      backsideThickness={0.35}
      samples={6}
      resolution={512}
      thickness={0.7}
      roughness={0.04}
      transmission={1}
      ior={1.42}
      chromaticAberration={0.08}
      anisotropicBlur={0.12}
      distortion={0.12}
      distortionScale={0.35}
      temporalDistortion={0.08}
      color="#e3f3ff"
      attenuationColor="#9fdcff"
      attenuationDistance={2.4}
      envMapIntensity={1.4}
    />
  )
}

function Satellite({
  radius,
  speed,
  color,
  size,
  tilt,
  reducedMotion,
}: {
  radius: number
  speed: number
  color: string
  size: number
  tilt: [number, number, number]
  reducedMotion: boolean
}) {
  const pivot = useRef<THREE.Group>(null)
  useFrame((_, delta) => {
    if (!reducedMotion && pivot.current) pivot.current.rotation.z += delta * speed
  })
  return (
    <group rotation={tilt}>
      <mesh>
        <torusGeometry args={[radius, 0.006, 12, 220]} />
        <meshBasicMaterial color={color} transparent opacity={0.55} toneMapped={false} />
      </mesh>
      <group ref={pivot}>
        <mesh position={[radius, 0, 0]}>
          <sphereGeometry args={[size, 24, 24]} />
          <meshBasicMaterial color={color} toneMapped={false} />
        </mesh>
        <pointLight position={[radius, 0, 0]} color={color} intensity={2.5} distance={2.5} />
      </group>
    </group>
  )
}

function Artifact({
  pointer,
  reducedMotion,
  quality,
  compact,
}: {
  pointer: RefObject<Pointer>
  reducedMotion: boolean
  quality: Quality
  compact: boolean
}) {
  const tilt = useRef<THREE.Group>(null)
  const crystal = useRef<THREE.Mesh>(null)
  const core = useRef<THREE.Mesh>(null)
  const hovered = useRef(false)
  const spin = useRef(0)

  useFrame((state, delta) => {
    const p = pointer.current
    const g = tilt.current
    if (g) {
      g.rotation.x = damp(g.rotation.x, p.y * -0.3, 2.5, delta)
      g.rotation.y = damp(g.rotation.y, p.x * 0.45, 2.5, delta)
      const targetScale = hovered.current ? 1.06 : 1
      g.scale.setScalar(damp(g.scale.x, targetScale, 4, delta))
    }
    if (reducedMotion) return

    spin.current = damp(spin.current, hovered.current ? 1.2 : 0.18, 2, delta)
    if (crystal.current) {
      crystal.current.rotation.y += delta * spin.current
      crystal.current.rotation.x += delta * spin.current * 0.35
    }
    if (core.current) {
      core.current.rotation.y -= delta * 0.4
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 1.4) * 0.025
      core.current.scale.setScalar(pulse)
    }
  })

  return (
    <group ref={tilt} scale={1}>
      <Float
        speed={reducedMotion ? 0 : 1.2}
        rotationIntensity={reducedMotion ? 0 : 0.25}
        floatIntensity={reducedMotion ? 0 : 0.6}
      >
        <group scale={compact ? 0.82 : 1}>
          <mesh ref={core}>
            <sphereGeometry args={[0.58, 64, 64]} />
            <meshPhysicalMaterial
              color="#0a1838"
              metalness={1}
              roughness={0.08}
              clearcoat={1}
              clearcoatRoughness={0.05}
              iridescence={1}
              iridescenceIOR={1.7}
              iridescenceThicknessRange={[200, 900]}
              envMapIntensity={2.2}
            />
          </mesh>
          <pointLight color="#22d3ee" intensity={6} distance={3} />

          <mesh
            ref={crystal}
            onPointerOver={() => {
              hovered.current = true
              document.body.style.cursor = 'grab'
            }}
            onPointerOut={() => {
              hovered.current = false
              document.body.style.cursor = ''
            }}
          >
            <icosahedronGeometry args={[1.35, 0]} />
            <GlassMaterial quality={quality} />
            <Edges threshold={15} color="#7fe3ff" transparent opacity={0.35} />
          </mesh>

          <Satellite
            radius={2.05}
            speed={0.45}
            color="#22d3ee"
            size={0.055}
            tilt={[Math.PI / 2.3, 0.2, 0]}
            reducedMotion={reducedMotion}
          />
          <Satellite
            radius={2.5}
            speed={-0.28}
            color="#8b5cf6"
            size={0.04}
            tilt={[Math.PI / 1.8, -0.5, 0.3]}
            reducedMotion={reducedMotion}
          />
        </group>
      </Float>
    </group>
  )
}

function Starfield({ count, reducedMotion }: { count: number; reducedMotion: boolean }) {
  const points = useRef<THREE.Points>(null)

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const r = 3.5 + Math.random() * 4
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      arr[i * 3 + 2] = r * Math.cos(phi)
    }
    return arr
  }, [count])

  useFrame((_, delta) => {
    if (!points.current || reducedMotion) return
    points.current.rotation.y += delta * 0.015
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.022}
        color="#9fdcff"
        transparent
        opacity={0.55}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

function Lighting() {
  return (
    <>
      <ambientLight intensity={0.25} />
      <spotLight
        position={[5, 6, 5]}
        angle={0.45}
        penumbra={1}
        intensity={120}
        color="#cfe6ff"
        decay={2}
      />
      <pointLight position={[-5, -2, 2]} intensity={45} color="#8b5cf6" />
      <pointLight position={[0, -4, -3]} intensity={35} color="#22d3ee" />

      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={5} color="#ffffff" position={[0, 5, -2]} rotation-x={Math.PI / 2} scale={[10, 1.2, 1]} />
        <Lightformer form="rect" intensity={4} color="#3b82ff" position={[5, 1, 2]} scale={[3, 6, 1]} />
        <Lightformer form="rect" intensity={3} color="#22d3ee" position={[-5, 0, 1]} scale={[2.5, 5, 1]} />
        <Lightformer form="ring" intensity={2.5} color="#8b5cf6" position={[0, -3, 4]} scale={2.5} />
        <Lightformer form="rect" intensity={1.5} color="#ffffff" position={[-3, 3, 5]} scale={[1, 4, 1]} />
      </Environment>
    </>
  )
}

export default function HeroScene({ reducedMotion, compact, active, onContextLost }: HeroSceneProps) {
  const [quality, setQuality] = useState<Quality>(compact ? 'low' : 'high')
  const pointer = useWindowPointer(!reducedMotion)
  const baseZ = compact ? 7 : 6.4
  const maxDpr = quality === 'high' ? 1.75 : 1.25

  return (
    <Canvas
      dpr={[1, maxDpr]}
      camera={{ position: [0, reducedMotion ? 0 : 0.8, reducedMotion ? baseZ : baseZ + 4], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      frameloop={active && !reducedMotion ? 'always' : 'demand'}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = 1.1
        gl.domElement.addEventListener('webglcontextlost', (e) => {
          e.preventDefault()
          onContextLost()
        })
      }}
      aria-hidden="true"
    >
      <PerformanceMonitor
        flipflops={2}
        onDecline={() => setQuality('low')}
        onFallback={() => setQuality('low')}
      />
      <CameraRig pointer={pointer} reducedMotion={reducedMotion} baseZ={baseZ} />
      <Lighting />
      <Artifact pointer={pointer} reducedMotion={reducedMotion} quality={quality} compact={compact} />
      <Sparkles
        count={compact ? 30 : 70}
        scale={[7, 5, 5]}
        size={compact ? 2 : 2.6}
        speed={reducedMotion ? 0 : 0.25}
        opacity={0.7}
        color="#9fdcff"
      />
      <Starfield count={compact ? 250 : 600} reducedMotion={reducedMotion} />
    </Canvas>
  )
}
