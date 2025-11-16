'use client';

export default function InfoPanel({ selectedObject }) {
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
      }}
    >
      <h2>{selectedObject.name}</h2>
    </div>
  );
}
