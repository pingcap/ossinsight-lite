'use client';

import RoughSvg from '@ossinsight-lite/roughness/components/RoughSvg';
import clsx from 'clsx';
import { ForwardedRef, forwardRef, HTMLProps, ReactElement, RefAttributes } from 'react';
import DiffAddedIcon from '../../../icons/diff-added.svg';
import DiffRemovedIcon from '../../../icons/diff-removed.svg';
import EyeIcon from '../../../icons/eye.svg';
import NorthStarIcon from '../../../icons/north-star.svg';
import RepoIcon from '../../../icons/repo.svg';
import StarIcon from '../../../icons/star.svg';
import cu from '../curr_user.sql?unique';
import ca from './code_additions.sql?unique';
import cd from './code_deletions.sql?unique';
import cr from './contributed_repos.sql?unique';
import cc from './contribution_count.sql?unique';
import es from './earned_stars.sql?unique';

function Widget ({ forwardedRef, ...props }: HTMLProps<HTMLDivElement> & { forwardedRef: RefAttributes<HTMLDivElement>['ref'] }, _ref: ForwardedRef<HTMLDivElement>) {
  return (
    <div {...props} className={clsx('flex items-center justify-center', props.className)} ref={forwardedRef}>
      <table className="table-auto widget-stats-table">
        <tbody>
        {cells.map(cell => (
          <tr key={cell.key}>
            <td className="inline-flex items-center gap-2">
              <span className="text-gray-500 inline-flex items-center">
                <RoughSvg>
                  {cell.field}
                </RoughSvg>
              </span>
              <span>
                {cell.key}
              </span>
            </td>
            <td>
              <span className="text-gray-700 font-bold">{format(cell.value)}</span>
            </td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  );
}

const cells: CellProps[] = [
  { key: 'Contribution Count', field: <NorthStarIcon width={16} height={16} />, value: cc.contribution_count },
  { key: 'Earned Stars', field: <StarIcon width={16} height={16} />, value: es.earned_stars },
  { key: 'Followers Count', field: <EyeIcon width={16} height={16} />, value: cu.followers_count },
  { key: 'Contributed Repos', field: <RepoIcon width={16} height={16} />, value: cr.contributed_repos },
  { key: 'Code Addition', field: <DiffAddedIcon width={16} height={16} className="text-green-400" />, value: ca.code_additions },
  { key: 'Code Deletions', field: <DiffRemovedIcon width={16} height={16} className="text-red-400" />, value: cd.code_deletions },
];

type CellProps = {
  key: string
  field: ReactElement
  value: any
}

const fmt = new Intl.NumberFormat('en');

const format = (num: number) => {
  return fmt.format(num);
};

export default forwardRef(Widget);
