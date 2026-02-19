CREATE TABLE "elstracker_accounts" (
	"id" serial PRIMARY KEY NOT NULL,
	"server_id" integer NOT NULL,
	"username" text NOT NULL,
	"is_steam" boolean DEFAULT false,
	"resonance_level" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "elstracker_characters" (
	"id" serial PRIMARY KEY NOT NULL,
	"account_id" integer NOT NULL,
	"class_id" integer NOT NULL,
	"name" text NOT NULL,
	"level" integer DEFAULT 1,
	"specialization_id" integer,
	"pvp_rank_id" integer
);
--> statement-breakpoint
CREATE TABLE "elstracker_classes" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"icon_url" text NOT NULL,
	CONSTRAINT "elstracker_classes_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "elstracker_pvp_ranks" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"icon_url" text,
	CONSTRAINT "elstracker_pvp_ranks_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "elstracker_servers" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "elstracker_servers_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "elstracker_specializations" (
	"id" serial PRIMARY KEY NOT NULL,
	"class_id" integer NOT NULL,
	"name" text NOT NULL,
	"icon_url" text NOT NULL,
	CONSTRAINT "elstracker_specializations_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "elstracker_accounts" ADD CONSTRAINT "elstracker_accounts_server_id_elstracker_servers_id_fk" FOREIGN KEY ("server_id") REFERENCES "public"."elstracker_servers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "elstracker_characters" ADD CONSTRAINT "elstracker_characters_account_id_elstracker_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."elstracker_accounts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "elstracker_characters" ADD CONSTRAINT "elstracker_characters_class_id_elstracker_classes_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."elstracker_classes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "elstracker_characters" ADD CONSTRAINT "elstracker_characters_specialization_id_elstracker_specializations_id_fk" FOREIGN KEY ("specialization_id") REFERENCES "public"."elstracker_specializations"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "elstracker_characters" ADD CONSTRAINT "elstracker_characters_pvp_rank_id_elstracker_pvp_ranks_id_fk" FOREIGN KEY ("pvp_rank_id") REFERENCES "public"."elstracker_pvp_ranks"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "elstracker_specializations" ADD CONSTRAINT "elstracker_specializations_class_id_elstracker_classes_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."elstracker_classes"("id") ON DELETE cascade ON UPDATE no action;