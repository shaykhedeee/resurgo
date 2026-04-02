// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO :: Social Share Card Generator (OG Image)
// Generates dynamic streak/achievement share cards using @vercel/og
// Used for: Twitter cards, LinkedIn shares, Instagram stories, Discord embeds
// ═══════════════════════════════════════════════════════════════════════════════

import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

// ── Style tokens ────────────────────────────────────────────────────────────
const BG = '#050505';
const BG_CARD = '#0d0d0d';
const BORDER = '#1a1a1a';
const ORANGE = '#FF6B35';
const GREEN = '#22c55e';
const TEXT = '#e0e0e0';
const TEXT_DIM = '#666666';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const type = searchParams.get('type') || 'streak'; // streak | achievement | weekly | coach
  const name = searchParams.get('name') || 'Operator';
  const streak = searchParams.get('streak') || '0';
  const habits = searchParams.get('habits') || '0';
  const level = searchParams.get('level') || '1';
  const title = searchParams.get('title') || '';
  const subtitle = searchParams.get('subtitle') || '';
  const coach = searchParams.get('coach') || 'MARCUS';

  // ── Streak Share Card ──────────────────────────────────────────────
  if (type === 'streak') {
    return new ImageResponse(
      (
        <div
          style={{
            width: '1200',
            height: '630',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: BG,
            fontFamily: '"JetBrains Mono", monospace',
          }}
        >
          {/* Terminal border */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '1120',
              height: '550',
              border: `2px solid ${BORDER}`,
              borderRadius: '12px',
              background: BG_CARD,
              padding: '40px',
            }}
          >
            {/* Header bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <div style={{ width: '12', height: '12', borderRadius: '50%', background: '#ef4444' }} />
              <div style={{ width: '12', height: '12', borderRadius: '50%', background: '#eab308' }} />
              <div style={{ width: '12', height: '12', borderRadius: '50%', background: GREEN }} />
              <span style={{ color: TEXT_DIM, fontSize: '16px', marginLeft: '12px' }}>resurgo.life // streak_report</span>
            </div>

            {/* Streak number */}
            <div
              style={{
                display: 'flex',
                fontSize: '140px',
                fontWeight: 800,
                color: ORANGE,
                lineHeight: 1,
                marginTop: '20px',
              }}
            >
              {streak}
            </div>
            <div style={{ display: 'flex', fontSize: '28px', color: TEXT, letterSpacing: '4px', marginTop: '8px' }}>
              DAY STREAK 🔥
            </div>

            {/* Stats row */}
            <div style={{ display: 'flex', gap: '60px', marginTop: '32px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ color: ORANGE, fontSize: '36px', fontWeight: 700 }}>{habits}</span>
                <span style={{ color: TEXT_DIM, fontSize: '16px' }}>HABITS</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ color: GREEN, fontSize: '36px', fontWeight: 700 }}>LVL {level}</span>
                <span style={{ color: TEXT_DIM, fontSize: '16px' }}>RANK</span>
              </div>
            </div>

            {/* Name + CTA */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '32px' }}>
              <span style={{ color: TEXT, fontSize: '20px' }}>{name}</span>
              <span style={{ color: TEXT_DIM, fontSize: '20px' }}>·</span>
              <span style={{ color: ORANGE, fontSize: '20px' }}>resurgo.life</span>
            </div>

            {/* Tagline */}
            <div style={{ display: 'flex', color: TEXT_DIM, fontSize: '14px', marginTop: '12px' }}>
              AI Life OS — Turn goals into daily execution
            </div>
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    );
  }

  // ── Achievement Card ───────────────────────────────────────────────
  if (type === 'achievement') {
    return new ImageResponse(
      (
        <div
          style={{
            width: '1200',
            height: '630',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: BG,
            fontFamily: '"JetBrains Mono", monospace',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '1120',
              height: '550',
              border: `2px solid ${ORANGE}`,
              borderRadius: '12px',
              background: BG_CARD,
              padding: '40px',
            }}
          >
            {/* Badge */}
            <div style={{ display: 'flex', fontSize: '80px', marginBottom: '16px' }}>🏆</div>

            {/* Title */}
            <div
              style={{
                display: 'flex',
                fontSize: '48px',
                fontWeight: 800,
                color: ORANGE,
                textAlign: 'center',
                maxWidth: '900px',
              }}
            >
              {title || 'ACHIEVEMENT UNLOCKED'}
            </div>

            {/* Subtitle */}
            <div
              style={{
                display: 'flex',
                fontSize: '24px',
                color: TEXT,
                marginTop: '16px',
                textAlign: 'center',
                maxWidth: '800px',
              }}
            >
              {subtitle || `${name} reached a new milestone on Resurgo`}
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', gap: '40px', marginTop: '40px' }}>
              <div
                style={{
                  display: 'flex',
                  padding: '12px 24px',
                  border: `1px solid ${BORDER}`,
                  borderRadius: '8px',
                  background: '#111111',
                }}
              >
                <span style={{ color: ORANGE, fontSize: '20px' }}>🔥 {streak} day streak</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  padding: '12px 24px',
                  border: `1px solid ${BORDER}`,
                  borderRadius: '8px',
                  background: '#111111',
                }}
              >
                <span style={{ color: GREEN, fontSize: '20px' }}>⚡ Level {level}</span>
              </div>
            </div>

            {/* CTA */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '32px' }}>
              <span style={{ color: ORANGE, fontSize: '22px', fontWeight: 700 }}>resurgo.life</span>
              <span style={{ color: TEXT_DIM, fontSize: '18px' }}>— AI Life OS</span>
            </div>
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    );
  }

  // ── Weekly Review Card ─────────────────────────────────────────────
  if (type === 'weekly') {
    const tasksCompleted = searchParams.get('tasks') || '0';
    const goalsHit = searchParams.get('goals') || '0';
    const score = searchParams.get('score') || '0';

    return new ImageResponse(
      (
        <div
          style={{
            width: '1200',
            height: '630',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: BG,
            fontFamily: '"JetBrains Mono", monospace',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '1120',
              height: '550',
              border: `2px solid ${BORDER}`,
              borderRadius: '12px',
              background: BG_CARD,
              padding: '40px',
            }}
          >
            <div style={{ display: 'flex', color: TEXT_DIM, fontSize: '16px', letterSpacing: '6px' }}>
              WEEKLY REVIEW
            </div>
            <div style={{ display: 'flex', color: ORANGE, fontSize: '50px', fontWeight: 800, marginTop: '16px' }}>
              {score}% EXECUTION
            </div>

            {/* Stats grid */}
            <div style={{ display: 'flex', gap: '40px', marginTop: '40px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 32px', border: `1px solid ${BORDER}`, borderRadius: '8px' }}>
                <span style={{ color: ORANGE, fontSize: '42px', fontWeight: 700 }}>{tasksCompleted}</span>
                <span style={{ color: TEXT_DIM, fontSize: '14px' }}>TASKS DONE</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 32px', border: `1px solid ${BORDER}`, borderRadius: '8px' }}>
                <span style={{ color: GREEN, fontSize: '42px', fontWeight: 700 }}>{habits}</span>
                <span style={{ color: TEXT_DIM, fontSize: '14px' }}>HABITS HIT</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 32px', border: `1px solid ${BORDER}`, borderRadius: '8px' }}>
                <span style={{ color: '#a78bfa', fontSize: '42px', fontWeight: 700 }}>{goalsHit}</span>
                <span style={{ color: TEXT_DIM, fontSize: '14px' }}>GOALS</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 32px', border: `1px solid ${BORDER}`, borderRadius: '8px' }}>
                <span style={{ color: '#f59e0b', fontSize: '42px', fontWeight: 700 }}>{streak}</span>
                <span style={{ color: TEXT_DIM, fontSize: '14px' }}>STREAK</span>
              </div>
            </div>

            {/* Name + brand */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '40px' }}>
              <span style={{ color: TEXT, fontSize: '22px' }}>{name}</span>
              <span style={{ color: TEXT_DIM }}>·</span>
              <span style={{ color: ORANGE, fontSize: '22px' }}>resurgo.life</span>
            </div>
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    );
  }

  // ── Coach Introduction Card ────────────────────────────────────────
  const COACH_EMOJIS: Record<string, string> = {
    MARCUS: '🏛️', AURORA: '🎨', TITAN: '⚔️',
    PHOENIX: '🔥', NEXUS: '∞',
  };
  const COACH_TITLES: Record<string, string> = {
    MARCUS: 'Stoic Discipline Engine', AURORA: 'Creative Flow Catalyst',
    TITAN: 'Physical Performance Coach',
    PHOENIX: 'Recovery & Resilience Specialist', NEXUS: 'Neural Integration Engine',
  };

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200',
          height: '630',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: BG,
          fontFamily: '"JetBrains Mono", monospace',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '1120',
            height: '550',
            border: `2px solid ${ORANGE}`,
            borderRadius: '12px',
            background: BG_CARD,
            padding: '40px',
          }}
        >
          <div style={{ display: 'flex', fontSize: '80px' }}>{COACH_EMOJIS[coach] || '🤖'}</div>
          <div style={{ display: 'flex', color: ORANGE, fontSize: '52px', fontWeight: 800, marginTop: '12px' }}>
            {coach}
          </div>
          <div style={{ display: 'flex', color: TEXT, fontSize: '24px', marginTop: '8px' }}>
            {COACH_TITLES[coach] || 'AI Coach'}
          </div>
          <div style={{ display: 'flex', color: TEXT_DIM, fontSize: '18px', marginTop: '24px', textAlign: 'center', maxWidth: '800px' }}>
            {subtitle || `Meet your personal AI coach on Resurgo — the life OS that turns goals into daily execution.`}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '32px' }}>
            <span style={{ color: ORANGE, fontSize: '24px', fontWeight: 700 }}>resurgo.life</span>
            <span style={{ color: TEXT_DIM, fontSize: '18px' }}>· Free forever</span>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
