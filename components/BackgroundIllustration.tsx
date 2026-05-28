export default function BackgroundIllustration() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 select-none overflow-hidden">
      <svg
        viewBox="0 0 1440 900"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
        style={{ width: '100%', height: '100%' }}
      >
        <defs>
          <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#C4B5D4" />
            <stop offset="58%" stopColor="#E8C4C4" />
            <stop offset="100%" stopColor="#F0D2CC" />
          </linearGradient>

          <linearGradient id="haloGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C4B5D4" />
            <stop offset="45%" stopColor="#E8C4C4" />
            <stop offset="100%" stopColor="#B5CEBC" />
          </linearGradient>

          <linearGradient id="grassGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#C2D6BA" />
            <stop offset="50%" stopColor="#B5CCB0" />
            <stop offset="100%" stopColor="#A4BAA0" />
          </linearGradient>

          <radialGradient id="cloudGrad" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FFFCFA" />
            <stop offset="100%" stopColor="#F5EEF5" stopOpacity="0.82" />
          </radialGradient>

          <radialGradient id="treeGrad" cx="38%" cy="32%" r="65%">
            <stop offset="0%" stopColor="#CCDEC5" />
            <stop offset="100%" stopColor="#94B490" />
          </radialGradient>
        </defs>

        {/* Sky */}
        <rect width="1440" height="900" fill="url(#skyGrad)" />

        {/* Clouds — left cluster */}
        <g opacity="0.92">
          <ellipse cx="188" cy="118" rx="98" ry="46" fill="url(#cloudGrad)" />
          <ellipse cx="255" cy="100" rx="74" ry="37" fill="url(#cloudGrad)" />
          <ellipse cx="132" cy="115" rx="56" ry="27" fill="url(#cloudGrad)" />
          <ellipse cx="292" cy="122" rx="44" ry="21" fill="url(#cloudGrad)" />
        </g>

        {/* Clouds — right cluster */}
        <g opacity="0.88">
          <ellipse cx="1215" cy="98" rx="90" ry="42" fill="url(#cloudGrad)" />
          <ellipse cx="1278" cy="80" rx="66" ry="33" fill="url(#cloudGrad)" />
          <ellipse cx="1162" cy="95" rx="52" ry="25" fill="url(#cloudGrad)" />
          <ellipse cx="1314" cy="106" rx="40" ry="19" fill="url(#cloudGrad)" />
        </g>

        {/* Clouds — center, smaller & lighter */}
        <g opacity="0.5">
          <ellipse cx="655" cy="152" rx="44" ry="20" fill="url(#cloudGrad)" />
          <ellipse cx="697" cy="140" rx="33" ry="15" fill="url(#cloudGrad)" />
          <ellipse cx="820" cy="168" rx="39" ry="18" fill="url(#cloudGrad)" />
          <ellipse cx="858" cy="156" rx="27" ry="13" fill="url(#cloudGrad)" />
        </g>

        {/* Halo — outer atmospheric glow */}
        <circle cx="720" cy="440" r="310" fill="none" stroke="rgba(196,181,212,0.07)" strokeWidth="80" />
        {/* Halo — mid bloom */}
        <circle cx="720" cy="440" r="275" fill="none" stroke="rgba(232,196,196,0.10)" strokeWidth="35" />
        {/* Halo — main ring */}
        <circle cx="720" cy="440" r="260" fill="none" stroke="url(#haloGrad)" strokeWidth="6" strokeOpacity="0.48" />
        {/* Halo — inner bright accent */}
        <circle cx="720" cy="440" r="255" fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="2" />
        {/* Halo — outer soft line */}
        <circle cx="720" cy="440" r="266" fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="2" />
        {/* Halo — inner secondary ring */}
        <circle cx="720" cy="440" r="242" fill="none" stroke="rgba(181,206,188,0.16)" strokeWidth="3" />

        {/* Grass */}
        <path
          d="M0,628 Q180,600 360,622 Q540,644 720,612 Q900,580 1080,618 Q1260,650 1440,622 L1440,900 L0,900 Z"
          fill="url(#grassGrad)"
        />
        {/* Oil-paint texture patches */}
        <ellipse cx="180" cy="652" rx="210" ry="28" fill="#C8DCC0" opacity="0.32" />
        <ellipse cx="560" cy="640" rx="250" ry="22" fill="#BCCDB5" opacity="0.26" />
        <ellipse cx="930" cy="646" rx="230" ry="26" fill="#C4D8BC" opacity="0.30" />
        <ellipse cx="1310" cy="654" rx="185" ry="24" fill="#C0D4B8" opacity="0.28" />
        <ellipse cx="720" cy="635" rx="170" ry="18" fill="#CAE0C2" opacity="0.22" />

        {/* Left pine tree */}
        <g transform="translate(275, 518)">
          <rect x="-11" y="92" width="22" height="96" fill="#A08865" rx="6" />
          <rect x="3" y="96" width="10" height="90" fill="#8A7050" opacity="0.32" rx="3" />
          <ellipse cx="0" cy="62" rx="84" ry="72" fill="url(#treeGrad)" />
          <ellipse cx="0" cy="38" rx="66" ry="58" fill="#C6D8BE" />
          <ellipse cx="0" cy="18" rx="47" ry="42" fill="#D0E2C8" />
          <ellipse cx="-20" cy="28" rx="24" ry="20" fill="#D8EDD0" opacity="0.48" />
          <ellipse cx="30" cy="70" rx="28" ry="22" fill="#7A9878" opacity="0.28" />
        </g>

        {/* Right pine tree */}
        <g transform="translate(1165, 518)">
          <rect x="-11" y="92" width="22" height="96" fill="#A08865" rx="6" />
          <rect x="-13" y="96" width="10" height="90" fill="#8A7050" opacity="0.32" rx="3" />
          <ellipse cx="0" cy="62" rx="84" ry="72" fill="url(#treeGrad)" />
          <ellipse cx="0" cy="38" rx="66" ry="58" fill="#C6D8BE" />
          <ellipse cx="0" cy="18" rx="47" ry="42" fill="#D0E2C8" />
          <ellipse cx="20" cy="28" rx="24" ry="20" fill="#D8EDD0" opacity="0.48" />
          <ellipse cx="-30" cy="70" rx="28" ry="22" fill="#7A9878" opacity="0.28" />
        </g>

        {/* Tiny girl — back view, centered at bottom of ring */}
        <g transform="translate(720, 570) scale(0.52)">
          {/* Hair */}
          <ellipse cx="0" cy="-34" rx="12" ry="13" fill="#3A2828" />
          <path d="M-11,-28 Q-16,2 -13,18" stroke="#3A2828" strokeWidth="9" fill="none" strokeLinecap="round" />
          <path d="M11,-28 Q16,2 13,18" stroke="#3A2828" strokeWidth="9" fill="none" strokeLinecap="round" />
          {/* Head */}
          <circle cx="0" cy="-24" r="14" fill="#F0D0BE" />
          {/* Neck */}
          <rect x="-4.5" y="-11" width="9" height="9" fill="#F0D0BE" rx="2" />
          {/* Body */}
          <path d="M-13,-3 Q-15,22 -19,48 Q0,56 19,48 Q15,22 13,-3 Z" fill="#C8A8CC" />
          {/* Skirt */}
          <path d="M-19,43 Q-26,66 -28,80 Q0,86 28,80 Q26,66 19,43 Z" fill="#D8B8DC" />
          {/* Dress highlight */}
          <path d="M-5,2 Q-1,24 0,46" stroke="rgba(255,255,255,0.28)" strokeWidth="4" fill="none" strokeLinecap="round" />
          {/* Left arm */}
          <path d="M-13,0 Q-22,18 -20,34" stroke="#C8A8CC" strokeWidth="8" fill="none" strokeLinecap="round" />
          {/* Right arm */}
          <path d="M13,0 Q22,18 20,34" stroke="#C8A8CC" strokeWidth="8" fill="none" strokeLinecap="round" />
          {/* Legs */}
          <rect x="-11" y="76" width="9" height="19" fill="#F0D0BE" rx="3" />
          <rect x="2" y="76" width="9" height="19" fill="#F0D0BE" rx="3" />
          {/* Shoes */}
          <ellipse cx="-7" cy="96" rx="8" ry="4" fill="#7060A8" />
          <ellipse cx="7" cy="96" rx="8" ry="4" fill="#7060A8" />
        </g>
      </svg>
    </div>
  )
}
