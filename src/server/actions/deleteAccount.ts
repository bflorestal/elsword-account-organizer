"use server";

import { revalidatePath } from "next/cache";
import "server-only";
import { deleteAccountById } from "~/server/db/queries";

export async function deleteAccountAction(accountId: number) {
  try {
    const deletedAccount = await deleteAccountById(accountId);
    if (!deletedAccount) {
      throw new Error("Failed to delete account");
    }

    revalidatePath("/");

    return { success: true, data: deletedAccount };
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
