/** @jest-environment node */

export {};

jest.mock('@clerk/nextjs/server', () => ({
  auth: jest.fn(async () => ({ userId: 'test_user_123' })),
}));

const mockFetch = jest.fn();
global.fetch = mockFetch as unknown as typeof fetch;

// Mock environment variable
process.env.VITE_OPENWEATHER_API_KEY = 'test_api_key';

// OpenWeatherMap API response format
const MOCK_OWM_RESPONSE = {
  coord: { lat: 51.51, lon: -0.13 },
  weather: [
    {
      id: 803,
      main: 'Clouds',
      description: 'broken clouds',
      icon: '04d',
    },
  ],
  main: {
    temp: 18,
    feels_like: 17,
    humidity: 72,
    pressure: 1012,
  },
  wind: {
    speed: 4.2,
  },
  visibility: 10000,
  sys: {
    country: 'GB',
    sunrise: 1606136000,
    sunset: 1606172400,
  },
  name: 'London',
};

describe('/api/weather route', () => {
  beforeEach(() => {
    jest.resetModules();
    mockFetch.mockReset();
  });

  afterAll(() => {
    delete process.env.VITE_OPENWEATHER_API_KEY;
  });

  it('returns weather data for a valid location', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => MOCK_OWM_RESPONSE,
    });

    const { GET } = await import('./route');
    const req = new Request('http://localhost/api/weather?q=London') as any;
    const res = await GET(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.current_condition).toBeDefined();
    expect(body.nearest_area).toBeDefined();
    expect(body.current_condition[0].temp_C).toBe(18);
    expect(body.current_condition[0].weatherDesc[0].value).toBe('Clouds');
  });

  it('passes location through to OpenWeatherMap', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => MOCK_OWM_RESPONSE,
    });

    const { GET } = await import('./route');
    const req = new Request('http://localhost/api/weather?q=New+York') as any;
    await GET(req);

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('New%20York'),
      expect.any(Object)
    );
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('api.openweathermap.org'),
      expect.any(Object)
    );
  });

  it('uses IP geolocation when no location query param is provided', async () => {
    // First fetch for ipapi.co (geolocation)
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ latitude: 51.51, longitude: -0.13 }),
    });
    // Second fetch for OpenWeatherMap
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => MOCK_OWM_RESPONSE,
    });

    const { GET } = await import('./route');
    const req = new Request('http://localhost/api/weather') as any;
    await GET(req);

    expect(mockFetch).toHaveBeenNthCalledWith(
      1,
      'https://ipapi.co/json/',
      expect.any(Object)
    );
    expect(mockFetch).toHaveBeenNthCalledWith(
      2,
      expect.stringContaining('api.openweathermap.org'),
      expect.any(Object)
    );
  });

  it('returns upstream status when weather API returns an error', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 503,
      statusText: 'Service Unavailable',
      json: async () => ({})
    });

    const { GET } = await import('./route');
    const req = new Request('http://localhost/api/weather?q=London') as any;
    const res = await GET(req);
    const body = await res.json();

    expect(res.status).toBe(503);
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
      json: async () => MOCK_OWM_RESPONSE,
    });

    const { GET } = await import('./route');
    const req = new Request('http://localhost/api/weather?q=Paris') as any;
    const res = await GET(req);

    expect(res.headers.get('Cache-Control')).toContain('s-maxage=600');
  });
});