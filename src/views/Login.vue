<template>
  <div class="login">
    <div class="login-background"></div>
    <div class="login-container">
      <el-form :model="loginForm" ref="loginForm" :rules="fieldRules" label-position="left" label-width="0px">
        <h2 class="title" :style="{'color':themeColor}">新安江工业泵生产管理系统</h2>
        <div class="password-tip">
          <transition name="slide-fade">
            <div v-if="show" class="password-tip-content">账号或密码错误，请重新输入</div>
          </transition>
        </div>
        <!-- <el-form-item>
          <el-input id="icCard" type="text" :autofocus="true" v-model="cardInfo" @change="handleChange"></el-input>
        </el-form-item> -->
        <!-- <input id="icCard" type="text" autofocus="autofocus" style="display:none"> -->
        <el-form-item prop="account">
          <el-input prefix-icon="iconfont icon-ali-user" type="text" v-model="loginForm.account" autocomplete="off" placeholder="请输入账号" autofocus="autofocus"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input prefix-icon="iconfont icon-ali-password" type="password" v-model="loginForm.password" autocomplete="off" placeholder="请输入密码"></el-input>
        </el-form-item>
        <div class="forget" :style="{'color':themeColor}" @click="forget">忘记密码？</div>
        <el-form-item style="width:100%;">
          <el-button style="width:100%;" @click.native="login" :loading="loading" :style="{'background-color':themeColor,'border-color':themeColor,'color':'#fff','height':'54px','font-size':'20px'}">登 录</el-button>
        </el-form-item>
        <div class="small-screen" v-if="isSmallScreen">
          <div class="small-screen-icon"><img :src="imgSrc"></div>
          <p>直接刷取员工卡，完成登录！</p>
        </div>
      </el-form>
      <el-dialog title="忘记密码？" :width="width" :visible.sync="dialogVisible" custom-class="forgetDialog" center>
        <div class="forget-content">
          <i class="el-icon-warning"></i>
          忘记密码，请联系公司管理员！
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Cookies from "js-cookie"
export default {
  name: 'Login',
  data() {
    return {
      width:'40%',
      loading: false,
      loginForm: {
        account: '',
        password: ''
      },
      fieldRules: {
        account: [
          { required: true, message: '请输入账号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      },
      checked: true,
      show:false,
      dialogVisible:false,
      isSmallScreen:false,
      imgSrc:require('@/assets/images/brush.png'),
      loginParams:{},
      groupId:'',
      groupName:'',
      roleId:'',
      userId:'',
      icCardNum:'',
      mobile:'',
      name:'',
      cardInfo:''
    }
  },
  methods: {
    // handleClick(){
    //   let _this = this;
    //   $("#icCard").val('asdf');
    //   // _this.cardInfo = 'asdf'
    // },
    // handleChange(value){
    //   console.log(value);
    // },
    login() {
      let _this = this;
      _this.$refs.loginForm.validate((valid) => {
        if(valid){
      _this.loading = true
      _this.loginParams = {
        userName:_this.loginForm.account,
        password:_this.loginForm.password
      }
      // if(_this.loginForm.account==""||_this.loginForm.password==""){
      //   _this.loading = false;
      //   _this.show = true;
      // }
      // _this.$api.login.login(_this.loginParams).then((res) => {
      //   console.log(res);
      //   _this.loading = false
      // }).catch((res) => {
      //   _this.loading = false
      //   _this.show = true;
      // });
      $.ajax({
        type:'GET',
        url:'/login',
        data:_this.loginParams,
        success:function(data){
          console.log(data);
          if(data.status==false){
            _this.loading = false;
            _this.show = true;
          }else{
            _this.loading = false;
            _this.show = false;
            var list = data.data;
            list.forEach(function(value,index){
              // if(_this.roleId.indexOf(value.roleId)<0){
              //   _this.roleId.push(value.roleId);
              // }
              _this.roleId = value.roleId;
              _this.userId = value.userId;
              _this.groupId = value.groupId;
              _this.groupName = value.groupName;
              _this.icCardNum = value.icCardNum;
              _this.mobile = value.mobile;
              _this.name = value.name;
            });
            console.log(_this.roleId);
            if(_this.roleId!=5){
              console.log("是管理员");
              _this.$router.push({path:'/'});
            }else{
              console.log("是操作员");
              _this.$router.push({path:'/platform/index'});
            }
            localStorage.setItem("groupId",_this.groupId);
            localStorage.setItem("groupName",_this.groupName);
            localStorage.setItem("icCardNum",_this.icCardNum);
            localStorage.setItem("roleId",_this.roleId);
            localStorage.setItem("userId",_this.userId);
            localStorage.setItem("mobile",_this.mobile);
            localStorage.setItem("name",_this.name);
            localStorage.setItem('reloaded','yes');
          }
        }
      })
    }
  })
    },
    forget(){
      this.dialogVisible = true;
    }
  },
  mounted() {
    let _this = this;
    var winWidth = $(window).width();
    var winHeight = $(window).height();
    $(".login-background").height(winHeight);
    if(winWidth<=1024){
      $(".login-container .el-form").css({"top":"165px"});
      this.isSmallScreen = true;
      this.width = '50%';
    }
    $('input').bind('input propertychange', function() {
        console.log($(this).val());
        _this.loginParams = {
          userName:$(this).val()
        }
        $.ajax({
          type:'GET',
          url:'/login',
          data:_this.loginParams,
          success:function(data){
            console.log(data);
            if(data.status==false){
              // _this.loading = false;
              // _this.show = true;
            }else{
              // _this.loading = false;
              // _this.show = false;
              var list = data.data;
              list.forEach(function(value,index){
                // if(_this.roleId.indexOf(value.roleId)<0){
                //   _this.roleId.push(value.roleId);
                // }
                _this.roleId = value.roleId;
                _this.userId = value.userId;
                _this.groupId = value.groupId;
                _this.groupName = value.groupName;
                _this.icCardNum = value.icCardNum;
                _this.mobile = value.mobile;
                _this.name = value.name;
              });
              console.log(_this.roleId);
              if(_this.roleId!=5){
                console.log("是管理员");
                _this.$router.push({path:'/'});
              }else{
                console.log("是操作员");
                _this.$router.push({path:'/platform/index'});
              }
              localStorage.setItem("groupId",_this.groupId);
              localStorage.setItem("groupName",_this.groupName);
              localStorage.setItem("icCardNum",_this.icCardNum);
              localStorage.setItem("roleId",_this.roleId);
              localStorage.setItem("userId",_this.userId);
              localStorage.setItem("mobile",_this.mobile);
              localStorage.setItem("name",_this.name);
              localStorage.setItem('reloaded','yes');
            }
          }
        })
    });
  },
  computed:{
    ...mapState({
      themeColor: state=>state.app.themeColor
    })
  }
}
</script>

<style>
.login-container-back{
  -webkit-border-radius: 5px;
  border-radius: 5px;
  -moz-border-radius: 5px;
  background-clip: padding-box;
  margin: 100px auto;
  width: 350px;
  padding: 35px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
}
.login-background{
  width: 100%;
  margin-top: -60px;
  background: url(../assets/images/timg.jpg) no-repeat;
  background-size: 100% 100%;
  opacity: 0.5;
}
.login-container .el-form{
  width: 433px;
  position: absolute;
  top: 200px;
  left: 50%;
  margin-left: -217px;
}
.login-container .title {
  margin: 0px auto 20px auto;
  text-align: center;
  font-size:36px;
}
.login-container .forget{
  float: right;
  height: 30px;
  line-height: 30px;
  font-size: 16px;
  font-family: 'Roboto';
  margin-bottom: 10px;
  margin-top:-17px;
  font-weight: bold;
}
.login-container .forget:hover{
  cursor: pointer;
}
.login-container .el-input--prefix .el-input__inner{
  padding-left: 44px;
  height: 54px;
}
.login-container .el-input__prefix{
  left: 15px;
  color: #0D0D0D;
}
.password-tip{
  position: relative;
  height: 30px;
  margin-bottom: 5px;
}
.login-container .password-tip-content{
  position: absolute;
  width: 100%;
  background-color: rgba(229,28,35,0.2);
  color: #E51C23;
  font-size: 14px;
  text-align: center;
  height: 30px;
  line-height: 30px;
  font-family: 'Roboto';
}
.login-container .small-screen{
  margin-top: 49px;
}
.login-container .small-screen-icon{
  width: 56px;
  height: 56px;
  margin:0 auto;
}
.login-container .small-screen-icon img{
  width: 100%;
  height: 100%;
  border-radius: 28px;
}
.login-container .small-screen p{
  margin-top: 8px;
  color: #000;
  font-size: 14px;
  font-family: 'SourceHanSansSC-regular';
  text-align: center;
}
.slide-fade-enter-active,.slide-fade-leave-active{
  transition: all .3s ease;
}
.slide-fade-enter,.slide-fade-leave-to{
  transform: translateY(10px);
  opacity: 0;
}
.el-dialog__header{
  padding:13px 17px 11px 22px;
  height: 36px;
  line-height: 36px;
  text-align: left;
  background-color:#009688;
}
.el-dialog__title{
  font-size: 24px;
  line-height: 36px;
  color: #fff;
  font-family: 'SourceHanSansSC-regular';
}
.el-dialog__headerbtn{
  top: 13px;
  font-size: 32px;
}
.el-dialog__headerbtn .el-dialog__close{
  color: #fff;
}
.el-dialog__headerbtn:focus .el-dialog__close, .el-dialog__headerbtn:hover .el-dialog__close{
  color: #fff;
}
.forgetDialog .el-icon-warning{
  font-size:40px;
  margin-right:10px;
  color:#FF9800;
  position: relative;
  top: 2px;
}
.forgetDialog .forget-content{
  text-align: center;
  color: #151515;
  font-size: 24px;
  font-family: 'SourceHanSansSC-regular';
}
.forgetDialog .el-dialog__body{
  padding:85px 25px 140px;
}
</style>