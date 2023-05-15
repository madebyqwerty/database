import { db } from "../kysely.ts";
import { z } from "https://deno.land/x/zod@v3.21.4/mod.ts";
// @deno-types="npm:@types/express@4"
import express from "npm:express@4.18.2";

const router = express.Router();

/**
 * @swagger
 * components:
 *  schemas:
 *   User:
 *    type: object
 *    required:
 *     - name
 *    properties:
 *      name:
 *        type: string
 *        description: The user's name.
 *      id:
 *        type: string
 *        description: The user's id.
 *    example:
 *      name: John Doe
 *      id: f7cabd53-49e1-4c93-b59e-6035811b134d
 */

/**
 * @openapi
 * tags:
 *  name: Users
 *  description: API for managing users.
 * /users:
 *  get:
 *   summary: Returns a list of users.
 *   tags: [Users]
 *   responses:
 *    200:
 *      description: The list of users.
 *      content:
 *        application/json:
 *          schema:
 *            type: array
 *            items:
 *              $ref: '#/components/schemas/User'
 *    500:
 *      description: Internal server error.
 */
router.get("/users", async (_req, res) => {
  const users = await db.selectFrom("User").selectAll().execute();
  res.json(users);
});

const userPostReqBodySchema = z.object({
  name: z.string({ required_error: "name/required" }),
});

/**
 * @openapi
 * /users:
 *  post:
 *   summary: Creates a new user.
 *   tags: [Users]
 *   responses:
 *    200:
 *      description: The created user.
 *      content:
 *       application/json:
 *        schema:
 *          $ref: '#/components/schemas/User'
 *    400:
 *     description: Bad request.
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *          name: string
 *        example:
 *          name: name/required
 */
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

export default router;
