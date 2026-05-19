/**
 * RESURGO — Dodo Payments Product Setup
 * Creates the 3 subscription/payment products on Dodo Payments.
 * 
 * Run: npx tsx scripts/setup-dodo-products.ts
 */

import DodoPayments from 'dodopayments';

const API_KEY = process.env.DODO_API_KEY;
if (!API_KEY) { console.error('❌ Set DODO_API_KEY env var before running.'); process.exit(1); }

const client = new DodoPayments({
  bearerToken: API_KEY,
  environment: 'test_mode', // Switch to 'live_mode' when ready for production
});

async function createProducts() {
  console.log('🚀 Creating Dodo Payments products for Resurgo...\n');

   // ─── 1. Pro Monthly — $9.99/mo subscription ───
   console.log('Creating Pro Monthly ($9.99/mo)...');
  const proMonthly = await client.products.create({
    name: 'Resurgo Pro Monthly',
    description: 'Unlimited goals, habits, AI coaching, analytics & more. Cancel anytime.',
    price: {
      currency: 'USD',
      discount: 0,
       price: 999, // $9.99 in cents
      purchasing_power_parity: false,
      type: 'recurring_price',
      payment_frequency_interval: 'Month',
      payment_frequency_count: 1,
      trial_period_days: 0,
      subscription_period_interval: 'Month',
      subscription_period_count: 1,
    },
    tax_category: 'digital_products',
  });
  console.log(`  ✅ Pro Monthly created: ${proMonthly.product_id}`);

   // ─── 2. Pro Yearly — $95.88/yr subscription ───
   console.log('Creating Pro Yearly ($95.88/yr)...');
   const proYearly = await client.products.create({
     name: 'Resurgo Pro Yearly',
     description: 'Same Pro features, billed yearly. Save 20% vs monthly ($7.99/mo effective).',
     price: {
       currency: 'USD',
       discount: 0,
       price: 9588, // $95.88 in cents
      purchasing_power_parity: false,
      type: 'recurring_price',
      payment_frequency_interval: 'Year',
      payment_frequency_count: 1,
      trial_period_days: 0,
      subscription_period_interval: 'Year',
      subscription_period_count: 1,
    },
    tax_category: 'digital_products',
  });
  console.log(`  ✅ Pro Yearly created: ${proYearly.product_id}`);

   // ─── 3. Lifetime — $89 one-time ───
   console.log('Creating Lifetime ($89)...');
   const lifetime = await client.products.create({
     name: 'Resurgo Lifetime',
     description: 'Pay once, use forever. All Pro features included for life. Founding price until July 5, 2026; after: $199.',
     price: {
       currency: 'USD',
       discount: 0,
       price: 8900, // $89 in cents
      purchasing_power_parity: false,
      type: 'one_time_price',
    },
    tax_category: 'digital_products',
  });
  console.log(`  ✅ Lifetime created: ${lifetime.product_id}`);

  // ─── Summary ───
  console.log('\n═══════════════════════════════════════════════════');
  console.log('✅ ALL PRODUCTS CREATED SUCCESSFULLY');
  console.log('═══════════════════════════════════════════════════');
  console.log(`\nAdd these to your .env file:\n`);
  console.log(`DODO_PRODUCT_ID_PRO_MONTHLY=${proMonthly.product_id}`);
  console.log(`DODO_PRODUCT_ID_PRO_YEARLY=${proYearly.product_id}`);
  console.log(`DODO_PRODUCT_ID_LIFETIME=${lifetime.product_id}`);
  console.log(`\n───────────────────────────────────────────────────`);
  console.log(`Pro Monthly: ${proMonthly.product_id}`);
  console.log(`Pro Yearly:  ${proYearly.product_id}`);
  console.log(`Lifetime:    ${lifetime.product_id}`);
  console.log('───────────────────────────────────────────────────\n');
}

createProducts().catch((err) => {
  console.error('❌ Failed to create products:', err);
  process.exit(1);
});
