import { Cluster } from "../..";
import { App } from "@stricjs/core";

// Spawn workers or serve an app
export default Cluster.spawn() || new App()
    .use(() => new Response("Hello"));