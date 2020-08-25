<template>
    <div class="warp">
        <div class="head">
            <div class="jft">
                <div class="line"></div>
                <div class="txt">账户积分</div>
                <div class="line"></div>
            </div>
            <div class="jf">
                <font>{{totalPoint}}</font><font>积分</font>
            </div>
        </div>
        <div class="cz">
            <div class="title">请选择充值金额</div>
            <div class="list">
                <div class="cell" v-for="item in list" :key="item.point" @click="pay(item)">
                    <div class="top">{{item.point}}积分</div>
                    <div class="bottom">{{item.amount}}元</div>
                </div>
                <div class="cell" style="visibility: hidden;"></div>
            </div>
        </div>
    </div>
</template>
<script>
    import {getAppid,checkLoginByCode,getConfig,getTxnId,toPay,getPoint} from "../api/user";
    import CryptoJS from 'crypto-js'
    import vConsole from 'vconsole'
    var vconsole = new vConsole();
    var log = console.log;
    export default {
        data() {
            return {
                list:[],
                totalPoint:0,
                token:""
            }
        },
        async created() {
            var token = window.localStorage.getItem("token");
            var code = this.getParams(window.location.href,"code");
            log("code:"+code);
            log("token:"+token);
            if(token){
                this.getConfigInfo();
                this.getTotalPoint();
            }else if(code){
                const res = await checkLoginByCode(code);
                if(res.data.token){
                    const {token} = res.data;
                    this.token = token;
                    window.localStorage.setItem("token",token);
                    this.getConfigInfo();
                }else{
                    const {unionId} = res.data
                    this.$router.push({name:"Bind",params:{unionId}})
                }
            }else{
                this.tapWxLogin();
            }
        },
        methods: {
            async tapWxLogin() {
                try {
                    const appid = await getAppid();
                    const href = `${window.location.origin}`;
                    //const href = "http://tswx.datangliang.com"
                    const callbakcAddress = encodeURIComponent(href);
                    const url =
                        `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${callbakcAddress}&response_type=code&scope=snsapi_userinfo&state=loginSuccess#wechat_redirect`;
                    window.location.href = url;
                } catch (error) {}
            },
            getParams(url, name) {
                var local = new URL(url);
                return local.searchParams.get(name);
            },
            async getConfigInfo(){
                log("getConfigInfo")
                const res =await getConfig();
                log("ConfigInfo")
                log(res)
                if(res.status == 1){
                    this.list = res.data;
                }
            },
            async pay(item){
                const ret = await getTxnId();
                const txnId=ret.data;
                const data={
                    txnId,
                    amount:item.amount
                }
                const res= await toPay(data);
                if(res.status == 1){
                    const {data} = res;
                    const callback = (res)=>{
                        if(res.err_msg == "get_brand_wcpay_request:ok"){
                            this.getTotalPoint();
                        }
                    }
                    WeixinJSBridge.invoke('getBrandWCPayRequest',res.data,callback);
                }
            },
            async getTotalPoint(){
                log("getTotalPoint")
                const res = await getPoint();
                log("TotalPoint");
                log(res);
                if(res.status == 1){
                    this.totalPoint = res.data.totalPoint;
                }
            }

        }
    };
</script>
<style scoped lang="less">
    .warp {
        .head{
            height: 192px;
            background: #5DCA8F;
            padding-top: 60px;
            font-size: 14px;
            color: #fff;
            .jft{
                display: flex;
                align-items: center;
                justify-content: center;
                padding-bottom:20px;
                .txt{
                    display: block;
                    margin:0 10px;
                }
                .line{
                    height: 2px;
                    width: 41px;
                    &:first-child{
                        background:linear-gradient(270deg,rgba(230,230,230,0.6) 0%,rgba(255,255,255,0) 100%);
                    }
                    &:last-child{
                        background:linear-gradient(270deg,rgba(255,255,255,0) 0%,rgba(230,230,230,0.6) 100%);
                    }
                }
            }
            .jf{
                text-align: center;
                font{
                    &:first-child{
                        font-size: 42px;
                    }
                }
            }
        }
        .cz{
            padding:0 14px;
            .title{
                padding:14px 0;
                color:#333;
                font-size: 16px;
            }
            .list{
                display: flex;
                flex-wrap: wrap;
                justify-content: space-between;
                .cell{
                    width: 104px;
                    height: 68px;
                    border-radius: 8px;
                    border:1px solid #E6E6E6;
                    overflow: hidden;
                    margin-bottom: 20px;
                    text-align: center;
                    .top{
                        color: #333;
                        font-size: 18px;
                        padding: 10px 0 5px;
                    }
                    .bottom{
                        color: #666;
                        font-size: 14px;
                    }
                }
            }
        }
    }
</style>
