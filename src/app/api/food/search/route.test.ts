/** @jest-environment node */

export {};

// ── Mocks ──────────────────────────────────────────────────────────────────
const mockFetch = jest.fn();
global.fetch = mockFetch as unknown as typeof fetch;

// ── Helper builders ────────────────────────────────────────────────────────

function makeOFFResponse(products: unknown[]) {
  return {
    ok: true,
    json: async () => ({ products }),
  };
}

function makeOFFProduct(overrides: Record<string, unknown> = {}) {
  return {
    product_name: 'Banana',
    brands: 'Chiquita',
    nutriments: {
      'energy-kcal_100g': 89,
      proteins_100g: 1.1,
      carbohydrates_100g: 23,
      fat_100g: 0.3,
      fiber_100g: 2.6,
      sugars_100g: 12,
      sodium_100g: 0.001,
    },
    serving_size: '118g',
    image_thumb_url: 'https://example.com/banana.jpg',
    code: '01234567',
    id: 'off_01234567',
    ...overrides,
  };
}

// ── Tests ──────────────────────────────────────────────────────────────────
describe('/api/food/search route', () => {
  beforeEach(() => {
    jest.resetModules();
    mockFetch.mockReset();
    delete process.env.USDA_FOODDATA_API_KEY;
  });

  it('returns 400 when query is missing', async () => {
    const { GET } = await import('./route');
    const req = new Request('http://localhost/api/food/search') as any;
    const res = await GET(req);
    const body = await res.json();
    expect(res.status).toBe(400);
    expect(body.error).toBeDefined();
  });

  it('returns 400 when query is too short (1 char)', async () => {
    const { GET } = await import('./route');
    const req = new Request('http://localhost/api/food/search?q=a') as any;
    const res = await GET(req);
    const body = await res.json();
    expect(res.status).toBe(400);
  });

  it('returns results from OpenFoodFacts for a valid query', async () => {
    mockFetch.mockResolvedValueOnce(makeOFFResponse([makeOFFProduct()]));

    const { GET } = await import('./route');
    const req = new Request('http://localhost/api/food/search?q=banana&source=off') as any;
    const res = await GET(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.results).toHaveLength(1);
    expect(body.results[0].name).toBe('Banana');
    expect(body.results[0].calories).toBe(89);
    expect(body.results[0].source).toBe('openfoodfacts');
  });

  it('filters out OFF products with no product_name', async () => {
    const noName = { ...makeOFFProduct(), product_name: '' };
    mockFetch.mockResolvedValueOnce(makeOFFResponse([noName, makeOFFProduct()]));

    const { GET } = await import('./route');
    const req = new Request('http://localhost/api/food/search?q=banana&source=off') as any;
    const res = await GET(req);
    const body = await res.json();

    expect(body.results).toHaveLength(1);
  });

  it('returns empty results when OFF fetch fails', async () => {
    mockFetch.mockRejectedValueOnce(new Error('network error'));

    const { GET } = await import('./route');
    const req = new Request('http://localhost/api/food/search?q=banana&source=off') as any;
    const res = await GET(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.results).toEqual([]);
  });

  it('skips USDA when no API key is set', async () => {
    // Only OFF call should be made (USDA skipped with no key)
    mockFetch.mockResolvedValueOnce(makeOFFResponse([]));

    const { GET } = await import('./route');
    const req = new Request('http://localhost/api/food/search?q=chicken') as any;
    await GET(req);

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch.mock.calls[0][0]).toContain('openfoodfacts');
  });

  it('deduplicates results when searching both sources', async () => {
    process.env.USDA_FOODDATA_API_KEY = 'test_key';

    const offProduct = makeOFFProduct({ product_name: 'Whole Milk' });
    const usdaFood = {
      fdcId: 1001,
      description: 'Whole Milk', // Same name → should be deduplicated
      brandOwner: 'USDA',
      foodNutrients: [
        { nutrientId: 1008, value: 61 },
        { nutrientId: 1003, value: 3.2 },
        { nutrientId: 1005, value: 4.8 },
        { nutrientId: 1004, value: 3.3 },
      ],
    };

    mockFetch
      .mockResolvedValueOnce(makeOFFResponse([offProduct]))
      .mockResolvedValueOnce({ ok: true, json: async () => ({ foods: [usdaFood] }) });

    const { GET } = await import('./route');
    const req = new Request('http://localhost/api/food/search?q=whole+milk') as any;
    const res = await GET(req);
    const body = await res.json();

    // Both have "whole milk" prefix → deduplicated
    expect(body.results.length).toBeLessThanOrEqual(1);
    delete process.env.USDA_FOODDATA_API_KEY;
  });

  it('handles barcode lookup and returns the product', async () => {
    const barcodeData = {
      status: 1,
      product: makeOFFProduct({ code: '5000112637922' }),
    };
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => barcodeData });

    const { GET } = await import('./route');
    const req = new Request('http://localhost/api/food/search?barcode=5000112637922') as any;
    const res = await GET(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.results).toHaveLength(1);
    expect(body.results[0].barcode).toBe('5000112637922');
  });

  it('returns empty results when barcode is not found', async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => ({ status: 0, product: null }) });

    const { GET } = await import('./route');
    const req = new Request('http://localhost/api/food/search?barcode=0000000000000') as any;
    const res = await GET(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.results).toEqual([]);
  });

  it('includes correct nutrient fields in parseOFFProduct output', async () => {
    const product = makeOFFProduct();
    mockFetch.mockResolvedValueOnce(makeOFFResponse([product]));

    const { GET } = await import('./route');
    const req = new Request('http://localhost/api/food/search?q=banana&source=off') as any;
    const res = await GET(req);
    const body = await res.json();

    const item = body.results[0];
    expect(typeof item.protein).toBe('number');
    expect(typeof item.carbs).toBe('number');
    expect(typeof item.fat).toBe('number');
    expect(item.fiber).toBeDefined();
    expect(item.sugar).toBeDefined();
    expect(item.sodium).toBeDefined();
    expect(item.serving).toBe('118g');
    expect(item.image).toBe('https://example.com/banana.jpg');
  });
});
