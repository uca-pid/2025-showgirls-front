import { calculateBalance } from "..";

describe('calculateBalance', () => {
  it('should add amount to balance for income type', () => {
    expect(calculateBalance(100, 50, 'income')).toBe(150);
  });

  it('should subtract amount from balance for expense type', () => {
    expect(calculateBalance(100, 50, 'expense')).toBe(50);
  });

  it('should return the same balance for unknown type', () => {
    expect(calculateBalance(100, 50, 'other')).toBe(100);
  });
});
