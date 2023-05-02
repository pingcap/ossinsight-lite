import { program } from 'commander';

import * as yup from 'yup';
import dev from './dev.js';
import buildPage from './build-page.js';
import buildBrowser from './build-browser.js';
import serve from './serve.js';

program
  .command('dev', {
    isDefault: true,
  })
  .description('Start a dev server')
  .action(async () => {
    await dev();
  });

program
  .command('build')
  .argument('<target>', 'Select a target (site, lib)')
  .option('-D --domain [domain]', 'Domain to deploy')
  .action(async (targetArg: string, options: any) => {
    const target = await yup.string().oneOf(['site', 'lib']).required().validate(targetArg);
    switch (target) {
      case 'site': {
        await buildPage({
          siteDomain: options.domain === true ? undefined : options.domain,
        });
        await buildBrowser();
      }
        break;
      default: {
        throw new Error('not impl');
      }
    }
  });

program
  .command('serve')
  .action(async () => {
    await serve();
  });

void program.parseAsync();
