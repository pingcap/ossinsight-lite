import { ComponentType, SVGProps } from 'react';
import VerticalEnd from './icons/align-bottom.svg';
import HorizontalCenter from './icons/align-center.svg';
import HorizontalEnd from './icons/align-end.svg';
import VerticalCenter from './icons/align-middle.svg';
import HorizontalStart from './icons/align-start.svg';
import VerticalStart from './icons/align-top.svg';

export type AlignIcons = {
  Start: ComponentType<SVGProps<SVGSVGElement>>
  Center: ComponentType<SVGProps<SVGSVGElement>>
  End: ComponentType<SVGProps<SVGSVGElement>>
}

export const vertical: AlignIcons = {
  Start: VerticalStart,
  Center: VerticalCenter,
  End: VerticalEnd,
};

export const horizontal: AlignIcons = {
  Start: HorizontalStart,
  Center: HorizontalCenter,
  End: HorizontalEnd,
};
