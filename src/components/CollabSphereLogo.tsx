import React from "react";

interface Props {
  size?: number;
  className?: string;
}

const CollabSphereLogo: React.FC<Props> = ({ size = 32, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Outer circle ring */}
    <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="2.5" opacity="0.25" />
    {/* Center node */}
    <circle cx="20" cy="20" r="4.5" fill="currentColor" />
    {/* Top node */}
    <circle cx="20" cy="7" r="3" fill="currentColor" />
    {/* Bottom-left node */}
    <circle cx="9.5" cy="28" r="3" fill="currentColor" />
    {/* Bottom-right node */}
    <circle cx="30.5" cy="28" r="3" fill="currentColor" />
    {/* Lines connecting center to outer nodes */}
    <line x1="20" y1="10" x2="20" y2="15.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line x1="11.5" y1="26.5" x2="17" y2="22.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line x1="28.5" y1="26.5" x2="23" y2="22.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export default CollabSphereLogo;
