<template>
  <el-submenu v-if="menu.children && menu.children.length >= 1" :index="'' + menu.id">
    <template slot="title">
      <i :class="menu.icon" class="iconfont"></i>
      <span slot="title">{{menu.name}}</span>
      <i class="iconfont icon-ali-arrow-right right"></i>
    </template>
    <MenuTree v-for="item in menu.children" :key="item.id" :menu="item"></MenuTree>
  </el-submenu>
  <el-menu-item v-else :index="'' + menu.id" @click="handleRoute(menu)">
    <i :class="menu.icon" class="iconfont"></i>
    <span slot="title">{{menu.name}}</span>
    <i v-show="!collapse" class="iconfont icon-ali-arrow-right right"></i>
  </el-menu-item>
</template>

<script>
import { mapState } from 'vuex'
import { getIFrameUrl, getIFramePath } from '@/utils/iframe'
export default {
  name: 'MenuTree',
  props: {
    menu: {
      type: Object,
      required: true
    }
  },
  methods: {
    handleRoute (menu) {
      // 如果是嵌套页面，转换成iframe的path
      let path = getIFramePath(menu.url)
      if(!path) {
        path = menu.url
      }
      // 通过菜单URL跳转至指定路由
      this.$router.push("/" + path)
    }
  },
  computed:{
    ...mapState({
      themeColor: state=>state.app.themeColor,
      collapse: state=>state.app.collapse
    }),
  }
}
</script>

<style>
 .menu-bar-container .el-menu-item {
    height:44px;
    line-height: 44px;
    font-size: 14px;
    color: rgba(11,11,11,1);
    font-family: 'Roboto';
 }
 .menu-bar-container .el-menu-item.is-active{
  background-color: rgb(0,150,136);
  color: #fff;
 }
 .menu-bar-container .el-menu-item .iconfont{
    font-size: 16px;
    color: rgba(11,11,11,1);
 }
 .menu-bar-container .el-menu-item.is-active .iconfont{
    color: #fff;
 }
 .menu-bar-container .el-menu-item span{
    margin-left: 13px;
 }
 .menu-bar-container .icon-ali-arrow-right{
    display: none;
 }
 .menu-bar-container .el-menu-item.is-active .icon-ali-arrow-right{
    display: block;
 }
 .menu-bar-container .el-submenu .el-submenu__title{
    color:rgba(11,11,11,1);
    height:44px;
    line-height: 44px;
    font-size: 14px;
    font-family: 'Roboto';
 }
 .menu-bar-container .el-submenu__title .iconfont{
    font-size: 16px;
    color: rgba(11,11,11,1);
 }
 .menu-bar-container .el-submenu__title span{
    margin-left: 13px;
 }
 .menu-bar-container .el-submenu__title i{
    color:rgba(11,11,11,1);
    font-size: 16px;
 }
 .menu-bar-container .el-submenu.is-active .el-submenu__title{
    border-bottom-color: rgb(0,150,136);
 }
 .menu-bar-container .el-submenu .el-menu-item{
    padding-right: 20px;
 }
</style>