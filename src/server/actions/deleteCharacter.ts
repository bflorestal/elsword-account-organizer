"use server";

import { revalidatePath } from "next/cache";
import "server-only";
import { deleteCharacterById } from "~/server/db/queries";

export async function deleteCharacterAction(characterId: number) {
  try {
    const deletedCharacter = await deleteCharacterById(characterId);
    if (!deletedCharacter) {
      throw new Error("Failed to delete character");
    }

    revalidatePath("/", "layout");

    return { success: true, data: deletedCharacter };
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
