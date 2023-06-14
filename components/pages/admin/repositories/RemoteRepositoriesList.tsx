'use client';

import { Alert } from '@/components/Alert';
import LoadingIndicator from '@/packages/ui/components/loading-indicator';
import useRefCallback from '@/packages/ui/hooks/ref-callback';
import * as RuiPopover from '@radix-ui/react-popover';
import CheckedIcon from 'bootstrap-icons/icons/check.svg';

import { ChangeEvent, cloneElement, ReactElement, useCallback, useEffect, useMemo, useRef, useState, useTransition } from 'react';
import { asyncScheduler, debounceTime, Subject } from 'rxjs';

export function RemoteRepositoriesList ({ children, id, name, selectedNames, clearVersion }: { children: ReactElement, id?: string, name?: string, selectedNames: string[], clearVersion: number }) {
  const [selected, setSelected] = useState('');

  useEffect(() => {
    if (clearVersion > 0) {
      setSelected('');
    }
  }, [clearVersion]);

  return (
    <>
      <input id={id} name={name} hidden value={selected} readOnly />
      <Popper selectedNames={selectedNames} onSelect={setSelected} selected={selected} clearVersion={clearVersion}>
        {children}
      </Popper>
    </>
  );
}

function Popper ({ selected, selectedNames, onSelect, children, clearVersion }: { selected: string, selectedNames: string[], onSelect: (repo: string) => void, children: ReactElement, clearVersion: number }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const { finalSearch, loading, fetching, result, error } = useSearchRepo({ search });

  useEffect(() => {
    if (clearVersion > 0) {
      setSearch('');
    }
  }, [clearVersion]);

  const handleChange = useCallback((ev: ChangeEvent<HTMLInputElement>) => {
    setSearch(ev.target.value);
    onSelect('');
  }, []);

  const handleFocus = useCallback(() => {
    setOpen(true);
  }, []);

  const handleSelect = useRefCallback((repo: string) => {
    onSelect(repo);
    setOpen(false);
  });

  return (
    <RuiPopover.Root open={open} onOpenChange={setOpen}>
      <RuiPopover.Trigger asChild>
        <RuiPopover.Anchor asChild>
          {cloneElement(children, { value: selected || search, onChange: handleChange })}
        </RuiPopover.Anchor>
      </RuiPopover.Trigger>
      <RuiPopover.Portal>
        <RuiPopover.Content className="remote-popper-content" onOpenAutoFocus={preventDefault} align="start" sideOffset={12}>
          {fetching
            ? <Searching search={finalSearch} />
            : error
              ? <Alert type="error" title="Failed to search" message={String((error as any).message ?? error)} />
              : result
                ? <ResultList repos={result} selectedNames={selectedNames} onSelect={handleSelect} />
                : <Pending search={search} />}
        </RuiPopover.Content>
      </RuiPopover.Portal>
    </RuiPopover.Root>
  );
}

function Pending ({ search }: { search: string }) {
  return (
    <div className="text-secondary">
      {`Search '${search}' in GitHub`}
    </div>
  );
}

function Searching ({ search }: { search: string }) {
  return (
    <div className="text-secondary flex gap-2 items-center">
      <LoadingIndicator />
      Searching for '{search}'
    </div>
  );
}

function ResultList ({ repos, selectedNames, onSelect }: { repos: { full_name: string, owner: { avatar_url: string } }[], selectedNames: string[], onSelect: (selected: string) => void }) {
  const selected = useMemo(() => new Set(selectedNames), [selectedNames]);

  return (
    <ul className="remote-repo-list">
      {repos.map(repo => (
        <li key={repo.full_name}>
          <button className="remote-repo" data-selected={selected.has(repo.full_name)} onClick={() => onSelect(repo.full_name)}>
            <img className="owner-avatar" src={repo.owner.avatar_url} alt={repo.owner.avatar_url} />
            <span className="repo-name">{repo.full_name}</span>
            {selected.has(repo.full_name) ? <CheckedIcon width={16} height={16} /> : null}
          </button>
        </li>
      ))}
    </ul>
  );
}

function useSearchRepo ({ search }: { search: string }) {
  const subject = useMemo(() => {
    return new Subject<string>();
  }, []);

  useEffect(() => {
    const sub = subject.pipe(debounceTime(1000, asyncScheduler))
      .subscribe(next => setFinalSearch(next));
    return () => {
      sub.unsubscribe();
    };
  }, []);

  useEffect(() => {
    subject.next(search);
    startTransition(() => {
      setResult(undefined);
      setError(undefined);
      setFetching(false);
      abortController.current?.abort();
    });
  }, [search]);

  const [finalSearch, setFinalSearch] = useState(search);

  const [result, setResult] = useState<{ full_name: string, owner: { avatar_url: string } }[]>();
  const [error, setError] = useState<unknown>();
  const [fetching, setFetching] = useState(false);
  const [transitioning, startTransition] = useTransition();

  const abortController = useRef<AbortController>();

  useEffect(() => {
    abortController.current?.abort();
    const controller = abortController.current = new AbortController();
    if (!finalSearch) {
      return;
    }

    startTransition(() => {
      setFetching(true);
      setResult(undefined);
      setError(undefined);
      void fetch(`https://api.github.com/search/repositories?q=${encodeURIComponent(finalSearch)}&per_page=10`, {
        signal: controller.signal,
      })
        .then(res => {
          if (!res.ok) {
            return Promise.reject(new Error(`${res.status} ${res.statusText}`));
          }
          return res.json();
        })
        .then(res => {
          setResult(res.items);
        })
        .catch((error) => {
          setError(error);
        })
        .finally(() => {
          setFetching(false);
        });
    });

    return () => {
      controller.abort('unmount');
    };
  }, [finalSearch]);

  return { loading: fetching || transitioning, fetching, result, error, finalSearch };
}

function preventDefault (e: Event) {
  e.preventDefault();
}
