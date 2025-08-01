PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_elstracker_accounts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`server_id` integer NOT NULL,
	`username` text NOT NULL,
	`is_steam` integer DEFAULT false,
	`resonance_level` integer DEFAULT 0,
	FOREIGN KEY (`server_id`) REFERENCES `elstracker_servers`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_elstracker_accounts`("id", "server_id", "username", "is_steam", "resonance_level") SELECT "id", "server_id", "username", "is_steam", "resonance_level" FROM `elstracker_accounts`;--> statement-breakpoint
DROP TABLE `elstracker_accounts`;--> statement-breakpoint
ALTER TABLE `__new_elstracker_accounts` RENAME TO `elstracker_accounts`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_elstracker_characters` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`account_id` integer NOT NULL,
	`class_id` integer NOT NULL,
	`name` text NOT NULL,
	`level` integer DEFAULT 1,
	`specialization_id` integer,
	`pvp_rank_id` integer,
	FOREIGN KEY (`account_id`) REFERENCES `elstracker_accounts`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`class_id`) REFERENCES `elstracker_classes`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`specialization_id`) REFERENCES `elstracker_specializations`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`pvp_rank_id`) REFERENCES `elstracker_pvp_ranks`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
INSERT INTO `__new_elstracker_characters`("id", "account_id", "class_id", "name", "level", "specialization_id", "pvp_rank_id") SELECT "id", "account_id", "class_id", "name", "level", "specialization_id", "pvp_rank_id" FROM `elstracker_characters`;--> statement-breakpoint
DROP TABLE `elstracker_characters`;--> statement-breakpoint
ALTER TABLE `__new_elstracker_characters` RENAME TO `elstracker_characters`;--> statement-breakpoint
CREATE TABLE `__new_elstracker_specializations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`class_id` integer NOT NULL,
	`name` text NOT NULL,
	`icon_url` text NOT NULL,
	FOREIGN KEY (`class_id`) REFERENCES `elstracker_classes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_elstracker_specializations`("id", "class_id", "name", "icon_url") SELECT "id", "class_id", "name", "icon_url" FROM `elstracker_specializations`;--> statement-breakpoint
DROP TABLE `elstracker_specializations`;--> statement-breakpoint
ALTER TABLE `__new_elstracker_specializations` RENAME TO `elstracker_specializations`;--> statement-breakpoint
CREATE UNIQUE INDEX `elstracker_specializations_name_unique` ON `elstracker_specializations` (`name`);