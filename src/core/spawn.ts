import {
  SpawnBuilder,
  type SpawnOptions,
  type SpawnResult,
} from './builder.js';

/**
 * Executes a command in a child process, mirroring the native Node.js spawn behavior.
 * By default, stdio is set to 'pipe', allowing stdout and stderr to be captured,
 * but this can be customized through the options parameter.
 *
 * @param command - The command to execute (e.g., 'ls', 'node').
 * @param args - Array of command arguments (e.g., ['-la']).
 * @param options - Optional spawn options (e.g., { cwd: './src', stdio: 'inherit' }).
 * @returns A promise resolving to the process SpawnResult (exit code, stdout, stderr).
 * @throws Error if the command is empty or the process fails to start.
 */
export const spawn = (
  command: string,
  args: string[] = [],
  options: Partial<SpawnOptions> = {},
): Promise<SpawnResult> => {
  if (!command) throw new Error('Command cannot be empty');

  const spawner = new SpawnBuilder().command(command);

  args.reduce((s, arg) => s.arg(arg), spawner);

  for (const [key, value] of Object.entries(options)) {
    spawner.setOption(key as keyof SpawnOptions, value);
  }

  return spawner.run();
};
