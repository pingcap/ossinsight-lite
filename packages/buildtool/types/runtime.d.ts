declare module '@oss-widgets/runtime' {

  /**
   * Indicate when component should disable animations.
   */
  export const prerenderMode: boolean;

  /**
   * If react component not using this function, the prerender program might finish render procedure.
   * Prerender program will still wait network idle after first render, not all components needs this.
   *
   * @see bin/thumbnail.ts
   * @returns A callback function to tell the prerender program the async render was finished.
   */
  export const usePrerenderCallback: () => () => void;
}
