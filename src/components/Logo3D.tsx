import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';
import { Text } from '@react-three/drei';

export const Logo3D = () => {
  const meshRef = useRef<Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  return (
    <group ref={meshRef}>
      <mesh>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial 
          color="#d4af37"
          metalness={0.9}
          roughness={0.1}
          emissive="#c9a227"
          emissiveIntensity={0.3}
        />
      </mesh>
      <Text
        position={[0, 0, 1.1]}
        fontSize={0.5}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Arial.ttf"
      >
        GL
      </Text>
    </group>
  );
};
