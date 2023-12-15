import { Subprocess } from 'bun';

declare global {
    namespace Bun {
        interface Env extends Dict<string> {
            /**
             * If this is specified in ENV, the process is a worker
             */
            WORKER?: string;

            /**
             * The type of process
             */
            NODE_ENV: string;
        }
    }
}

/**
 * Check whether this process is a worker process
 */
export const worker = 'WORKER' in Bun.env;
export const target = Bun.main;
export const cwd = process.cwd();

const defaultENV = { NODE_ENV: Bun.env.NODE_ENV };

/**
 * Spawn a new process with corresponding ENV
 * @param env 
 * @returns the process spawned or `null` if process is a worker
 */
function fork(env?: Bun.Env): Subprocess | null {
    if (worker) return null;

    env ||= defaultENV;
    env.WORKER = '';

    return Bun.spawn([process.execPath, 'run', target], {
        env, cwd,
        stdin: 'inherit',
        stdout: 'inherit',
        stderr: 'inherit'
    });
}

/**
 * Spawn `cpus().length` processes
 * @returns the list of processes spawned
 */
function spawn(): Subprocess[];

/**
 * Spawn `cpus().length` processes with additional ENVs
 * @returns the list of processes spawned
 */
function spawn(env: Bun.Env): Subprocess[];

/**
 * Spawn `instances` processes
 * @param instances number of processes to spawn
 * @returns the list of processes spawned
 */
function spawn(instances: number): Subprocess[];

/**
 * Spawn `instances` processes with additional ENVs
 * @param instances number of processes to spawn
 * @returns the list of processes spawned
 */
function spawn(instances: number, env: Bun.Env): Subprocess[];

function spawn(...args: any[]) {
    if (worker)
        return [];

    if (args.length === 0)
        return spawn(navigator.hardwareConcurrency);

    if (typeof args[0] === 'object')
        return spawn(navigator.hardwareConcurrency, args[0]);

    const arr = new Array(args[0]);

    let i = 0;
    while (i < args[0]) {
        arr[i] = fork(args[1]);
        ++i;
    }

    return arr;
}

export { spawn, fork };
