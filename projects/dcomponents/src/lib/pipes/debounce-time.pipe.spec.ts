import { DebounceTimePipe } from './debounce-time.pipe';

describe('DebounceTimePipe', () => {
  it('create an instance', () => {
    const pipe = new DebounceTimePipe();
    expect(pipe).toBeTruthy();
  });
});
