CREATE TYPE "public"."discipline" AS ENUM('tiro_a_segno', 'tiro_a_volo', 'tiro_dinamico', 'long_range', 'tiro_difensivo', 'avancarica');--> statement-breakpoint
CREATE TYPE "public"."range_manager_role" AS ENUM('proprietario', 'staff');--> statement-breakpoint
CREATE TYPE "public"."range_status" AS ENUM('censito', 'rivendicato', 'partner', 'inattivo');--> statement-breakpoint
CREATE TYPE "public"."range_type" AS ENUM('tsn', 'privato', 'tiro_a_volo', 'dinamico', 'long_range');--> statement-breakpoint
CREATE TYPE "public"."document_type" AS ENUM('porto_armi_tav', 'porto_armi_caccia', 'porto_armi_difesa', 'porto_gpg', 'certificato_medico', 'tessera_federale');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('tiratore', 'gestore', 'gpg', 'admin');--> statement-breakpoint
CREATE TYPE "public"."booking_source" AS ENUM('app', 'web', 'manuale_gestore', 'telefono');--> statement-breakpoint
CREATE TYPE "public"."booking_status" AS ENUM('richiesta', 'confermata', 'annullata', 'completata', 'no_show');--> statement-breakpoint
CREATE TYPE "public"."firearm_type" AS ENUM('pistola', 'revolver', 'carabina', 'fucile', 'avancarica');--> statement-breakpoint
CREATE TYPE "public"."maintenance_kind" AS ENUM('pulizia', 'usura_canna', 'molla_recupero');--> statement-breakpoint
CREATE TYPE "public"."target_scoring_mode" AS ENUM('manuale', 'automatico');--> statement-breakpoint
CREATE TYPE "public"."ammo_category" AS ENUM('arma_corta', 'arma_lunga_caccia', 'spezzone', 'polvere');--> statement-breakpoint
CREATE TYPE "public"."ammo_movement_reason" AS ENUM('acquisto', 'consumo_sessione', 'ricarica', 'correzione', 'cessione');--> statement-breakpoint
CREATE TABLE "range_closures" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"range_id" uuid NOT NULL,
	"date_from" date NOT NULL,
	"date_to" date NOT NULL,
	"reason" text NOT NULL,
	"is_recurring" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "range_hours" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"range_id" uuid NOT NULL,
	"weekday" integer NOT NULL,
	"opens_at" text NOT NULL,
	"closes_at" text NOT NULL,
	"season_from" date,
	"season_to" date
);
--> statement-breakpoint
CREATE TABLE "range_lines" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"range_id" uuid NOT NULL,
	"name" text NOT NULL,
	"distance_m" integer NOT NULL,
	"is_indoor" boolean DEFAULT false NOT NULL,
	"capacity" integer DEFAULT 1 NOT NULL,
	"calibers" text[] DEFAULT '{}' NOT NULL,
	"disciplines" "discipline"[] DEFAULT '{}' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "range_managers" (
	"range_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"role" "range_manager_role" DEFAULT 'staff' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "range_pricing" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"range_id" uuid NOT NULL,
	"item" text NOT NULL,
	"price_cents" integer NOT NULL,
	"unit" text,
	"note" text
);
--> statement-breakpoint
CREATE TABLE "range_services" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"range_id" uuid NOT NULL,
	"service" text NOT NULL,
	"available" boolean DEFAULT false NOT NULL,
	"price_cents" integer
);
--> statement-breakpoint
CREATE TABLE "ranges" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"type" "range_type" NOT NULL,
	"address" text,
	"comune" text NOT NULL,
	"provincia" text NOT NULL,
	"regione" text NOT NULL,
	"cap" text,
	"location" geography(Point,4326) NOT NULL,
	"phone" text,
	"email" text,
	"website" text,
	"external_booking_url" text,
	"management_software" text,
	"status" "range_status" DEFAULT 'censito' NOT NULL,
	"data_source" text,
	"verified_at" timestamp with time zone,
	"verified_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "ranges_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "user_documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"type" "document_type" NOT NULL,
	"expires_on" date NOT NULL,
	"storage_ref" text,
	"encrypted" text DEFAULT 'false' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"email" text,
	"phone" text,
	"display_name" text,
	"role" "user_role" DEFAULT 'tiratore' NOT NULL,
	"home_location" geography(Point,4326),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "booking_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"range_id" uuid NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"requested_for" timestamp with time zone NOT NULL,
	"message" text,
	"forwarded_at" timestamp with time zone,
	"outcome" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bookings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"range_id" uuid NOT NULL,
	"line_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"slot_start" timestamp with time zone NOT NULL,
	"slot_end" timestamp with time zone NOT NULL,
	"status" "booking_status" DEFAULT 'richiesta' NOT NULL,
	"source" "booking_source" DEFAULT 'web' NOT NULL,
	"price_cents" integer DEFAULT 0 NOT NULL,
	"fee_cents" integer DEFAULT 0 NOT NULL,
	"stripe_payment_intent_id" text,
	"qr_token" text,
	"checked_in_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "bookings_qr_token_unique" UNIQUE("qr_token")
);
--> statement-breakpoint
CREATE TABLE "firearms" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"nickname" text NOT NULL,
	"type" "firearm_type" NOT NULL,
	"caliber" text NOT NULL,
	"year_acquired" integer,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "maintenance_rules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"firearm_id" uuid NOT NULL,
	"kind" "maintenance_kind" NOT NULL,
	"interval_rounds" integer NOT NULL,
	"last_done_at_rounds" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session_shots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" uuid NOT NULL,
	"firearm_id" uuid NOT NULL,
	"caliber" text NOT NULL,
	"rounds_fired" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"range_id" uuid,
	"booking_id" uuid,
	"range_name_manual" text,
	"started_at" timestamp with time zone NOT NULL,
	"duration_min" integer NOT NULL,
	"distance_m" integer,
	"auto_generated" boolean DEFAULT false NOT NULL,
	"confirmed_by_user" boolean DEFAULT false NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "target_holes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"target_id" uuid NOT NULL,
	"x_mm" double precision NOT NULL,
	"y_mm" double precision NOT NULL,
	"score" double precision
);
--> statement-breakpoint
CREATE TABLE "targets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" uuid NOT NULL,
	"firearm_id" uuid NOT NULL,
	"storage_ref" text NOT NULL,
	"target_type" text,
	"distance_m" integer,
	"scoring_mode" "target_scoring_mode" DEFAULT 'manuale' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ammo_movements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"caliber" text NOT NULL,
	"category" "ammo_category" NOT NULL,
	"delta" integer NOT NULL,
	"reason" "ammo_movement_reason" NOT NULL,
	"session_id" uuid,
	"occurred_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "audit_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"action" text NOT NULL,
	"table_name" text NOT NULL,
	"record_id" uuid,
	"details" text,
	"ip_address" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gpg_exercises" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"logbook_id" uuid NOT NULL,
	"sequence" integer NOT NULL,
	"due_by" timestamp with time zone NOT NULL,
	"performed_at" timestamp with time zone,
	"range_id" uuid,
	"rounds_fired" integer DEFAULT 50 NOT NULL,
	"score" integer,
	"certified" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gpg_logbook" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"porto_armi_expires_on" timestamp with time zone NOT NULL,
	"institute_name" text,
	CONSTRAINT "gpg_logbook_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "legal_ammo_limits" (
	"category" "ammo_category" PRIMARY KEY NOT NULL,
	"max_quantity" integer NOT NULL,
	"declaration_from" integer,
	"legal_reference" text NOT NULL,
	"note" text
);
--> statement-breakpoint
ALTER TABLE "range_closures" ADD CONSTRAINT "range_closures_range_id_ranges_id_fk" FOREIGN KEY ("range_id") REFERENCES "public"."ranges"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "range_hours" ADD CONSTRAINT "range_hours_range_id_ranges_id_fk" FOREIGN KEY ("range_id") REFERENCES "public"."ranges"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "range_lines" ADD CONSTRAINT "range_lines_range_id_ranges_id_fk" FOREIGN KEY ("range_id") REFERENCES "public"."ranges"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "range_managers" ADD CONSTRAINT "range_managers_range_id_ranges_id_fk" FOREIGN KEY ("range_id") REFERENCES "public"."ranges"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "range_pricing" ADD CONSTRAINT "range_pricing_range_id_ranges_id_fk" FOREIGN KEY ("range_id") REFERENCES "public"."ranges"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "range_services" ADD CONSTRAINT "range_services_range_id_ranges_id_fk" FOREIGN KEY ("range_id") REFERENCES "public"."ranges"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_documents" ADD CONSTRAINT "user_documents_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "booking_requests" ADD CONSTRAINT "booking_requests_range_id_ranges_id_fk" FOREIGN KEY ("range_id") REFERENCES "public"."ranges"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_range_id_ranges_id_fk" FOREIGN KEY ("range_id") REFERENCES "public"."ranges"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_line_id_range_lines_id_fk" FOREIGN KEY ("line_id") REFERENCES "public"."range_lines"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "maintenance_rules" ADD CONSTRAINT "maintenance_rules_firearm_id_firearms_id_fk" FOREIGN KEY ("firearm_id") REFERENCES "public"."firearms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session_shots" ADD CONSTRAINT "session_shots_session_id_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session_shots" ADD CONSTRAINT "session_shots_firearm_id_firearms_id_fk" FOREIGN KEY ("firearm_id") REFERENCES "public"."firearms"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_range_id_ranges_id_fk" FOREIGN KEY ("range_id") REFERENCES "public"."ranges"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "target_holes" ADD CONSTRAINT "target_holes_target_id_targets_id_fk" FOREIGN KEY ("target_id") REFERENCES "public"."targets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "targets" ADD CONSTRAINT "targets_session_id_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "targets" ADD CONSTRAINT "targets_firearm_id_firearms_id_fk" FOREIGN KEY ("firearm_id") REFERENCES "public"."firearms"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ammo_movements" ADD CONSTRAINT "ammo_movements_session_id_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."sessions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gpg_exercises" ADD CONSTRAINT "gpg_exercises_logbook_id_gpg_logbook_id_fk" FOREIGN KEY ("logbook_id") REFERENCES "public"."gpg_logbook"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "idx_range_managers" ON "range_managers" USING btree ("range_id","user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_user_documents" ON "user_documents" USING btree ("user_id","type");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_gpg_exercises" ON "gpg_exercises" USING btree ("logbook_id","sequence");