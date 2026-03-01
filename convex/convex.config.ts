// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Convex App Configuration
// Registers the Dodo Payments component for checkout, portal & webhooks
// ═══════════════════════════════════════════════════════════════════════════════

import { defineApp } from 'convex/server';
import dodopayments from '@dodopayments/convex/convex.config';

const app = defineApp();
app.use(dodopayments);
export default app;
