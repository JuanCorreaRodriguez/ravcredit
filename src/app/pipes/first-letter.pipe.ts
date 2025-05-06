import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'firstLetter'
})
export class FirstLetterPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): unknown {
    if (!value) return value
    return value[0].toUpperCase() + value.substr(1).toLowerCase();
  }

}
