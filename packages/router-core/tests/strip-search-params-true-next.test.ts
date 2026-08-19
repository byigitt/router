import { describe, expect, test } from 'vitest'
import { createMemoryHistory } from 'speedy-router-history'
import { createRootRoute, createRoute } from '../src/route'
import { createRouter } from '../src/router'
import { stripSearchParams, retainSearchParams } from '../src/search-middleware'
import { applySearchMiddleware } from '../src/router-search'

describe('stripSearchParams(true) calls next()', () => {
  test('dest search updater is applied when stripSearchParams(true) is present', async () => {
    const root = createRootRoute({
      validateSearch: (s: Record<string, unknown>) => s,
      search: {
        middlewares: [stripSearchParams(true)],
      },
    } as any)
    const index = createRoute({ getParentRoute: () => root, path: '/' })
    const about = createRoute({ getParentRoute: () => root, path: '/about' })
    root.addChildren([index, about])

    const router = createRouter({
      routeTree: root,
      history: createMemoryHistory({ initialEntries: ['/?keep=1'] }),
      isServer: true,
    })
    await router.load()
    await router.navigate({ to: '/about', search: { explicit: 'yes' } } as any)

    expect(router.state.location.search).toEqual({ explicit: 'yes' })
  })

  test('middleware after stripSearchParams(true) still runs', () => {
    let downstreamCalls = 0
    const root = createRootRoute({
      search: {
        middlewares: [
          stripSearchParams(true),
          ({ search, next }) => {
            downstreamCalls++
            return next({ ...search, fromDownstream: true })
          },
        ],
      },
    } as any)
    const index = createRoute({ getParentRoute: () => root, path: '/' })
    root.addChildren([index])

    const result = applySearchMiddleware({ keep: 1 }, { search: true }, [root, index], false)
    expect(downstreamCalls).toBe(1)
    expect(result).toEqual({ fromDownstream: true })
  })

  test('retainSearchParams before stripSearchParams(true) can restore keys', async () => {
    const root = createRootRoute({
      validateSearch: (s: Record<string, unknown>) => s,
      search: {
        middlewares: [retainSearchParams(['keep'] as any), stripSearchParams(true)],
      },
    } as any)
    const index = createRoute({ getParentRoute: () => root, path: '/' })
    const about = createRoute({ getParentRoute: () => root, path: '/about' })
    root.addChildren([index, about])

    const router = createRouter({
      routeTree: root,
      history: createMemoryHistory({ initialEntries: ['/?keep=1'] }),
      isServer: true,
    })
    await router.load()
    await router.navigate({ to: '/about', search: true } as any)
    expect(router.state.location.search).toEqual({ keep: 1 })
  })
})
