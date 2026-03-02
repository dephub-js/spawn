import {
  SpawnBuilder,
  type SpawnOptions,
  type SpawnResult,
} from './builder.js';

/**
 * Executes a command silently with piped stdio, returning its SpawnResult.
 * @param command - The command to execute (e.g., 'ls', 'node').
 * @param args - Array of command arguments (e.g., ['-la']).
 * @param options - Optional cmd options (e.g., { cwd: './src' }).
 * @returns A promise resolving to the process SpawnResult (code, stdout, stderr).
 * @throws Error if the command fails or is empty.
 */
export const spawnSilent = (
  command: string,
  args: string[] = [],
  options: Partial<SpawnOptions> = {},
): Promise<SpawnResult> => {
  if (!command) throw new Error('Command cannot be empty');

  const spawner = new SpawnBuilder().command(command);

  args.reduce((s, arg) => s.arg(arg), spawner);

  spawner.setOption('stdio', 'pipe');

  for (const [key, value] of Object.entries(options)) {
    spawner.setOption(key as keyof SpawnOptions, value);
  }

  return spawner.run();
};
