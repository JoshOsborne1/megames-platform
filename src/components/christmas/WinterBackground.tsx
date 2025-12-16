"use client";

export function WinterBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <svg
        className="absolute bottom-0 left-0 w-full h-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMax slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0a0820" />
            <stop offset="100%" stopColor="#1a1040" />
          </linearGradient>
        </defs>
        
        <rect fill="url(#skyGradient)" width="1440" height="900"/>
        
        <g opacity="0.6">
          <ellipse cx="200" cy="100" rx="60" ry="60" fill="#ffffff" opacity="0.1"/>
          <ellipse cx="1200" cy="150" rx="80" ry="80" fill="#ffffff" opacity="0.08"/>
        </g>
        
        <g className="mountains" opacity="0.3">
          <path d="M0 500 L200 300 L400 400 L600 250 L800 350 L1000 200 L1200 320 L1440 280 L1440 900 L0 900 Z" fill="#1a1a40"/>
          <path d="M0 600 L150 450 L350 520 L550 400 L750 480 L950 380 L1150 450 L1440 420 L1440 900 L0 900 Z" fill="#0d0d28"/>
        </g>
        
        <g className="trees">
          <g transform="translate(100, 650)">
            <polygon points="0,-80 -30,0 30,0" fill="#0d3d0d" opacity="0.6"/>
            <polygon points="0,-60 -35,10 35,10" fill="#0d3d0d" opacity="0.6"/>
            <polygon points="0,-40 -40,20 40,20" fill="#0d3d0d" opacity="0.6"/>
            <rect x="-8" y="20" width="16" height="30" fill="#2d1810" opacity="0.6"/>
          </g>
          
          <g transform="translate(300, 680)">
            <polygon points="0,-60 -25,0 25,0" fill="#0f4d0f" opacity="0.5"/>
            <polygon points="0,-45 -28,8 28,8" fill="#0f4d0f" opacity="0.5"/>
            <polygon points="0,-30 -32,15 32,15" fill="#0f4d0f" opacity="0.5"/>
            <rect x="-6" y="15" width="12" height="25" fill="#2d1810" opacity="0.5"/>
          </g>
          
          <g transform="translate(1100, 670)">
            <polygon points="0,-70 -28,0 28,0" fill="#0d3d0d" opacity="0.6"/>
            <polygon points="0,-52 -32,8 32,8" fill="#0d3d0d" opacity="0.6"/>
            <polygon points="0,-35 -36,18 36,18" fill="#0d3d0d" opacity="0.6"/>
            <rect x="-7" y="18" width="14" height="28" fill="#2d1810" opacity="0.6"/>
          </g>
          
          <g transform="translate(1300, 690)">
            <polygon points="0,-55 -22,0 22,0" fill="#0f4d0f" opacity="0.5"/>
            <polygon points="0,-40 -26,7 26,7" fill="#0f4d0f" opacity="0.5"/>
            <polygon points="0,-25 -30,14 30,14" fill="#0f4d0f" opacity="0.5"/>
            <rect x="-5" y="14" width="10" height="22" fill="#2d1810" opacity="0.5"/>
          </g>
        </g>
        
        <path d="M0 750 Q360 730 720 750 T1440 750 L1440 900 L0 900 Z" fill="#ffffff" opacity="0.15"/>
        <path d="M0 800 Q360 785 720 800 T1440 800 L1440 900 L0 900 Z" fill="#ffffff" opacity="0.2"/>
      </svg>
    </div>
  );
}
