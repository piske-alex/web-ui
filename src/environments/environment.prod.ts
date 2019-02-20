export const environment = {
  production: true
};

export class EnvironmentConstant {
  public static AVATAR = 'https://minio.koin.minus.cafe/avatar';
  public static API_URL = 'https://api.koin.minus.cafe/api';
  public static API_URL_V1 = EnvironmentConstant.API_URL;
  public static MINIO_URL_V1 = '';
  // public static CHATING_TOPIC_KEYWORD = '_dev01'; // for master branch
   public static CHATING_TOPIC_KEYWORD = '_prd01'; // for prd branch
}
