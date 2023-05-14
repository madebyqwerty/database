// @deno-types="npm:@types/express@4"
import express, { NextFunction, Request, Response } from "npm:express@4.18.2";
import bodyParser from "npm:body-parser";

export const app = express();
const port = Number(Deno.env.get("PORT")) || 5000;

const reqLogger = (req: Request, _res: Response, next: NextFunction) => {
  console.info(`🌐 ${req.method}: ${req.url} by ${req.hostname}`);
  next();
};
app.use(reqLogger);
app.use(bodyParser.json());

app.get("/", (_req, res) => {
  res.status(200).send("Hello World!");
});

import { db } from "./kysely.ts";
import { z } from "https://deno.land/x/zod@v3.21.4/mod.ts";

const userPostReqBodySchema = z.object({
  name: z.string({ required_error: "name/required" }),
});

app.post("/users", async (req, res) => {
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

app.get("/users", async (_req, res) => {
  const users = await db.selectFrom("User").selectAll().execute();
  res.json(users);
});

app.listen(port, () => {
  console.log(`🚀 LAUNCHING on ${port}`);
});
