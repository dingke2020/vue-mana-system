<template>
	<div class="headbar" :style="{'background-color':themeColor}">
		<div class="headbar-brand"><img :src="imgSrc"></div>
		<h1 class="headbar-title">工业泵生产管理系统</h1>
		<span class="toolbar">
			<el-menu class="el-menu-demo" mode="horizontal" :style="{'background-color':themeColor,'border-bottom':'none'}">
				<el-menu-item>
				  <el-button @click="logout">退出登录</el-button>
				</el-menu-item>
				<el-menu-item>
		          <span class="user-info"><img :src="avatar"/></span>
		        </el-menu-item>
			</el-menu>
		</span>
	</div>
</template>
<script>
import { mapState } from 'vuex'
export default{
	data(){
		return{
			imgSrc:require('@/assets/images/logo.png'),
			avatar:require('@/assets/user.png')
		}
	},
	computed:{
    	...mapState({
      		themeColor: state=>state.app.themeColor
    	})
  	},
  	methods:{
  		logout:function(){
  			localStorage.clear();
        	this.$router.push({path:'/login'});
  		}
  	}
}
</script>
<style scoped>
	.headbar{
		position: fixed;
		width: 100%;
	  	top: 0;
	  	right: 0;
	  	height: 60px;
	  	z-index: 1030;
	}
	.headbar-brand{
		width: 125px;
		height: 31px;
		float: left;
		margin-top:15px;
		margin-left: 12px;
	}
	.headbar-brand img{
		width: 100%;
		height: 100%;
	}
	.headbar-title{
		color: #fff;
		font-size: 20px;
		margin-left: 10px;
		font-family: 'Roboto';
		float: left;
		margin-top: 0;
		margin-bottom: 0;
		height: 60px;
		line-height: 60px;
	}
	.toolbar {
	  float: right;
	}
	.user-info {
	  font-size: 20px;
	  color: #fff;
	  cursor: pointer;
	}
	.user-info img {
	  width: 32px;
	  height: 32px;
	  border-radius: 50%;
	  margin: 0px 10px 5px 10px;
	}
	.headbar .el-menu-item{
		padding:0;
	}
	.headbar .el-menu-item:last-child{
		margin-right: 10px;
	}
	.headbar .el-menu--horizontal>.el-menu-item:not(.is-disabled):focus,.headbar .el-menu--horizontal>.el-menu-item:not(.is-disabled):hover{
		background-color: transparent;
	}
	.headbar .el-button:focus,.headbar .el-button:hover{
		color: #606266;
		border-color: #DCDFE6;
		background-color: #FFF;
	}
</style>