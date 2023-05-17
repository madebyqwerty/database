import { db } from "../kysely.ts";
import { z } from "https://deno.land/x/zod@v3.21.4/mod.ts";
// @deno-types="npm:@types/express@4"
import express from "npm:express@4.18.2";
import { isValidUUID } from "../utils/isValidUUID.ts";

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
 *   ErrorCodes:
 *    type: string
 *    enum:
 *      - required
 *      - not-found
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
 *    400:
 *     description: Bad request.
 *     content:
 *      application/json:
 *        schema:
 *         type: object
 *         properties:
 *          name:
 *            type: string
 *            enum:
 *             - required
 */
router.get("/users", async (_req, res) => {
  const users = await db.selectFrom("User").selectAll().execute();
  res.json(users);
});

const userPostReqBodySchema = z.object({
  name: z.string({ required_error: "required" }),
});

/**
 * @openapi
 * /users/{id}:
 *  get:
 *   summary: Returns a user by ID.
 *   tags: [Users]
 *   responses:
 *    200:
 *      description: The user.
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/User'
 *    400:
 *      description: Id is not valid.
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              id:
 *               type: string
 *               enum:
 *                - not-valid
 *    404:
 *      description: User not found
 *      content:
 *       application/json:
 *        schema:
 *          type: object
 *          properties:
 *            user:
 *             type: string
 *             enum:
 *              - not-found
 */
router.get("/users/:id", async (req, res) => {
  const id = req.params.id;

  if (!isValidUUID(id)) {
    res.status(400).json({ id: "not-valid" });
    return;
  }

  const user = await db
    .selectFrom("User")
    .selectAll()
    .where("id", "=", id)
    .executeTakeFirst();

  if (!user) {
    res.status(404).json({ user: "not-found" });
    return;
  }

  res.json(user);
});

/**
 * @openapi
 * /users:
 *  post:
 *   summary: Creates a new user.
 *   tags: [Users]
 *   requestBody:
 *    required: true
 *    content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *          name:
 *            type: string
 *            description: The user's name.
 *            example: Tomáš Kebrle
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
 *          fieldErrors:
 *            type: object
 *            properties:
 *              name:
 *                type: array
 *                items:
 *                  type: string
 *                  enum: [required]
 *            example:
 *              name: [required]
 */
router.post("/users", async (req, res) => {
  const result = userPostReqBodySchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json(result.error.flatten());
    return;
  }

  const [user] = await db
    .insertInto("User")
    .values({
      name: result.data.name,
    })
    .returning(["id", "name"])
    .execute();

  res.json(user);
});

export default router;
