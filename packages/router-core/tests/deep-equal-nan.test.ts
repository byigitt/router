import { describe, expect, it } from 'vitest'
import { deepEqual } from '../src/utils'

describe('deepEqual NaN breaks match/deps identity', () => {
  it('deepEqual(NaN, NaN) is true so loaderDeps with NaN can reuse matches', () => {
    expect(deepEqual({ n: NaN }, { n: NaN })).toBe(true)
  })
})
