import { describe, expect, test, vi } from 'vitest'
import { createMemoryHistory } from '../src/memory'

describe('memory history back/forward at stack edges', () => {
  test('back() at the first entry must not notify subscribers', () => {
    const history = createMemoryHistory({ initialEntries: ['/a', '/b'] })
    history.back() // now at /a (index 0)
    expect(history.location.pathname).toBe('/a')

    const subscriber = vi.fn()
    history.subscribe(subscriber)
    history.back() // already at start — no location change

    expect(history.location.pathname).toBe('/a')
    expect(subscriber).not.toHaveBeenCalled()
  })

  test('forward() at the last entry must not notify subscribers', () => {
    const history = createMemoryHistory({ initialEntries: ['/a', '/b'] })
    expect(history.location.pathname).toBe('/b')

    const subscriber = vi.fn()
    history.subscribe(subscriber)
    history.forward()

    expect(history.location.pathname).toBe('/b')
    expect(subscriber).not.toHaveBeenCalled()
  })
})
