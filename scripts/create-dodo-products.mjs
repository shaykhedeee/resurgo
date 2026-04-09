// Temporary script to create Dodo Payments products
// Run: node scripts/create-dodo-products.mjs
// Delete after running.

const API_KEY = process.env.DODO_PAYMENTS_API_KEY;
if (!API_KEY) { console.error('❌ Set DODO_PAYMENTS_API_KEY env var before running.'); process.exit(1); }
const BASE = 'https://live.dodopayments.com';

const products = [
  {
    name: 'Resurgo Pro Monthly',
    description: 'Resurgo Pro - Monthly subscription. Unlimited habits, goals, AI coaching, vision boards, and all premium features.',
    tax_category: 'saas',
    price: {
      type: 'recurring_price',
      price: 499,
      currency: 'USD',
      discount: 0,
      purchasing_power_parity: false,
      payment_frequency_count: 1,
      payment_frequency_interval: 'Month',
      subscription_period_count: 1,
      subscription_period_interval: 'Month',
      trial_period_days: 0,
    },
  },
  {
    name: 'Resurgo Pro Yearly',
    description: 'Resurgo Pro - Annual subscription. Save 50% vs monthly. Unlimited habits, goals, AI coaching, vision boards, and all premium features.',
    tax_category: 'saas',
    price: {
      type: 'recurring_price',
      price: 2999,
      currency: 'USD',
      discount: 0,
      purchasing_power_parity: false,
      payment_frequency_count: 1,
      payment_frequency_interval: 'Year',
      subscription_period_count: 1,
      subscription_period_interval: 'Year',
      trial_period_days: 0,
    },
  },
  {
    name: 'Resurgo Lifetime',
    description: 'Resurgo Lifetime - One-time purchase. Permanent access to all Pro features forever. Never pay again.',
    tax_category: 'saas',
    price: {
      type: 'one_time_price',
      price: 4999,
      currency: 'USD',
      discount: 0,
      purchasing_power_parity: false,
    },
  },
];

async function createProduct(product) {
  const res = await fetch(`${BASE}/products`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(product),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error(`FAILED creating "${product.name}": ${res.status} ${errText}`);
    return null;
  }

  const data = await res.json();
  console.log(`CREATED: ${product.name} → product_id: ${data.product_id}`);
  return data;
}

async function main() {
  console.log('Creating Dodo Payments products on LIVE mode...\n');

  const results = [];
  for (const p of products) {
    const result = await createProduct(p);
    results.push(result);
  }

  console.log('\n--- SUMMARY ---');
  if (results[0]) console.log(`DODO_PRODUCT_ID_PRO_MONTHLY=${results[0].product_id}`);
  if (results[1]) console.log(`DODO_PRODUCT_ID_PRO_YEARLY=${results[1].product_id}`);
  if (results[2]) console.log(`DODO_PRODUCT_ID_LIFETIME=${results[2].product_id}`);

  console.log('\nUpdate these in:');
  console.log('  1. .env file');
  console.log('  2. Convex Dashboard → Settings → Environment Variables');
  console.log('  3. NEXT_PUBLIC_DODO_PRODUCT_* vars in .env');
}

main().catch(console.error);
