export default function BackgroundIllustration() {
  return (
    <div className="fixed bottom-0 right-0 pointer-events-none z-0 select-none" style={{ width: 380, height: 300 }}>
      <svg viewBox="0 0 380 300" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
        {/* Sky gradient overlay */}
        <defs>
          <radialGradient id="cloudGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="white" stopOpacity="0.95" />
            <stop offset="100%" stopColor="white" stopOpacity="0.7" />
          </radialGradient>
          <linearGradient id="riverGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#C4D8E4" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#A8C8D8" stopOpacity="0.5" />
          </linearGradient>
          <linearGradient id="houseWall" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#EDD8C8" />
            <stop offset="100%" stopColor="#E0C8B8" />
          </linearGradient>
        </defs>

        {/* Clouds */}
        <g opacity="0.85">
          <ellipse cx="60" cy="45" rx="38" ry="20" fill="url(#cloudGrad)" />
          <ellipse cx="88" cy="38" rx="28" ry="16" fill="url(#cloudGrad)" />
          <ellipse cx="40" cy="42" rx="18" ry="12" fill="url(#cloudGrad)" />

          <ellipse cx="260" cy="30" rx="32" ry="17" fill="url(#cloudGrad)" />
          <ellipse cx="284" cy="24" rx="22" ry="13" fill="url(#cloudGrad)" />
          <ellipse cx="244" cy="28" rx="15" ry="10" fill="url(#cloudGrad)" />
        </g>

        {/* House */}
        <g>
          {/* Roof */}
          <polygon points="218,120 268,80 318,120" fill="#D4A898" />
          <polygon points="222,120 268,84 314,120" fill="#E8C0A8" />
          {/* Chimney */}
          <rect x="290" y="88" width="12" height="22" fill="#D4A898" rx="2" />
          <rect x="288" y="86" width="16" height="5" fill="#C49888" rx="1" />
          {/* Wall */}
          <rect x="228" y="120" width="80" height="58" fill="url(#houseWall)" rx="2" />
          {/* Windows */}
          <rect x="238" y="132" width="20" height="20" fill="#C4D8E8" rx="3" opacity="0.8" />
          <line x1="248" y1="132" x2="248" y2="152" stroke="#A8C0D0" strokeWidth="1" opacity="0.6" />
          <line x1="238" y1="142" x2="258" y2="142" stroke="#A8C0D0" strokeWidth="1" opacity="0.6" />
          <rect x="278" y="132" width="20" height="20" fill="#C4D8E8" rx="3" opacity="0.8" />
          <line x1="288" y1="132" x2="288" y2="152" stroke="#A8C0D0" strokeWidth="1" opacity="0.6" />
          <line x1="278" y1="142" x2="298" y2="142" stroke="#A8C0D0" strokeWidth="1" opacity="0.6" />
          {/* Door */}
          <rect x="255" y="150" width="22" height="28" fill="#C4A888" rx="3" />
          <circle cx="273" cy="166" r="2" fill="#A88868" />
          {/* Door frame */}
          <rect x="254" y="149" width="24" height="30" fill="none" stroke="#B89878" strokeWidth="1.5" rx="3" />
        </g>

        {/* Left tree */}
        <g>
          <rect x="196" y="158" width="9" height="46" fill="#A89070" rx="2" />
          <ellipse cx="200" cy="148" rx="24" ry="22" fill="#B5CEBC" opacity="0.9" />
          <ellipse cx="192" cy="155" rx="16" ry="14" fill="#9EC0A8" opacity="0.7" />
        </g>

        {/* Right tree (behind house) */}
        <g>
          <rect x="330" y="155" width="9" height="50" fill="#A89070" rx="2" />
          <ellipse cx="334" cy="144" rx="22" ry="20" fill="#B5CEBC" opacity="0.9" />
          <ellipse cx="326" cy="150" rx="14" ry="12" fill="#9EC0A8" opacity="0.7" />
        </g>

        {/* Small flowers/bushes */}
        <circle cx="215" cy="205" r="6" fill="#E8C4C4" opacity="0.7" />
        <circle cx="224" cy="202" r="5" fill="#D4B5C4" opacity="0.6" />
        <circle cx="208" cy="202" r="4" fill="#E0C8C0" opacity="0.6" />
        <circle cx="345" cy="200" r="5" fill="#B5CEBC" opacity="0.7" />
        <circle cx="355" cy="202" r="4" fill="#A8C0A8" opacity="0.6" />

        {/* River */}
        <path
          d="M0,245 Q45,232 90,248 Q135,264 180,248 Q225,232 270,248 Q315,264 380,245 L380,300 L0,300 Z"
          fill="url(#riverGrad)"
        />
        {/* River highlights */}
        <path
          d="M20,252 Q60,242 100,254"
          stroke="white" strokeWidth="1.5" fill="none" opacity="0.4" strokeLinecap="round"
        />
        <path
          d="M140,250 Q180,240 220,252"
          stroke="white" strokeWidth="1.5" fill="none" opacity="0.4" strokeLinecap="round"
        />
        <path
          d="M260,248 Q300,238 340,250"
          stroke="white" strokeWidth="1.5" fill="none" opacity="0.4" strokeLinecap="round"
        />

        {/* Ground */}
        <rect x="0" y="205" width="380" height="45" fill="#D4CBBC" opacity="0.25" rx="0" />

        {/* ====== RABBIT ====== */}
        <g transform="translate(68, 168)">
          {/* Left ear */}
          <ellipse cx="-10" cy="-30" rx="7" ry="22" fill="white" />
          <ellipse cx="-10" cy="-30" rx="4" ry="17" fill="#E8C0C0" opacity="0.7" />
          {/* Right ear */}
          <ellipse cx="10" cy="-30" rx="7" ry="22" fill="white" />
          <ellipse cx="10" cy="-30" rx="4" ry="17" fill="#E8C0C0" opacity="0.7" />

          {/* Head */}
          <circle cx="0" cy="-4" r="22" fill="white" />

          {/* Eyes */}
          <circle cx="-7" cy="-7" r="3.5" fill="#7A6070" />
          <circle cx="7" cy="-7" r="3.5" fill="#7A6070" />
          <circle cx="-6" cy="-8" r="1.2" fill="white" />
          <circle cx="8" cy="-8" r="1.2" fill="white" />

          {/* Nose */}
          <ellipse cx="0" cy="-1" rx="4" ry="2.5" fill="#E8B0B0" />

          {/* Mouth */}
          <path d="M-3,2 Q0,5 3,2" stroke="#D09090" strokeWidth="1.2" fill="none" strokeLinecap="round" />

          {/* Blush */}
          <ellipse cx="-12" cy="-1" rx="5" ry="3" fill="#F5C0C0" opacity="0.55" />
          <ellipse cx="12" cy="-1" rx="5" ry="3" fill="#F5C0C0" opacity="0.55" />

          {/* Body / Dress (deeper pink) */}
          <ellipse cx="0" cy="30" rx="20" ry="26" fill="#C8849A" />

          {/* Dress collar */}
          <path d="M-10,14 Q0,20 10,14" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" />

          {/* Dress bottom ruffle */}
          <path
            d="M-19,44 Q-14,50 -9,44 Q-4,50 1,44 Q6,50 11,44 Q16,50 20,44"
            stroke="white" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.7"
          />

          {/* Left arm */}
          <ellipse cx="-22" cy="24" rx="8" ry="13" fill="#C8849A" transform="rotate(-18,-22,24)" />
          {/* Right arm */}
          <ellipse cx="22" cy="24" rx="8" ry="13" fill="#C8849A" transform="rotate(18,22,24)" />

          {/* Left hand (paw) */}
          <circle cx="-27" cy="34" r="6" fill="white" />
          {/* Right hand (paw) */}
          <circle cx="27" cy="34" r="6" fill="white" />

          {/* Legs */}
          <ellipse cx="-8" cy="55" rx="9" ry="7" fill="white" />
          <ellipse cx="8" cy="55" rx="9" ry="7" fill="white" />

          {/* Dress pocket decoration */}
          <circle cx="5" cy="32" r="3" fill="white" opacity="0.4" />
        </g>
      </svg>
    </div>
  )
}
