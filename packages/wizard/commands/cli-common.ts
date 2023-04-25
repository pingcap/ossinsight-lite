import type { Argument, Command, Option } from 'commander';

export interface SubCommand<Args extends any[], Flags extends object> {
  (flags: Flags, ...args: Args): Promise<void> | void;

  description?: string;
  buildArgs?: (program: Command) => Argument[];
  buildOptions?: (program: Command) => Option[];
}
