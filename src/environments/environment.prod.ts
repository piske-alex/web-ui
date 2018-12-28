export const environment = {
  production: true
};

export class EnvironmentConstant {
  // public static API_URL = 'http://10.20.100.211:80/api';
  public static AVATAR = '/avatar';
  public static API_URL = '/api';
  public static API_URL_V1 = EnvironmentConstant.API_URL;
  public static MINIO_URL_V1 = 'https://minio.otcfiretesting.space';
}
