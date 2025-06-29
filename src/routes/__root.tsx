/// <reference types="vite/client" />
import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import * as React from 'react'
import { queryOptions, type QueryClient } from '@tanstack/react-query'
import { DefaultCatchBoundary } from '~/components/DefaultCatchBoundary'
import { NotFound } from '~/components/NotFound'
import appCss from '~/styles/app.css?url'
import { seo } from '~/utils/seo'

const testQueryOptions = queryOptions({
  queryKey: ["testQuery"],
  queryFn: async () => {
    const response = await fetch("https://jsonplaceholder.typicode.com/users/");
    const data = await response.json()
    return data
  },
  staleTime: 2,
  gcTime: 2,
  refetchOnReconnect: false,
});
export const Route = createRootRouteWithContext<{ 
  queryClient: QueryClient
}>()({
  beforeLoad: async ({ context }) => {
    await context.queryClient.ensureQueryData(testQueryOptions);
    const testQueryCacheOptions = context.queryClient.getQueryCache().get(JSON.stringify(testQueryOptions.queryKey));
    console.log("gcTime", testQueryCacheOptions?.gcTime);
    const ret = {
      gcTime: testQueryCacheOptions!.gcTime,
      optionsGcTime: testQueryCacheOptions!.options.gcTime,
      // @ts-expect-error
      staleTime: testQueryCacheOptions!.options.staleTime,
      // @ts-expect-error
      refetchOnReconnect: testQueryCacheOptions!.options.refetchOnReconnect,
    }
    console.log("ret", ret);
    return ret;
  },
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      ...seo({
        title:
          'TanStack Start | Type-Safe, Client-First, Full-Stack React Framework',
        description: `TanStack Start is a type-safe, client-first, full-stack React framework. `,
      }),
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/apple-touch-icon.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/favicon-32x32.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: '/favicon-16x16.png',
      },
      { rel: 'manifest', href: '/site.webmanifest', color: '#fffff' },
      { rel: 'icon', href: '/favicon.ico' },
    ],
  }),
  errorComponent: (props) => {
    return (
      <RootDocument>
        <DefaultCatchBoundary {...props} />
      </RootDocument>
    )
  },
  notFoundComponent: () => <NotFound />,
  component: RootComponent,
})

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body>
        <div className="p-2 flex gap-2 text-lg">
          <Link
            to="/test-query"
            activeProps={{
              className: 'font-bold',
            }}
          >
            Click here to test Test Query
          </Link>{' '}
        </div>
        <hr />
        {children}
        <TanStackRouterDevtools position="bottom-right" />
        <ReactQueryDevtools buttonPosition="bottom-left" />
        <Scripts />
      </body>
    </html>
  )
}
