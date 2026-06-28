import Svg, { Path, Circle, Rect, Line, Polyline } from 'react-native-svg';

type IconProps = { size?: number; color?: string };

export const IconClipboard = ({ size = 24, color = '#f97316' }: IconProps) => (
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
    <Rect x="8" y="2" width="8" height="4" rx="1" />
    <Path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <Line x1="9" y1="12" x2="15" y2="12" />
    <Line x1="9" y1="16" x2="13" y2="16" />
  </Svg>
);

export const IconWallet = ({ size = 24, color = '#f97316' }: IconProps) => (
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
    <Path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
    <Path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
    <Path d="M18 12a2 2 0 0 0 0 4h4v-4Z" fill={color} />
  </Svg>
);

export const IconReceipt = ({ size = 24, color = '#f97316' }: IconProps) => (
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
    <Path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" />
    <Line x1="8" y1="7" x2="16" y2="7" />
    <Line x1="8" y1="11" x2="16" y2="11" />
    <Line x1="8" y1="15" x2="13" y2="15" />
  </Svg>
);

export const IconHeadset = ({ size = 24, color = '#f97316' }: IconProps) => (
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
    <Path d="M3 14v-3a9 9 0 0 1 18 0v3" />
    <Path d="M21 16a2 2 0 0 1-2 2h-1v-6h1a2 2 0 0 1 2 2Z" fill={color} />
    <Path d="M3 16a2 2 0 0 0 2 2h1v-6H5a2 2 0 0 0-2 2Z" fill={color} />
    <Path d="M21 14v2a4 4 0 0 1-4 4h-5" />
  </Svg>
);

export const IconTicket = ({ size = 20, color = '#334155' }: IconProps) => (
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
    <Path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
    <Line x1="13" y1="5" x2="13" y2="19" strokeDasharray="2 2" />
  </Svg>
);

export const IconCard = ({ size = 20, color = '#334155' }: IconProps) => (
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
    <Rect x="2" y="5" width="20" height="14" rx="2" />
    <Line x1="2" y1="10" x2="22" y2="10" />
    <Line x1="6" y1="15" x2="10" y2="15" />
  </Svg>
);

export const IconCode = ({ size = 20, color = '#334155' }: IconProps) => (
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
    <Polyline points="16 18 22 12 16 6" />
    <Polyline points="8 6 2 12 8 18" />
  </Svg>
);

export const IconGift = ({ size = 20, color = '#334155' }: IconProps) => (
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
    <Rect x="3" y="8" width="18" height="4" rx="1" />
    <Path d="M12 8v13" />
    <Path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
    <Path d="M7.5 8a2.5 2.5 0 0 1 0-5C11 3 12 8 12 8s1-5 4.5-5a2.5 2.5 0 0 1 0 5" />
  </Svg>
);

export const IconShield = ({ size = 20, color = '#334155' }: IconProps) => (
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
    <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
    <Path d="m9 12 2 2 4-4" />
  </Svg>
);

export const IconGlobe = ({ size = 20, color = '#334155' }: IconProps) => (
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
    <Line x1="2" y1="12" x2="22" y2="12" />
    <Path d="M12 2a15 15 0 0 1 0 20" />
    <Path d="M12 2a15 15 0 0 0 0 20" />
  </Svg>
);

export const IconGear = ({ size = 20, color = '#334155' }: IconProps) => (
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
    <Circle cx="12" cy="12" r="3" />
    <Path d="M12 2v3M12 19v3M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M2 12h3M19 12h3M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12" />
  </Svg>
);

export const IconChevronRight = ({
  size = 20,
  color = '#cbd5e1',
}: IconProps) => (
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
    <Path d="m9 18 6-6-6-6" />
  </Svg>
);

export const IconMegaphone = ({ size = 20, color = '#f97316' }: IconProps) => (
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
    <Path d="M3 11l18-5v12L3 14v-3Z" />
    <Path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
  </Svg>
);
