export type IconProvider = 'octicons' | 'twbs';

export default async function main (provider: IconProvider, name: string, options: Record<string, any>) {
  switch (provider) {
    case 'octicons': {
      return await import('./octoicons.js').then(module => module.checkout(name, options));
    }
    case 'twbs': {
      return await import('./twbs.js').then(module => module.checkout(name, options));
    }
  }
}
