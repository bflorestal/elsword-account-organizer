ALTER TABLE `elstracker_accounts` RENAME COLUMN "resonanceLevel" TO "resonance_level";--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_elstracker_characters` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`account_id` integer NOT NULL,
	`class_id` integer NOT NULL,
	`name` text NOT NULL,
	`level` integer DEFAULT 1,
	`specialization_id` integer,
	`pvp_rank_id` integer NOT NULL,
	FOREIGN KEY (`account_id`) REFERENCES `elstracker_accounts`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`class_id`) REFERENCES `elstracker_classes`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`specialization_id`) REFERENCES `elstracker_specializations`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`pvp_rank_id`) REFERENCES `elstracker_pvp_ranks`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_elstracker_characters`("id", "account_id", "class_id", "name", "level", "specialization_id", "pvp_rank_id") SELECT "id", "account_id", "class_id", "name", "level", "specialization_id", "pvp_rank_id" FROM `elstracker_characters`;--> statement-breakpoint
DROP TABLE `elstracker_characters`;--> statement-breakpoint
ALTER TABLE `__new_elstracker_characters` RENAME TO `elstracker_characters`;--> statement-breakpoint
PRAGMA foreign_keys=ON;