import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const size = {
  width: 32,
  height: 32,
};

export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'transparent',
        }}
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 16 16"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Black outline */}
          <rect x="3" y="1" width="3" height="1" fill="#000000" />
          <rect x="10" y="1" width="3" height="1" fill="#000000" />

          <rect x="2" y="2" width="1" height="1" fill="#000000" />
          <rect x="6" y="2" width="1" height="1" fill="#000000" />
          <rect x="9" y="2" width="1" height="1" fill="#000000" />
          <rect x="13" y="2" width="1" height="1" fill="#000000" />

          <rect x="1" y="3" width="1" height="2" fill="#000000" />
          <rect x="14" y="3" width="1" height="2" fill="#000000" />

          <rect x="0" y="5" width="1" height="4" fill="#000000" />
          <rect x="15" y="5" width="1" height="4" fill="#000000" />

          <rect x="1" y="9" width="1" height="1" fill="#000000" />
          <rect x="14" y="9" width="1" height="1" fill="#000000" />

          <rect x="2" y="10" width="1" height="1" fill="#000000" />
          <rect x="13" y="10" width="1" height="1" fill="#000000" />

          <rect x="3" y="11" width="1" height="1" fill="#000000" />
          <rect x="12" y="11" width="1" height="1" fill="#000000" />

          <rect x="4" y="12" width="1" height="1" fill="#000000" />
          <rect x="11" y="12" width="1" height="1" fill="#000000" />

          <rect x="5" y="13" width="1" height="1" fill="#000000" />
          <rect x="10" y="13" width="1" height="1" fill="#000000" />

          <rect x="6" y="14" width="1" height="1" fill="#000000" />
          <rect x="9" y="14" width="1" height="1" fill="#000000" />

          <rect x="7" y="15" width="2" height="1" fill="#000000" />

          {/* Red heart fill */}
          <rect x="3" y="2" width="3" height="1" fill="#CC0000" />
          <rect x="10" y="2" width="3" height="1" fill="#CC0000" />

          <rect x="2" y="3" width="5" height="2" fill="#CC0000" />
          <rect x="9" y="3" width="5" height="2" fill="#CC0000" />

          <rect x="1" y="5" width="14" height="4" fill="#CC0000" />

          {/* Dark red bottom shadow */}
          <rect x="2" y="9" width="2" height="1" fill="#990000" />
          <rect x="12" y="9" width="2" height="1" fill="#990000" />

          <rect x="3" y="10" width="3" height="1" fill="#990000" />
          <rect x="10" y="10" width="3" height="1" fill="#990000" />

          <rect x="4" y="11" width="2" height="1" fill="#990000" />
          <rect x="10" y="11" width="2" height="1" fill="#990000" />

          <rect x="5" y="12" width="2" height="1" fill="#990000" />
          <rect x="9" y="12" width="2" height="1" fill="#990000" />

          <rect x="6" y="13" width="1" height="1" fill="#990000" />
          <rect x="9" y="13" width="1" height="1" fill="#990000" />

          <rect x="7" y="14" width="2" height="1" fill="#990000" />

          {/* Light red middle part */}
          <rect x="4" y="9" width="8" height="1" fill="#CC0000" />
          <rect x="6" y="10" width="4" height="1" fill="#CC0000" />
          <rect x="6" y="11" width="4" height="1" fill="#CC0000" />
          <rect x="7" y="12" width="2" height="1" fill="#CC0000" />
          <rect x="7" y="13" width="2" height="1" fill="#CC0000" />

          {/* White highlight */}
          <rect x="3" y="3" width="2" height="2" fill="#FFFFFF" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
