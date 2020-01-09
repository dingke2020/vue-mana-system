<template>
  <div class="container">
      <!-- 导航菜单栏 -->
      <nav-bar></nav-bar>
      <!-- 头部区域 -->
      <head-bar></head-bar>
      <!-- 主内容区域 -->
      <main-content></main-content>
  </div>
</template>

<script>
import HeadBar from "./HeadBar/HeadBar"
import NavBar from "./NavBar/NavBar"
import MainContent from "./MainContent/MainContent"
export default {
  components:{
        HeadBar,
        NavBar,
        MainContent
  },
  mounted(){
    let _this = this;
    if(!localStorage.getItem('groupId')){
        console.log("已登出");
        _this.$router.push({path:'/login'});
      }else{
        if(parseInt(localStorage.getItem('roleId'))==5){
          _this.$router.push({path:'/platform/index'});
        }else{
          // _this.$router.push({path:'/'});
          if(localStorage.getItem('reloaded')=='yes'){
            _this.reload();
          }
        }
        console.log(localStorage.getItem('roleId'));
        console.log("已登录");
        console.log(localStorage.getItem('groupId'));
      }
  },
  // inject:['reload'],
  methods:{
    reload:function(){
      this.$router.go(0)
      // this.reload();
      // location.reload();
      localStorage.setItem('reloaded','no');
    }
  }
};
</script>

<style>
.container {
  position:absolute;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  /*background: rgba(224, 234, 235, 0.1);*/
}
.el-input.is-disabled .el-input__inner{
    color: #1989fa;
}
</style>  