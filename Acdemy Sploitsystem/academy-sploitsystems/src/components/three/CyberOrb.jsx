import { useFrame } from '@react-three/fiber'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

const NODE_COUNT = 42
const PARTICLE_COUNT = 200
const MAX_LINES = 96
const FLOW_POINTS = 18

function getRandomPointOnSphere(radius) {
  const u = Math.random() * 2 - 1
  const theta = Math.random() * Math.PI * 2
  const factor = Math.sqrt(1 - u * u)
  return new THREE.Vector3(
    radius * factor * Math.cos(theta),
    radius * u,
    radius * factor * Math.sin(theta),
  )
}

function getRandomPointInSphere(radius) {
  const vector = new THREE.Vector3(
    Math.random() * 2 - 1,
    Math.random() * 2 - 1,
    Math.random() * 2 - 1,
  ).normalize()

  const distance = Math.cbrt(Math.random()) * radius
  return vector.multiplyScalar(distance)
}

function CyberKnowledgeSphere() {
  const nodeMaterialRef = useRef(null)
  const flowRef = useRef(null)

  const { nodes, linePairs, linePositions, particlePositions, flowPaths, flowOffsets } = useMemo(() => {
    const generatedNodes = Array.from({ length: NODE_COUNT }, () => getRandomPointOnSphere(1.16))

    const pairs = []
    for (let i = 0; i < generatedNodes.length; i += 1) {
      for (let j = i + 1; j < generatedNodes.length; j += 1) {
        const distance = generatedNodes[i].distanceTo(generatedNodes[j])
        if (distance < 0.74) {
          pairs.push([i, j, distance])
        }
      }
    }

    pairs.sort((a, b) => a[2] - b[2])
    const limitedPairs = pairs.slice(0, MAX_LINES).map(([a, b]) => [a, b])

    const generatedLinePositions = new Float32Array(limitedPairs.length * 6)
    limitedPairs.forEach(([a, b], index) => {
      const nodeA = generatedNodes[a]
      const nodeB = generatedNodes[b]
      const base = index * 6

      generatedLinePositions[base] = nodeA.x
      generatedLinePositions[base + 1] = nodeA.y
      generatedLinePositions[base + 2] = nodeA.z
      generatedLinePositions[base + 3] = nodeB.x
      generatedLinePositions[base + 4] = nodeB.y
      generatedLinePositions[base + 5] = nodeB.z
    })

    const generatedParticlePositions = new Float32Array(PARTICLE_COUNT * 3)
    for (let idx = 0; idx < PARTICLE_COUNT; idx += 1) {
      const point = getRandomPointInSphere(0.95)
      const base = idx * 3
      generatedParticlePositions[base] = point.x
      generatedParticlePositions[base + 1] = point.y
      generatedParticlePositions[base + 2] = point.z
    }

    const availableFlowPaths = Array.from({ length: Math.min(FLOW_POINTS, limitedPairs.length) }, (_, index) => {
      const [a, b] = limitedPairs[index]
      return [generatedNodes[a], generatedNodes[b]]
    })

    const generatedFlowOffsets = Array.from({ length: availableFlowPaths.length }, () => Math.random())

    return {
      nodes: generatedNodes,
      linePairs: limitedPairs,
      linePositions: generatedLinePositions,
      particlePositions: generatedParticlePositions,
      flowPaths: availableFlowPaths,
      flowOffsets: generatedFlowOffsets,
    }
  }, [])

  useFrame((state) => {

    if (nodeMaterialRef.current) {
      const pulse = 0.55 + Math.sin(state.clock.elapsedTime * 1.8) * 0.25
      nodeMaterialRef.current.emissiveIntensity = pulse
    }

    if (flowRef.current && flowPaths.length > 0) {
      const positions = flowRef.current.geometry.attributes.position.array
      const elapsed = state.clock.elapsedTime

      flowPaths.forEach(([start, end], index) => {
        const t = (elapsed * 0.2 + flowOffsets[index]) % 1
        const point = new THREE.Vector3().lerpVectors(start, end, t)
        const base = index * 3
        positions[base] = point.x
        positions[base + 1] = point.y
        positions[base + 2] = point.z
      })

      flowRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  const flowPositions = useMemo(() => new Float32Array(flowPaths.length * 3), [flowPaths.length])

  return (
    <group>
      <mesh>
        <sphereGeometry args={[1.2, 28, 28]} />
        <meshStandardMaterial
          color="#0b1a30"
          transparent
          opacity={0.2}
          wireframe
          emissive="#ff7a3c"
          emissiveIntensity={0.08}
        />
      </mesh>

      <mesh>
        <sphereGeometry args={[0.95, 26, 26]} />
        <meshPhysicalMaterial
          color="#0a1730"
          transparent
          opacity={0.22}
          roughness={0.35}
          metalness={0.2}
          clearcoat={0.8}
          emissive="#ff5a1f"
          emissiveIntensity={0.06}
        />
      </mesh>

      {nodes.map((node, index) => (
        <mesh key={`node-${index}`} position={node.toArray()}>
          <sphereGeometry args={[0.028, 10, 10]} />
          <meshStandardMaterial ref={index === 0 ? nodeMaterialRef : null} color="#ff5a1f" emissive="#ff7a3c" emissiveIntensity={0.6} />
        </mesh>
      ))}

      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={linePairs.length * 2} array={linePositions} itemSize={3} />
        </bufferGeometry>
        <lineBasicMaterial color="#ff8a56" transparent opacity={0.42} />
      </lineSegments>

      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={PARTICLE_COUNT} array={particlePositions} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial color="#ffd9c7" size={0.012} transparent opacity={0.75} sizeAttenuation />
      </points>

      <points ref={flowRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={flowPaths.length} array={flowPositions} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial color="#ff5a1f" size={0.03} transparent opacity={0.95} sizeAttenuation />
      </points>
    </group>
  )
}

function CyberOrb() {
  return (
    <div className="relative mx-auto h-[280px] w-[280px] cursor-grab active:cursor-grabbing sm:h-[380px] sm:w-[380px] lg:h-[500px] lg:w-[500px]">
      <Canvas camera={{ position: [0, 0, 4.5], fov: 50 }} dpr={[1, 2]}>
        <ambientLight intensity={0.4} />
        <pointLight position={[2.8, 2.2, 3]} intensity={1.05} color="#ff7a3c" />
        <pointLight position={[-3.2, -2, -2.2]} intensity={0.35} color="#ffffff" />
        <CyberKnowledgeSphere />
        <OrbitControls
          makeDefault
          enableZoom={false}
          enablePan={false}
          rotateSpeed={0.6}
          autoRotate
          autoRotateSpeed={0.5}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.5}
        />
      </Canvas>
      <p className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full border border-[#1f2a44] bg-[#0f1629]/80 px-3 py-1 text-[11px] font-medium tracking-wide text-[#a8b0c3]">
        Drag to explore the network
      </p>
    </div>
  )
}

export default CyberOrb
