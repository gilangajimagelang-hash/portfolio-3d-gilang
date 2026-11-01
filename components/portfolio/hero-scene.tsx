'use client'

import * as THREE from 'three'
import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, extend, useFrame, useThree, type ThreeElement, type ThreeEvent } from '@react-three/fiber'
import { Environment, Lightformer, useTexture } from '@react-three/drei'
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
  type RapierRigidBody,
  type RigidBodyProps,
} from '@react-three/rapier'
import { MeshLineGeometry, MeshLineMaterial } from 'meshline'

extend({ MeshLineGeometry, MeshLineMaterial })

declare module '@react-three/fiber' {
  interface ThreeElements {
    meshLineGeometry: ThreeElement<typeof MeshLineGeometry>
    meshLineMaterial: ThreeElement<typeof MeshLineMaterial>
  }
}

const CARD_W = 1.6
const CARD_H = 2.56
const HOLDER_W = 1.74
const HOLDER_H = 2.8
const ANCHOR_Y = 1.58

type HeroSceneProps = {
  reducedMotion: boolean
  compact: boolean
  active: boolean
  onContextLost: () => void
}

export default function HeroScene({ reducedMotion, compact, active, onContextLost }: HeroSceneProps) {
  return (
    <Canvas
      className="!touch-none"
      camera={{ position: [0, 0, compact ? 14.5 : 13], fov: 25 }}
      dpr={compact ? [1, 1.5] : [1, 2]}
      frameloop={active ? 'always' : 'never'}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener('webglcontextlost', onContextLost, { once: true })
      }}
      aria-label="Interactive 3D name card for Gilang. Drag the card to swing it on its lanyard."
      role="img"
    >
      <ambientLight intensity={Math.PI * 0.6} />
      <directionalLight position={[3, 5, 6]} intensity={2.2} />
      <Suspense fallback={null}>
        <Physics gravity={[0, -40, 0]} timeStep={1 / 60} paused={!active}>
          <Lanyard reducedMotion={reducedMotion} compact={compact} />
        </Physics>
      </Suspense>
      <Environment resolution={compact ? 64 : 256} frames={1}>
        <color attach="background" args={['#050816']} />
        <Lightformer intensity={2} color="white" position={[0, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
        <Lightformer intensity={3} color="#9fdcff" position={[-1, -1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
        <Lightformer intensity={3} color="white" position={[1, 1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
        <Lightformer intensity={8} color="#3b82ff" position={[-10, 0, 14]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[100, 10, 1]} />
      </Environment>
    </Canvas>
  )
}

const segmentProps: RigidBodyProps = {
  type: 'dynamic',
  canSleep: true,
  colliders: false,
  angularDamping: 2,
  linearDamping: 2,
}

function useStrapTexture() {
  return useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 1024
    canvas.height = 128
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.fillStyle = '#eef3fb'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = '#16306b'
      ctx.fillRect(0, 0, canvas.width, 10)
      ctx.fillRect(0, canvas.height - 10, canvas.width, 10)
      ctx.font = '800 54px system-ui, sans-serif'
      ctx.textBaseline = 'middle'
      ctx.fillText('GILANG  //  HUMAS  //  STMIK BINA PATRIA  //', 24, canvas.height / 2 + 2)
    }
    const texture = new THREE.CanvasTexture(canvas)
    texture.colorSpace = THREE.SRGBColorSpace
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping
    texture.anisotropy = 8
    return texture
  }, [])
}

function useCardBackTexture() {
  return useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 640
    canvas.height = 1024
    const ctx = canvas.getContext('2d')
    if (ctx) {
      const gradient = ctx.createLinearGradient(0, 0, 640, 1024)
      gradient.addColorStop(0, '#0e4f86')
      gradient.addColorStop(1, '#0a1f45')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, 640, 1024)
      ctx.strokeStyle = 'rgba(255,255,255,0.08)'
      for (let x = 0; x <= 640; x += 40) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, 1024)
        ctx.stroke()
      }
      ctx.fillStyle = '#ffffff'
      ctx.textAlign = 'center'
      ctx.font = '600 34px system-ui, sans-serif'
      ctx.fillText('HIMTI', 320, 330)
      ctx.font = '800 52px system-ui, sans-serif'
      ctx.fillText('STMIK BINA PATRIA', 320, 400)
      ctx.font = 'italic 400 28px system-ui, sans-serif'
      ctx.fillStyle = 'rgba(255,255,255,0.7)'
      ctx.fillText('Kabinet Pranava vox academia', 320, 450)
      ctx.fillStyle = '#ffffff'
      ctx.font = '800 96px system-ui, sans-serif'
      ctx.fillText('GILANG', 320, 690)
      ctx.font = '600 34px system-ui, sans-serif'
      ctx.fillStyle = '#9fdcff'
      ctx.fillText('HUMAS', 320, 750)
    }
    const texture = new THREE.CanvasTexture(canvas)
    texture.colorSpace = THREE.SRGBColorSpace
    texture.anisotropy = 8
    return texture
  }, [])
}

function Lanyard({ reducedMotion, compact }: { reducedMotion: boolean; compact: boolean }) {
  const band = useRef<THREE.Mesh<MeshLineGeometry, MeshLineMaterial>>(null)
  const fixed = useRef<RapierRigidBody>(null!)
  const j1 = useRef<RapierRigidBody>(null!)
  const j2 = useRef<RapierRigidBody>(null!)
  const j3 = useRef<RapierRigidBody>(null!)
  const card = useRef<RapierRigidBody>(null!)

  const [vec] = useState(() => new THREE.Vector3())
  const [ang] = useState(() => new THREE.Vector3())
  const [rot] = useState(() => new THREE.Vector3())
  const [dir] = useState(() => new THREE.Vector3())
  const [lerped] = useState(() => [new THREE.Vector3(), new THREE.Vector3()])
  const lerpReady = useRef(false)

  const [curve] = useState(() => {
    const c = new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()])
    c.curveType = 'chordal'
    return c
  })

  const { width, height } = useThree((state) => state.size)
  const [dragged, setDragged] = useState<THREE.Vector3 | false>(false)
  const [hovered, setHovered] = useState(false)

  const front = useTexture('/images/name-card.jpg', (t) => {
    t.colorSpace = THREE.SRGBColorSpace
    t.anisotropy = 8
  })
  const back = useCardBackTexture()
  const strap = useStrapTexture()

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1])
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1])
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1])
  useSphericalJoint(j3, card, [[0, 0, 0], [0, ANCHOR_Y, 0]])

  useEffect(() => {
    if (!hovered) return
    document.body.style.cursor = dragged ? 'grabbing' : 'grab'
    return () => {
      document.body.style.cursor = 'auto'
    }
  }, [hovered, dragged])

  useFrame((state, delta) => {
    if (!fixed.current || !j1.current || !j2.current || !j3.current || !card.current || !band.current) return

    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera)
      dir.copy(vec).sub(state.camera.position).normalize()
      vec.add(dir.multiplyScalar(state.camera.position.length()))
      ;[card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp())
      card.current.setNextKinematicTranslation({
        x: vec.x - dragged.x,
        y: vec.y - dragged.y,
        z: vec.z - dragged.z,
      })
    }

    const joints = [j1.current, j2.current]
    if (!lerpReady.current) {
      joints.forEach((joint, i) => lerped[i].copy(joint.translation()))
      lerpReady.current = true
    }
    joints.forEach((joint, i) => {
      const target = joint.translation()
      const distance = Math.max(0.1, Math.min(1, lerped[i].distanceTo(target)))
      lerped[i].lerp(target, Math.min(1, delta * (10 + distance * 40)))
    })

    curve.points[0].copy(j3.current.translation())
    curve.points[1].copy(lerped[1])
    curve.points[2].copy(lerped[0])
    curve.points[3].copy(fixed.current.translation())
    band.current.geometry.setPoints(curve.getPoints(compact ? 24 : 32))

    ang.copy(card.current.angvel())
    const q = card.current.rotation()
    rot.set(q.x, q.y, q.z)
    card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z }, true)
  })

  const start = reducedMotion
    ? { j1: [0, -1, 0], j2: [0, -2, 0], j3: [0, -3, 0], card: [0, -3 - ANCHOR_Y, 0] }
    : { j1: [0.5, 0, 0], j2: [1, 0, 0], j3: [1.5, 0, 0], card: [2, 0, 0] }

  const onPointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    ;(e.target as unknown as Element).setPointerCapture(e.pointerId)
    if (card.current) setDragged(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation())))
  }

  const onPointerUp = (e: ThreeEvent<PointerEvent>) => {
    ;(e.target as unknown as Element).releasePointerCapture(e.pointerId)
    setDragged(false)
  }

  return (
    <>
      <group position={[0, 4.2, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={start.j1 as [number, number, number]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={start.j2 as [number, number, number]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={start.j3 as [number, number, number]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={start.card as [number, number, number]}
          ref={card}
          {...segmentProps}
          type={dragged ? 'kinematicPosition' : 'dynamic'}
        >
          <CuboidCollider args={[HOLDER_W / 2, HOLDER_H / 2, 0.02]} />
          <group
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
          >
            <Card front={front} back={back} />
          </group>
        </RigidBody>
      </group>

      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          args={[{ resolution: new THREE.Vector2(width, height) }]}
          color="white"
          depthTest={false}
          resolution={[width, height]}
          useMap={1}
          map={strap}
          repeat={[-4, 1]}
          lineWidth={compact ? 0.9 : 1}
        />
      </mesh>
    </>
  )
}

function Card({ front, back }: { front: THREE.Texture; back: THREE.Texture }) {
  return (
    <group>
      <mesh position={[0, 0, 0.006]}>
        <planeGeometry args={[CARD_W, CARD_H]} />
        <meshPhysicalMaterial map={front} roughness={0.45} clearcoat={0.6} clearcoatRoughness={0.25} />
      </mesh>
      <mesh position={[0, 0, -0.006]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[CARD_W, CARD_H]} />
        <meshPhysicalMaterial map={back} roughness={0.45} clearcoat={0.6} clearcoatRoughness={0.25} />
      </mesh>

      <mesh position={[0, 0.1, 0]} renderOrder={2}>
        <boxGeometry args={[HOLDER_W, HOLDER_H, 0.045]} />
        <meshPhysicalMaterial
          color="#dbe9ff"
          transparent
          opacity={0.16}
          roughness={0.04}
          metalness={0}
          clearcoat={1}
          clearcoatRoughness={0.03}
          envMapIntensity={2.5}
          depthWrite={false}
        />
      </mesh>
      <mesh position={[0, HOLDER_H / 2 - 0.02, 0]} renderOrder={3}>
        <boxGeometry args={[0.42, 0.07, 0.05]} />
        <meshStandardMaterial color="#050816" transparent opacity={0.55} />
      </mesh>

      <group position={[0, ANCHOR_Y - 0.06, 0]}>
        <mesh>
          <torusGeometry args={[0.09, 0.022, 12, 32]} />
          <meshStandardMaterial color="#d4d8e0" metalness={1} roughness={0.22} />
        </mesh>
        <mesh position={[0, -0.12, 0]}>
          <boxGeometry args={[0.1, 0.12, 0.04]} />
          <meshStandardMaterial color="#c3c8d2" metalness={1} roughness={0.28} />
        </mesh>
      </group>
    </group>
  )
}
