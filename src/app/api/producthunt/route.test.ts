/** @jest-environment node */

export {};

import { NextRequest } from 'next/server';
import { getPostComments, getProductByName } from '@/lib/api/producthunt';

jest.mock('@/lib/api/producthunt', () => ({
  getProductByName: jest.fn(),
  getPostComments: jest.fn(),
}));

const mockGetProductByName = getProductByName as jest.MockedFunction<typeof getProductByName>;
const mockGetPostComments = getPostComments as jest.MockedFunction<typeof getPostComments>;

const asNextRequest = (url: string) => new NextRequest(url);

describe('/api/producthunt route', () => {
  beforeEach(() => {
    mockGetProductByName.mockReset();
    mockGetPostComments.mockReset();
  });

  it('returns product data for the default slug', async () => {
    mockGetProductByName.mockResolvedValueOnce({
      id: 1,
      name: 'Resurgo',
      tagline: 'Execution OS',
      description: 'AI planner',
      url: 'https://www.producthunt.com/posts/resurgo',
      redirect_url: 'https://resurgo.life',
      votes_count: 42,
      comments_count: 7,
      created_at: '2026-05-20T00:00:00.000Z',
      updated_at: '2026-05-20T00:00:00.000Z',
      maker: {
        id: 1,
        name: 'Maker',
        username: 'maker',
        headline: null,
        website_url: null,
        twitter_username: null,
        avatar_url: { URL: '', '80': '', '640': '' },
      },
      media: { images: [], video: null },
      topics: { nodes: [] },
      thumbnail: { URL: '', '80': '', '640': '' },
    });

    const { GET } = await import('./route');
    const response = await GET(asNextRequest('http://localhost/api/producthunt'));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(mockGetProductByName).toHaveBeenCalledWith('resurgo');
    expect(body.product?.name).toBe('Resurgo');
    expect(response.headers.get('Cache-Control')).toContain('s-maxage=300');
  });

  it('returns comment data when comments mode is requested', async () => {
    mockGetPostComments.mockResolvedValueOnce([
      {
        id: 10,
        body: 'Nice launch',
        created_at: '2026-05-20T00:00:00.000Z',
        votes_count: 3,
        user: {
          id: 1,
          name: 'Tester',
          username: 'tester',
          headline: null,
          website_url: null,
          twitter_username: null,
          avatar_url: { URL: '', '80': '', '640': '' },
        },
      },
    ]);

    const { GET } = await import('./route');
    const response = await GET(asNextRequest('http://localhost/api/producthunt?mode=comments&postId=123&limit=5'));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(mockGetPostComments).toHaveBeenCalledWith(123, 5);
    expect(body.comments).toHaveLength(1);
  });

  it('rejects invalid comment requests', async () => {
    const { GET } = await import('./route');
    const response = await GET(asNextRequest('http://localhost/api/producthunt?mode=comments&postId=abc'));
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toMatch(/postId/i);
  });
});
