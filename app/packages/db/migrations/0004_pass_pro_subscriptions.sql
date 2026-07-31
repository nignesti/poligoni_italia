CREATE TYPE "public"."pass_pro_billing_period" AS ENUM('mensile', 'annuale');--> statement-breakpoint
CREATE TYPE "public"."pass_pro_tier" AS ENUM('gratuito', 'pass_pro');--> statement-breakpoint
CREATE TABLE "user_subscriptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"tier" "pass_pro_tier" DEFAULT 'gratuito' NOT NULL,
	"billing_period" "pass_pro_billing_period",
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"renews_at" timestamp with time zone,
	"cancelled_at" timestamp with time zone,
	"stripe_subscription_id" text,
	CONSTRAINT "user_subscriptions_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
ALTER TABLE "user_subscriptions" ADD CONSTRAINT "user_subscriptions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;