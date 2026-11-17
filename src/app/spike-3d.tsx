import { Canvas, useFrame } from '@react-three/fiber/native';
import { router, Stack } from 'expo-router';
import { useRef } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import type { Mesh } from 'three';

function RotatingBox() {
  const mesh = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (mesh.current === null) {
      return;
    }

    mesh.current.rotation.x += delta * 0.25;
    mesh.current.rotation.y += delta * 0.6;
  });

  return (
    <mesh ref={mesh}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#9fc5e8" />
    </mesh>
  );
}

export default function Spike3dScreen() {
  return (
    <>
      <Stack.Screen options={{ title: '3D Spike' }} />
      <View style={styles.container}>
        <Canvas camera={{ position: [0, 0, 3] }} style={styles.canvas}>
          <color args={['#0f172a']} attach="background" />
          <ambientLight intensity={0.5} />
          <directionalLight intensity={2} position={[3, 4, 5]} />
          <RotatingBox />
        </Canvas>
        <View style={styles.footer}>
          <Text style={styles.caption}>R3F native canvas + expo-gl</Text>
          <Button title="Back" onPress={() => router.back()} />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  canvas: {
    flex: 1,
  },
  caption: {
    color: '#6b7280',
    fontSize: 13,
  },
  container: {
    backgroundColor: '#0f172a',
    flex: 1,
  },
  footer: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    gap: 8,
    padding: 16,
  },
});
