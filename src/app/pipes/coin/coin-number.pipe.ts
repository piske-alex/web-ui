import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'coinNumber'
})
export class CoinNumberPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value && !isNaN(+value)) {
      return (+value).toFixed(8);
    } else {
      return value;
    }
  }

}
