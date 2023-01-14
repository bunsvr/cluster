import { App } from "@bunsvr/core";
import Bun from "bun";

const app = new App();

app.fetch = async () => new Response("Hello");
app.baseURI = Bun.env.URI as string;

Bun.serve(app);