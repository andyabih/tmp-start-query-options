import { createFileRoute, Link } from '@tanstack/react-router'
import { z } from 'zod'


export const Route = createFileRoute('/test-query')({
    component: RouteComponent,
    validateSearch: z.object({
        counter: z.number().optional().default(0)
    }),
    loaderDeps: ({ search }) => ({ search }),
    loader: async ({ context }) => {
        return {
            ...context
        }
    }
})

function RouteComponent() {
    const {
        gcTime,
        staleTime,
        refetchOnReconnect,
        optionsGcTime,
    } = Route.useLoaderData();

    const { counter } = Route.useSearch();
    return (
        <div>
            <p>Counter: {counter}</p>

            <ul>
                <li>gcTime: {gcTime}</li>
                <li>staleTime: {staleTime}</li>
                <li>refetchOnReconnect: {refetchOnReconnect ? "true" : "false"}</li>
                <li>optionsGcTime: {optionsGcTime}</li>
            </ul>
            
            <Link
                to="."
                search={(prev) => ({
                    ...prev,
                    counter: prev.counter ? prev.counter + 1 : 1,
                })}
            >
                Increment
            </Link>
        </div>
    )
}
