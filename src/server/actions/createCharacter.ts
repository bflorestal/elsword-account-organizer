"use server";

import "server-only";
import { revalidatePath } from "next/cache";
import { createCharacter } from "~/server/db/queries";
import { characters } from "~/server/db/schema";

export async function createCharacterAction(
  data: typeof characters.$inferInsert
) {
  try {
    const newCharacter = await createCharacter(data);
    if (!newCharacter) {
      throw new Error("Failed to create character");
    }

    revalidatePath(`/account/${data.accountId}`);

    return { success: true, data: newCharacter };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: {
        message:
          error instanceof Error ? error.message : "An unknown error occurred",
      },
    };
  }
}
