import { Compilation, Module, WebpackPluginFunction } from 'webpack';
import type { Chalk, Ora, OraInstance } from './types';
import * as path from 'path';
import { clearInterval } from 'timers';

const PLUGIN_NAME = 'REPORT_PLUGIN';

export default function reportPlugin () {
  return function (compiler) {
    let ora: OraInstance;
    let chalk: Chalk;
    const reporters = new Map<string, CompilationReporter>();

    // Resolve esm dependencies
    // TODO: How to import ESM from commonjs project?
    compiler.hooks.beforeCompile.tapPromise(PLUGIN_NAME, async () => {
      if (!ora) {
        ora = await import('ora').then(module => module.default);
      }
      if (!chalk) {
        chalk = await import('chalk').then(module => module.default);
      }
    });

    compiler.hooks.compilation.tap(PLUGIN_NAME, c => {
      const reporter = reporters.get(c.name ?? 'Default');
      if (reporter) {
        reporters.set(c.name ?? 'Default', new CompilationReporter(c, true, ora, chalk));
      } else {
        reporters.set(c.name ?? 'Default', new CompilationReporter(c, false, ora, chalk));
      }
    });

    compiler.hooks.afterCompile.tap(PLUGIN_NAME, c => {
      reporters.get(c.name ?? 'Default')?.stop();
    });

  } satisfies WebpackPluginFunction;
}

class CompilationReporter {
  spinner: Ora;
  modules: Set<string>;
  resolvedModules: Set<string>;
  failedModules: Set<Module>;
  warningModules: Set<Module>;
  curr: string = '';
  id: string;
  updateRequest: ReturnType<typeof setInterval> | undefined;
  forceUpdateInterval = 100;
  cwd = process.cwd();

  updateInternal?: () => void;

  constructor (public c: Compilation, private rebuild: boolean, public ora: OraInstance, public chalk: Chalk) {
    this.id = c.name ?? 'Default';
    const spinner = this.spinner = ora({
      prefixText: chalk.gray.bold(`${this.id}`),
    });

    const modules = this.modules = new Set<string>();
    const resolvedModules = this.resolvedModules = new Set<string>();
    const failedModules = this.failedModules = new Set();
    const warningModules = this.warningModules = new Set();

    if (rebuild) {
      c.hooks.buildModule.tap(PLUGIN_NAME, (module) => {
        modules.add(module.identifier());
        this.curr = this.getDisplayName(module);
      });
      c.hooks.succeedModule.tap(PLUGIN_NAME, (module) => {
        resolvedModules.add(module.identifier());
        this.ora({
          text: chalk.gray('rebuilt ') + chalk.white(this.getDisplayName(module)),
          indent: 2,
        }).succeed();
      });
    } else {
      this.spinner.start();
      this.updateInternal = () => {
        if (failedModules.size) {
          spinner.text = `${chalk.gray(`[${resolvedModules.size}/${modules.size}, ${chalk.redBright(`${failedModules.size} failed`)}]`)} ${this.curr}`;
        } else {
          spinner.text = `${chalk.gray(`[${resolvedModules.size}/${modules.size}]`)} ${this.curr}`;
        }
        spinner.render();
      };

      this.updateRequest = setInterval(this.updateInternal, this.forceUpdateInterval);
      c.buildQueue.hooks.added.tap(PLUGIN_NAME, module => {
        modules.add(module.identifier());
      });

      c.buildQueue.hooks.started.tap(PLUGIN_NAME, module => {
        this.curr = this.getDisplayName(module);
      });

      c.buildQueue.hooks.result.tap(PLUGIN_NAME, module => {
        if (module.getErrors()) {
          failedModules.add(module);
        } else {
          resolvedModules.add(module.identifier());
        }
        if (module.getWarnings()) {
          warningModules.add(module);
        }
      });
    }
  }

  parsePnpmLikeName (name: string, limit: boolean) {
    // Example: webpack@5.81.0_webpack-cli@5.0.2/node_modules/webpack
    // Example: webpack-dev-server@4.13.3_webpack-cli@5.0.2_webpack@5.81.0/node_modules/webpack-dev-server/client/utils/stripAnsi.js
    const PNPM_NORMAL_DEP_REGEXP = /^([^@]+)@([^_/]+)(?:_[^/]+)?\/node_modules\/\1\/(.*)$/;
    // Example: @babel+runtime@7.21.0/node_modules/@babel/runtime/helpers/esm/arrayWithHoles.js
    const PNPM_ORG_DEP_REGEXP = /^(@[^+]+)\+([^@]+)@([^_/]+)(?:_[^/]+)?\/node_modules\/\1\/\2\/(.*)$/;

    if (name.startsWith('@')) {
      const res = PNPM_ORG_DEP_REGEXP.exec(name);
      if (res) {
        const [, org, packageName, version, rest] = res;
        return `${this.chalk.bold.cyanBright(`${org}/${packageName}`)}${this.chalk.gray(`@${version}/${limit ? maxLen(rest, 64) : rest}`)}`;
      }
    } else {
      const res = PNPM_NORMAL_DEP_REGEXP.exec(name);
      if (res) {
        const [, packageName, version, rest] = res;
        return `${this.chalk.bold.cyanBright(packageName)}${this.chalk.gray(`@${version}/${limit ? maxLen(rest, 64) : rest}`)}`;
      }
    }

    return name;
  }

  getDisplayName (module: Module, limit = true) {
    const NODE_MODULES_REGEXP = /(?:..\/)*node_modules\/(?:\.pnpm\/)?/;
    const PIPE_REGEXP = /^\w+(?:\/\w+)?\|/g;

    let name = module.identifier();

    let type: 'dep' | 'src' | 'raw';
    let final: string;

    if (PIPE_REGEXP.test(name)) {
      name = name.replace(PIPE_REGEXP, '');
    }

    if (name.startsWith('/')) {
      name = name.split('!').pop()!;
      name = name.split('?')[0];

      const relative = path.relative(this.cwd, name);

      if (NODE_MODULES_REGEXP.test(relative)) {
        type = 'dep';
        final = this.parsePnpmLikeName(relative.replace(NODE_MODULES_REGEXP, ''), limit);
      } else {
        type = 'src';
        final = limit ? maxLen(relative, 64) : relative;
      }
    } else {
      type = 'raw';
      final = this.chalk.gray(`[raw code:${name.length}bytes]`);
    }
    return final;
  };

  stop () {
    clearInterval(this.updateRequest);
    if (this.failedModules.size) {
      this.spinner.fail(`${this.chalk.gray(`[${this.resolvedModules.size}/${this.modules.size}]`)} modules processed (${this.failedModules.size} errors, ${this.warningModules.size} warnings)`);
      this.failedModules.forEach(module => {
        console.error(`${this.chalk.redBright('Failed to process module:')} ${this.getDisplayName(module, false)}`);
        [...module.getErrors()!].forEach(error => {
          console.error(error.message.split('\n').map(line => '  ' + line).join('\n'));
        });
      });
    } else {
      this.spinner.succeed(`${this.chalk.gray(`[${this.resolvedModules.size}/${this.modules.size}]`)} modules processed (${this.warningModules.size} warnings)`);
    }
  }
}

function maxLen (name: string, n: number) {
  if (name.length > n) {
    return '...' + name.slice(-n + 3);
  } else {
    return name;
  }
}