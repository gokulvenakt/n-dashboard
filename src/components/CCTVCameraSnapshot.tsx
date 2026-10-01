import React from 'react';
import { Finding } from '../types/findings';

interface CCTVCameraSnapshotProps {
  finding: Finding;
  className?: string;
}

export const CCTVCameraSnapshot: React.FC<CCTVCameraSnapshotProps> = ({
  finding,
  className = '',
}) => {
  const theme = finding.media.sceneTheme;
  const isCritical = finding.severity === 'CRITICAL' || finding.statusCategory === 'CRITICAL';
  const boxColor = isCritical ? '#EF4444' : '#00E9C9';
  const boxBg = isCritical ? 'rgba(239, 68, 68, 0.15)' : 'rgba(0, 233, 201, 0.15)';

  return (
    <div className={`relative w-full aspect-video overflow-hidden bg-[#1E293B] select-none ${className}`}>
      {/* 
        AUTHENTIC REALISTIC CCTV CAMERA VIEW (STATIC IMAGE - NO CPU ANIMATION IN CARD)
        Scene tailored directly to finding's detection theme and caption
      */}
      <svg
        viewBox="0 0 480 270"
        className="w-full h-full object-cover"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Subtle security camera scanline texture */}
          <pattern id={`scanlines-${finding.id}`} width="100" height="4" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="100" y2="0" stroke="rgba(0,0,0,0.08)" strokeWidth="1" />
          </pattern>
          {/* Subtle noise / vignette */}
          <radialGradient id={`vignette-${finding.id}`} cx="50%" cy="50%" r="65%">
            <stop offset="60%" stopColor="transparent" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.4)" />
          </radialGradient>
        </defs>

        {/* -------------------------------------------------------------
            THEME 1: TOO MANY PEOPLE (Assembly Floor with Crowd Limit)
           ------------------------------------------------------------- */}
        {theme === 'too_many_people' && (
          <g>
            {/* Polished production floor background */}
            <rect width="480" height="270" fill="#E2E8F0" />
            {/* Floor perspective tiles */}
            <polygon points="0,90 480,90 480,270 0,270" fill="#CBD5E1" />
            <line x1="0" y1="90" x2="480" y2="90" stroke="#94A3B8" strokeWidth="2" />
            {/* Perspective grid lines on floor */}
            <line x1="60" y1="90" x2="0" y2="270" stroke="#94A3B8" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="160" y1="90" x2="100" y2="270" stroke="#94A3B8" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="260" y1="90" x2="240" y2="270" stroke="#94A3B8" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="360" y1="90" x2="380" y2="270" stroke="#94A3B8" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="440" y1="90" x2="480" y2="270" stroke="#94A3B8" strokeWidth="1" strokeDasharray="3 3" />

            {/* Industrial assembly line tables & machinery in background */}
            <rect x="30" y="50" width="100" height="40" fill="#94A3B8" rx="2" />
            <rect x="40" y="40" width="80" height="10" fill="#64748B" rx="1" />
            <rect x="350" y="50" width="100" height="40" fill="#94A3B8" rx="2" />
            <rect x="360" y="40" width="80" height="10" fill="#64748B" rx="1" />

            {/* Demarcated yellow safety zone on floor with capacity limit */}
            <rect
              x="70"
              y="110"
              width="340"
              height="130"
              fill="rgba(245, 158, 11, 0.12)"
              stroke="#D97706"
              strokeWidth="2"
              strokeDasharray="6 4"
              rx="4"
            />
            <rect x="80" y="118" width="125" height="16" fill="rgba(217, 119, 6, 0.9)" rx="2" />
            <text x="85" y="130" fill="#FFFFFF" fontSize="9" fontFamily="monospace" fontWeight="bold">
              ZONE C · CAPACITY: 8
            </text>

            {/* 14 Persons rendered in realistic positions inside Zone C */}
            {[
              { x: 120, y: 140, c: '#334155' },
              { x: 145, y: 155, c: '#1E293B' },
              { x: 175, y: 135, c: '#475569' },
              { x: 200, y: 160, c: '#0F172A' },
              { x: 230, y: 145, c: '#334155' },
              { x: 260, y: 165, c: '#1E293B' },
              { x: 290, y: 140, c: '#475569' },
              { x: 315, y: 158, c: '#334155' },
              { x: 345, y: 145, c: '#1E293B' },
              { x: 160, y: 185, c: '#0F172A' },
              { x: 195, y: 195, c: '#334155' },
              { x: 240, y: 190, c: '#475569' },
              { x: 280, y: 200, c: '#1E293B' },
              { x: 325, y: 185, c: '#0F172A' },
            ].map((p, i) => (
              <g key={i}>
                {/* Person floor shadow */}
                <ellipse cx={p.x} cy={p.y + 26} rx="8" ry="2.5" fill="rgba(0,0,0,0.3)" />
                {/* Head */}
                <circle cx={p.x} cy={p.y} r="5" fill="#E2B797" stroke="#334155" strokeWidth="0.5" />
                {/* Torso */}
                <path d={`M ${p.x - 6} ${p.y + 6} L ${p.x + 6} ${p.y + 6} L ${p.x + 5} ${p.y + 19} L ${p.x - 5} ${p.y + 19} Z`} fill={p.c} />
                {/* Legs */}
                <line x1={p.x - 2.5} y1={p.y + 19} x2={p.x - 2.5} y2={p.y + 26} stroke="#1E293B" strokeWidth="2.5" />
                <line x1={p.x + 2.5} y1={p.y + 19} x2={p.x + 2.5} y2={p.y + 26} stroke="#1E293B" strokeWidth="2.5" />
              </g>
            ))}

            {/* AI Bounding Box around crowd violation */}
            <rect x="95" y="125" width="270" height="95" fill={boxBg} stroke={boxColor} strokeWidth="1.5" strokeDasharray="4 2" rx="3" />
            <polygon points="95,125 105,125 95,135" fill={boxColor} />
            <polygon points="365,125 355,125 365,135" fill={boxColor} />
            <polygon points="95,220 105,220 95,210" fill={boxColor} />
            <polygon points="365,220 355,220 365,210" fill={boxColor} />
          </g>
        )}

        {/* -------------------------------------------------------------
            THEME 2: MOBILE THEFT (Office Lounge / Cafe Counter)
           ------------------------------------------------------------- */}
        {theme === 'mobile_theft' && (
          <g>
            {/* Lounge wall and warm ambient lighting */}
            <rect width="480" height="270" fill="#E5DACD" />
            {/* Parquet wood floor */}
            <polygon points="0,110 480,110 480,270 0,270" fill="#D4C5B3" />
            <line x1="0" y1="110" x2="480" y2="110" stroke="#B8A793" strokeWidth="2" />

            {/* Wooden coffee lounge table */}
            <rect x="160" y="160" width="180" height="55" fill="#8C5C36" rx="4" />
            <rect x="160" y="155" width="180" height="10" fill="#A47148" rx="2" />
            {/* Coffee cup on table */}
            <circle cx="210" cy="172" r="7" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" />
            <circle cx="210" cy="172" r="5" fill="#582F0E" />

            {/* Smartphone on table with red target */}
            <rect x="250" y="168" width="14" height="22" fill="#0F172A" rx="2" stroke="#94A3B8" strokeWidth="0.5" />
            <rect x="252" y="170" width="10" height="18" fill="#38BDF8" rx="1" opacity="0.8" />

            {/* Suspect standing beside table reaching hand toward phone */}
            <ellipse cx="285" cy="225" rx="12" ry="4" fill="rgba(0,0,0,0.3)" />
            <circle cx="285" cy="115" r="8" fill="#D4A373" />
            {/* Hooded jacket */}
            <path d="M 270 128 C 270 120 300 120 300 128 L 298 175 L 272 175 Z" fill="#1E293B" />
            {/* Arm reaching over table toward phone */}
            <path d="M 275 140 L 260 165 L 255 172" stroke="#1E293B" strokeWidth="4" strokeLinecap="round" />
            <circle cx="255" cy="172" r="2.5" fill="#D4A373" />
            {/* Legs */}
            <line x1="279" y1="175" x2="278" y2="225" stroke="#0F172A" strokeWidth="4.5" />
            <line x1="291" y1="175" x2="292" y2="225" stroke="#0F172A" strokeWidth="4.5" />

            {/* Bounding Box on Suspect & Phone */}
            <rect x="240" y="105" width="70" height="125" fill={boxBg} stroke={boxColor} strokeWidth="1.5" rx="2" />
          </g>
        )}

        {/* -------------------------------------------------------------
            THEME 3: PERSON FALLEN (Facility Corridor Slip & Fall)
           ------------------------------------------------------------- */}
        {theme === 'person_fallen' && (
          <g>
            {/* Long hallway perspective */}
            <rect width="480" height="270" fill="#CBD5E1" />
            {/* Hallway walls */}
            <polygon points="0,0 120,70 120,200 0,270" fill="#94A3B8" />
            <polygon points="480,0 360,70 360,200 480,270" fill="#94A3B8" />
            {/* Floor */}
            <polygon points="120,200 360,200 480,270 0,270" fill="#E2E8F0" />
            {/* Ceiling */}
            <polygon points="0,0 120,70 360,70 480,0" fill="#64748B" />

            {/* Fluorescent overhead lighting panels */}
            <rect x="180" y="72" width="120" height="10" fill="#FFFFFF" opacity="0.9" />
            <line x1="240" y1="82" x2="240" y2="200" stroke="rgba(255,255,255,0.2)" strokeWidth="40" />

            {/* Person fallen horizontally on the floor */}
            <ellipse cx="230" cy="225" rx="35" ry="8" fill="rgba(0,0,0,0.3)" />
            {/* Fallen body */}
            <circle cx="190" cy="218" r="7" fill="#E2B797" />
            <path d="M 197 218 L 245 224 L 243 232 L 195 226 Z" fill="#1E293B" />
            <line x1="245" y1="225" x2="270" y2="228" stroke="#334155" strokeWidth="4" />
            <line x1="245" y1="229" x2="265" y2="236" stroke="#334155" strokeWidth="4" />

            {/* Dropped clipboard/tablet */}
            <rect x="175" y="228" width="12" height="16" fill="#F8FAFC" stroke="#64748B" strokeWidth="0.8" transform="rotate(-20 175 228)" />

            {/* CRITICAL Alert Bounding Box */}
            <rect x="170" y="200" width="115" height="42" fill="rgba(239,68,68,0.2)" stroke="#EF4444" strokeWidth="2" rx="3" />
            <text x="175" y="196" fill="#EF4444" fontSize="9" fontFamily="monospace" fontWeight="bold">
              FALL DETECTED [NO MOVEMENT 45s]
            </text>
          </g>
        )}

        {/* -------------------------------------------------------------
            THEME 4: UNAUTHORIZED ENTRY (Server Room Vault)
           ------------------------------------------------------------- */}
        {theme === 'unauthorized_entry' && (
          <g>
            {/* Server room dark high-tech ambiance */}
            <rect width="480" height="270" fill="#0A0F1D" />
            {/* Metallic raised floor tiles */}
            <polygon points="0,110 480,110 480,270 0,270" fill="#111827" />
            {/* Blue glowing floor perspective grid */}
            <line x1="120" y1="110" x2="0" y2="270" stroke="#1E3A8A" strokeWidth="1" />
            <line x1="240" y1="110" x2="240" y2="270" stroke="#1E3A8A" strokeWidth="1" />
            <line x1="360" y1="110" x2="480" y2="270" stroke="#1E3A8A" strokeWidth="1" />

            {/* Server racks left & right with pulsing LEDs */}
            <rect x="20" y="40" width="70" height="150" fill="#1E293B" stroke="#334155" strokeWidth="1.5" />
            <rect x="390" y="40" width="70" height="150" fill="#1E293B" stroke="#334155" strokeWidth="1.5" />
            {/* Server LED indicators */}
            {[60, 80, 100, 120, 140, 160].map((y) => (
              <g key={y}>
                <circle cx="35" cy={y} r="2" fill="#00E9C9" />
                <circle cx="45" cy={y} r="2" fill="#3B82F6" />
                <circle cx="55" cy={y} r="2" fill="#10B981" />
                <circle cx="405" cy={y} r="2" fill="#00E9C9" />
                <circle cx="415" cy={y} r="2" fill="#EF4444" />
                <circle cx="425" cy={y} r="2" fill="#3B82F6" />
              </g>
            ))}

            {/* Restricted area red zone threshold line */}
            <line x1="80" y1="180" x2="400" y2="180" stroke="#EF4444" strokeWidth="2" strokeDasharray="8 4" />
            <text x="175" y="175" fill="#EF4444" fontSize="8" fontFamily="monospace" fontWeight="bold">
              RESTRICTED VAULT · NO BADGE DETECTED
            </text>

            {/* Intruder standing between server racks */}
            <ellipse cx="240" cy="205" rx="14" ry="4" fill="rgba(0,0,0,0.5)" />
            <circle cx="240" cy="120" r="9" fill="#E2B797" />
            <path d="M 226 133 C 226 125 254 125 254 133 L 252 175 L 228 175 Z" fill="#1F2937" />
            <line x1="233" y1="175" x2="232" y2="205" stroke="#111827" strokeWidth="5" />
            <line x1="247" y1="175" x2="248" y2="205" stroke="#111827" strokeWidth="5" />

            {/* Bounding box on intruder */}
            <rect x="215" y="108" width="52" height="102" fill="rgba(239,68,68,0.2)" stroke="#EF4444" strokeWidth="1.5" rx="2" />
          </g>
        )}

        {/* -------------------------------------------------------------
            THEME 5: FIRE ACCIDENT (Battery Storage Room)
           ------------------------------------------------------------- */}
        {theme === 'fire_accident' && (
          <g>
            {/* High temperature industrial storage room */}
            <rect width="480" height="270" fill="#18181B" />
            <polygon points="0,100 480,100 480,270 0,270" fill="#27272A" />

            {/* Battery cabinet units */}
            <rect x="120" y="60" width="240" height="120" fill="#3F3F46" stroke="#52525B" strokeWidth="2" rx="3" />
            <rect x="140" y="80" width="80" height="85" fill="#18181B" stroke="#71717A" strokeWidth="1" />
            <rect x="260" y="80" width="80" height="85" fill="#18181B" stroke="#71717A" strokeWidth="1" />

            {/* Fire flame & smoke flare at battery pack */}
            <radialGradient id="fire-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.9" />
              <stop offset="40%" stopColor="#F97316" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#DC2626" stopOpacity="0" />
            </radialGradient>
            <circle cx="200" cy="120" r="35" fill="url(#fire-glow)" />
            {/* Flames */}
            <path d="M 190 135 Q 185 105 195 95 Q 200 115 205 100 Q 215 110 210 135 Z" fill="#EF4444" />
            <path d="M 194 135 Q 190 115 198 105 Q 202 118 206 135 Z" fill="#FBBF24" />

            {/* Smoke billowing */}
            <circle cx="195" cy="70" r="22" fill="#71717A" opacity="0.4" />
            <circle cx="215" cy="55" r="28" fill="#71717A" opacity="0.3" />

            {/* CRITICAL Flashing Fire Bounding Box */}
            <rect x="165" y="80" width="70" height="75" fill="rgba(239,68,68,0.25)" stroke="#EF4444" strokeWidth="2" rx="4" />
            <text x="140" y="74" fill="#EF4444" fontSize="10" fontFamily="monospace" fontWeight="bold">
              THERMAL SIGNATURE EXCEEDED · 284°C
            </text>
          </g>
        )}

        {/* -------------------------------------------------------------
            THEME 6: PERSON FIGHTING (Loading Dock Entrance)
           ------------------------------------------------------------- */}
        {theme === 'person_fighting' && (
          <g>
            {/* Outdoor loading dock concrete bay */}
            <rect width="480" height="270" fill="#94A3B8" />
            <polygon points="0,80 480,80 480,270 0,270" fill="#64748B" />
            {/* Yellow forklift parked in distance */}
            <rect x="50" y="45" width="60" height="40" fill="#EAB308" rx="2" />
            <rect x="100" y="35" width="20" height="50" fill="#1E293B" />
            <circle cx="65" cy="85" r="8" fill="#0F172A" />
            <circle cx="95" cy="85" r="8" fill="#0F172A" />

            {/* High impact interaction: Two individuals in physical scuffle */}
            <ellipse cx="235" cy="205" rx="28" ry="6" fill="rgba(0,0,0,0.35)" />
            {/* Fighter 1 (Navy) */}
            <circle cx="215" cy="130" r="7" fill="#E2B797" />
            <path d="M 205 140 L 225 142 L 230 180 L 210 180 Z" fill="#1E3A8A" />
            <line x1="210" y1="180" x2="205" y2="205" stroke="#0F172A" strokeWidth="4.5" />
            <line x1="225" y1="180" x2="220" y2="205" stroke="#0F172A" strokeWidth="4.5" />

            {/* Fighter 2 (Charcoal) grappling */}
            <circle cx="245" cy="132" r="7" fill="#D4A373" />
            <path d="M 235 142 L 255 140 L 250 180 L 230 180 Z" fill="#334155" />
            <line x1="235" y1="180" x2="240" y2="205" stroke="#0F172A" strokeWidth="4.5" />
            <line x1="250" y1="180" x2="255" y2="205" stroke="#0F172A" strokeWidth="4.5" />

            {/* Grappling arms crossed */}
            <line x1="220" y1="148" x2="240" y2="148" stroke="#E2B797" strokeWidth="3" />

            {/* Alert Bounding Box */}
            <rect x="195" y="118" width="70" height="92" fill="rgba(239,68,68,0.2)" stroke="#EF4444" strokeWidth="1.5" rx="3" />
          </g>
        )}

        {/* -------------------------------------------------------------
            THEME 7: BIN MOVEMENT (Hazardous Staging Area)
           ------------------------------------------------------------- */}
        {theme === 'bin_movement' && (
          <g>
            {/* Industrial chemical staging tarmac */}
            <rect width="480" height="270" fill="#94A3B8" />
            <polygon points="0,90 480,90 480,270 0,270" fill="#475569" />

            {/* Designated blue safety boundary box on ground */}
            <rect x="100" y="130" width="130" height="90" fill="rgba(59,130,246,0.15)" stroke="#3B82F6" strokeWidth="2" strokeDasharray="4 4" rx="2" />
            <text x="110" y="145" fill="#93C5FD" fontSize="8" fontFamily="monospace" fontWeight="bold">
              AUTHORIZED ZONE · HAZ-04
            </text>

            {/* Yellow chemical waste container displaced outside zone */}
            <ellipse cx="300" cy="205" rx="22" ry="7" fill="rgba(0,0,0,0.3)" />
            <rect x="275" y="135" width="50" height="65" fill="#EAB308" stroke="#CA8A04" strokeWidth="1.5" rx="3" />
            <rect x="275" y="135" width="50" height="10" fill="#FACC15" />
            {/* Hazmat biohazard symbol */}
            <circle cx="300" cy="168" r="8" fill="#18181B" />
            <text x="296" y="172" fill="#EAB308" fontSize="8" fontWeight="bold">☣</text>

            {/* Displaced vector arrow */}
            <line x1="230" y1="170" x2="270" y2="170" stroke="#F59E0B" strokeWidth="2.5" strokeDasharray="4 2" markerEnd="url(#arrow)" />

            {/* Bounding box on displaced container */}
            <rect x="268" y="128" width="64" height="82" fill="rgba(245,158,11,0.2)" stroke="#F59E0B" strokeWidth="1.5" rx="2" />
          </g>
        )}

        {/* -------------------------------------------------------------
            THEME 8: CHILD SAFETY (Entrance Lobby Ramp)
           ------------------------------------------------------------- */}
        {theme === 'child_safety' && (
          <g>
            {/* Modern glass headquarters lobby */}
            <rect width="480" height="270" fill="#F1F5F9" />
            <polygon points="0,100 480,100 480,270 0,270" fill="#E2E8F0" />
            {/* Architectural glass curtain wall */}
            <line x1="120" y1="0" x2="120" y2="100" stroke="#CBD5E1" strokeWidth="2" />
            <line x1="240" y1="0" x2="240" y2="100" stroke="#CBD5E1" strokeWidth="2" />
            <line x1="360" y1="0" x2="360" y2="100" stroke="#CBD5E1" strokeWidth="2" />

            {/* Concrete ramp edge & safety railing */}
            <line x1="80" y1="180" x2="400" y2="180" stroke="#94A3B8" strokeWidth="3" />
            <line x1="80" y1="160" x2="400" y2="160" stroke="#64748B" strokeWidth="2" />

            {/* Unaccompanied minor (small child in yellow jacket) near loading ramp edge */}
            <ellipse cx="230" cy="205" rx="8" ry="3" fill="rgba(0,0,0,0.3)" />
            <circle cx="230" cy="155" r="5" fill="#E2B797" />
            <path d="M 223 162 L 237 162 L 235 185 L 225 185 Z" fill="#F59E0B" />
            <line x1="227" y1="185" x2="227" y2="205" stroke="#1E293B" strokeWidth="2.5" />
            <line x1="233" y1="185" x2="233" y2="205" stroke="#1E293B" strokeWidth="2.5" />

            {/* Bounding box on child */}
            <rect x="218" y="145" width="25" height="65" fill={boxBg} stroke={boxColor} strokeWidth="1.5" rx="2" />
          </g>
        )}

        {/* Realistic CCTV OSD (On-Screen Display) Header Overlay */}
        <g>
          {/* Top dark gradient banner */}
          <rect x="0" y="0" width="480" height="26" fill="rgba(0,0,0,0.6)" />
          {/* Live indicator dot */}
          <circle cx="16" cy="13" r="3.5" fill="#EF4444" />
          <text x="24" y="16" fill="#FFFFFF" fontSize="9" fontFamily="monospace" fontWeight="bold">
            REC · {finding.camera.id}
          </text>

          {/* Timecode */}
          <text x="380" y="16" fill="#FFFFFF" fontSize="8.5" fontFamily="monospace">
            {finding.timestamp}
          </text>

          {/* Subtle Scanlines overlay */}
          <rect width="480" height="270" fill={`url(#scanlines-${finding.id})`} pointerEvents="none" opacity="0.6" />
          {/* Subtle Vignette */}
          <rect width="480" height="270" fill={`url(#vignette-${finding.id})`} pointerEvents="none" />
        </g>
      </svg>
    </div>
  );
};
