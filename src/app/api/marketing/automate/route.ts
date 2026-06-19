// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO :: Marketing Automation Cron Dispatcher
// Automates: Twitter, LinkedIn, Reddit, and Instagram posting on a schedule.
// Uses OpenAI to dynamically generate highly engaging, authentic content.
// Triggered via Vercel Cron.
// ═══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const ADMIN_SECRET = process.env.ADMIN_SECRET || '';

function authorize(request: NextRequest): boolean {
  const cronSecret = process.env.CRON_SECRET;
  const adminSecretEnv = process.env.ADMIN_SECRET;
  const authHeader = request.headers.get('authorization');
  const adminHeader = request.headers.get('x-admin-secret');

  if (cronSecret && authHeader === `Bearer ${cronSecret}`) return true;
  if (adminSecretEnv && adminHeader === adminSecretEnv) return true;

  // Allow in development/preview if not explicitly blocked
  return process.env.NODE_ENV !== 'production';
}

export async function POST(request: NextRequest) {
  return handleAutomate(request);
}

export async function GET(request: NextRequest) {
  return handleAutomate(request);
}

async function handleAutomate(request: NextRequest): Promise<NextResponse> {
  if (!authorize(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const dryRunParam = searchParams.get('dryRun');
  
  // Parse body if present, fallback to empty object
  let body: any = {};
  if (request.method === 'POST') {
    body = await request.json().catch(() => ({}));
  }

  // dryRun is true by default to prevent accidental live postings during testing
  const dryRun = dryRunParam === 'false' || body.dryRun === false ? false : true;
  const requestedPlatform = searchParams.get('platform') || body.platform || 'all';
  const requestedAction = searchParams.get('action') || body.action || 'post';

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  
  const results: Record<string, any> = {};

  // Initialize OpenAI or fallback to Groq if OpenAI key is mock
  const hasOpenAI = process.env.OPENAI_API_KEY && !process.env.OPENAI_API_KEY.startsWith('SET_REAL');
  const hasGroq = process.env.GROQ_API_KEY && !process.env.GROQ_API_KEY.startsWith('SET_REAL');

  const openai = hasOpenAI
    ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    : hasGroq
      ? new OpenAI({ apiKey: process.env.GROQ_API_KEY, baseURL: 'https://api.groq.com/openai/v1' })
      : null;

  const modelName = hasOpenAI ? 'gpt-4o-mini' : 'llama-3.3-70b-versatile';

  // scouting automation flow (backlinks and PR replies)
  if (requestedAction === 'scout') {
    if (!openai) {
      return NextResponse.json({ error: 'Neither OpenAI nor Groq API key is configured for AI scouting replies' }, { status: 503 });
    }

    // 1. Twitter Scouting
    const isTwitterConfigured = !!(process.env.TWITTER_CONSUMER_KEY && process.env.TWITTER_ACCESS_TOKEN && process.env.TWITTER_BEARER_TOKEN);
    if (isTwitterConfigured && (requestedPlatform === 'all' || requestedPlatform === 'twitter')) {
      try {
        const query = '"habit streak fatigue" OR "ADHD planner" OR "streak fatigue" OR "habit app ADHD" OR "monday productivity restart"';
        const searchRes = await fetch(`${baseUrl}/api/marketing/twitter`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${ADMIN_SECRET}`,
          },
          body: JSON.stringify({ action: 'search', searchQuery: query }),
        });

        const searchData = await searchRes.json().catch(() => ({}));
        let tweets = searchData.results || [];
        
        let simulated = false;
        if (tweets.length === 0) {
          console.log('[Twitter Scout] No results or auth failed. Using simulation fallback.');
          tweets = [
            {
              id: 'sim_tweet_1',
              text: "Genuinely hate streak-based habit apps. I missed one day of journaling due to a long work shift, and now my 45-day streak is gone and I feel like a total failure. Any app that doesn't punish you?"
            },
            {
              id: 'sim_tweet_2',
              text: "Need a planner for ADHD. Every habit app is either too bloated with icons or too rigid. I just want a simple brain dump that helps me focus on 3 things a day without guilt."
            },
            {
              id: 'sim_tweet_3',
              text: "Every Monday is the same: I plan my entire week, stack 10 habits, and by Wednesday I'm exhausted and restart. How do people stay consistent?"
            }
          ];
          simulated = true;
        }

        results.twitterScout = { foundCount: tweets.length, simulated, replies: [] };

        for (const tweet of tweets.slice(0, 3)) {
          const tweetText = tweet.text;
          const tweetId = tweet.id;

          const completion = await openai.chat.completions.create({
            model: modelName,
            temperature: 0.7,
            response_format: { type: 'json_object' },
            messages: [
              {
                role: 'system',
                content: `You are an empathetic community builder representing Resurgo (resurgo.life). A user posted a tweet about habit struggles, ADHD, or productivity issues. Write a highly helpful, contextual, and completely non-salesy reply. Under 280 characters. Give genuine advice first. Mention Resurgo (resurgo.life) or its unique approach (phoenix coach restart recovery, streak freeze grace days) only if it naturally fits the context. Avoid all marketing buzzwords, emojis overload, and pushy sales copy. Write like a normal human developer/builder who wants to help. Return valid JSON only with format: { "reply": "your reply text here" }`
              },
              {
                role: 'user',
                content: `Analyze this tweet: "${tweetText}" and draft a reply.`
              }
            ]
          });

          const data = JSON.parse(completion.choices[0]?.message.content || '{}');
          if (data.reply) {
            const replyRes = await fetch(`${baseUrl}/api/marketing/twitter`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${ADMIN_SECRET}`,
              },
              body: JSON.stringify({
                action: 'tweet',
                text: data.reply,
                replyToId: tweetId,
                dryRun,
              }),
            });

            results.twitterScout.replies.push({
              tweetId,
              originalText: tweetText,
              draftedReply: data.reply,
              postResult: await replyRes.json().catch(() => ({})),
            });
          }
        }
      } catch (err: any) {
        results.twitterScout = { error: err.message };
      }
    } else if (requestedPlatform === 'twitter') {
      results.twitterScout = { error: 'Twitter keys not fully configured for search/post' };
    }

    // 2. Reddit Scouting
    const isRedditConfigured = !!(process.env.REDDIT_CLIENT_ID && process.env.REDDIT_CLIENT_SECRET && process.env.REDDIT_USERNAME && process.env.REDDIT_PASSWORD);
    if (isRedditConfigured && (requestedPlatform === 'all' || requestedPlatform === 'reddit')) {
      try {
        const subreddits = ['productivity', 'getdisciplined', 'HabitTracker'];
        const query = 'streak fatigue OR ADHD planner OR habit spiral OR restart monday';
        results.redditScout = { replies: [] };

        for (const sub of subreddits) {
          const searchRes = await fetch(`${baseUrl}/api/marketing/reddit`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-admin-secret': ADMIN_SECRET,
            },
            body: JSON.stringify({ action: 'search', subreddit: sub, query }),
          });

          const searchData = await searchRes.json().catch(() => ({}));
          let posts = searchData.results || [];
          
          let simulated = false;
          if (posts.length === 0) {
            console.log(`[Reddit Scout] No results or auth failed in r/${sub}. Using simulation fallback.`);
            if (sub === 'productivity') {
              posts = [{
                id: 't3_sim_prod_1',
                title: 'Struggling with the Monday restart cycle. How to break it?',
                text: 'Every Sunday night I get super motivated. I plan my week, clean my desk, and promise myself this is the week. Then Wednesday hits, I miss a couple of goals, and I tell myself "I\'ll just restart next Monday." I\'ve been in this loop for 6 months. How do I build a system that doesn\'t let me quit?',
                author: 'productivity_struggler'
              }];
            } else if (sub === 'getdisciplined') {
              posts = [{
                id: 't3_sim_disc_1',
                title: 'Streak fatigue is real. Habit tracking is giving me anxiety.',
                text: 'I have been tracking my habits on an app for a few months. But I notice that the streak number has become a source of stress. When I miss a day, I feel so much shame that I avoid the app for a week. Is there any habit tracker that allows grace days or adapts to your energy levels?',
                author: 'disciplined_mind'
              }];
            } else if (sub === 'HabitTracker') {
              posts = [{
                id: 't3_sim_habit_1',
                title: 'ADHD friendly habit tracker with simple UI?',
                text: 'I need a habit tracker that is minimal and keyboard-friendly, preferably with a terminal look or simple dashboard. Most apps have too much gamification or colors that distract me. Also, I need something that helps with habit stacking. Any recommendations?',
                author: 'adhd_builder'
              }];
            }
            simulated = true;
          }

          if (simulated) {
            results.redditScout.simulated = true;
          }

          const targetPost = posts.find((p: any) => p.author !== process.env.REDDIT_USERNAME);
          if (targetPost) {
            const postTitle = targetPost.title;
            const postText = targetPost.text;
            const postId = targetPost.id;

            const completion = await openai.chat.completions.create({
              model: modelName,
              temperature: 0.7,
              response_format: { type: 'json_object' },
              messages: [
                {
                  role: 'system',
                  content: `You are an active, helpful Reddit community member. Write a response to a post titled "${postTitle}" with body: "${postText.substring(0, 1000)}". Your response must be highly empathetic, detailed, and directly answer/address their struggle. Mention Resurgo (resurgo.life) contextually as a product you built/use to address these specific struggles (like the restart shame cycle, rigid streak trackers, or ADHD executive dysfunction) only if it makes sense. Do NOT sound like an ad. Speak like a friend. Return valid JSON only with format: { "reply": "your markdown formatted comment here" }`
                },
                {
                  role: 'user',
                  content: 'Draft a helpful Reddit comment reply.'
                }
              ]
            });

            const data = JSON.parse(completion.choices[0]?.message.content || '{}');
            if (data.reply) {
              const commentRes = await fetch(`${baseUrl}/api/marketing/reddit`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'x-admin-secret': ADMIN_SECRET,
                },
                body: JSON.stringify({
                  action: 'comment',
                  thingId: postId,
                  text: data.reply,
                  dryRun,
                }),
              });

              results.redditScout.replies.push({
                subreddit: sub,
                postId,
                postTitle,
                draftedReply: data.reply,
                commentResult: await commentRes.json().catch(() => ({})),
              });
            }
          }
        }
      } catch (err: any) {
        results.redditScout = { error: err.message };
      }
    } else if (requestedPlatform === 'reddit') {
      results.redditScout = { error: 'Reddit keys not configured' };
    }

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      dryRun,
      requestedAction,
      requestedPlatform,
      results,
    });
  }


  // 1. Twitter posting automation
  const isTwitterConfigured = !!(process.env.TWITTER_CONSUMER_KEY && process.env.TWITTER_ACCESS_TOKEN);
  if (isTwitterConfigured && (requestedPlatform === 'all' || requestedPlatform === 'twitter')) {
    try {
      let payload: any = {};
      const isThread = Math.random() < 0.4;

      if (openai) {
        if (isThread) {
          const completion = await openai.chat.completions.create({
            model: modelName,
            temperature: 0.75,
            response_format: { type: 'json_object' },
            messages: [
              {
                role: 'system',
                content: 'You are an elite Twitter marketer for Resurgo.life (AI life OS, habit tracker, focus session, 5 AI coaches). Generate a high-value Twitter thread of 4 to 6 tweets. Each tweet must be strictly under 280 characters. The final tweet must be a strong call-to-action to resurgo.life. Return valid JSON only with format: { "tweets": ["tweet1", "tweet2", ...] }'
              },
              {
                role: 'user',
                content: 'Write a thread about productivity systems, habit loops, or how standard streak trackers cause shame spirals.'
              }
            ]
          });
          const data = JSON.parse(completion.choices[0]?.message.content || '{}');
          if (Array.isArray(data.tweets) && data.tweets.length > 0) {
            payload = { action: 'thread', threadTweets: data.tweets, dryRun };
          }
        } else {
          const completion = await openai.chat.completions.create({
            model: modelName,
            temperature: 0.7,
            response_format: { type: 'json_object' },
            messages: [
              {
                role: 'system',
                content: 'You are an elite Twitter marketer for Resurgo.life (AI life OS, habit tracker, focus session, 5 AI coaches). Generate a single engaging tweet. It must be strictly under 280 characters and include "resurgo.life". Avoid generic corporate marketing speak; write with a clean, builder, developer, or stoic tone. Return valid JSON only with format: { "tweet": "your tweet text here" }'
              },
              {
                role: 'user',
                content: 'Write a tweet about productivity, daily execution, or habit stacking.'
              }
            ]
          });
          const data = JSON.parse(completion.choices[0]?.message.content || '{}');
          if (data.tweet) {
            payload = { action: 'tweet', text: data.tweet, dryRun };
          }
        }
      }

      // Fallback to static templates if OpenAI fails or is not configured
      if (!payload.action) {
        payload = isThread
          ? { action: 'thread', dryRun }
          : { action: 'tweet', templateType: Math.random() < 0.5 ? 'product_launch' : 'engagement', dryRun };
      }

      const res = await fetch(`${baseUrl}/api/marketing/twitter`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ADMIN_SECRET}`,
        },
        body: JSON.stringify(payload),
      });

      results.twitter = {
        status: res.status,
        data: await res.json().catch(() => ({})),
      };
    } catch (err: any) {
      results.twitter = { error: err.message };
    }
  } else if (requestedPlatform === 'twitter') {
    results.twitter = { error: 'Twitter keys not configured' };
  }

  // 2. LinkedIn posting automation
  const isLinkedinConfigured = !!(process.env.LINKEDIN_ACCESS_TOKEN && process.env.LINKEDIN_PERSON_URN);
  if (isLinkedinConfigured && (requestedPlatform === 'all' || requestedPlatform === 'linkedin')) {
    try {
      let payload: any = { action: 'post', dryRun };

      if (openai) {
        const completion = await openai.chat.completions.create({
          model: modelName,
          temperature: 0.7,
          response_format: { type: 'json_object' },
          messages: [
            {
              role: 'system',
              content: 'You are an experienced startup founder writing a personal post on LinkedIn. Write a value-first, authentic update about building Resurgo.life (AI life OS, habit stacking, daily planning) or tips on productivity systems for founders. Must feel genuine and include "resurgo.life" near the end. Return valid JSON only with format: { "post": "your post text here" }'
            },
            {
              role: 'user',
              content: 'Write a professional but direct post about startup discipline or productivity habits.'
            }
          ]
        });
        const data = JSON.parse(completion.choices[0]?.message.content || '{}');
        if (data.post) {
          payload.text = data.post;
        }
      }

      // Fallback to static templates if OpenAI fails or is not configured
      if (!payload.text) {
        const templates = ['founder_story', 'value_post', 'milestone'];
        payload.templateType = templates[Math.floor(Math.random() * templates.length)];
      }

      const res = await fetch(`${baseUrl}/api/marketing/linkedin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ADMIN_SECRET}`,
        },
        body: JSON.stringify(payload),
      });

      results.linkedin = {
        status: res.status,
        data: await res.json().catch(() => ({})),
      };
    } catch (err: any) {
      results.linkedin = { error: err.message };
    }
  } else if (requestedPlatform === 'linkedin') {
    results.linkedin = { error: 'LinkedIn keys not configured' };
  }

  // 3. Reddit posting automation
  const isRedditConfigured = !!process.env.REDDIT_CLIENT_ID;
  if (isRedditConfigured && (requestedPlatform === 'all' || requestedPlatform === 'reddit')) {
    try {
      const subs = ['productivity', 'getdisciplined', 'HabitTracker'];
      const subreddit = subs[Math.floor(Math.random() * subs.length)];
      let payload: any = { subreddit, dryRun };

      if (openai) {
        const completion = await openai.chat.completions.create({
          model: modelName,
          temperature: 0.8,
          response_format: { type: 'json_object' },
          messages: [
            {
              role: 'system',
              content: `You are an active Reddit community member posting to r/${subreddit}. Write a highly authentic, vulnerability-driven post detailing a personal struggle with productivity loops (e.g. the Monday restart cycle) and how you built Resurgo (resurgo.life) as an open-source/developer life OS with grace days, habit stacking, and AI coaching. Ask for feedback. DO NOT make it read like an advertisement. Avoid salesy copy. Return valid JSON only with format: { "title": "post title here", "text": "post body text here" }`
            },
            {
              role: 'user',
              content: 'Generate a post expressing frustration with generic planners and introducing Resurgo for feedback.'
            }
          ]
        });
        const data = JSON.parse(completion.choices[0]?.message.content || '{}');
        if (data.title && data.text) {
          payload.customTitle = data.title;
          payload.customText = data.text;
        }
      }

      const res = await fetch(`${baseUrl}/api/marketing/reddit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-secret': ADMIN_SECRET,
        },
        body: JSON.stringify(payload),
      });

      results.reddit = {
        status: res.status,
        data: await res.json().catch(() => ({})),
      };
    } catch (err: any) {
      results.reddit = { error: err.message };
    }
  } else if (requestedPlatform === 'reddit') {
    results.reddit = { error: 'Reddit keys not configured' };
  }

  // 4. Instagram posting automation
  const isInstagramConfigured = !!(process.env.INSTAGRAM_ACCESS_TOKEN && process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID);
  if (isInstagramConfigured && (requestedPlatform === 'all' || requestedPlatform === 'instagram')) {
    try {
      const res = await fetch(`${baseUrl}/api/marketing/instagram`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ADMIN_SECRET}`,
        },
        body: JSON.stringify({
          action: 'publish',
          templateType: 'product_showcase',
          imageUrl: `${baseUrl}/og-image.png`,
          dryRun,
        }),
      });

      results.instagram = {
        status: res.status,
        data: await res.json().catch(() => ({})),
      };
    } catch (err: any) {
      results.instagram = { error: err.message };
    }
  } else if (requestedPlatform === 'instagram') {
    results.instagram = { error: 'Instagram keys not configured' };
  }

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    dryRun,
    requestedPlatform,
    results,
  });
}
