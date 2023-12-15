# `@stricjs/cluster`
A cluster implementation for Bun.

## Install
```bash
bun i @stricjs/cluster
```

## Usage
```ts
import { worker, spawn } from '@stricjs/cluster';

// If current module is a worker
if (worker) Bun.serve({
    fetch: () => new Response('Hi'),
    // Must use this
    reusePort: true
});

// Spawn a number of threads equivalent to available hardware concurrency
else spawn();
```
