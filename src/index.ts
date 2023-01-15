import { SpawnOptions, env, spawn } from "bun";

/**
 * Spawn options with additional server options
 */
export interface Process extends SpawnOptions.OptionsObject {
    url?: URL,
    port?: string | number,
    hostname?: string,
    baseURI?: string,
    protocol?: "http" | "https",
}

/**
 * Clustering for Bun
 */
class Cluster {
    private readonly procs: Process[];

    /**
     * Create a cluster 
     * @param target Target file
     */
    constructor(public readonly target: string) {
        this.procs = [];
    }

    /**
     * Add processes
     * @param opts 
     */
    use(...opts: Process[]) {
        for (const v of opts) {
            v.env ||= {};
            Object.assign(v.env, env);

            if (v.url)
                v.env.URI = v.url.toString();
            else {
                let url = (v.protocol || "http") + "://";
                url += v.hostname || "localhost";
                if (v.port)
                    url += ":" + v.port;

                v.env.URI = url;
            }
            v.stdin = v.stdout = v.stderr = "inherit";
        }

        this.procs.push(...opts);
    }

    /**
     * Start the cluster
     * @returns Spawned processes 
     */
    fork() {
        return this.procs.map(v =>
            spawn(["bun", this.target], v)
        );
    }
}

export { Cluster };