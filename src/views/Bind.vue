<template>
  <div class="warp">
    <div class="form">
       <div class="row">
           <div class="left">
               <input type="number" maxlength="16" v-model="mobile" placeholder="手机号码"/>
           </div>
       </div>
       <div class="row">
           <div class="left">
                <input type="number" maxlength="16" v-model="code" placeholder="验证码"/>
           </div>
           <div class="right">
               <span :class="{'doit':phoneOk}" @click="getCode" >{{btnTxt}}</span>
           </div>
       </div>
       <div class="row">
           <div class="btn" @click="login">绑定</div>
       </div>
    </div>
  </div>
</template>
<script>
    import {getMobileCode,loginAndBindMobile} from "../api/user";
    export default{
        data(){
            return {
                mobile:"",
                code:"",
                btnTxt:"获取验证码",
                getCodeing:false,
                loading:false
            }
        },
        computed:{
            phoneOk(){
                if(/^1\d{10}$/.test(this.mobile)){
                    return true;
                }
                return false;
            }
        },
        created() {
            this.unionId = this.$route.params.unionId;
        },
        methods:{
            async getCode(){
                if(!this.phoneOk){
                    this.$toast({msg:'请输入正确的手机号'});
                    return;
                }
                if(this.getCodeing){
                   return;
                }
                this.getCodeing = true;
                const res = await getMobileCode(this.mobile);
                if(res.status){
                    let time = 60;
                    var stopFlag = setInterval(()=>{
                        if(--time){
                            this.btnTxt = time+"秒后可再获取"
                        }else{
                            this.btnTxt = "获取验证码";
                            clearInterval(stopFlag);
                        }
                    },1000);
                }
                this.getCodeing = false;
            },
            async login(){
                if(this.loading){
                   return;
                }
                const {code,mobile,referrer="",source=4,unionId,phoneOk} = this;
                const params={
                    code,
                    mobile,
                    referrer,
                    source,
                    unionId
                }
                if(!phoneOk){
                    this.$toast({msg:"请输入正确的手机号"});
                    return;
                }
                if(!code){
                    this.$toast({msg:"请输入手机验证码"});
                    return;
                }
                this.loading = true;
                const res = await loginAndBindMobile(params);
                if(res.status ==1){
                    const token = res.data.token;
                    window.localStorage.setItem("token",token);
                    this.$router.replace({path:"/"})
                }
                this.loading = false;
            }
        }
    };
</script>
<style lang="less" scoped>
    .warp{
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #F5F5F5;
        height: 100vh;
        font-size: 12px;
        .form{
            width: 250px;
            height: 200px;
            padding: 30px 20px;
            background-color: #fff;
            border-radius: 10px;
            border:1px solid #ededed;
            .row{
                display: flex;
                align-items: center;
                padding-bottom: 30px;
                .left{
                    flex:1;
                    input{
                        width: 100%;
                        border-radius: 3px;
                        font-size: 12px;
                        height: 30px;
                        border-bottom:1px solid #ededed;
                        padding-left: 10px;
                    }
                }
                .right{
                    width:120px;
                    text-align: right;
                    padding: 1px 0;
                    span{
                        display: inline-block;
                        background: #f5f5f5;
                        color: rgba(0,0,0,.25);
                        padding: 3px 10px;
                        border-radius: 5px;
                    }
                    .doit{
                        color:#fff;
                        background-color: #1890ff;
                    }
                }
                .btn{
                    padding: 5px 50px;
                    color: #fff;
                    text-align: center;
                    background-color: #1890ff;
                    margin:0 auto;
                    border-radius: 5px;
                }
            }
        }
    }
</style>
