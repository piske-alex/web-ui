// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */

// import 'zone.js/dist/zone-error';  // Included with Angular CLI.

export class EnvironmentConstant {
  // public static API_URL = 'http://localhost:4200/api';
  // public static API_URL = 'http://10.20.100.211:80/api';
  public static AVATAR = 'http://office.ddns.need.sh:8011/avatar';
  public static API_URL = 'http://office.ddns.need.sh:8011/api';
  public static API_URL_V1 = EnvironmentConstant.API_URL;

}
