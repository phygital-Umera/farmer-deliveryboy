import DeliveryApp from '@/pages/DeliveryApp'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/homepage')({
  component: RouteComponent,
})

function RouteComponent() {
  return <DeliveryApp/>
}
