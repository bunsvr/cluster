import { spawn } from "..";
import { App } from "@stricjs/core";

// Spawn processes, if no processes are spawned then serve a server
export default spawn().length === 0 && new App()
    .use(() => new Response('Hello'));