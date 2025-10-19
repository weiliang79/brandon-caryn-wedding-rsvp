"use server";

import { actionClient } from "@/lib/safe-action";
import { formSchema } from "./schema";
import { createClient } from "@/utils/supabase/server";

export const submitRsvp = actionClient
  .inputSchema(formSchema)
  .action(async ({ parsedInput }) => {
    const supabase = await createClient();

    const { error } = await supabase.from("guests_dev").insert({
      ...parsedInput,
    });

    if (error) {
      console.error(error);
      return { success: false, error: error.message };
    }

    return { success: true };
  });
