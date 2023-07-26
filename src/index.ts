import { Subprocess } from 'bun';
import { cpus } from 'os';

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

/**
 * Spawn a new process with corresponding ENV
 * @param env 
 * @returns the process spawned or `null` if process is a worker
 */
function fork(env?: Bun.Env): Subprocess | null {
    if (worker) return null;

    env ||= { NODE_ENV: Bun.env.NODE_ENV };
    env.WORKER = '';

    return Bun.spawn([process.execPath, 'run', target], {
        env, cwd: process.cwd(),
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
        return spawn(cpus().length);

    if (typeof args[0] === 'object')
        return spawn(cpus().length, args[0]);

    const arr = new Array(args[0]);

    for (let i = 0; i < args[0]; ++i)
        arr[i] = fork(args[1]);

    return arr;
}

export { spawn, fork };
