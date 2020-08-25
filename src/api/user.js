/*
 * @Description:
 * @Author: Inkfish08
 * @Date: 2019-05-15 15:36:36
 * @LastEditTime: 2020-04-22 09:45:19
 */
import {
    post,
    get
} from "@/JS/ajax"

//获取微信appid
export function getAppid(){
    return get({
        url: `https://tsapi.datangliang.com/v1/wechat/appid`
    })
}
export function getMobileCode(mobile){
    return post({
        url: `v1/common/sms/login/${mobile}`,
        data:{}
    })
}
export function checkLoginByCode(code){
    return get({
        url: `v1/wechat/login/${code}`
    })
}

export function loginAndBindMobile(data){
    return post({
        url: `/v1/user/code/login`,
        data
    })
}
//获取充值优惠配置
export function getConfig(data){
    return get({
        url: `/v1/point/config`,
        data
    })
}

//流水号
export function getTxnId(data){
    return get({
        url: `/v1/common/token`,
        data
    })
}
//请求生成订单
export function toPay(data){
    return post({
        url: `/v1/wechat/pay/point`,
        data
    })
}
//获取总积分
export function getPoint(data){
    return get({
        url: `/v1/user/referrer/total`,
        data
    })
}
