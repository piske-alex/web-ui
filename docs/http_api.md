### 1. 根据 Id 获取交易页面详情:

```
GET http://office.ddns.need.sh:8011/api/ad/otc/ad?id=1
```

```
{success: boolean, data: {
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
}}
```

### 2. 获取用户详情：

```
GET http://office.ddns.need.sh:8011/api/user/detail?id=1&coinType=BTC&userId=3
```

```
id: 查询的用户id
userId: 登陆用户的 id
cointType: 历史交易
```

```
{
    success: boolean,
    data: {
      id: 'string',
      username: 'username',
      transactionCount: 1000, // 交易次数
      trustCount: 100, // 交易次数
      praiseCount: '99%', // 
      historyDealCoin: 5, // 
      historyDealCoinType: 'BTC',// 
      dealWithMeCount: 10,
      isInMyTrustList: false;
      isInMyBlackList: false;
    }
}
```

```
export class User {
  id: string;
  username: string;
  countryCallingCode: string;
  phone: string;
  email: string;
  verified: boolean;
  headUrl: string;

  transactionCount: number; // 交易次数
  trustCount: number; // 信任
  praiseCount: number; // 好评
  historyDealCoin: number; // 历史成交币
  historyDealCoinType: string; // 历史成交币种

  dealWithMeCount: number; // 和我交易过的次数
}
```

### 3. 购买/出售：

```
POST    http://office.ddns.need.sh:8011/api/ad/otc/transaction
```

adUerId: '发布广告的用户id',
payAmount: '左边的数量',
receiveAmount: '右边的数量',

### 4. 发布广告

```
POST http://office.ddns.need.sh:8011/api/ad/otc
```

```
{
    "price":100,
    "premium":3,
    "maxPrice":100,
    "minCount":200,
    "maxCount":400,
    "payTerm":20,
    "isOnlyTrustUser":true,
    "isOnlyRealUser":true,
    "openTimeType":"2",
    "adType":"2",
    "coinType":"LTC",
    "country":"HK",
    "currency":"HKD",
    "payType":"BT",
    "userId": "123",
}
```


### 5. otc 首页 列表查询:

```
GET http://office.ddns.need.sh:8011/api/ad/otc/transaction?adType=2&coinType=BTC&countryCode=CN&coinTypes=BCH
```

```
adType 1: 出售， 2：购买
```


```
{
    success: boolean,
    data: [
        {
            adId: string; // 交易 id
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
        }
    ]
}
```


### 6. 发布的广告列表查询

```
GET http://office.ddns.need.sh:8011/api/ad/otc?publishUserId=123
```

```
publishUserId 发布广告的用户id
status 1. 进行中， 10. 已下架    可不传
```

```
{
    success: boolean,
    data: [
        {
            id: string;
            status: string;
            adType: string; // 1 出售, 2 购买
            coinType: string;
            country: string;
            currency: string;
            price: number;
            premium: number;
            maxPrice: number;
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
        }
    ]
}
```

### 7. 和我的交易列表查询

```
GET http://office.ddns.need.sh:8011/api/ad/otc/transaction/deal?userId=123&otherUserId=432
```

```
userId 当前用户 id
otherUserId 其他用户id
```


```
{
    success: boolean,
    data: [
        {
            adId: string;
            adType: string;
            adUserId: string;
            adUsername: string;
            adAmount: string;
            adCurrency: string;
            adCoinType: string;
            dealUserId: string;
            dealUsername: string;
            dealAmount: string;
            dealCurrency: string;
            dealCoinType: string;

        }
    ]
}
```

### 8. 屏蔽用户

```
GET http://office.ddns.need.sh:8011/api/user/blacklist
```

```
userId 当前登陆用户
otherUserId 其他用户
```

### 9. 信任用户

```
GET http://office.ddns.need.sh:8011/api/user/trustlist
```

```
userId 当前登陆用户
otherUserId 其他用户
```

### 10. 用户列表

```
GET http://office.ddns.need.sh:8011/api/user
```

```
userId 当前登陆用户
relationShip: 关系   1. 我信任的人， 2. 信任我的人， 3. 我屏蔽的人
```


### 11. 获取国家区号（注册）

```
GET http://office.ddns.need.sh:8011/api/info/countryCode
```

```
{
    success: boolean,
    data: [
        {code: '86', name: '中国'},
        {code: '852', name: '中国香港'}
    ]
}
```

### 12 获取验证码

```
GET http://office.ddns.need.sh:8011/api/verify?countryCode=86&phoneNo=13555555555
```

```
{
    success: boolean,
    data: {
        smsCode: '2233';
    }
}
```

### 13. 注册
```
POST http://office.ddns.need.sh:8011/api/user/signup
```


```
{
    countryCallingCode: '86',
    phone: '13333333',
    verifyCode: '1233',
    password: '1233233',
    isAggreeTerms: true,
}
```


```
{
    success: boolean,
    data: {
        userId: '',
        token: '',
    }
}
```


### 13. 设置昵称
```
POST http://office.ddns.need.sh:8011/api/user/setNickname
```

```
{
    userId: '',
    nickname: '',
}
```

### 13. 修改密码
```
POST http://office.ddns.need.sh:8011/api/user/forgetPassword
```

```
{
    countryCode: '',
    phoneNo: '',
    verifyCode: '',
    password: '',
}
```


### 14. 实名认证
```

```
POST http://office.ddns.need.sh:8011/api/user/realCert
```
{
    countryCode:"CN",
    isSelectPromise:true,
    realCardNo:"555555555555555",
    realName:"12312312",
}
```

### 15. 设置资金密码
```

```
POST http://office.ddns.need.sh:8011/api/user/transactionPassword
```
{
    password1:"555555555555555",
    password2:"12312312",
}
```

### 16. 发送邮箱验证码
```

```
GET http://office.ddns.need.sh:8011/api/user/email/vrifyCode
```
{
    email:"555555555555555"
}
```

### 17. 绑定邮箱
```

```
POST http://office.ddns.need.sh:8011/api/user/email
```
{
    email:"555555555555555",
    verifyCode:"12312312",
}
```

### 18. 语言设置
```

```
POST http://office.ddns.need.sh:8011/api/user/language
```
{
    code:"zh-CN",
}
```

### 19. 币币账户
```

```
GET http://office.ddns.need.sh:8011/api/coin/my
```
请求参数
{
    accountType: '', // 1. 币币账户(暂无此功能)， 2. 场外账户
}
```

```
{
    success: boolean,
    data: {
        mainCoin: {
            amount: number, // 钱包上面 币数量
            coinType: string; // 钱包上面 币种
            equalCurrencyAmount: number; // 等价货币数量
            equalCurrency: string; // 等价货币类型
        },
        coinList: [
            {
                usableAmount: number;
                freezeAmount: number;
                coinType: string;
            }
        ]
    }
}
```

