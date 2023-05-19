// @deno-types="npm:@types/express@4"
import express, { NextFunction, Request, Response } from "npm:express@4.18.2";
import bodyParser from "npm:body-parser";
import userRouter from "./routes/users/users.ts";
// @deno-types="npm:@types/swagger-jsdoc"
import swaggerJsDoc from "npm:swagger-jsdoc";
import swaggerUi from "npm:swagger-ui-express";
import swaggerConfig from "./swagger-config.json" assert { type: "json" };
import { port } from "./constants.ts";
import absenceRouter from "./routes/absences/absences.ts";

export const app = express();

const reqLogger = (req: Request, _res: Response, next: NextFunction) => {
  console.info(`🌐 ${req.method}: ${req.url} by ${req.hostname}`);
  next();
};
app.use(reqLogger);
app.use(bodyParser.json());

app.get("/", (_req, res) => {
  res.status(200).send("Hello World!");
});

app.use("/api", userRouter);
app.use("/api", absenceRouter);

const specs = swaggerJsDoc({
  definition: swaggerConfig,
  apis: ["./src/routes/*.ts"],
});

app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }));

app.listen(port, () => {
  console.log(`🚀 LAUNCHING on ${port}`);
});
