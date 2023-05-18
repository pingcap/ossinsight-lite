import CopyIcon from '../icons/copy.svg';
import { useCallback, useEffect, useState } from 'react';
import RoughSvg from '@ossinsight-lite/roughness/components/RoughSvg';

export default function CopyButton ({ content }: { content: string }) {
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState<unknown>();
  const handleClick = useCallback(() => {
    navigator.clipboard.writeText(content)
      .then(() => setCopied(true))
      .catch(err => setFailed(err));
  }, [content]);

  useEffect(() => {
    setCopied(false);
    setFailed(undefined);
  }, [content]);

  return (
    <button className="inline-flex items-center gap-2 text-sm" onClick={handleClick}>
      <span>{copied ? 'Copied!' : failed ? 'Failed to copy' : ''}</span>
      <RoughSvg>
        <CopyIcon className='text-gray-600' width={24} height={24} />
      </RoughSvg>
    </button>
  );
}