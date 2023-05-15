import { useCollection, useCollectionKeys } from '@oss-widgets/ui/hooks/bind';

export default function NavBar () {
  const menus = useCollection('menu.navbar');

  const menuKeys = useCollectionKeys(menus)

  return (
    <nav>

    </nav>
  )
}