/**
 * Carica SUBSCRIPTION_PLANS_SEED (src/seed/subscription-plans.ts) nella
 * tabella `subscription_plans`.
 *
 * Idempotente per id (UUID fissi nel seed): un upsert su conflitto di
 * chiave primaria aggiorna la riga invece di duplicarla, così un rilancio
 * dopo una modifica prezzi/features è sicuro.
 *
 * Uso: DATABASE_URL=postgres://... pnpm exec tsx scripts/run-seed-billing-plans.ts
 */
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { subscriptionPlans } from '../src/schema/billing.js';
import { SUBSCRIPTION_PLANS_SEED } from '../src/seed/subscription-plans.js';

async function main(): Promise<void> {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error('DATABASE_URL non impostata.');
    process.exitCode = 1;
    return;
  }

  const client = postgres(databaseUrl, { max: 1 });
  const db = drizzle(client);

  try {
    for (const plan of SUBSCRIPTION_PLANS_SEED) {
      await db
        .insert(subscriptionPlans)
        .values({ ...plan, features: [...plan.features] })
        .onConflictDoUpdate({
          target: subscriptionPlans.id,
          set: {
            name: plan.name,
            planType: plan.planType,
            priceCents: plan.priceCents,
            billingPeriodDays: plan.billingPeriodDays,
            maxRanges: plan.maxRanges,
            maxUsers: plan.maxUsers,
            maxMonthlyBookings: plan.maxMonthlyBookings,
            features: [...plan.features],
          },
        });
    }

    console.log(`Fatto. ${SUBSCRIPTION_PLANS_SEED.length} piani caricati.`);
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
