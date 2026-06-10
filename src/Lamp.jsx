export default function Lamp({ size = 56, flame = '#e8740c', line = '#1f2a33' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M18 8h12"
        stroke={line}
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <path
        d="M24 4v4"
        stroke={line}
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <path
        d="M17 12c0-1.7 1.3-3 3-3h8c1.7 0 3 1.3 3 3 0 0 2.5 5 2.5 12S30 38 30 38H18s-3.5-7-3.5-14S17 12 17 12Z"
        stroke={line}
        strokeWidth="2.6"
        strokeLinejoin="round"
      />
      <path
        d="M24 19c2.6 3 3.9 5.2 3.9 7.4 0 2.6-1.7 4.6-3.9 4.6s-3.9-2-3.9-4.6c0-2.2 1.3-4.4 3.9-7.4Z"
        fill={flame}
      />
      <path
        d="M15 38h18v3c0 1.7-1.3 3-3 3H18c-1.7 0-3-1.3-3-3v-3Z"
        stroke={line}
        strokeWidth="2.6"
        strokeLinejoin="round"
      />
    </svg>
  )
}
