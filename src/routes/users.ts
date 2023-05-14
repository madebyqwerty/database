import { db } from "../kysely.ts";
import { app } from "../main.ts";
import { z } from "https://deno.land/x/zod@v3.21.4/mod.ts";

const userPostReqBodySchema = z.object({
  name: z.string({ required_error: "name/required" }),
});

app.post("/users", async (req, res) => {
  const result = userPostReqBodySchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json(result.error.flatten());
  }

  const body = req.body as z.infer<typeof userPostReqBodySchema>;

  const { name } = body;
  const user = await db
    .insertInto("User")
    .values({ name })
    .executeTakeFirstOrThrow();

  res.json(user);
});

app.get("/users", async (_req, res) => {
  const users = await db
    .selectFrom("User")
    .selectAll()
    .executeTakeFirstOrThrow();
  res.json(users);
});
