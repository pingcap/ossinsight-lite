import { KeyType } from './types';

export class BindKeyDuplicatedError extends Error {
  constructor (public readonly type: KeyType) {
    super(`[react-bind] Collection for bind key ${String(type)} was already created.`);
  }
}

export class BindKeyNotExistsError extends Error {
  constructor (public readonly type: KeyType, parent?: KeyType) {
    super(`[react-bind] Collection for bind key ${String(type)} not exists. (${String(parent)})`);
  }
}