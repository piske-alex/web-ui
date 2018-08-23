export class OtcAd {
  id: string;
  status: string;
  adType: string; // 1 出售, 2 购买
  coinType: string;
  country: string;
  currency: string;
  price: number;
  premium: number = 0;
  maxPrice: number;
  minPrice: number;
  minCount: number;
  maxCount: number;
  payType: string;
  payTerm: number;
  remark: string;
  isOnlyTrustUser: boolean;
  isOnlyRealUser: boolean;
  openTimeType: number;
  openTime: any;
  userId: string;


  constructor() {

  }
}
