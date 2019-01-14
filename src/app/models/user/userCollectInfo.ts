export class userCollectInfo{
    id : number | null;
    userid: number | null;

    pay_type : string | null;
    alipay_qrcode_url : string | null;
    alipay_qrcode_info : string | null;
    alipay_account : string | null;
    alipay_name : string | null;
    wxpay_qrcode_url : string | null;
    wxpay_qrcode_info : string | null;
    wxpay_account : string | null;
    wxpay_name : string | null;
    ebank_bank : string | null;
    ebank_branch : string | null;
    ebank_account : string | null;
    ebank_name : string | null;
    status : string | null;

    alipay_notset : boolean; // true 未设置  , false 设置
    wxpay_notset : boolean;
    ebank_notset : boolean;

    minio_url_prefix:string;//前缀，非表中字段

    static newInstance(obj): userCollectInfo {
        let _item = new userCollectInfo();
        if(obj == null){
            _item.alipay_notset = true ;
            _item.wxpay_notset = true ;
            _item.ebank_notset = true ;
            return _item;
        }

        _item.id = obj.id;
        _item.userid = obj.userid || "";

        _item.pay_type = obj.pay_type;

        _item.alipay_qrcode_url = obj.alipay_qrcode_url || "";
        _item.alipay_qrcode_info = obj.alipay_qrcode_info || "";
        _item.alipay_account = obj.alipay_account || "";
        _item.alipay_name = obj.alipay_name || "";

        _item.wxpay_qrcode_url = obj.wxpay_qrcode_url || "";
        _item.wxpay_qrcode_info = obj.wxpay_qrcode_info || "";
        _item.wxpay_account = obj.wxpay_account || "";
        _item.wxpay_name = obj.wxpay_name || "";
        
        _item.ebank_branch = obj.ebank_branch || "";
        _item.ebank_bank = obj.ebank_bank || "";
        _item.ebank_name = obj.ebank_name || "";
        _item.ebank_account = obj.ebank_account || "";

        _item.status = obj.status || "";

        _item.minio_url_prefix = obj.minio_url_prefix || "";

        _item.alipay_notset = obj.alipay_account == "" || obj.alipay_account == null ;
        _item.wxpay_notset = obj.wxpay_account == "" || obj.wxpay_account == null ;
        _item.ebank_notset = obj.ebank_account == "" || obj.ebank_account == null ;
        
        return _item;
      }
    
}