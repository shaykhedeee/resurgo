/** @jest-environment node */

export {};

const mockFetch = jest.fn();
global.fetch = mockFetch as unknown as typeof fetch;

function makeMealDBMeal(overrides: Record<string, unknown> = {}) {
  const base: Record<string, unknown> = {
    idMeal: '52772',
    strMeal: 'Teriyaki Chicken Casserole',
    strCategory: 'Chicken',
    strArea: 'Japanese',
    strInstructions: 'Cook chicken with teriyaki sauce...',
    strMealThumb: 'https://example.com/teriyaki.jpg',
    strTags: 'Chicken,Casserole',
    strYoutube: 'https://youtube.com/watch?v=test',
    strIngredient1: 'Chicken',
    strMeasure1: '1kg',
    strIngredient2: 'Soy Sauce',
    strMeasure2: '3 tbsp',
    strIngredient3: '',
    strMeasure3: '',
    ...overrides,
  };
  return base;
}

function makeMealDBResponse(meals: unknown[] | null) {
  return { ok: true, json: async () => ({ meals }) };
}

describe('/api/food/recipes route', () => {
  beforeEach(() => {
    jest.resetModules();
    mockFetch.mockReset();
    delete process.env.SPOONACULAR_API_KEY;
  });

  it('returns 400 when no query or category provided', async () => {
    const { GET } = await import('./route');
    const req = new Request('http://localhost/api/food/recipes') as any;
    const res = await GET(req);
    const body = await res.json();
    expect(res.status).toBe(400);
    expect(body.error).toBeDefined();
  });

  it('returns MealDB results for a valid search query', async () => {
    mockFetch.mockResolvedValueOnce(makeMealDBResponse([makeMealDBMeal()]));

    const { GET } = await import('./route');
    const req = new Request('http://localhost/api/food/recipes?q=teriyaki') as any;
    const res = await GET(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.results).toHaveLength(1);
    expect(body.results[0].name).toBe('Teriyaki Chicken Casserole');
    expect(body.results[0].source).toBe('mealdb');
    expect(body.results[0].id).toBe('mdb_52772');
  });

  it('parses MealDB ingredients correctly (stops at empty ingredient slots)', async () => {
    mockFetch.mockResolvedValueOnce(makeMealDBResponse([makeMealDBMeal()]));

    const { GET } = await import('./route');
    const req = new Request('http://localhost/api/food/recipes?q=teriyaki') as any;
    const res = await GET(req);
    const body = await res.json();

    const recipe = body.results[0];
    expect(recipe.ingredients).toHaveLength(2);
    expect(recipe.ingredients[0]).toEqual({ name: 'Chicken', measure: '1kg' });
    expect(recipe.ingredients[1]).toEqual({ name: 'Soy Sauce', measure: '3 tbsp' });
  });

  it('parses MealDB tags as an array', async () => {
    mockFetch.mockResolvedValueOnce(makeMealDBResponse([makeMealDBMeal()]));

    const { GET } = await import('./route');
    const req = new Request('http://localhost/api/food/recipes?q=teriyaki') as any;
    const res = await GET(req);
    const body = await res.json();

    expect(body.results[0].tags).toEqual(['Chicken', 'Casserole']);
  });

  it('returns empty results when MealDB returns null meals', async () => {
    mockFetch.mockResolvedValueOnce(makeMealDBResponse(null));

    const { GET } = await import('./route');
    const req = new Request('http://localhost/api/food/recipes?q=xyz123notreal') as any;
    const res = await GET(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.results).toEqual([]);
  });

  it('returns empty results when MealDB fetch throws', async () => {
    mockFetch.mockRejectedValueOnce(new Error('network error'));

    const { GET } = await import('./route');
    const req = new Request('http://localhost/api/food/recipes?q=chicken') as any;
    const res = await GET(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.results).toEqual([]);
  });

  it('filters by category when only category param is given', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        meals: [
          { idMeal: '1', strMeal: 'Pasta Bolognese', strMealThumb: 'https://example.com/pasta.jpg' },
          { idMeal: '2', strMeal: 'Spaghetti', strMealThumb: 'https://example.com/spag.jpg' },
        ],
      }),
    });

    const { GET } = await import('./route');
    const req = new Request('http://localhost/api/food/recipes?category=Pasta') as any;
    const res = await GET(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.results.length).toBeGreaterThanOrEqual(1);
    expect(body.results[0].source).toBe('mealdb');
  });

  it('returns a random meal when random=true', async () => {
    mockFetch.mockResolvedValueOnce(makeMealDBResponse([makeMealDBMeal()]));

    const { GET } = await import('./route');
    const req = new Request('http://localhost/api/food/recipes?random=true') as any;
    const res = await GET(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.results).toHaveLength(1);
    expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('random.php'));
  });

  it('skips Spoonacular when no API key is configured', async () => {
    mockFetch.mockResolvedValueOnce(makeMealDBResponse([makeMealDBMeal()]));

    const { GET } = await import('./route');
    const req = new Request('http://localhost/api/food/recipes?q=chicken') as any;
    await GET(req);

    // Only one fetch call — the Spoonacular call is skipped
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('combines MealDB and Spoonacular results when key is available', async () => {
    process.env.SPOONACULAR_API_KEY = 'test_key';

    const spoonResult = {
      id: 9001,
      title: 'Spicy Chicken Soup',
      image: 'https://spoonacular.com/soup.jpg',
      dishTypes: ['soup'],
      cuisines: ['American'],
      extendedIngredients: [{ name: 'chicken', original: '200g chicken breast' }],
      diets: ['gluten free'],
      nutrition: {
        nutrients: [
          { name: 'Calories', amount: 320 },
          { name: 'Protein', amount: 28 },
          { name: 'Carbohydrates', amount: 18 },
          { name: 'Fat', amount: 12 },
        ],
      },
    };

    mockFetch
      .mockResolvedValueOnce(makeMealDBResponse([makeMealDBMeal()]))
      .mockResolvedValueOnce({ ok: true, json: async () => ({ results: [spoonResult] }) });

    const { GET } = await import('./route');
    const req = new Request('http://localhost/api/food/recipes?q=chicken') as any;
    const res = await GET(req);
    const body = await res.json();

    expect(body.results).toHaveLength(2);
    const spoon = body.results.find((r: any) => r.source === 'spoonacular');
    expect(spoon).toBeDefined();
    expect(spoon.macros.calories).toBe(320);
    expect(spoon.id).toBe('spoon_9001');
    delete process.env.SPOONACULAR_API_KEY;
  });
});
