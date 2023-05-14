// @deno-types="npm:@types/express@4"
import express, { NextFunction, Request, Response } from "npm:express@4.18.2";

const app = express();
const port = Number(Deno.env.get("PORT")) || 3000;

const reqLogger = (req: Request, _res: Response, next: NextFunction) => {
    console.info(`🌐 ${req.method}: ${req.url} by ${req.hostname}`);
    next();
};
app.use(reqLogger);

app.get("/", (_req, res) => {
    res.status(200).send("Hello World!");
});

app.listen(port, () => {
    console.log(`🚀 LAUNCHING on ${port}`);
});
