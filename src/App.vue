<template>
  <div id="app">
    <!-- <img src="./assets/logo.png"> -->
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  // provide: function(){
  //   return {
  //     reload:this.reload
  //   }
  // },
  // data: function(){
  //   return {
  //     isRouterAlive:true
  //   }
  // },
  // methods:{
  //   reload: function(){
  //     this.isRouterAlive = false;
  //     this.$nextTick(function(){this.isRouterAlive = true})
  //   }
  // }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.left{
  float: left;
}
.right{
  float: right;
}
.clearfix:after{
  content:"";
  height:0;
  line-height: 0;
  display: block;
  visibility: hidden;
  clear:both;
}
.clearfix{
  zoom:1;
}
.el-message-box{
  width: 600px;
  border:none;
}
.el-message-box__header{
  padding:13px 17px 11px 22px;
  height: 36px;
  line-height: 36px;
  text-align: left;
  background-color:#009688;
}
.el-message-box__title{
  font-size: 24px;
  line-height: 36px;
  color: #fff;
  font-family: 'SourceHanSansSC-regular';
}
.el-message-box__headerbtn{
  top: 13px;
  font-size: 32px;
}
.el-message-box__headerbtn .el-message-box__close{
  color: #fff;
}
.el-message-box__headerbtn:focus .el-message-box__close, .el-message-box__headerbtn:hover .el-message-box__close{
  color: #fff;
}
.el-message-box__content{
  text-align: center;
  padding:60px 15px;
}
.el-message-box__status{
  position: relative;
  transform: translateY(0);
  font-size: 30px !important;
}
.el-message-box__status+.el-message-box__message{
  display: inline-block;
  padding-left: 20px;
  font-size: 24px;
  color: #151515;
  font-family: 'SourceHanSansSC-regular';
}
.el-message-box__btns{
  text-align: center;
  padding-bottom: 50px;
}
.el-message-box__btns button:nth-child(1){
  width: 40%;
  height: 60px;
  background: #D0CFCF;
  color: #000;
  border-color: #D0CFCF;
  font-size: 20px;
  font-family: 'Microsoft Yahei';
}
.el-message-box__btns button:nth-child(2){
  width: 40%;
  height: 60px;
  background: #009688;
  color: #fff;
  border-color: #009688;
  font-size: 20px;
  font-family: 'Microsoft Yahei';
}
.el-message-box__message p{
  font-size: 20px;
}
/*.el-form-item.is-required:not(.is-no-asterisk) .el-form-item__label-wrap>.el-form-item__label:before, .el-form-item.is-required:not(.is-no-asterisk)>.el-form-item__label:before{
  color: transparent;
}*/
</style>
