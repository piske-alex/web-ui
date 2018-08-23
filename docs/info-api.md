# info list

## GET /api/info/coin

取得平台可用數字貨幣種類

```JSON
{
    "success": true,
    "data": [
        {
            "code": "BTC",
            "name": "Bitcoin"
        },
        {
            "code": "BCH",
            "name": "Bitcoin cash"
        },
        {
            "code": "LTC",
            "name": "Litecoin"
        },
        {
            "code": "ETH",
            "name": "Ethereum"
        },
        {
            "code": "USDT",
            "name": "USDT"
        },
        {
            "code": "XRP",
            "name": "Ripple"
        }
    ]
}
```

## GET /api/info/country

取得平台支持國家列表

```JSON
{
    "success": true,
    "data": [
        {
            "code": "CN",
            "name": "中国"
        },
        {
            "code": "HK",
            "name": "中國香港"
        },
        {
            "code": "UK",
            "name": "United Kingdom"
        },
        {
            "code": "SG",
            "name": "新加坡"
        }
    ]
}
```

## GET /api/info/countryCode

取得電話區碼

```JSON
{
    "success": true,
    "data": [
        {
            "code": "86",
            "name": "中国"
        },
        {
            "code": "852",
            "name": "中國香港"
        },
        {
            "code": "44",
            "name": "United Kingdom"
        },
        {
            "code": "65",
            "name": "新加坡"
        }
    ]
}
```

## GET /api/info/currency

取得可用法定貨幣種類

```JSON
{
    "success": true,
    "data": [
        {
            "sign": "¥",
            "code": "CNY",
            "name": "人民币"
        },
        {
            "sign": "$",
            "code": "HKD",
            "name": "港幣"
        },
        {
            "sign": "£",
            "code": "GBP",
            "name": "Pound"
        },
        {
            "sign": "$",
            "code": "SGD",
            "name": "新加坡元"
        }
    ]
}
```

## GET /api/info/language

取得平台支持語言列表

```JSON
{
    "success": true,
    "data": [
        {
            "code": "zh-HK",
            "name": "繁體中文"
        },
        {
            "code": "zh-CN",
            "name": "简体中文"
        },
        {
            "code": "en-GB",
            "name": "English"
        }
    ]
}
```

## GET /api/info/pay

取得平台支持支付方式

```JSON
{
    "success": true,
    "data": [
        {
            "code": "AP",
            "name": "AliPay"
        },
        {
            "code": "WP",
            "name": "WechatPay"
        },
        {
            "code": "BT",
            "name": "Bank Transfer"
        }
    ]
}
```

## GET /api/info/rate

取得現在市場對換價

params:

* coin
* currency

```JSON
{
    "success": true,
    "data": {
        "value": 45749
    }
}
```
