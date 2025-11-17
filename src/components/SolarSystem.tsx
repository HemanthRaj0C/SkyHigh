'use client';

import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { CameraControls } from '@react-three/drei';
import React, { useRef, useMemo, useState } from 'react';
import * as THREE from 'three';
import InfoPanel from './InfoPanel';

const CelestialBody = ({
  name,
  texturePath,
  size,
  color,
  emissive,
  emissiveIntensity,
  orbitalRadius = 0,
  orbitalSpeed = 0,
  setSelectedObject,
  children,
  rings,
  resetCamera
}) => {
    const groupRef = useRef<THREE.Group>(null!);
    const meshRef = useRef<THREE.Mesh>(null!);
    const texture = useLoader(THREE.TextureLoader, texturePath);

    useFrame(({ clock }) => {
        if (orbitalSpeed > 0) {
            const t = clock.getElapsedTime() * orbitalSpeed;
            const x = orbitalRadius * Math.sin(t);
            const z = orbitalRadius * Math.cos(t);
            if (groupRef.current) {
                groupRef.current.position.x = x;
                groupRef.current.position.z = z;
            }
        }
        if (meshRef.current) {
            meshRef.current.rotation.y += 0.005;
        }
    });

    const handleClick = (event) => {
        event.stopPropagation();
        if (name === 'Sun') {
            resetCamera();
        } else {
            if (!groupRef.current) return;
            setSelectedObject({ name, mesh: meshRef.current, size });
        }
    };

    return (
        <group ref={groupRef}>
            <mesh ref={meshRef} onClick={handleClick}>
                <sphereGeometry args={[size, 32, 32]} />
                <meshStandardMaterial
                    map={texture}
                    color={color}
                    emissive={emissive}
                    emissiveIntensity={emissiveIntensity}
                />
            </mesh>
            {rings && rings.map((ring, index) => {
                const ringTexture = useLoader(THREE.TextureLoader, ring.texturePath);
                return (
                    <mesh key={index} rotation-x={Math.PI / 2}>
                        <torusGeometry args={[ring.radius, ring.tube, 2, 100]} />
                        <meshStandardMaterial map={ringTexture} side={THREE.DoubleSide} transparent />
                    </mesh>
                );
            })}
            {React.Children.map(children, child =>
                React.cloneElement(child, { setSelectedObject, resetCamera })
            )}
        </group>
    );
};


const AsteroidBelt = () => {
    const asteroids = useMemo(() => {
        const temp = [];
        for (let i = 0; i < 1500; i++) {
            const size = Math.random() * 0.1 + 0.05;
            const angle = Math.random() * Math.PI * 2;
            const radius = 21.5 + (Math.random() - 0.5) * 5;
            const x = Math.sin(angle) * radius;
            const z = Math.cos(angle) * radius;
            const y = (Math.random() - 0.5) * 0.5;
            temp.push({ position: new THREE.Vector3(x, y, z), size });
        }
        return temp;
    }, []);

    return (
        <group>
            {asteroids.map((asteroid, index) => (
                <mesh key={index} position={asteroid.position}>
                    <sphereGeometry args={[asteroid.size, 8, 8]} />
                    <meshStandardMaterial color="#8B4513" />
                </mesh>
            ))}
        </group>
    );
};

const Scene = ({ cameraControlsRef, selectedObject, setSelectedObject, resetCamera }) => {
    const saturnRings = [
      { radius: 3, tube: 0.4, texturePath: '/textures/saturn_ring.png' },
    ];

    useFrame(() => {
      if (selectedObject && selectedObject.mesh && cameraControlsRef.current) {
          const position = new THREE.Vector3();
          selectedObject.mesh.getWorldPosition(position);

          const distance = selectedObject.size * (selectedObject.name === 'Sun' ? 4 : 5);

          cameraControlsRef.current.setLookAt(
              position.x + distance,
              position.y + distance / 2,
              position.z + distance,
              position.x,
              position.y,
              position.z,
              false
          );
      }
    });

    return (
      <>
        <ambientLight intensity={0.1} />
        <pointLight position={[0, 0, 0]} intensity={300} decay={2} />
        <CelestialBody name="Sun" texturePath="/textures/sun.jpg" size={2.5} emissive="yellow" emissiveIntensity={2} setSelectedObject={setSelectedObject} resetCamera={resetCamera} />
        <CelestialBody name="Mercury" texturePath="/textures/mercury.jpg" size={0.38} orbitalRadius={5} orbitalSpeed={0.4} setSelectedObject={setSelectedObject} resetCamera={resetCamera} />
        <CelestialBody name="Venus" texturePath="/textures/venus.jpg" size={0.95} orbitalRadius={8} orbitalSpeed={0.3} setSelectedObject={setSelectedObject} resetCamera={resetCamera} />
        <CelestialBody name="Earth" texturePath="/textures/earth.jpg" size={1} orbitalRadius={12} orbitalSpeed={0.2} setSelectedObject={setSelectedObject} resetCamera={resetCamera}>
            <CelestialBody name="Moon" texturePath="/textures/moon.jpg" size={0.27} orbitalRadius={1.5} orbitalSpeed={2} />
        </CelestialBody>
        <CelestialBody name="Mars" texturePath="/textures/mars.jpg" size={0.53} orbitalRadius={18} orbitalSpeed={0.15} setSelectedObject={setSelectedObject} resetCamera={resetCamera}>
            <CelestialBody name="Phobos" texturePath="/textures/moon.jpg" size={0.1} orbitalRadius={1} orbitalSpeed={2.5} />
            <CelestialBody name="Deimos" texturePath="/textures/moon.jpg" size={0.08} orbitalRadius={1.2} orbitalSpeed={3} />
        </CelestialBody>
        <AsteroidBelt />
        <CelestialBody name="Jupiter" texturePath="/textures/jupiter.jpg" size={2.5} orbitalRadius={25} orbitalSpeed={0.08} setSelectedObject={setSelectedObject} resetCamera={resetCamera}>
            <CelestialBody name="Io" texturePath="/textures/moon.jpg" size={0.4} orbitalRadius={3} orbitalSpeed={1.5} />
            <CelestialBody name="Europa" texturePath="/textures/moon.jpg" size={0.3} orbitalRadius={3.5} orbitalSpeed={1.8} />
            <CelestialBody name="Ganymede" texturePath="/textures/moon.jpg" size={0.35} orbitalRadius={4} orbitalSpeed={1.2} />
            <CelestialBody name="Callisto" texturePath="/textures/moon.jpg" size={0.2} orbitalRadius={4.5} orbitalSpeed={2} />
        </CelestialBody>
        <CelestialBody name="Saturn" texturePath="/textures/saturn.jpg" size={2.1} orbitalRadius={35} orbitalSpeed={0.05} rings={saturnRings} setSelectedObject={setSelectedObject} resetCamera={resetCamera} />
        <CelestialBody name="Uranus" texturePath="/textures/uranus.jpg" size={1.5} orbitalRadius={45} orbitalSpeed={0.03} setSelectedObject={setSelectedObject} resetCamera={resetCamera} />
        <CelestialBody name="Neptune" texturePath="/textures/neptune.jpg" size={1.4} orbitalRadius={55} orbitalSpeed={0.02} setSelectedObject={setSelectedObject} resetCamera={resetCamera} />
        <CameraControls ref={cameraControlsRef} />
      </>
    );
  };

export default function SolarSystem() {
  const cameraControlsRef = useRef<CameraControls>(null!);
  const [selectedObject, setSelectedObject] = useState(null);

  const resetCamera = () => {
    if (cameraControlsRef.current) {
        cameraControlsRef.current.setLookAt(0, 60, 100, 0, 0, 0, true);
        setSelectedObject(null);
    }
  };

  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: 'black' }}>
      <InfoPanel selectedObject={selectedObject} resetCamera={resetCamera} />
      <Canvas camera={{ position: [0, 60, 100], fov: 45 }}>
        <Scene
            cameraControlsRef={cameraControlsRef}
            selectedObject={selectedObject}
            setSelectedObject={setSelectedObject}
            resetCamera={resetCamera}
        />
      </Canvas>
    </div>
  );
}
