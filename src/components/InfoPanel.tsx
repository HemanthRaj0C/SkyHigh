'use client';

export default function InfoPanel({ selectedObject, resetCamera }) {
  if (!selectedObject) {
    return null;
  }

  return (
    <div
      style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        padding: '10px',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        color: 'white',
        borderRadius: '5px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}
    >
      <h2>{selectedObject.name}</h2>
      <button onClick={resetCamera} style={{
        backgroundColor: '#444',
        color: 'white',
        border: 'none',
        padding: '8px',
        borderRadius: '3px',
        cursor: 'pointer'
      }}>Reset Camera</button>
    </div>
  );
}
