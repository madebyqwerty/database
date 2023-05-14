// @deno-types="npm:@types/express@4"
import express, { NextFunction, Request, Response } from "npm:express@4.18.2";
import bodyParser from "npm:body-parser";
import userRouter from "./routes/users.ts";

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

app.use("/api/v1", userRouter);

app.listen(port, () => {
  console.log(`🚀 LAUNCHING on ${port}`);
});
