import { type SpawnOptions as NodeSpawnOptions, spawn } from 'child_process';

export type OptionKeys = keyof SpawnOptions;

export type OptionValues<T extends OptionKeys> = SpawnOptions[T];

/**
 * Options for configuring a SpawnBuilder instance, extending Node.js child_process SpawnOptions.
 * @interface
 */
export interface SpawnOptions extends NodeSpawnOptions {
  /** Character encoding for stdout/stderr streams. Defaults to 'utf8'. */
  encoding?: BufferEncoding;
}
/**
 * Result of a SpawnBuilder process execution.
 * @interface
 */
/**
 * Result of a process execution
 */
export interface SpawnResult {
  /** Exit code of the process */
  code: number;
  /** Captured stderr output */
  stderr: null | string;
  /** Captured stdout output */
  stdout: null | string;
}

/**
 * A lightweight, fluent API for spawning child processes in Node.js.
 * @class
 */
export class SpawnBuilder {
  readonly #args: string[] = [];
  #command = '';
  readonly #options = new Map<OptionKeys, OptionValues<OptionKeys>>();

  /**
   * Adds an argument to the command.
   * @param arg - A single argument to pass to the command (e.g., '-la').
   * @returns The SpawnBuilder instance for chaining.
   */
  arg(arg: string): this {
    this.#args.push(arg);
    return this;
  }

  /**
   * Sets the command to execute.
   * @param command - The command to run (e.g., 'ls', 'node').
   * @returns The SpawnBuilder instance for chaining.
   */
  command(command: string): this {
    this.#command = command;
    return this;
  }

  /**
   * Executes the command and returns its output.
   * @returns A promise resolving to the process output (code, stdout, stderr).
   * @throws Error if the child process fails.
   */
  async run(): Promise<SpawnResult> {
    const child = spawn(
      this.#command,
      this.#args,
      Object.fromEntries(this.#options),
    );

    let stdout = '';
    let stderr = '';

    const encoding =
      (this.#options.get('encoding') as BufferEncoding) ?? 'utf8';

    if (child.stdout) {
      child.stdout.setEncoding(encoding);
      child.stdout.on('data', (data) => {
        stdout += data;
      });
    }

    if (child.stderr) {
      child.stderr.setEncoding(encoding);
      child.stderr.on('data', (data) => {
        stderr += data;
      });
    }

    return new Promise((resolve, reject) => {
      child.on('close', (code) => {
        resolve({
          code: code ?? 0,
          stderr: stderr ? stderr.trim() : null,
          stdout: stdout ? stdout.trim() : null,
        });
      });
      child.on('error', (err) => {
        reject(new Error(err.message));
      });
    });
  }

  /**
   * Sets a spawn option (e.g., cwd, encoding).
   * @param key - The option key (e.g., 'cwd', 'encoding').
   * @param value - The value for the option.
   * @returns The SpawnBuilder instance for chaining.
   */
  setOption<K extends OptionKeys>(key: K, value: OptionValues<K>): this {
    this.#options.set(key, value);
    return this;
  }
}

export const spawner = new SpawnBuilder();
