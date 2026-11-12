import App from '@/App'
import { AppLayout } from '@/layouts'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/app')({
  component: RouteComponent,
})

function RouteComponent() {
  return <AppLayout/>
}
