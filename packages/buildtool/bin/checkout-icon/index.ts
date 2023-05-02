export type IconProvider = 'octicons';

export default async function main (provider: IconProvider, name: string, options: Record<string, any>) {
  switch (provider) {
    case 'octicons': {
      return await import('./octoicons.js').then(module => module.checkout(name, options));
    }
  }
}
