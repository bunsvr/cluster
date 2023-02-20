import { Subprocess } from "bun";
import { cpus } from "os";

/**
 * Clustering for Bun. 
 * Only works properly for an entry point.
 */
class Cluster {
    /**
     * The target file. Defaults to the entry point or `process.argv[1]`.
     */
    static target = Bun.main;

    /**
     * Spawn new process
     * @param env 
     */
    static fork(env?: Bun.Env): Subprocess {
        if (!this.isMain)
            return;

        // @ts-ignore
        env ||= {};
        Object.assign(env, Bun.env);
        env.PROC_TYPE = "worker";
    
        return Bun.spawn([process.execPath, this.target], {
            env,
            cwd: process.cwd(),
            stdin: "inherit",
            stdout: "inherit",
            stderr: "inherit"
        });
    }

    /**
     * Spawn `cpus().length` processes
     */
    static spawn(): Subprocess[];

    /**
     * Spawn `cpus().length` processes with additional ENVs
     */
    static spawn(env: Bun.Env): Subprocess[];

    /**
     * Spawn `instances` processes
     * @param instances number of processes to spawn
     */
    static spawn(instances: number): Subprocess[];

    /**
     * Spawn `instances` processes with additional ENVs
     * @param instances number of processes to spawn
     */
    static spawn(instances: number, env: Bun.Env): Subprocess[];

    /**
     * Spawn new processes
     * @param instances instances count
     */
    static spawn(...args: any[]): Subprocess[] {
        if (!this.isMain)
            return;

        if (args.length === 0)
            return this.spawn(cpus().length);

        if (typeof args[0] === "object")
            return this.spawn(cpus().length, args[0]);

        const arr = [];

        for (let i = 0; i < args[0]; ++i)
            arr.push(this.fork(args[1]));

        return arr;
    }

    /**
     * If the process is the main process
     */
    static readonly isMain = Bun.env.PROC_TYPE !== "worker";
}

export { Cluster };