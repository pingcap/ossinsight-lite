import { FC } from 'react';
import { Provider as ReduxProvider, ProviderProps } from 'react-redux';
import { AnyAction } from 'redux';
import store, { State } from './store';

export type StoreProviderProps = Omit<ProviderProps<AnyAction, State>, 'store'>;

const StoreProvider: FC<StoreProviderProps> = ({ children, ...props }) => {
  return (
    <ReduxProvider store={store} {...props}>
      {children}
    </ReduxProvider>
  );
};

StoreProvider.displayName = 'StoreProvider';

export { StoreProvider };
