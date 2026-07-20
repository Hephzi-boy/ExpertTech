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

type MauriceReferenceAvatarProps = {
  size?: number;
};

export function MauriceReferenceAvatar({
  size = 46,
}: MauriceReferenceAvatarProps) {
  const clipId = 'maurice-reference-avatar-clip';

  return (
    <Svg height={size} viewBox="0 0 46 46" width={size}>
      <Defs>
        <ClipPath id={clipId}>
          <Circle cx={23} cy={23} r={23} />
        </ClipPath>
        <LinearGradient id="maurice-bg" x1="0" x2="1" y1="0" y2="1">
          <Stop offset="0" stopColor="#15161B" />
          <Stop offset="1" stopColor="#08090D" />
        </LinearGradient>
        <LinearGradient id="maurice-skin" x1="0.2" x2="0.8" y1="0" y2="1">
          <Stop offset="0" stopColor="#B97553" />
          <Stop offset="1" stopColor="#8A523A" />
        </LinearGradient>
      </Defs>

      <G clipPath={`url(#${clipId})`}>
        <Rect fill="url(#maurice-bg)" height="46" width="46" x="0" y="0" />

        <Path
          d="M2 46C4.8 33.4 12.2 26.8 23.6 26.8C35.6 26.8 42.3 33.6 44 46H2Z"
          fill="#0F1015"
        />
        <Path
          d="M6.4 45.8C8.3 36.2 14 30.8 22.7 30.8C31.7 30.8 37.3 36 39.8 45.8H6.4Z"
          fill="#191B21"
        />

        <Ellipse cx="22.8" cy="21.2" fill="url(#maurice-skin)" rx="8.1" ry="9.8" />
        <Path
          d="M16.4 12.8C18.6 8.7 22.9 6.7 27.1 7.6C31.6 8.5 34.5 11.9 34.6 17V22.5H31.8C28.2 19.6 24.8 18 20.8 17.5C19.4 19.8 17.8 22 15 23.6L13.8 19.2C13.5 16.6 14.2 14.5 16.4 12.8Z"
          fill="#07080B"
        />
        <Path
          d="M16 17.3C17.4 12.7 20.8 9.9 25.1 9.5C29.8 9.1 33.6 12.1 34.6 16.6C31.8 14.2 28.9 12.8 24.8 12.7C21.8 12.7 18.7 13.9 16 17.3Z"
          fill="#131419"
          opacity="0.9"
        />

        <Path
          d="M26.7 18.9C27.6 18.9 28.3 19.6 28.3 20.4C28.3 21.3 27.6 21.9 26.7 21.9C25.8 21.9 25.1 21.3 25.1 20.4C25.1 19.6 25.8 18.9 26.7 18.9Z"
          fill="#111217"
        />
        <Path
          d="M19.9 19.4C20.8 19.4 21.5 20 21.5 20.9C21.5 21.8 20.8 22.4 19.9 22.4C19 22.4 18.3 21.8 18.3 20.9C18.3 20 19 19.4 19.9 19.4Z"
          fill="#111217"
        />
        <Path
          d="M20.2 24.7C22.1 25.9 24.4 25.9 26.2 24.7"
          fill="none"
          stroke="#6E3F2B"
          strokeLinecap="round"
          strokeWidth="1.1"
        />

        <Path
          d="M11.3 14.9C13.2 12.8 15.8 12.8 17.4 14.1C18.4 14.9 18.9 16.2 19.1 17.7L17.8 19C16.4 18.3 15.1 18.1 13.4 18.5L11.2 17.8C10.6 16.7 10.7 15.7 11.3 14.9Z"
          fill="url(#maurice-skin)"
        />
        <Path
          d="M10.6 18.2C12 17.4 13.7 17 15.2 17.1C16.2 17.2 17 17.5 17.8 18.3C16.4 19 14.7 19.1 12.8 19L10.6 18.2Z"
          fill="#94614B"
        />
        <Path
          d="M10.5 17.8C10.4 15.4 11.4 13.8 13.3 12.6"
          fill="none"
          stroke="#0E0F14"
          strokeLinecap="round"
          strokeWidth="2.2"
        />

        <Path
          d="M17.8 30.9C20.9 32 24.4 32 27.5 30.8L28.6 33.7C24.8 36 20.5 35.9 16.8 33.6L17.8 30.9Z"
          fill="#0D0F14"
        />
      </G>
    </Svg>
  );
}
