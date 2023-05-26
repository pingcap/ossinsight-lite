import { BindBase } from './BindBase';
import { ReactiveValue, ReactiveValueSubject } from './ReactiveValueSubject';
import { SingletonsBindMap } from './types';

export class ReactBindSingletons extends BindBase<{ [P in keyof SingletonsBindMap]: ReactiveValue<SingletonsBindMap[P]> }, [SingletonsBindMap[keyof SingletonsBindMap]]> {
  public static readonly default = new ReactBindSingletons();
  readonly _key = 'singletons';

  protected initialize (arg: any): any {
    return new ReactiveValueSubject(arg);
  }
}
