import { OrderTaskView } from '@/components/maincomponents/OrderTaskView'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/_orderFlow/ordersDetails/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  return <OrderTaskView />
}
