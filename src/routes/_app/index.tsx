import { createFileRoute } from '@tanstack/react-router';

import DeliveryApp from '@/pages/DeliveryApp';
import SignIn from '@/pages/SignIn';

export const Route = createFileRoute('/_app/')({
  component: SignIn,
});



