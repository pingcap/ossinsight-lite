import { program } from 'commander';

import * as yup from 'yup';

program
  .command('dev', {
    isDefault: true,
  })
  .description('Start a dev server')
  .action(async () => {
    await (await import('./dev.js')).default();
  });

program
  .command('build')
  .argument('<target>', 'Select a target (site, lib)')
  .option('-D --domain [domain]', 'Domain to deploy')
  .option('-T --generate-thumbnails', 'Generate thumbnails for widgets, requires puppeteer installed')
  .action(async (targetArg: string, options: any) => {
    const buildPage = (await import('./build-page.js')).default;
    const buildBrowser = (await import('./build-browser.js')).default;
    const target = await yup.string().oneOf(['site', 'lib']).required().validate(targetArg);
    switch (target) {
      case 'site': {
        await buildPage({
          siteDomain: options.domain === true ? undefined : options.domain,
        });
        await buildBrowser();

        if (options['generateThumbnails'] === true || (process.env.CI && options['generateThumbnails'] !== false)) {
          await import('./prepare-browser.js').then(module => module.default());
          await import('./thumbnail.js').then(module => module.default());
        }
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
    await (await import('./serve.js')).default();
  });

program
  .command('thumbnail')
  .action(async () => {
    await (await import('./thumbnail.js')).default();
  });

program
  .command('prepare')
  .argument('<mod>', 'Supported: browser')
  .action(async (mod: string) => {
    const resolvedMod = await yup.string().required().oneOf(['browser']).validate(mod);

    switch (resolvedMod) {
      case 'browser': {
        await (await import('./prepare-browser.js')).default();
      }
    }
  });

program
  .command('checkout-icon')
  .argument('<provider>', 'Available: octicons')
  .argument('<name>', 'Icon name')
  .option('-S --size <size>', 'size', numberOption)
  .option('-W --width <width>', 'width', numberOption)
  .option('-H --height <height>', 'height', numberOption)
  .option('-p --path <path>', 'output path')
  .option('--label <label>', 'aria label')
  .action(async (rawProvider: string, name: string, options: any) => {
    const provider = await yup.string().oneOf(['octicons']).required().validate(rawProvider);
    const fn = await import('./checkout-icon/index.js').then(module => module.default(provider, name, options));
    console.log(`Checkout ${provider}/${name} at ${fn}`);
  });

void program.parseAsync();

function numberOption (n: string): number | undefined {
  const value = parseFloat(n);
  if (!isFinite(value)) {
    throw new Error(`'${n}' is not a valid number`);
  }

  return value;
}
