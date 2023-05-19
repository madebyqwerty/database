// @deno-types="npm:@types/express@4"
import express from "npm:express@4.18.2";
import { db } from "../../kysely.ts";
import { isValidUUID } from "../../utils/isValidUUID.ts";
// @deno-types="npm:@types/multer"
import multer from "npm:multer";

const router = express.Router();

/**
 * @swagger
 * components:
 *  schemas:
 *   Absence:
 *    type: object
 *    required:
 *     - name
 *     - userId
 *     - id
 *     - lesson
 *     - date
 *    properties:
 *      name:
 *        type: string
 *        description: The user's name.
 *      userId:
 *        type: string
 *        description: The user's id.
 *      id:
 *        type: Absence ID
 *        description: The absence's id.
 *      lesson:
 *        type: number
 *        description: The lesson number
 *      date:
 *        type: string
 *        description: Date of the absence
 *    example:
 *      name: John Doe
 *      userId: 7d6fd0c4-6b3d-46d9-9840-5e8874c9c646
 *      id: f7cabd53-49e1-4c93-b59e-6035811b134d
 *      lesson: 2
 *      date: 2023-05-14
 *   ErrorCodes:
 *    type: string
 *    enum:
 *      - required
 *      - not-found
 */

/**
 * @openapi
 * tags:
 *  name: Absences
 *  description: API for managing absences.
 * /absences/{userId}:
 *  get:
 *   summary: Returns a list of absences for a given user.
 *   tags: [Absences]
 *   responses:
 *    200:
 *      description: The list of absences.
 *      content:
 *        application/json:
 *          schema:
 *            type: array
 *            items:
 *              $ref: '#/components/schemas/Absence'
 *    400:
 *     description: Bad request.
 *     content:
 *      application/json:
 *        schema:
 *         type: object
 *         properties:
 *          id:
 *            type: string
 *            enum:
 *             - required
 *             - not-valid
 */
router.get("/absences/:userId", async (req, res) => {
  const { userId } = req.params;

  if (!isValidUUID(userId)) {
    res.status(400).json({ id: "not-valid" });
    return;
  }

  const absences = await db
    .selectFrom("Absence")
    .innerJoin("User", "User.name", "Absence.userId")
    .selectAll()
    .where("userId", "=", userId)
    .execute();

  if (absences.length === 0) {
    res.status(404).json({ id: "not-found" });
    return;
  }

  res.json(absences);
});

/**
 * @openapi
 * /absences/{userId}:
 *  post:
 *    summary: Creates a new absence.
 *    tags: [Absences]
 *    requestBody:
 *      required: true
 *      content:
 *       application/json:
 *        schema:
 *          type: object
 *          properties:
 *            lesson:
 *              type: number
 *              example: 3
 *            date:
 *              type: string
 *              example: "2023-05-14"
 *    responses:
 *     200:
 *       description: The absence was successfully created.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              id:
 *                type: string
 *                description: The absence id.
 *                example: 7d6fd0c4-6b3d-46d9-9840-5e8874c9c646
 *              lesson:
 *                type: number
 *                description: The lesson number
 *                example: 2
 *              date:
 *                type: string
 *                description: Date of the absence
 *                example: "2023-05-14"
 */
router.post("/absences/:userId", async (req, res) => {
  const { userId } = req.params;
  const { lesson, date } = req.body;

  if (!isValidUUID(userId)) {
    res.status(400).json({ id: "not-valid" });
    return;
  }

  if (!lesson || !date) {
    res.status(400).json({ id: "required" });
    return;
  }

  const newAbsence = await db
    .insertInto("Absence")
    .values({ lesson, date, userId })
    .returning(["id", "lesson", "date"])
    .execute();

  res.json(newAbsence);
});

const scan = multer({ dest: "/absences/scan" });

/**
 * @openapi
 * /absences/scan:
 *  post:
 *    summary: Creates a new absence by scanning a paper.
 *    tags: [Absences]
 *    requestBody:
 *      required: true
 *      content:
 *        multipart/form-data:
 *          schema:
 *            type: object
 *            properties:
 *              image:
 *                type: string
 *                format: binary
 */
router.post("/absences/scan", scan.single("image"), (req, res) => {
  console.log(req.file);
  res.json({ success: true });
});

export default router;
