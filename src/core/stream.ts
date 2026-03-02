import { SpawnBuilder, type SpawnOptions } from './builder.js';

/**
 * Executes a command with inherited stdio, streaming output to parent process.
 * Note: With stdio: 'inherit', stdout/stderr cannot be captured and will be null.
 *
 * @param command - The command to execute
 * @param args - Array of command arguments
 * @param options - Optional spawn options
 * @returns Promise resolving to process result code only
 * @throws Error if command is empty or process fails
 */
export const spawnStream = async (
  command: string,
  args: string[] = [],
  options: Partial<SpawnOptions> = {},
): Promise<{ code: number }> => {
  if (!command) throw new Error('Command cannot be empty');

  const spawner = new SpawnBuilder().command(command);
  args.reduce((s, arg) => s.arg(arg), spawner);
  spawner.setOption('stdio', 'inherit');

  for (const [key, value] of Object.entries(options)) {
    spawner.setOption(key as keyof SpawnOptions, value);
  }

  const { code } = await spawner.run();

  return {
    code,
  };
};
