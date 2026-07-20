import React from 'react';
import Svg, {
  Circle,
  ClipPath,
  Defs,
  Ellipse,
  G,
  LinearGradient,
  Path,
  Rect,
  Stop,
} from 'react-native-svg';

import { MauriceReferenceAvatar } from './MauriceReferenceAvatar';

type ReferenceFeedAvatarProps = {
  size?: number;
  variant: 'maurice' | 'boyd' | 'stranger' | 'felix';
};

export function ReferenceFeedAvatar({
  size = 44,
  variant,
}: ReferenceFeedAvatarProps) {
  if (variant === 'maurice') {
    return <MauriceReferenceAvatar size={size} />;
  }

  if (variant === 'boyd') {
    return <BoydReferenceAvatar size={size} />;
  }

  if (variant === 'stranger') {
    return <StrangerReferenceAvatar size={size} />;
  }

  return <FelixReferenceAvatar size={size} />;
}

function BoydReferenceAvatar({ size }: { size: number }) {
  const clipId = 'boyd-reference-avatar-clip';

  return (
    <Svg height={size} viewBox="0 0 44 44" width={size}>
      <Defs>
        <ClipPath id={clipId}>
          <Circle cx="22" cy="22" r="22" />
        </ClipPath>
        <LinearGradient id="boyd-bg" x1="0" x2="1" y1="0" y2="1">
          <Stop offset="0" stopColor="#0A1010" />
          <Stop offset="1" stopColor="#15171A" />
        </LinearGradient>
        <LinearGradient id="boyd-skin" x1="0.2" x2="0.8" y1="0" y2="1">
          <Stop offset="0" stopColor="#4C362D" />
          <Stop offset="1" stopColor="#221712" />
        </LinearGradient>
      </Defs>

      <Circle cx="22" cy="22" fill="#24D39E" r="22" />
      <Circle cx="22" cy="22" fill="#0B0F10" r="19.2" />

      <G clipPath={`url(#${clipId})`}>
        <Rect fill="url(#boyd-bg)" height="44" width="44" x="0" y="0" />

        {[
          [7, 7],
          [15, 5],
          [27, 7],
          [35, 10],
          [5, 19],
          [13, 15],
          [31, 17],
          [39, 19],
          [9, 31],
          [17, 34],
          [29, 32],
          [37, 29],
        ].map(([cx, cy], index) => (
          <Circle
            key={`boyd-leaf-${index}`}
            cx={cx}
            cy={cy}
            fill={index % 2 === 0 ? '#1D2E28' : '#131E1B'}
            opacity="0.8"
            r={index % 3 === 0 ? 3.4 : 2.7}
          />
        ))}

        <Path
          d="M10.5 43.5C12.7 34.8 16.8 30.2 22.2 30.2C27.8 30.2 32.1 34.6 34.5 43.5H10.5Z"
          fill="#B7AB99"
        />
        <Path
          d="M14.2 43.5C15.5 36.4 18.6 32.7 22.4 32.7C26.4 32.7 29.3 36.2 30.9 43.5H14.2Z"
          fill="#1A1717"
        />

        <Ellipse cx="22" cy="20.6" fill="url(#boyd-skin)" rx="7.2" ry="8.8" />
        <Path
          d="M15.7 20.2C16.4 15.1 18.7 11.8 22 11.8C25.3 11.8 27.5 15 28.4 20.2"
          fill="none"
          stroke="#090C0E"
          strokeLinecap="round"
          strokeWidth="3.2"
        />
        <Path
          d="M14.8 23.8C17 27.7 19.4 29.6 22.1 29.6C24.9 29.6 27.2 27.7 29.2 23.7L30.6 27.4C29.3 31 26.3 33.1 22.1 33.1C17.7 33.1 14.7 30.8 13.5 27.1L14.8 23.8Z"
          fill="#0E0F11"
        />
        <Rect fill="#171B1D" height="4.1" rx="1.4" width="5.2" x="16.2" y="19.4" />
        <Rect fill="#171B1D" height="4.1" rx="1.4" width="5.2" x="22.7" y="19.4" />
        <Rect fill="#171B1D" height="1.1" rx="0.55" width="2.2" x="20.9" y="20.8" />
        <Path
          d="M18.4 26.5C19.7 27.3 21 27.8 22.2 27.8C23.5 27.8 24.8 27.3 26 26.5"
          fill="none"
          stroke="#6D5349"
          strokeLinecap="round"
          strokeWidth="1"
        />
      </G>
    </Svg>
  );
}

function StrangerReferenceAvatar({ size }: { size: number }) {
  const clipId = 'stranger-reference-avatar-clip';

  return (
    <Svg height={size} viewBox="0 0 44 44" width={size}>
      <Defs>
        <ClipPath id={clipId}>
          <Circle cx="22" cy="22" r="22" />
        </ClipPath>
        <LinearGradient id="stranger-skin" x1="0.2" x2="0.8" y1="0" y2="1">
          <Stop offset="0" stopColor="#9C5536" />
          <Stop offset="1" stopColor="#6F341D" />
        </LinearGradient>
      </Defs>

      <G clipPath={`url(#${clipId})`}>
        <Rect fill="#0A0D10" height="44" width="44" x="0" y="0" />
        <Circle cx="22" cy="20.5" fill="#DCE1E5" r="14.2" />
        <Path
          d="M6.5 44C9.4 35.4 14.3 30.8 21.9 30.8C29.2 30.8 34.2 35.1 37.4 44H6.5Z"
          fill="#111417"
        />
        <Ellipse cx="22.1" cy="20.9" fill="url(#stranger-skin)" rx="8.1" ry="8.9" />
        <Path
          d="M12.5 18.9C13.4 12.1 17 8.3 22.1 8.3C27.2 8.3 30.8 12.1 31.6 18.9L28.6 18.3C26.7 16.3 24.7 15.2 22.1 15.1C19.5 15.2 17.3 16.3 15.5 18.4L12.5 18.9Z"
          fill="#0B0B0D"
        />
        <Path
          d="M13.7 16.2C16.2 10.8 20.4 8.3 26 9.2C28.4 9.6 30.1 11.1 31.3 13.6C29.4 12.9 27.8 12.5 26 12.5C21.5 12.5 17.7 13.8 13.7 16.2Z"
          fill="#131417"
        />
        <Path
          d="M15.3 27.2C17.7 31.9 19.9 34.2 22.2 34.2C24.5 34.2 26.6 31.8 28.8 27L31.7 30.6C29.3 36.1 26.1 39 22.2 39C18.2 39 15 36.2 12.4 30.8L15.3 27.2Z"
          fill="#111214"
        />
        <Path
          d="M17.8 21.3C18.6 21.3 19.3 22 19.3 22.8C19.3 23.6 18.6 24.3 17.8 24.3C17 24.3 16.3 23.6 16.3 22.8C16.3 22 17 21.3 17.8 21.3Z"
          fill="#141519"
        />
        <Path
          d="M26.2 21.3C27 21.3 27.7 22 27.7 22.8C27.7 23.6 27 24.3 26.2 24.3C25.4 24.3 24.7 23.6 24.7 22.8C24.7 22 25.4 21.3 26.2 21.3Z"
          fill="#141519"
        />
      </G>
    </Svg>
  );
}

function FelixReferenceAvatar({ size }: { size: number }) {
  const clipId = 'felix-reference-avatar-clip';

  return (
    <Svg height={size} viewBox="0 0 44 44" width={size}>
      <Defs>
        <ClipPath id={clipId}>
          <Circle cx="22" cy="22" r="22" />
        </ClipPath>
        <LinearGradient id="felix-skin" x1="0.1" x2="0.9" y1="0.2" y2="0.8">
          <Stop offset="0" stopColor="#9C674F" />
          <Stop offset="1" stopColor="#6E4431" />
        </LinearGradient>
      </Defs>

      <G clipPath={`url(#${clipId})`}>
        <Rect fill="#F7F7F5" height="44" width="44" x="0" y="0" />
        <Circle cx="32" cy="11" fill="#EBEBE6" r="10" />
        <Path
          d="M7.5 45C8.6 36.2 12.4 30.6 18.8 27.4C21.5 26 24.2 25.5 27 25.6L31.5 32.2L33.6 45H7.5Z"
          fill="#D0D1CB"
        />
        <Path
          d="M22.3 15.2C24.6 16 26.6 17.4 28.2 19.6C26.8 20.5 25.8 21.7 25.3 23.3L22.8 23.7L20.9 21.9L19.9 18.8L22.3 15.2Z"
          fill="url(#felix-skin)"
        />
        <Path
          d="M16.8 11.1C19.2 10.6 21.1 11.1 22.6 12.7L23.4 15C22 17.3 20.8 19.5 20 21.8L18.1 21.4L16.2 18.2L15.8 14.2L16.8 11.1Z"
          fill="#3F2B25"
        />
        <Path
          d="M19.4 21.5C22 21.1 24 21.6 25.6 23C24.9 24.1 23.9 24.9 22.4 25.2C21.1 24.6 20.1 23.4 19.4 21.5Z"
          fill="#734B3A"
        />
        <Path
          d="M15.7 17.8C16.6 21.5 18.5 23.9 21.1 25.2"
          fill="none"
          stroke="#201513"
          strokeLinecap="round"
          strokeWidth="1.5"
        />
      </G>
    </Svg>
  );
}
