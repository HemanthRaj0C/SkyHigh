'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { CameraControls } from '@react-three/drei';
import React, { useRef, useMemo, useState } from 'react';
import * as THREE from 'three';
import InfoPanel from './InfoPanel';

const Sun = ({ cameraControlsRef, setSelectedObject }) => {
    const meshRef = useRef<THREE.Mesh>(null!);
    const handleClick = () => {
        if (!meshRef.current || !cameraControlsRef.current) return;
        const position = new THREE.Vector3();
        meshRef.current.getWorldPosition(position);
        cameraControlsRef.current.setLookAt(
            position.x + 10,
            position.y + 5,
            position.z + 10,
            position.x,
            position.y,
            position.z,
            true
        );
        setSelectedObject({ name: 'Sun' });
    };
    return (
        <mesh ref={meshRef} onClick={handleClick}>
            <sphereGeometry args={[2.5, 32, 32]} />
            <meshStandardMaterial emissive="yellow" emissiveIntensity={2} color="yellow" />
        </mesh>
    );
};

const Moon = ({ name, size, color, orbitalRadius, orbitalSpeed, cameraControlsRef, setSelectedObject }) => {
    const ref = useRef<THREE.Mesh>(null!);
    useFrame(({ clock }) => {
      const t = clock.getElapsedTime() * orbitalSpeed;
      const x = orbitalRadius * Math.sin(t);
      const z = orbitalRadius * Math.cos(t);
      if (ref.current) {
          ref.current.position.x = x;
          ref.current.position.z = z;
      }
    });

    const handleClick = (event) => {
        event.stopPropagation();
        if (!ref.current || !cameraControlsRef.current) return;
        const position = new THREE.Vector3();
        ref.current.getWorldPosition(position);
        const distance = size * 10;
        cameraControlsRef.current.setLookAt(
            position.x + distance,
            position.y + distance / 2,
            position.z + distance,
            position.x,
            position.y,
            position.z,
            true
        );
        setSelectedObject({ name });
    }

    return (
        <mesh ref={ref} onClick={handleClick}>
            <sphereGeometry args={[size, 32, 32]} />
            <meshStandardMaterial color={color} />
        </mesh>
    );
};

const Planet = ({ name, children, color, size, orbitalRadius, orbitalSpeed, rings, cameraControlsRef, setSelectedObject }) => {
  const groupRef = useRef<THREE.Group>(null!);
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * orbitalSpeed;
    const x = orbitalRadius * Math.sin(t);
    const z = orbitalRadius * Math.cos(t);
    if (groupRef.current) {
        groupRef.current.position.x = x;
        groupRef.current.position.z = z;
    }
    if (meshRef.current) {
        meshRef.current.rotation.y += 0.01;
    }
  });

  const handleClick = (event) => {
    event.stopPropagation();
    if (!groupRef.current || !cameraControlsRef.current) return;
    const position = new THREE.Vector3();
    groupRef.current.getWorldPosition(position);
    const distance = size * 4;
    cameraControlsRef.current.setLookAt(
        position.x + distance,
        position.y + distance / 2,
        position.z + distance,
        position.x,
        position.y,
        position.z,
        true
    );
    setSelectedObject({ name });
  }

  return (
    <group ref={groupRef}>
      <mesh ref={meshRef} onClick={handleClick}>
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {rings && rings.map((ring, index) => (
        <mesh key={index} rotation-x={Math.PI / 2}>
            <torusGeometry args={[ring.radius, ring.tube, 2, 100]} />
            <meshStandardMaterial color={ring.color} side={THREE.DoubleSide} />
        </mesh>
      ))}
      {React.Children.map(children, child =>
        React.cloneElement(child, { setSelectedObject, cameraControlsRef })
      )}
    </group>
  );
};

const AsteroidBelt = () => {
    const asteroids = useMemo(() => {
        const temp = [];
        for (let i = 0; i < 1000; i++) {
            const size = Math.random() * 0.1 + 0.05;
            const angle = Math.random() * Math.PI * 2;
            const radius = 21.5 + (Math.random() - 0.5) * 5;
            const x = Math.sin(angle) * radius;
            const z = Math.cos(angle) * radius;
            const y = (Math.random() - 0.5) * 0.5;
            temp.push({ position: [x, y, z], size });
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

export default function SolarSystem() {
  const cameraControlsRef = useRef<CameraControls>(null!);
  const [selectedObject, setSelectedObject] = useState(null);
  const saturnRings = [
    { radius: 3, tube: 0.2, color: '#A52A2A' },
    { radius: 3.5, tube: 0.2, color: '#D2B48C' },
    { radius: 4, tube: 0.2, color: '#A52A2A' },
  ];

  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: 'black' }}>
      <InfoPanel selectedObject={selectedObject} />
      <Canvas camera={{ position: [0, 60, 100], fov: 45 }}>
        <ambientLight intensity={0.1} />
        <pointLight position={[0, 0, 0]} intensity={300} decay={2} />
        <Sun cameraControlsRef={cameraControlsRef} setSelectedObject={setSelectedObject} />
        <Planet name="Mercury" cameraControlsRef={cameraControlsRef} setSelectedObject={setSelectedObject} color="gray" size={0.38} orbitalRadius={5} orbitalSpeed={0.4} />
        <Planet name="Venus" cameraControlsRef={cameraControlsRef} setSelectedObject={setSelectedObject} color="#FFD700" size={0.95} orbitalRadius={8} orbitalSpeed={0.3} />
        <Planet name="Earth" cameraControlsRef={cameraControlsRef} setSelectedObject={setSelectedObject} color="blue" size={1} orbitalRadius={12} orbitalSpeed={0.2}>
            <Moon name="Moon" size={0.27} color="gray" orbitalRadius={1.5} orbitalSpeed={2} />
        </Planet>
        <Planet name="Mars" cameraControlsRef={cameraControlsRef} setSelectedObject={setSelectedObject} color="red" size={0.53} orbitalRadius={18} orbitalSpeed={0.15}>
            <Moon name="Phobos" size={0.1} color="gray" orbitalRadius={1} orbitalSpeed={2.5} />
            <Moon name="Deimos" size={0.08} color="gray" orbitalRadius={1.2} orbitalSpeed={3} />
        </Planet>
        <AsteroidBelt />
        <Planet name="Jupiter" cameraControlsRef={cameraControlsRef} setSelectedObject={setSelectedObject} color="orange" size={2.5} orbitalRadius={25} orbitalSpeed={0.08}>
            <Moon name="Io" size={0.4} color="gray" orbitalRadius={3} orbitalSpeed={1.5} />
            <Moon name="Europa" size={0.3} color="gray" orbitalRadius={3.5} orbitalSpeed={1.8} />
            <Moon name="Ganymede" size={0.35} color="gray" orbitalRadius={4} orbitalSpeed={1.2} />
            <Moon name="Callisto" size={0.2} color="gray" orbitalRadius={4.5} orbitalSpeed={2} />
        </Planet>
        <Planet name="Saturn" cameraControlsRef={cameraControlsRef} setSelectedObject={setSelectedObject} color="gold" size={2.1} orbitalRadius={35} orbitalSpeed={0.05} rings={saturnRings} />
        <Planet name="Uranus" cameraControlsRef={cameraControlsRef} setSelectedObject={setSelectedObject} color="lightblue" size={1.5} orbitalRadius={45} orbitalSpeed={0.03} />
        <Planet name="Neptune" cameraControlsRef={cameraControlsRef} setSelectedObject={setSelectedObject} color="darkblue" size={1.4} orbitalRadius={55} orbitalSpeed={0.02} />
        <CameraControls ref={cameraControlsRef} />
      </Canvas>
    </div>
  );
}
