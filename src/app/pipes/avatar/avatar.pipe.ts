import { Pipe, PipeTransform } from '@angular/core';
import { EnvironmentConstant } from '../../../environments/environment';

@Pipe({
  name: 'avatar'
})
export class AvatarPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (!value) {
      return '/assets/images/logo.jpg';
    }
    if (value && value.indexOf('data:image/') !== -1) {
      return value;
    }
    return EnvironmentConstant.AVATAR + '/' + value;
  }

}
