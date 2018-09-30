export class TradeItem {

    id:number;
    userid: string; // 用户 id
    adid: string;
    amount:number;

    paymentStatus:string;//
    sellerPaymentConfirm:string;//
    status:string;
    paymentTime:number;//
    confirmTime:number;//
    orderRating:number;//
    isRating:number;//
    createTime:number;//
    updateTime:number;//

    //下面字段是界面上要用到的
    userHeadUrl: string; // 用户头像 url
    username: string; // 用户名
    tradeCurrency:string; // 交易的货币  BTC  ETH ..
    transactionCount: number; // 交易数量
    price:number;// 价格
    currency: string; // 价格的货币类型，例如 CNY
    tradeTime:number;//交易时间
    collectTime:number;//收币时间


    constructor() {
  
    }
  
    static newInstance(obj): TradeItem {
      let _item = new TradeItem();
      _item.id = obj.id;
      _item.userid = obj.userid;
      _item.adid = obj.adid;
      _item.amount = obj.amount;
      _item.paymentStatus = obj.payment_status;
      _item.sellerPaymentConfirm = obj.seller_payment_confirm;
      _item.status = obj.status;
      _item.paymentTime = obj.payment_time;
      _item.confirmTime = obj.confirm_time;
      _item.orderRating = obj.order_rating;
      _item.isRating = obj.is_rating;
      _item.createTime = obj.create_time;
      _item.updateTime = obj.update_time;
      
      _item.userHeadUrl = "";
      _item.username = "";
      _item.currency = "";
      _item.tradeCurrency = "";
      _item.transactionCount = 0;
      _item.price = 0;
      _item.tradeTime = 0;
      _item.collectTime = 0;
      
      return _item;
    }
  }
  