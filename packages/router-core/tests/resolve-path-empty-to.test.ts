import { describe, expect, it } from 'vitest'
import { resolvePath } from '../src/path'

describe('resolvePath empty to', () => {
  it('resolves an empty relative to as the base path (URL resolution)', () => {
    // new URL('', 'http://example.com/a/b').pathname === '/a/b'
    expect(resolvePath({ base: '/a/b', to: '' })).toBe('/a/b')
  })
})
