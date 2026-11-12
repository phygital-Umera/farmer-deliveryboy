import * as React from 'react';
import {Outlet, createRootRouteWithContext} from '@tanstack/react-router';
import RootLayout from './../layouts/RootLayout';
import {AuthContextType} from '@/types';

export interface RouterContext {
  auth: AuthContextType;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
});
