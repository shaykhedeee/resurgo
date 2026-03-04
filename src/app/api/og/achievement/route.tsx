import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get('title') ?? 'Achievement Unlocked';
  const stat = searchParams.get('stat') ?? '100%';
  const name = searchParams.get('name') ?? 'Resurgo User';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '48px',
          background: '#0a0a0a',
          color: '#e4e4e7',
          border: '2px solid #27272a',
          fontFamily: 'ui-monospace, Menlo, Monaco, monospace',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#71717a', fontSize: 22 }}>
          <span>resurgo://achievement</span>
          <span>{new Date().toISOString().slice(0, 10)}</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ color: '#f97316', fontSize: 24 }}>$ echo "{title}"</div>
          <div style={{ fontSize: 64, fontWeight: 700, color: '#fafafa' }}>{stat}</div>
          <div style={{ fontSize: 30, color: '#a1a1aa' }}>for {name}</div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ color: '#3f3f46', fontSize: 20 }}>Organized by RESURGO.life</div>
          <div style={{ color: '#52525b', fontSize: 18 }}>#build-with-consistency</div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
