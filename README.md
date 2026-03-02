# @dephub/spawn 🚀

> A lightweight, fluent API for spawning child processes in Node.js. Enhanced wrapper around child_process.spawn with better defaults and convenience methods.

[![NPM version](https://img.shields.io/npm/v/@dephub/spawn.svg?style=flat)](https://npmjs.org/package/@dephub/spawn)
[![ESM-only](https://img.shields.io/badge/ESM-only-brightgreen?style=flat)](https://nodejs.org/)

---

## Features ✨

- 🛠️ **Fluent API** - Chainable command building with `SpawnBuilder`
- 🔧 **Multiple Modes** - `spawn`, `spawnSilent`, `spawnStream` for different use cases
- 📡 **Enhanced Options** - Extended spawn options with encoding support
- 🔒 **Type Safe** - Full TypeScript support with strict typing
- 🚀 **Lightweight** - Minimal wrapper around native child_process
- 💻 **Cross-Platform** - Consistent behavior across Windows, macOS, Linux

---

## Installation 📦

```bash
npm install @dephub/spawn
# or
pnpm add @dephub/spawn
# or
yarn add @dephub/spawn
```

---

## Quick Start 🚀

```typescript
import { spawn, spawnStream, spawnSilent, SpawnBuilder } from '@dephub/spawn';

// Basic spawn with output capture
const result = await spawn('ls', ['-la']);
console.log(result.stdout);

// Stream output to parent process
await spawnStream('npm', ['install']);

// Silent execution with captured output
const silentResult = await spawnSilent('node', ['script.js']);

// Fluent builder API
const builderResult = await new SpawnBuilder()
  .command('ls')
  .arg('-la')
  .setOption('cwd', './src')
  .run();
```

---

## Usage Examples 🎯

### Basic Command Execution

```typescript
import { spawn } from '@dephub/spawn';

// Run simple command
const { code, stdout, stderr } = await spawn('echo', ['hello world']);

// Check exit code
if (code === 0) {
  console.log('Success:', stdout);
} else {
  console.error('Error:', stderr);
}
```

### Working Directory and Environment

```typescript
import { spawn } from '@dephub/spawn';

// Execute in specific directory
const result = await spawn('ls', ['-la'], {
  cwd: './src',
  env: { ...process.env, NODE_ENV: 'production' },
});
```

### Streaming Output

```typescript
import { spawnStream } from '@dephub/spawn';

// Stream npm install output to console
await spawnStream('npm', ['install'], {
  cwd: './project',
});

// Note: spawnStream returns only exit code, not stdout/stderr
```

### Silent Execution

```typescript
import { spawnSilent } from '@dephub/spawn';

// Capture output without inheriting stdio
const { stdout } = await spawnSilent('git', ['status']);
console.log('Git status:', stdout);
```

### Fluent Builder API

```typescript
import { SpawnBuilder } from '@dephub/spawn';

// Complex command with fluent API
const result = await new SpawnBuilder()
  .command('ffmpeg')
  .arg('-i')
  .arg('input.mp4')
  .arg('-c:v')
  .arg('libx264')
  .arg('output.mp4')
  .setOption('stdio', 'pipe')
  .setOption('encoding', 'utf8')
  .run();
```

### Pre-configured Spawner

```typescript
import { spawner } from '@dephub/spawn';

// Reusable spawner instance
const result = await spawner
  .command('docker')
  .arg('build')
  .arg('-t')
  .arg('my-app')
  .arg('.')
  .run();
```

---

## API Reference 📚

### Core Functions

#### `spawn(command, args?, options?)`

Execute command with output capture (stdio: 'pipe' by default).

#### `spawnSilent(command, args?, options?)`

Execute with piped stdio and captured output.

#### `spawnStream(command, args?, options?)`

Execute with inherited stdio (output streamed to parent).

### `SpawnBuilder` Class

Fluent API for building commands:

- `.command(cmd)` - Set command to execute
- `.arg(arg)` - Add command argument
- `.setOption(key, value)` - Set spawn option
- `.run()` - Execute and return result

### Types

#### `SpawnOptions`

Extends Node.js `SpawnOptions` with:

- `encoding` - Character encoding for stdout/stderr

#### `SpawnResult`

- `code` - Exit code (0 for success)
- `stdout` - Captured stdout output
- `stderr` - Captured stderr output

---

## Common Patterns 🎨

### Error Handling

```typescript
import { spawn } from '@dephub/spawn';

try {
  const result = await spawn('unknown-command');
} catch (error) {
  console.error('Process failed:', error.message);
}
```

### Working with Promises

```typescript
import { spawn } from '@dephub/spawn';

spawn('ls', ['-la'])
  .then((result) => console.log(result.stdout))
  .catch((error) => console.error('Error:', error));
```

### Batch Operations

```typescript
import { spawn } from '@dephub/spawn';

const commands = [
  ['ls', ['-la']],
  ['pwd', []],
  ['whoami', []],
];

const results = await Promise.all(
  commands.map(([cmd, args]) => spawn(cmd, args)),
);
```

---

## Integration Examples 🔗

### With Build Tools

```typescript
import { spawnStream } from '@dephub/spawn';

async function buildProject() {
  await spawnStream('npm', ['run', 'build']);
  await spawnStream('npm', ['test']);
  await spawnStream('npm', ['run', 'lint']);
}
```

### With File System Operations

```typescript
import { spawn } from '@dephub/spawn';
import { readFile } from '@dephub/read';

const { stdout } = await spawn('git', ['log', '--oneline']);
const commits = stdout.split('\n').filter(Boolean);
```

### CLI Tools Integration

```typescript
#!/usr/bin/env node
import { spawnStream } from '@dephub/spawn';

await spawnStream('docker', ['build', '-t', 'my-app', '.']);
await spawnStream('docker', ['push', 'my-app']);
```

---

## Migration from Child Process

### Before (Node.js native)

```typescript
import { spawn } from 'child_process';

const child = spawn('ls', ['-la'], { stdio: 'pipe' });

let stdout = '';
child.stdout.on('data', (data) => {
  stdout += data;
});

await new Promise((resolve) => {
  child.on('close', resolve);
});
```

### After (@dephub/spawn)

```typescript
import { spawn } from '@dephub/spawn';

const { stdout } = await spawn('ls', ['-la']);
```

---

## License 📄

MIT License – see [LICENSE](LICENSE) for details.

**Author:** Estarlin R ([estarlincito.com](https://estarlincito.com))
