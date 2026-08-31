import React, { useState, useEffect, useRef } from 'react';
import JharkhandMap, { districtNames } from 'svgmap-jharkhand';

// Warm premium palette for district colorization
const DISTRICT_PALETTE: Record<string, string> = {
  RAN: '#718B78', // Ranchi – sage
  ESI: '#A99ABF', // East Singhbhum – muted lavender
  WSI: '#8F7AA8', // West Singhbhum – dusty purple
  DHA: '#C7A76C', // Dhanbad – muted gold
  BOK: '#E7C6A5', // Bokaro – soft peach
  HAZ: '#718B78', // Hazaribagh – sage
  GIR: '#A99ABF', // Giridih – muted lavender
  DEO: '#E9DCCB', // Deoghar – warm beige
  DUM: '#8F7AA8', // Dumka – dusty purple
  PAL: '#718B78', // Palamu – sage
  CHA: '#C7A76C', // Chatra – muted gold
  GAR: '#E7C6A5', // Garhwa – soft peach
  LAT: '#A99ABF', // Latehar – muted lavender
  LOH: '#8F7AA8', // Lohardaga – dusty purple
  GUM: '#718B78', // Gumla – sage
  SIM: '#E9DCCB', // Simdega – warm beige
  KHU: '#C7A76C', // Khunti – muted gold
  SKH: '#E7C6A5', // Saraikela-Kharsawan – soft peach
  JAM: '#A99ABF', // Jamtara – muted lavender
  RAM: '#718B78', // Ramgarh – sage
  GOD: '#8F7AA8', // Godda – dusty purple
  PAK: '#E9DCCB', // Pakur – warm beige
  SAH: '#C7A76C', // Sahibganj – muted gold
  KOD: '#E7C6A5', // Koderma – soft peach
};

const HOVER_COLOR = '#5a7260';

const JharkhandHeroMap: React.FC = () => {
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // After the map renders, apply per-district colors by targeting SVG paths by their id/class
  useEffect(() => {
    const applyColors = () => {
      if (!wrapperRef.current) return;
      const svg = wrapperRef.current.querySelector('svg');
      if (!svg) return;

      // The svgmap-jharkhand package sets each district path's id or class to the district code
      // We iterate all paths and colour them by matching data-name or id attributes
      const paths = svg.querySelectorAll('path, polygon');
      paths.forEach((el) => {
        const id = el.getAttribute('id') || el.getAttribute('data-id') || el.getAttribute('class') || '';
        // Try to match against known district codes
        const code = Object.keys(DISTRICT_PALETTE).find(
          (k) => id.toUpperCase().includes(k)
        );
        if (code) {
          (el as SVGElement).style.fill = DISTRICT_PALETTE[code];
          (el as SVGElement).style.stroke = '#FFFFFF';
          (el as SVGElement).style.strokeWidth = '1px';
          (el as SVGElement).style.cursor = 'pointer';
          (el as SVGElement).style.transition = 'fill 0.2s ease';
        }
      });
    };

    // Delay slightly to ensure the map is rendered
    const timer = setTimeout(applyColors, 100);
    return () => clearTimeout(timer);
  }, []);

  const tooltip = selectedDistrict
    ? districtNames[selectedDistrict as keyof typeof districtNames]
    : hoveredDistrict
    ? districtNames[hoveredDistrict as keyof typeof districtNames]
    : null;

  return (
    <div
      ref={wrapperRef}
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        minHeight: '380px',
      }}
    >
      {/* Map */}
      <div
        style={{
          filter: 'drop-shadow(0 12px 28px rgba(70, 55, 75, 0.14))',
          width: 'min(420px, 100%)',
        }}
      >
        <JharkhandMap
          onClick={(value: string) => {
            setSelectedDistrict(value === selectedDistrict ? null : value);
          }}
          size="min(420px, 100%)"
          mapColor="#A99ABF"
          strokeColor="#FFFFFF"
          strokeWidth="1"
          hoverColor={HOVER_COLOR}
        />
      </div>

      {/* District tooltip */}
      {tooltip && (
        <div
          style={{
            position: 'absolute',
            bottom: '8px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(255,255,255,0.92)',
            backdropFilter: 'blur(6px)',
            border: '1px solid #edeae6',
            borderRadius: '8px',
            padding: '4px 14px',
            fontSize: '11px',
            fontWeight: 700,
            color: '#3c3840',
            boxShadow: '0 2px 8px rgba(70,55,75,0.10)',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            zIndex: 30,
          }}
        >
          {tooltip}
        </div>
      )}

      {/* Subtle glow nodes on key districts */}
      {[
        { top: '28%', left: '54%', color: '#718B78', label: 'Ranchi' },
        { top: '72%', left: '70%', color: '#8F7AA8', label: 'East Singhbhum' },
        { top: '40%', left: '78%', color: '#C7A76C', label: 'Dhanbad' },
        { top: '18%', left: '62%', color: '#A99ABF', label: 'Hazaribagh' },
        { top: '55%', left: '38%', color: '#E7C6A5', label: 'Gumla' },
      ].map((node, i) => (
        <span
          key={i}
          title={node.label}
          style={{
            position: 'absolute',
            top: node.top,
            left: node.left,
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: node.color,
            border: '2px solid #fff',
            boxShadow: `0 0 0 3px ${node.color}44`,
            zIndex: 25,
            pointerEvents: 'none',
            animation: 'pulse-subtle 2.4s ease-in-out infinite',
            animationDelay: `${i * 0.4}s`,
          }}
        />
      ))}

      <style>{`
        @keyframes pulse-subtle {
          0%, 100% { transform: scale(1); opacity: 0.9; }
          50% { transform: scale(1.35); opacity: 0.6; }
        }
      `}</style>
    </div>
  );
};

export default JharkhandHeroMap;
