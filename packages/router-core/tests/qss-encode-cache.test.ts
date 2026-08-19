import { describe, expect, it } from 'vitest'
import { encode } from '../src/qss'

describe('encode identity cache', () => {
  it('must not return a stale string after the same object is mutated', () => {
    const obj = { a: 1 }
    expect(encode(obj)).toBe('a=1')
    obj.a = 2
    expect(encode(obj)).toBe('a=2')
  })
})
