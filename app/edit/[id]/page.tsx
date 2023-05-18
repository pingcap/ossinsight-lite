import dynamic from 'next/dynamic'

const Edit = dynamic(
  () => import('@/src/_pages/EditWidgetInstance'),
  { ssr: false }
)

export default function Page () {
  return <Edit />
}
