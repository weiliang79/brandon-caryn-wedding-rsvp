"use server";

import { actionClient } from "@/lib/safe-action";
import { formSchema } from "./schema";
import { createClient } from "@/utils/supabase/server";

export const submitRsvp = actionClient
  .inputSchema(formSchema)
  .action(async ({ parsedInput }) => {
    const supabase = await createClient();

    const tableName = process.env.DB_GUEST_TABLE || "guests_dev";
    const { error } = await supabase.from(tableName).insert({
      ...parsedInput,
    });

    if (error) {
      console.error(error);
      return { success: false, error: error.message };
    }

    return { success: true };
  });
