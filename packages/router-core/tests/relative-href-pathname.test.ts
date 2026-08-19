import { describe, expect, test } from 'vitest'
import { createMemoryHistory } from 'speedy-router-history'
import { createRootRoute, createRoute } from '../src/route'
import { createRouter } from '../src/router'

describe('relative search/hash href navigation', () => {
  test('navigating to "?q=1" from /posts keeps the posts path and updates search', async () => {
    const root = createRootRoute({
      validateSearch: (s: Record<string, unknown>) => s,
    } as any)
    const posts = createRoute({
      getParentRoute: () => root,
      path: '/posts',
      loader: () => 'posts',
    })
    root.addChildren([posts] as any)

    const router = createRouter({
      routeTree: root as any,
      history: createMemoryHistory({ initialEntries: ['/posts?old=1#old'] }),
      isServer: true,
    })
    await router.load()

    await router.navigate({ href: '?q=1' } as any)

    expect(router.state.location.pathname).toBe('/posts')
    expect(router.state.location.search).toEqual({ q: 1 })
    expect(router.state.location.hash).toBe('')
  })

  test('navigating to "#section" from /about keeps /about', async () => {
    const root = createRootRoute({
      validateSearch: (search: Record<string, unknown>) => search,
    } as any)
    const about = createRoute({
      getParentRoute: () => root,
      path: '/about',
      loader: () => 'about',
    })
    root.addChildren([about] as any)

    const router = createRouter({
      routeTree: root as any,
      history: createMemoryHistory({ initialEntries: ['/about?q=1'] }),
      isServer: true,
    })
    await router.load()

    await router.navigate({ href: '#section' } as any)

    expect(router.state.location.pathname).toBe('/about')
    expect(router.state.location.search).toEqual({ q: 1 })
    expect(router.state.location.hash).toBe('section')
  })
})
