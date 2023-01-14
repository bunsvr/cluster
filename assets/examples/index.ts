import { Cluster } from "../..";

const cluster = new Cluster(import.meta.dir + "/server.ts");
cluster.use({ port: 3000 }, { port: 8080 });
cluster.fork();