import { db } from "../kysely.ts";
import { z } from "https://deno.land/x/zod@v3.21.4/mod.ts";
// @deno-types="npm:@types/express@4"
import express from "npm:express@4.18.2";

const router = express.Router();

const userPostReqBodySchema = z.object({
  name: z.string({ required_error: "name/required" }),
});

router.post("/users", async (req, res) => {
  const result = userPostReqBodySchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json(result.error.flatten());
    return;
  }
  const user = await db
    .insertInto("User")
    .values({ name: result.data.name })
    .executeTakeFirstOrThrow();

  res.json(user);
});

router.get("/users", async (_req, res) => {
  const users = await db.selectFrom("User").selectAll().execute();
  res.json(users);
});

export default router;
