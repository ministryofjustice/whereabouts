import errorStatusCode from '../error-status-code'

describe('Should translate errors', () => {
  describe('error has response', () => {
    it('should return status', () => {
      expect(errorStatusCode({ response: { status: 'code' } })).toBe('code')
    })
    it('should ignore response if no status', () => {
      expect(errorStatusCode({ response: { joe: 'code' } })).toBe(500)
    })
  })
  describe('error has code', () => {
    it('should return 503 if connection refused', () => {
      expect(errorStatusCode({ code: 'ECONNREFUSED' })).toBe(503)
    })
    it('should ignore code if any other value', () => {
      expect(errorStatusCode({ code: 'code' })).toBe(500)
    })
  })
  it('should return 500 for missing error', () => {
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 1 arguments, but got 0.
    expect(errorStatusCode()).toBe(500)
  })
  it('should default to 500', () => {
    expect(errorStatusCode({ some: 'error' })).toBe(500)
  })
})
