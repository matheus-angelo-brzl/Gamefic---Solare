import { Access } from './access.decorator';

describe('Access', () => {
  it('should be a function', () => {
    expect(typeof Access).toBe('function');
  });

  it('should return a decorator function', () => {
    const decorator = Access('public');
    expect(typeof decorator).toBe('function');
  });
});
