"use server";

import { revalidatePath } from "next/cache";
import "server-only";
import { createAccount } from "~/server/db/queries";
import { accounts } from "~/server/db/schema";

export async function createAccountAction(data: typeof accounts.$inferInsert) {
  try {
    const newAccount = await createAccount(data);
    if (!newAccount) {
      throw new Error("Failed to create account");
    }

    revalidatePath("/");

    return { success: true, data: newAccount };
  } catch (error) {
    console.error(error);
    return { success: false, error };
  }
}
