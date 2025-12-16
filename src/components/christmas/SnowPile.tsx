"use client";

export function SnowPile({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute -top-2 left-0 right-0 overflow-hidden ${className}`}>
      <svg
        width="100%"
        height="20"
        viewBox="0 0 200 20"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0,10 Q10,5 20,10 T40,10 T60,10 T80,10 T100,10 T120,10 T140,10 T160,10 T180,10 T200,10 L200,20 L0,20 Z"
          fill="white"
          opacity="0.9"
        />
        <path
          d="M0,12 Q8,8 16,12 T32,12 T48,12 T64,12 T80,12 T96,12 T112,12 T128,12 T144,12 T160,12 T176,12 T192,12 T200,12 L200,20 L0,20 Z"
          fill="white"
          opacity="0.7"
        />
        <ellipse cx="15" cy="8" rx="4" ry="3" fill="white" opacity="0.6"/>
        <ellipse cx="45" cy="7" rx="3" ry="2" fill="white" opacity="0.6"/>
        <ellipse cx="75" cy="9" rx="5" ry="3" fill="white" opacity="0.6"/>
        <ellipse cx="105" cy="8" rx="3" ry="2" fill="white" opacity="0.6"/>
        <ellipse cx="135" cy="7" rx="4" ry="3" fill="white" opacity="0.6"/>
        <ellipse cx="165" cy="9" rx="3" ry="2" fill="white" opacity="0.6"/>
        <ellipse cx="185" cy="8" rx="4" ry="3" fill="white" opacity="0.6"/>
      </svg>
    </div>
  );
}
