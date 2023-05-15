// @deno-types="npm:@types/express@4"
import express, { NextFunction, Request, Response } from "npm:express@4.18.2";
import bodyParser from "npm:body-parser";
import userRouter from "./routes/users.ts";
// @deno-types="npm:@types/swagger-jsdoc"
import swaggerJsDoc from "npm:swagger-jsdoc";
import swaggerUi from "npm:swagger-ui-express";

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

const swaggerOptions = {
  basePath: "/api/v1",
  definition: {
    openapi: "3.0.0",
    info: {
      basePath: "/api/v1",
      title: "Database service API",
      version: "0.0.1",
      description: "This is a REST API for the database service.",
      license: {
        name: "Proprietary",
      },
      contact: {
        name: "Tomáš Kebrle",
      },
    },
    servers: [
      {
        url: "http://localhost:5000/api/v1",
      },
    ],
  },
  apis: ["./src/routes/*.ts"],
};

const specs = swaggerJsDoc(swaggerOptions);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }));

app.listen(port, () => {
  console.log(`🚀 LAUNCHING on ${port}`);
});
