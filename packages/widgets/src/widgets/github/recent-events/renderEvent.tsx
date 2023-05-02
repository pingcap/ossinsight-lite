import { components } from '@octokit/openapi-types';
import { ReactNode } from 'react';
import RepoPushIcon from '../../../icons/octicons/repo-push.svg';
import RepoForkedIcon from '../../../icons/octicons/repo-forked.svg';
import CommentIcon from '../../../icons/octicons/comment.svg';
import RoughSvg from '@oss-widgets/roughness/components/RoughSvg';

export function renderEvent (event: components['schemas']['event']): ReactNode {
  switch (event.type) {
    case 'PushEvent':
      return (
        <>
          <RoughSvg>
            <RepoPushIcon width={16} height={16} />
          </RoughSvg>
          {' '}
          pushed {(event.payload as any).commits.length} commits to <a href={event.repo.url} target='_blank'>{event.repo.name}</a>
        </>
      );
    case 'ForkEvent':
      return (
        <>
          <RoughSvg>
            <RepoForkedIcon width={16} height={16} />
          </RoughSvg>
          {' '}
          forked <a href={event.repo.url}>{event.repo.name}</a>
        </>
      )
    case 'IssueCommentEvent':
      return (
        <>
          <RoughSvg>
            <CommentIcon width={16} height={16} />
          </RoughSvg>
          {' '}
          {event.payload.action}
          {' '}
          <a href={event.payload.comment.url} target='_blank'>comment</a>
          {' to '}
          <a href={event.repo.url} target='_blank'>{event.repo.name}</a>
          <a href={event.payload.issue.url}>#{event.payload.issue.number}</a>
        </>
      )
    default:
      return <span className='text-gray-300'>&lt;{event.type}&gt;</span>;
  }
}