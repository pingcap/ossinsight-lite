import { ItemReference, LibraryItem } from '@/src/types/config';
import { Subject } from 'rxjs';

const PRIVATE_SYMBOL_ORDER = Symbol('PRIVATE_SYMBOL_ORDER');

type BaseCommand<Key extends string> = {
  type: Key
  id: string
  [PRIVATE_SYMBOL_ORDER]?: number;
}

type CommandPayload<P> = { payload: P }

type UpdateLibraryItem = BaseCommand<'update-library-item'> & CommandPayload<LibraryItem>;
type DeleteLibraryItem = BaseCommand<'delete-library-item'>

type LibraryItemCommand = UpdateLibraryItem | DeleteLibraryItem;

type UpdateDashboardItem = BaseCommand<'update-dashboard-item'> & { dashboard: string } & CommandPayload<ItemReference>;
type DeleteDashboardItem = BaseCommand<'delete-dashboard-item'> & { dashboard: string }

type DashboardItemCommand = UpdateDashboardItem | DeleteDashboardItem;

export type Command = UpdateLibraryItem | DeleteLibraryItem | UpdateDashboardItem | DeleteDashboardItem

export class BatchCommands {
  private n = 0;
  private libraryItems: Record<string, LibraryItemCommand> = {};
  private dashboardItems: Record<string, { items: Record<string, DashboardItemCommand> }> = {};

  public readonly changed = new Subject<void>();
  private observed = false;
  private active = true;

  constructor (commands: Command[] = []) {
    commands.forEach(command => this.add(command));
    this.observed = true;
  }

  add (command: Command) {
    if (!this.active) {
      return false;
    }
    command[PRIVATE_SYMBOL_ORDER] = this.n++;
    switch (command.type) {
      case 'update-library-item':
      case 'delete-library-item':
        this.libraryItems[command.id] = command;
        break;
      case 'update-dashboard-item':
      case 'delete-dashboard-item':
        (this.dashboardItems[command.dashboard] ||= { items: {} }).items[command.id] = command;
        break;
    }
    if (this.observed) {
      this.changed.next();
    }
  }

  merge () {
    const commands: Command[] = [];
    commands.push(...Object.values(this.libraryItems));
    Object.values(this.dashboardItems).forEach(rec => {
      commands.push(...Object.values(rec.items));
    });
    commands.sort((a, b) => {
      return (a[PRIVATE_SYMBOL_ORDER] ?? 0) - (b[PRIVATE_SYMBOL_ORDER] ?? 0);
    }).forEach(command => delete command[PRIVATE_SYMBOL_ORDER]);

    this.clear();
    return commands;
  }

  clear () {
    this.dashboardItems = {};
    this.libraryItems = {};
    this.n = 0;
  }

  inactiveScope (cb: () => void) {
    this.active = false;
    cb();
    this.active = true;
  }

  public static readonly default = new BatchCommands();
}

export function merge (commands: Command[]): Command[] {
  const bc = new BatchCommands(commands);
  return bc.merge();
}