import Svg, { Path, Circle, Line } from 'react-native-svg';

export const IconScan = ({ size = 20, color = '#0f172a' }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Path d="M3 7V5a2 2 0 0 1 2-2h2" />
    <Path d="M17 3h2a2 2 0 0 1 2 2v2" />
    <Path d="M21 17v2a2 2 0 0 1-2 2h-2" />
    <Path d="M7 21H5a2 2 0 0 1-2-2v-2" />
  </Svg>
);

export const IconLocate = ({ size = 20, color = '#0f172a' }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Circle cx="12" cy="12" r="10" />
    <Circle cx="12" cy="12" r="3" />
  </Svg>
);

export const IconCarClock = ({ size = 28, color = '#f97316' }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Path d="M14 16H9m10 0h3v-3.159c0-.53-.214-1.039-.594-1.414l-4.404-4.404A2.001 2.001 0 0 0 15.586 6H8.414a2 2 0 0 0-1.414.586L2.596 10.99A1.998 1.998 0 0 0 2 12.404V16h3m14 0v1.5a2.5 2.5 0 0 1-5 0V16m5 0h-5m-9 0v1.5a2.5 2.5 0 0 1-5 0V16m5 0H2" />
    <Circle cx="18" cy="6" r="5" fill="#ffffff" stroke={color} />
    <Path d="M18 4v2l1.5 1.5" />
  </Svg>
);

export const IconCarUser = ({ size = 28, color = '#f97316' }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Path d="M14 16H9m10 0h3v-3.159c0-.53-.214-1.039-.594-1.414l-4.404-4.404A2.001 2.001 0 0 0 15.586 6H8.414a2 2 0 0 0-1.414.586L2.596 10.99A1.998 1.998 0 0 0 2 12.404V16h3m14 0v1.5a2.5 2.5 0 0 1-5 0V16m5 0h-5m-9 0v1.5a2.5 2.5 0 0 1-5 0V16m5 0H2" />
    <Circle cx="18" cy="5" r="2.5" fill="#ffffff" stroke={color} />
    <Path d="M15.5 10a2.5 2.5 0 0 1 5 0v1" fill="#ffffff" stroke={color} />
  </Svg>
);

export const IconPlane = ({ size = 28, color = '#3b82f6' }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.2-1.1.6L3 8l6 4-3 3-3.2-.8c-.4-.1-.8.1-1 .5L1 16l4 2 2 4 .8-1c.4-.2.6-.6.5-1l-.8-3.2 3-3 4 6c.3.5.9.6 1.3.4l1.2-.7c.4-.2.7-.6.6-1.1z" />
  </Svg>
);

export const IconPaw = ({ size = 28, color = '#b45309' }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Path d="M12 5.5A2.5 2.5 0 1 1 9.5 3 2.5 2.5 0 0 1 12 5.5zM7.5 10A2.5 2.5 0 1 1 5 7.5 2.5 2.5 0 0 1 7.5 10zM16.5 10A2.5 2.5 0 1 1 14 7.5 2.5 2.5 0 0 1 16.5 10zM19 12.5a2.5 2.5 0 1 1-2.5-2.5 2.5 2.5 0 0 1 2.5 2.5zM12 11c-2.5 0-4.5 2.5-4.5 5.5S9.5 21 12 21s4.5-2 4.5-4.5S14.5 11 12 11z" />
  </Svg>
);

export const IconPercent = ({ size = 28, color = '#ef4444' }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Line x1="19" y1="5" x2="5" y2="19" />
    <Circle cx="6.5" cy="6.5" r="2.5" />
    <Circle cx="17.5" cy="17.5" r="2.5" />
  </Svg>
);

export const IconCarLogo = ({ size = 24, color = '#f97316' }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color}
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Path d="M14 16H9m10 0h3v-3.159c0-.53-.214-1.039-.594-1.414l-4.404-4.404A2.001 2.001 0 0 0 15.586 6H8.414a2 2 0 0 0-1.414.586L2.596 10.99A1.998 1.998 0 0 0 2 12.404V16h3m14 0v1.5a2.5 2.5 0 0 1-5 0V16m5 0h-5m-9 0v1.5a2.5 2.5 0 0 1-5 0V16m5 0H2" />
  </Svg>
);

export const IconUser = ({ size = 24, color = '#94a3b8' }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <Circle cx="12" cy="7" r="4" />
  </Svg>
);
