import { library } from '@/core/bind';
import { LibraryItem } from '@/utils/types/config';

export default function ({ id, item }: { id: string, item: LibraryItem }) {
  if (library.has(id)) {
    library.update(id, item);
  } else {
    library.add(id, item);
  }
}
