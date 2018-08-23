export class TransactionListItem {


  adId: string;
  userId: string; // 用户 id
  userHeadUrl: string; // 用户头像 url
  username: string; // 用户名
  transactionCount: number; // 交易数量
  praiseCount: number; // 好评
  trustCount: number; // 信任
  limitMinAmount: number; // 限额 最小
  limitMaxAmount: number; // 限额 最大
  currency: string; // 限额 货币类型，例如 CNY
  adType: string; // 1 出售, 2 购买
  transactionAmount: number; // 交易金额
  transactionCurrency: string; // 交易货币类型
  transactionCoinType: string; // 交易 币类型
  isRealUser: boolean; // 是否实名
  isAccessBankTransfer: boolean; // 是否接受银行转账
  remark: string;
  online: boolean;
  country: string;
  rate: string;
  payType: string;


  constructor() {

  }

  static newInstance(obj): TransactionListItem {
    let _item = new TransactionListItem();
    _item.adId = obj.id;
    _item.userId = obj.userid;
    _item.username = obj.username;
    _item.userHeadUrl = obj.avatar;
    if (obj.verify) {
      if (obj.verify.includes('real')) {
        _item.isRealUser = true;
      }
    }
    _item.online = obj.online;
    _item.country = obj.country;
    _item.transactionCoinType = obj.coin;
    _item.transactionCurrency = obj.currency;
    _item.rate = obj.rate;
    _item.payType = obj.payment[0];
    _item.limitMinAmount = obj.amount && obj.amount.min;
    _item.limitMaxAmount = obj.amount && obj.amount.max;
    if (obj.type == 'sell') {
      _item.adType = '1';
    } else {
      _item.adType = '2';
    }
    _item.remark = obj.message;

    return _item;
  }
}
