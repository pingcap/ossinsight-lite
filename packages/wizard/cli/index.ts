import { program } from 'commander';
import status from '../commands/status.js';
import { SubCommand } from '../commands/cli-common.js';

function addCommand (name: string, command: SubCommand<any, any>) {
  program.command(name);
  if (command.description) {
    program.description(command.description);
  }
  command.buildArgs?.(program)?.forEach(arg => program.addArgument(arg));
  command.buildOptions?.(program)?.forEach(opt => program.addOption(opt));
  program.action(command);
}

addCommand('status', status);

program.parse();
