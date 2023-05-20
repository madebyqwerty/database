import userRouter from "./routes/users/users.ts";
// @deno-types="npm:@types/swagger-jsdoc"
import swaggerJsDoc from "npm:swagger-jsdoc";
import swaggerConfig from "./swagger-config.json" assert { type: "json" };
import { port } from "./constants.ts";
import absenceRouter from "./routes/absences/absences.ts";
import { Application, Router } from "https://deno.land/x/oak@v12.4.0/mod.ts";

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
app.use(userRouter.allowedMethods());
app.use(absenceRouter.routes());
app.use(absenceRouter.allowedMethods());

const specs = swaggerJsDoc({
  definition: swaggerConfig,
  apis: ["./src/routes/*/*.ts"],
});

const docsRouter = new Router({ prefix: "/docs" });
docsRouter.get("/", (ctx) => {
  ctx.response.status = 200;
  ctx.response.headers.set("Content-Type", "html");
  ctx.response.body = `
    <html>
  <head>
    <!-- Load the latest Swagger UI code and style from npm using unpkg.com -->
    <script src="https://unpkg.com/swagger-ui-dist@3/swagger-ui-bundle.js"></script>
    <link
      rel="stylesheet"
      type="text/css"
      href="https://unpkg.com/swagger-ui-dist@3/swagger-ui.css"
    />
    <title>My New API</title>
  </head>
  <body>
    <div id="swagger-ui"></div>
    <!-- Div to hold the UI component -->
    <script>
      window.onload = function () {
        // Begin Swagger UI call region
        const ui = SwaggerUIBundle({
          url: "openapi.json", //Location of Open API spec in the repo
          dom_id: "#swagger-ui",
          deepLinking: true,
          presets: [
            SwaggerUIBundle.presets.apis,
            SwaggerUIBundle.SwaggerUIStandalonePreset,
          ],
          plugins: [SwaggerUIBundle.plugins.DownloadUrl],
        });
        window.ui = ui;
      };
    </script>
  </body>
</html>
  `;
});

docsRouter.get("/openapi.json", (ctx) => {
  ctx.response.body = specs;
});

app.use(docsRouter.routes());
app.use(docsRouter.allowedMethods());

console.log("═════════════════════════════════");
console.log(`      🚀 LAUNCHING on ${port}    `);
console.log("═════════════════════════════════");
await app.listen({ port });
