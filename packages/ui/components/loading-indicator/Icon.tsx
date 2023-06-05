import { forwardRef, SVGProps } from 'react';
import './style.scss';

const LoadingIndicator = forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>(function Icon (props, ref) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="loading-indicator" width="1em" height="1em" viewBox="0 0 10 10" {...props} ref={ref}>
      <circle r="4.5" cx="5" cy="5" stroke="currentColor" opacity="0.2" fill="none" />
      <circle className="loading-indicator-bar" r="4.5" cx="5" cy="5" stroke="currentColor" fill="none" strokeLinecap="round" strokeDashoffset="0" strokeDasharray="24" />
    </svg>
  );
});

export default LoadingIndicator;
