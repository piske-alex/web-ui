import { CoinNumberPipe } from './coin-number.pipe';

describe('CoinNumberPipe', () => {
  it('create an instance', () => {
    const pipe = new CoinNumberPipe();
    expect(pipe).toBeTruthy();
  });
});
