export class User {
  id: string;
  username: string;
  countryCallingCode: string;
  phone: string;
  email: string;
  verified: number;
  avatar: string;
  languageCode: string;
  transactionPassword: string;

  transaction_count: number; // 交易次数
  trust_count: number; // 信任
  positive_count: number; // 好评
  historyDealCoin: number; // 历史成交币
  historyDealCoinType: string; // 历史成交币种

  deal_with_me_count: number; // 和我交易过的次数
  is_in_my_trust_list: boolean;
  is_in_my_black_list: boolean;
  kycStatus: string; // pending
  payPass: boolean;

}
