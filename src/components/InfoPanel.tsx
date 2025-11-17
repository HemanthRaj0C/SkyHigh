'use client';

import { celestialData } from '@/data/celestialData';

export default function InfoPanel({ selectedObject, resetCamera }) {
  if (!selectedObject) {
    return null;
  }

  const data = celestialData[selectedObject.name];

  return (
    <div
      style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        padding: '15px',
        width: '250px',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        color: 'white',
        borderRadius: '10px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        fontFamily: 'sans-serif'
      }}
    >
      <h2 style={{ margin: 0, fontSize: '20px', borderBottom: '1px solid #555', paddingBottom: '10px' }}>{data.name}</h2>
      <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.5' }}>{data.description}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <p style={{ margin: 0 }}><strong>Distance from Sun:</strong> {data.distanceFromSun}</p>
        <p style={{ margin: 0 }}><strong>Radius:</strong> {data.radius}</p>
      </div>
      <button onClick={resetCamera} style={{
        backgroundColor: '#555',
        color: 'white',
        border: 'none',
        padding: '10px',
        borderRadius: '5px',
        cursor: 'pointer',
        marginTop: '10px',
        transition: 'background-color 0.3s'
      }}
      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#777'}
      onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#555'}
      >Reset Camera</button>
    </div>
  );
}
