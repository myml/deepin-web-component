import { Pipe, PipeTransform } from '@angular/core';
import { debounceTime, Observable, Subject } from 'rxjs';

@Pipe({
  name: 'debounceTime',
})
export class DebounceTimePipe implements PipeTransform {
  transform<T>(obs: Observable<T> | Subject<T>, time: number) {
    return obs.pipe(debounceTime(time));
  }
}
