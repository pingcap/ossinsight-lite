import ora, { Ora } from 'ora';

type Level = 'succeed' | 'warn' | 'info' | 'fail';
type Text<R> = string | ((r: R) => string | [Level, string])

export async function withOra<R = any> (
  processing: Text<void>,
  success: Text<R>,
  fail: Text<unknown>,
  run: () => R | Promise<R>,
) {
  ora();
  const indicator = ora(anyText(processing, undefined)).start();

  try {
    const result = await run();
    indicator.stop();
    indicate(indicator, 'succeed', text(success, result));
    return result;
  } catch (e) {
    indicate(indicator, 'fail', text(fail, e));
    throw e;
  }
}

function text<R> (raw: Text<R>, arg: R): string | [Level, string] {
  if (typeof raw === 'string') {
    return raw;
  }
  return raw(arg);
}

function anyText<R> (raw: Text<R>, arg: R): string {
  const res = text(raw, arg);
  if (typeof res === 'string') {
    return res;
  } else {
    return res[1];
  }
}

function indicate (ora: Ora, defaultLevel: Level, text: string | [Level, string]) {
  if (typeof text === 'string') {
    ora[defaultLevel](text);
  } else {
    ora[text[0]](text[1]);
  }
  return ora;
}
