CREATE TYPE "public"."invoice_status" AS ENUM('bozza', 'emessa', 'pagata', 'scaduta', 'annullata');--> statement-breakpoint
CREATE TYPE "public"."subscription_plan_type" AS ENUM('gratuito', 'partner', 'premium');--> statement-breakpoint
CREATE TYPE "public"."subscription_status" AS ENUM('attivo', 'sospeso', 'annullato', 'scaduto');--> statement-breakpoint
CREATE TABLE "billing_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"range_subscription_id" uuid NOT NULL,
	"invoice_id" uuid,
	"event_type" text NOT NULL,
	"amount_cents" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "invoices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"range_subscription_id" uuid NOT NULL,
	"invoice_number" text NOT NULL,
	"invoice_date" date NOT NULL,
	"due_date" date NOT NULL,
	"total_cents" integer NOT NULL,
	"vat_cents" integer DEFAULT 0 NOT NULL,
	"status" "invoice_status" DEFAULT 'bozza' NOT NULL,
	"line_items" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"paid_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "invoices_invoice_number_unique" UNIQUE("invoice_number")
);
--> statement-breakpoint
CREATE TABLE "manager_billing_config" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"range_id" uuid NOT NULL,
	"company_name" text,
	"vat_number" text,
	"fiscal_code" text,
	"address" text,
	"city" text,
	"province" text,
	"postal_code" text,
	"invoice_email" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "range_subscriptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"range_id" uuid NOT NULL,
	"plan_id" uuid NOT NULL,
	"status" "subscription_status" DEFAULT 'attivo' NOT NULL,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"renews_at" timestamp with time zone NOT NULL,
	"cancelled_at" timestamp with time zone,
	"stripe_subscription_id" text,
	"auto_renew" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subscription_plans" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"plan_type" "subscription_plan_type" NOT NULL,
	"price_cents" integer NOT NULL,
	"billing_period_days" integer DEFAULT 30 NOT NULL,
	"max_ranges" integer,
	"max_users" integer,
	"max_monthly_bookings" integer,
	"features" text[] DEFAULT '{}' NOT NULL
);
--> statement-breakpoint
ALTER TABLE "billing_history" ADD CONSTRAINT "billing_history_range_subscription_id_range_subscriptions_id_fk" FOREIGN KEY ("range_subscription_id") REFERENCES "public"."range_subscriptions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "billing_history" ADD CONSTRAINT "billing_history_invoice_id_invoices_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "public"."invoices"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_range_subscription_id_range_subscriptions_id_fk" FOREIGN KEY ("range_subscription_id") REFERENCES "public"."range_subscriptions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "manager_billing_config" ADD CONSTRAINT "manager_billing_config_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "manager_billing_config" ADD CONSTRAINT "manager_billing_config_range_id_ranges_id_fk" FOREIGN KEY ("range_id") REFERENCES "public"."ranges"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "range_subscriptions" ADD CONSTRAINT "range_subscriptions_range_id_ranges_id_fk" FOREIGN KEY ("range_id") REFERENCES "public"."ranges"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "range_subscriptions" ADD CONSTRAINT "range_subscriptions_plan_id_subscription_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."subscription_plans"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "idx_manager_billing_config" ON "manager_billing_config" USING btree ("range_id","user_id");