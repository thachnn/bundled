// noinspection JSUnusedGlobalSymbols

import type picomatch from "picomatch";

type OnQueueEmptyCallback = (error: Error | null, output: WalkerState) => void;
/**
 * This is a custom stateless queue to track concurrent async fs calls.
 * It increments a counter whenever a call is queued and decrements it
 * as soon as it completes. When the counter hits 0, it calls onQueueEmpty.
 */
declare class Queue {
  private readonly onQueueEmpty;
  private count;
  constructor(onQueueEmpty: OnQueueEmptyCallback);

  enqueue(): void;
  dequeue(error: Error | null, output: WalkerState): void;
}

export type Counts = {
  files: number;
  directories: number;
  /**
   * @deprecated use `directories` instead. Will be removed in v7.0.
   */
  dirs: number;
};

export type Group = {
  directory: string;
  files: string[];
  /**
   * @deprecated use `directory` instead. Will be removed in v7.0.
   */
  dir: string;
};

export type GroupOutput = Group[];
export type OnlyCountsOutput = Counts;
export type PathsOutput = string[];

export type Output = OnlyCountsOutput | PathsOutput | GroupOutput;

export type WalkerState = {
  root: string;
  paths: string[];
  groups: Group[];
  counts: Counts;
  options: Options;
  queue: Queue;

  symlinks: Map<string, string>;
  visited: string[];
};

export type ResultCallback<TOutput extends Output> = (
  error: Error | null,
  output: TOutput
) => void;

export type FilterPredicate = (path: string, isDirectory: boolean) => boolean;
export type ExcludePredicate = (dirName: string, dirPath: string) => boolean;
export type PathSeparator = "/" | "\\";
export type Options<TGlobFunction = unknown> = {
  includeBasePath?: boolean;
  includeDirs?: boolean;
  normalizePath?: boolean;
  maxDepth: number;
  maxFiles?: number;
  resolvePaths?: boolean;
  suppressErrors: boolean;
  group?: boolean;
  onlyCounts?: boolean;
  filters: FilterPredicate[];
  resolveSymlinks?: boolean;
  useRealPaths?: boolean;
  excludeFiles?: boolean;
  excludeSymlinks?: boolean;
  exclude?: ExcludePredicate;
  relativePaths?: boolean;
  pathSeparator: PathSeparator;
  signal?: AbortSignal;
  globFunction?: TGlobFunction;
};

export type GlobMatcher = (test: string) => boolean;
export type GlobFunction = (
  glob: string | string[],
  ...params: unknown[]
) => GlobMatcher;
export type GlobParams<T> = T extends (
  globs: string | string[],
  ...params: infer TParams extends unknown[]
) => GlobMatcher
  ? TParams
  : [];

declare class APIBuilder<TReturnType extends Output> {
  private readonly root;
  private readonly options;
  constructor(root: string, options: Options);

  withPromise(): Promise<TReturnType>;
  withCallback(cb: ResultCallback<TReturnType>): void;
  sync(): TReturnType;
}

declare class Builder<
  TReturnType extends Output = PathsOutput,
  TGlobFunction = typeof picomatch,
> {
  private readonly globCache;
  private options;
  private globFunction?;
  constructor(options?: Partial<Options<TGlobFunction>>);

  group(): Builder<GroupOutput, TGlobFunction>;

  withPathSeparator(separator: "/" | "\\"): this;
  withBasePath(): this;
  withRelativePaths(): this;
  withDirs(): this;
  withMaxDepth(depth: number): this;
  withMaxFiles(limit: number): this;
  withFullPaths(): this;
  withErrors(): this;

  withSymlinks({ resolvePaths }?: { resolvePaths?: boolean }): this;
  withAbortSignal(signal: AbortSignal): this;

  normalize(): this;
  filter(predicate: FilterPredicate): this;
  onlyDirs(): this;
  exclude(predicate: ExcludePredicate): this;

  onlyCounts(): Builder<OnlyCountsOutput, TGlobFunction>;
  crawl(root?: string): APIBuilder<TReturnType>;

  withGlobFunction<TFunc>(fn: TFunc): Builder<TReturnType, TFunc>;

  /**
   * @deprecated Pass options using the constructor instead:
   * ```ts
   * new fdir(options).crawl("/path/to/root");
   * ```
   * This method will be removed in v7.0
   */
  crawlWithOptions(
    root: string,
    options: Partial<Options<TGlobFunction>>
  ): APIBuilder<TReturnType>;

  glob(...patterns: string[]): Builder<TReturnType, TGlobFunction>;

  globWithOptions(patterns: string[]): Builder<TReturnType, TGlobFunction>;
  globWithOptions(
    patterns: string[],
    ...options: GlobParams<TGlobFunction>
  ): Builder<TReturnType, TGlobFunction>;
}

export { Builder as fdir };
export type Fdir = typeof Builder;
