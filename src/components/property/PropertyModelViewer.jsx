import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment } from '@react-three/drei';
import { Suspense } from 'react';

function Model({ url }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} scale={1.5} />;
}

function PropertyModelViewer({ modelUrl, className = '' }) {
  if (!modelUrl) return null;

  return (
    <div className={`w-full h-full min-h-[384px] rounded-lg overflow-hidden bg-secondary-100 dark:bg-secondary-800 ${className}`}>
      <Canvas camera={{ position: [4, 2, 6], fov: 45 }} gl={{ antialias: true }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
        <directionalLight position={[-5, 5, -5]} intensity={0.3} />
        <Suspense
          fallback={
            <mesh>
              <boxGeometry args={[1, 1, 1]} />
              <meshBasicMaterial color="#e5e7eb" wireframe />
            </mesh>
          }
        >
          <Model url={modelUrl} />
          <Environment preset="sunset" />
        </Suspense>
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={2}
          maxDistance={15}
        />
      </Canvas>
    </div>
  );
}

export default PropertyModelViewer;
