import userRouter from "./routes/users/users.ts";
// @deno-types="npm:@types/swagger-jsdoc"
import swaggerJsDoc from "npm:swagger-jsdoc";
import swaggerUi from "npm:swagger-ui-express";
import swaggerConfig from "./swagger-config.json" assert { type: "json" };
import { port } from "./constants.ts";
import absenceRouter from "./routes/absences/absences.ts";
import { Application, Context } from "https://deno.land/x/oak@v12.4.0/mod.ts";

export const app = new Application();

app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.headers.get("X-Response-Time");
  console.log("═════════════════════════════════");
  console.info(
    `🌐 ${ctx.request.method}: ${ctx.request.url} by ${ctx.request.ip}`
  );
  console.info(`🕒 proccesed in ${rt}`);
});

app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.response.headers.set("X-Response-Time", `${ms}ms`);
});

app.use(userRouter.routes());
app.use(absenceRouter.routes());

//const specs = swaggerJsDoc({
//definition: swaggerConfig,
//apis: ["./src/routes/*/*.ts"],
//});

//app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }));

console.log("═════════════════════════════════");
console.log(`      🚀 LAUNCHING on ${port}    `);
console.log("═════════════════════════════════");
await app.listen({ port });
