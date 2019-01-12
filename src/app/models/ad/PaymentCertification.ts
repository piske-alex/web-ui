export class PaymentCertification {
    id: number;
    adid: string;
    orderid: string; 
    userid: string; 
    certificate_url: string; 
    status: string; 
  
    constructor() {
  
    }
  
    static newInstance(obj): PaymentCertification {
      let _item = new PaymentCertification();
      _item.id = obj.id;
      _item.adid = obj.adid;
      _item.orderid = obj.orderid;
      _item.certificate_url = obj.certificate_url;
      _item.status = obj.status;
      return _item;
    }
  }
  