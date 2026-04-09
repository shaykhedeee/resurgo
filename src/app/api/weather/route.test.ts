/** @jest-environment node */

export {};

jest.mock('@clerk/nextjs/server', () => ({
  auth: jest.fn(async () => ({ userId: 'test_user_123' })),
}));

const mockFetch = jest.fn();
global.fetch = mockFetch as unknown as typeof fetch;

const MOCK_WEATHER_RESPONSE = {
  current_condition: [
    {
      temp_C: '18',
      temp_F: '64',
      weatherDesc: [{ value: 'Partly cloudy' }],
      humidity: '72',
      windspeedKmph: '15',
      FeelsLikeC: '17',
    },
  ],
  nearest_area: [
    {
      areaName: [{ value: 'London' }],
      country: [{ value: 'United Kingdom' }],
    },
  ],
  weather: [],
};

describe('/api/weather route', () => {
  beforeEach(() => {
    jest.resetModules();
    mockFetch.mockReset();
  });

  it('returns weather data for a valid location', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => MOCK_WEATHER_RESPONSE,
    });

    const { GET } = await import('./route');
    const req = new Request('http://localhost/api/weather?q=London') as any;
    const res = await GET(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.current_condition).toBeDefined();
    expect(body.nearest_area).toBeDefined();
  });

  it('passes location through to wttr.in', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => MOCK_WEATHER_RESPONSE,
    });

    const { GET } = await import('./route');
    const req = new Request('http://localhost/api/weather?q=New+York') as any;
    await GET(req);

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('New%20York'),
      expect.any(Object)
    );
  });

  it('uses "auto" when no location query param is provided', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => MOCK_WEATHER_RESPONSE,
    });

    const { GET } = await import('./route');
    const req = new Request('http://localhost/api/weather') as any;
    await GET(req);

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/auto?'),
      expect.any(Object)
    );
  });

  it('returns 502 when upstream weather service returns an error', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 503, json: async () => ({}) });

    const { GET } = await import('./route');
    const req = new Request('http://localhost/api/weather?q=London') as any;
    const res = await GET(req);
    const body = await res.json();

    expect(res.status).toBe(502);
    expect(body.error).toBeDefined();
  });

  it('returns 500 when fetch throws a network error', async () => {
    mockFetch.mockRejectedValueOnce(new Error('network timeout'));

    const { GET } = await import('./route');
    const req = new Request('http://localhost/api/weather?q=London') as any;
    const res = await GET(req);
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.error).toBeDefined();
  });

  it('sets cache-control header on successful response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => MOCK_WEATHER_RESPONSE,
    });

    const { GET } = await import('./route');
    const req = new Request('http://localhost/api/weather?q=Paris') as any;
    const res = await GET(req);

    expect(res.headers.get('Cache-Control')).toContain('s-maxage=3600');
  });
});
