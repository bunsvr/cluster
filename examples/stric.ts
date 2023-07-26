import { App } from "@stricjs/core";

export default new App()
    .use(() => new Response('Hello'));