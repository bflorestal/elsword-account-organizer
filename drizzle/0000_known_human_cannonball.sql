CREATE TABLE `elstracker_accounts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`server_id` integer NOT NULL,
	`username` text NOT NULL,
	`is_steam` integer DEFAULT false,
	`resonanceLevel` integer DEFAULT 0,
	FOREIGN KEY (`server_id`) REFERENCES `elstracker_servers`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `elstracker_characters` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`account_id` integer NOT NULL,
	`class_id` integer NOT NULL,
	`name` text NOT NULL,
	`level` integer DEFAULT 1,
	`specialization_id` integer,
	`pvp_rank_id` integer NOT NULL,
	FOREIGN KEY (`account_id`) REFERENCES `elstracker_accounts`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`class_id`) REFERENCES `elstracker_classes`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`specialization_id`) REFERENCES `elstracker_specializations`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`pvp_rank_id`) REFERENCES `elstracker_pvp_ranks`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `elstracker_classes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`icon_url` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `elstracker_pvp_ranks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`icon_url` text
);
--> statement-breakpoint
CREATE TABLE `elstracker_servers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `elstracker_specializations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`class_id` integer NOT NULL,
	`name` text NOT NULL,
	`icon_url` text NOT NULL,
	FOREIGN KEY (`class_id`) REFERENCES `elstracker_classes`(`id`) ON UPDATE no action ON DELETE no action
);
