import React from "react";

export default function TestAnalytics({ entries }) {
  return (
    <div style={{
      color: 'white',
      padding: '50px',
      background: 'rgba(20,20,20,0.8)',
      borderRadius: '20px',
      margin: '50px auto',
      maxWidth: '800px'
    }}>
      <h2 style={{fontSize: '3rem', marginBottom: '20px'}}>Test Analytics Working!</h2>
      <p style={{fontSize: '1.5rem'}}>Found {entries?.length || 0} entries</p>
      <p style={{fontSize: '1rem', marginTop: '20px', opacity: 0.6}}>
        If you see this, the component loading works. 
        The issue is with Recharts rendering.
      </p>
    </div>
  );
}