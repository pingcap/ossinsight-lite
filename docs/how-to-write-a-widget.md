# How to write a widget

All widgets are written in `React` and should be placed
in [packages/widgets/src/widgets](../packages/widgets/src/widgets).

- Create a subdirectory with an `index.ts`
- Required exports:
  ```typescript
  /** This is the displaying component of your widget */
  export const Widget = () => import('path_to_your_widget_component');
  ```
- Optional exports:
  ```typescript
  /** This is the configure component of your widget. If provided, your widget will show a configure button in edit mode. */
  export const ConfigureComponent = () => import('path_to_your_configure_component');
  
  /** If true, your widget will show a style customization button in edit mode */
  export const styleConfigurable = true;
  
  /** If true, your widget will be able to clone. */
  export const duplicable = true; 
  
  export const defaultProps = { ... };
  export const category = 'Your widget\'s category';
  export const displayName = 'Your widget\'s display name';
  ```

## Widget details

### `Widget` and `ConfigureComponent`

The main entry of your widget. App will pass several props (may include some HTML div props) and a `forwardedRef` prop
to your component, extra props should be passed to your container `div` element.

```typescript jsx
import WidgetContext from '@/packages/ui/context/widget';

function Widget ({ customProp1, customProp2, ...props }) {
  const {
    visible,
    onPropChange,
    configuring,
  } = useContext(WidgetContext);
  
  //// in some callback
  //  onPropChange('customProp1', 'new value')
  //...
  
  //// in some effect
  //  if (visible) { /** do some heavy jobs */ }
  //
  
  return <div {...props}>...</div>;
}
```

Your widget could update custom props (not just in configure component). A
function `onPropChange(key: string, value: any): void` was provided by `WidgetContext` to submit your propChanges. All
props changes will finally be submitted to database.

See markdown widget [example](../packages/widgets/src/widgets/markdown/index.ts) 