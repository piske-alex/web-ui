import { EnvironmentConstant } from '../../../environments/environment';

export class RouteJson {
  method: string;
  url: string;

  constructor(method, apiUrl, url: string) {
    this.method = method;
    this.url = apiUrl + url;
  }
}

export class RouteMap {
  static METHODS = {
    GET: 'get',
    POST: 'post',
    PUT: 'put',
    DELETE: 'delete'
  };
  private static API_URL_V1 = EnvironmentConstant.API_URL_V1;
  private static BACK_GROUND_URL_V1 = EnvironmentConstant.BG_URL;
  static V1 = {
    COMMON: {
      COUNTRY: new RouteJson(RouteMap.METHODS.GET, RouteMap.API_URL_V1, '/info/country'),
      CURRENCY: new RouteJson(RouteMap.METHODS.GET, RouteMap.API_URL_V1, '/info/currency'),
      LANGUAGE: new RouteJson(RouteMap.METHODS.GET, RouteMap.API_URL_V1, '/info/language'),
      PAY_TYPE: new RouteJson(RouteMap.METHODS.GET, RouteMap.API_URL_V1, '/info/pay'),
      COIN_TYPE: new RouteJson(RouteMap.METHODS.GET, RouteMap.API_URL_V1, '/info/coin'),
      COUNTRY_CODE: new RouteJson(RouteMap.METHODS.GET, RouteMap.API_URL_V1, '/info/countryCode'),
      COIN_RATE: new RouteJson(RouteMap.METHODS.GET, RouteMap.API_URL_V1, '/info/rate'),
      SMS_CODE: new RouteJson(RouteMap.METHODS.POST, RouteMap.API_URL_V1, '/verify'),
      ADD_BANNER: new RouteJson(RouteMap.METHODS.POST, RouteMap.API_URL_V1, '/info/banner'),
      AD_BANNERS: new RouteJson(RouteMap.METHODS.GET, RouteMap.BACK_GROUND_URL_V1, '/select_active_banners '),
    },
    USER: {
      LOGIN: new RouteJson(RouteMap.METHODS.POST, RouteMap.API_URL_V1, '/login'),
      LOGOUT: new RouteJson(RouteMap.METHODS.GET, RouteMap.API_URL_V1, '/logout'),
      REGISTER: new RouteJson(RouteMap.METHODS.POST, RouteMap.API_URL_V1, '/signup'),
      SET_NICKNAME: new RouteJson(RouteMap.METHODS.POST, RouteMap.API_URL_V1, '/user/username'),
      FORGET_PASSWORD: new RouteJson(RouteMap.METHODS.POST, RouteMap.API_URL_V1, '/forgetpassword'),
      KYC: new RouteJson(RouteMap.METHODS.POST, RouteMap.API_URL_V1, '/user/kyc'),
      TRANSACTION_PASSWORD: new RouteJson(RouteMap.METHODS.POST, RouteMap.API_URL_V1, '/user/paymentpassword'),
      SEND_EMAIL_CODE: new RouteJson(RouteMap.METHODS.GET, RouteMap.API_URL_V1, '/user/email/vrifyCode'),
      BIND_EMAIL: new RouteJson(RouteMap.METHODS.POST, RouteMap.API_URL_V1, '/user/email'),
      SET_AVATAR: new RouteJson(RouteMap.METHODS.POST, RouteMap.API_URL_V1, '/user/avatar'),
      SET_LANGUAGE: new RouteJson(RouteMap.METHODS.POST, RouteMap.API_URL_V1, '/user/language'),
      LIST_USER: new RouteJson(RouteMap.METHODS.GET, RouteMap.API_URL_V1, '/user'),
      GET_DETAIL: new RouteJson(RouteMap.METHODS.GET, RouteMap.API_URL_V1, '/user/detail'),
      ADD_BLACK_LIST: new RouteJson(RouteMap.METHODS.GET, RouteMap.API_URL_V1, '/user/block'),
      ADD_TRUST_LIST: new RouteJson(RouteMap.METHODS.GET, RouteMap.API_URL_V1, '/user/trust'),
    },
    AD: {
      PUBLISH_OTC_AD: new RouteJson(RouteMap.METHODS.POST, RouteMap.API_URL_V1, '/otc'),
      LIST_OTC_AD: new RouteJson(RouteMap.METHODS.GET, RouteMap.API_URL_V1, '/otc'),
      DELETE_AD: new RouteJson(RouteMap.METHODS.DELETE, RouteMap.API_URL_V1, '/otc'),
      GET_OTC_AD: new RouteJson(RouteMap.METHODS.GET, RouteMap.API_URL_V1, '/otc/detail'),
      TRANSACTION_AD: new RouteJson(RouteMap.METHODS.POST, RouteMap.API_URL_V1, '/otc/order'),
      GET_ORDER: new RouteJson(RouteMap.METHODS.GET, RouteMap.API_URL_V1, '/otc/order'),
      UPDATE_ORDER_STATUS: new RouteJson(RouteMap.METHODS.POST, RouteMap.API_URL_V1, '/otc/orderstatus'),
      LIST_TRANSACTION: new RouteJson(RouteMap.METHODS.GET, RouteMap.API_URL_V1, '/otc'),
      DEAL_TRANSACTION: new RouteJson(RouteMap.METHODS.GET, RouteMap.API_URL_V1, '/ad/otc/transaction/deal'),
      OTC_TRENDING: new RouteJson(RouteMap.METHODS.GET, RouteMap.API_URL_V1, '/otc/trending'),
      UPDATE_ORDER_RATING: new RouteJson(RouteMap.METHODS.POST, RouteMap.API_URL_V1, '/otc/rating'),
      GET_TRANS_BY_USERID: new RouteJson(RouteMap.METHODS.GET, RouteMap.API_URL_V1, '/otc/get_trans_by_userid'),
      GET_TRANS_BETWEEN_USERIDS: new RouteJson(RouteMap.METHODS.GET, RouteMap.API_URL_V1, '/otc/get_trans_between_userids'),
    },
    WALLET: {
      MY_ACCOUNT: new RouteJson(RouteMap.METHODS.GET, RouteMap.API_URL_V1, '/coin/my'),
      WALLET_BALANCE: new RouteJson(RouteMap.METHODS.GET, RouteMap.API_URL_V1, '/wallet/balance'),
      WALLET_ADDRESS: new RouteJson(RouteMap.METHODS.GET, RouteMap.API_URL_V1, '/wallet/address'),
      WALLET_WIDTHDRAW: new RouteJson(RouteMap.METHODS.POST, RouteMap.API_URL_V1, '/wallet/withdraw'),
      WALLET_TRANSACTION: new RouteJson(RouteMap.METHODS.GET, RouteMap.API_URL_V1, '/wallet/transaction'),
    },

  };
}
