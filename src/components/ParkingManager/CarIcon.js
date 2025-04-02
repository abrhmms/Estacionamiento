import React from 'react';

const CarIcon = ({ color = 'var(--color-accent)', size = 50 }) => (
  <svg width={size} height={size/2} viewBox="0 0 24 18" style={{ fill: color }}>
    <path d="M18.9 6.5c-.2-.6-.8-1-1.4-1h-11c-.7 0-1.2.4-1.4 1l-2 6v5c0 .6.4 1 1 1h1c.6 0 1-.4 1-1v-1h12v1c0 .6.4 1 1 1h1c.6 0 1-.4 1-1v-5l-2-6zm-12.4 1h11l1.3 4h-13.6l1.3-4zm-1.5 6c.8 0 1.5-.7 1.5-1.5s-.7-1.5-1.5-1.5-1.5.7-1.5 1.5.7 1.5 1.5 1.5zm13 0c.8 0 1.5-.7 1.5-1.5s-.7-1.5-1.5-1.5-1.5.7-1.5 1.5.7 1.5 1.5 1.5z" />
  </svg>
);

export default CarIcon;