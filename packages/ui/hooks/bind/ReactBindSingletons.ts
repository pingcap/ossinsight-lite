import { BindBase } from './BindBase';
import { SingletonsBindMap } from './types';
import { ReactiveValue, ReactiveValueSubject } from './ReactiveValueSubject';

export class ReactBindSingletons extends BindBase<{ [P in keyof SingletonsBindMap]: ReactiveValue<SingletonsBindMap[P]> }, [SingletonsBindMap[keyof SingletonsBindMap]]> {
  protected initialize (arg: any): any {
    return new ReactiveValueSubject(arg);
  }

  readonly _key = 'singletons';

  public static readonly default = new ReactBindSingletons();
}
