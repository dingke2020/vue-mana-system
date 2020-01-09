<template>
	<div class="head_vue">
		<header class="navbar navbar-inverse navbar-static-top jz-nav" v-bind:class="{'fixed-nav':pos}">
			<div class="container-fluid">
				<a class="navbar-header-icon" data-toggle="collapse" data-target="#top">	
				</a>
				<router-link :to="device_router" class="navbar-title">
					<h1>{{title}}</h1>
					<!-- <h4>{{subTitle}}</h4> -->
				</router-link>
				<router-link :to="device_router" class="navbar-logo">
					
				</router-link>
				<div class="dropBox" v-if="isShow">
					<div class="dropdown">
						<button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
					      {{chooseText}}
					      <span class="caret"></span>
					    </button>
					  	<ul class="dropdown-menu" aria-labelledby="dropdownMenu1" @click="giveAdvice">
						    <li><a href="javascript:;">笔头车间</a></li>
						    <li><a href="javascript:;">马卡车间</a></li>
						    <li><a href="javascript:;">笔芯车间</a></li>
						    <li><a href="javascript:;">总二车间</a></li>
					  	</ul>
					</div>
				</div>
				<div class="navbar-date">
					<p class="total-date time">
						<span class="h"></span>:
						<span class="m"></span>
					</p>
					<div class="clearfix">
						<p class="date">
							<span class="Y"></span>/<span class="M"></span>/<span class="D"></span>
						</p>
						<p class="day"><span class="week"></span></p>
					</div>
					<div class="temperature" v-show="isTem">
						<p>环境温度：{{temperature}}</p>
					</div>
				</div>
			</div>
		</header>
	</div>
</template>
<script>
	export default{
		name: 'Header',
		data(){
			return{
				device_router: '',
				Y:'',
				M:'',
				D:'',
				day:'',
				h:'',
				m:'',
				s:'',
				ul_index:0
			}
		},
		mounted(){
				(function(){  
		          change();  
		          function change(){     
		               /* 这里的html字体大小利用了一个简单书序公式（十字相乘），当我们默认设置以屏幕320px位基准此时的字体大小为20px(320    20px),那么浏览器窗口大小改变的时候新的html的fontSize（clientWidth  新的值）就是clientWidth*20/320 */
		               document.documentElement.style.fontSize = document.documentElement.clientWidth*10/1920 + 'px';  
		          }    
		       /* 监听窗口大小发生改变时 */
		        window.addEventListener('resize',change,false);})();


				let that = this;
				var date = new Date();
				var week;
				that.Y = date.getFullYear();
				that.M = date.getMonth();
				that.D = date.getDate();
				that.day = date.getDay();
				that.h = date.getHours();
				that.m = date.getMinutes();
				that.s = date.getSeconds();
				that.M = that.M + 1;
				$(".Y").html(that.Y);
				$(".M").html(that.M);
				$(".D").html(that.D);
				switch(that.day){
					case 0:
						week = '星期日';
						break;
					case 1:
						week = '星期一';
						break;
					case 2:
						week = '星期二';
						break;
					case 3:
						week = '星期三';
						break;
					case 4:
						week = '星期四';
						break;
					case 5:
						week = '星期五';
						break;
					case 6:
						week = '星期六';
						break;
				}
				$(".week").html(week);
				that.h = (that.h<10)?'0'+that.h:that.h;
				that.m = (that.m<10)?'0'+that.m:that.m;
				that.s = (that.s<10)?'0'+that.s:that.s;
				$(".h").html(that.h);
				$(".m").html(that.m);
				$(".s").html(that.s);
			function transferTime(){
				var date = new Date();
				var Y = date.getFullYear();
				var M = date.getMonth();
				var D = date.getDate();
				var day = date.getDay();
				var week;
				var h = date.getHours();
				var m = date.getMinutes();
				var s = date.getSeconds();
				M = M + 1;
				if(Y!=that.Y){
					that.Y = Y;
				}
				if(M!=that.M){
					that.M = M;
				}
				if(D!=that.D){
					that.D = D;
				}
				if(day!=that.day){
					that.day = day;
				}
				if(h!=that.h){
					that.h = h;
					that.h = (that.h<10)?'0'+that.h:that.h;
					$(".h").html(that.h);
				}
				if(m!=that.m){
					that.m = m;
					that.m = (that.m<10)?'0'+that.m:that.m;
					$(".m").html(that.m);
				}
				if(s!=that.s){
					that.s = s;
					that.s = (that.s<10)?'0'+that.s:that.s;
					$(".s").html(that.s);
				}
				$(".Y").html(that.Y);
				$(".M").html(that.M);
				$(".D").html(that.D);
				switch(that.day){
					case 0:
						week = '星期日';
						break;
					case 1:
						week = '星期一';
						break;
					case 2:
						week = '星期二';
						break;
					case 3:
						week = '星期三';
						break;
					case 4:
						week = '星期四';
						break;
					case 5:
						week = '星期五';
						break;
					case 6:
						week = '星期六';
						break;
				}
				$(".week").html(week);
							
			}
			setInterval(function(){
				transferTime();
			},500)
			$(".dropdown-menu li").click(function(){
				// console.log($(this).index());
				that.ul_index = $(this).index();
			})
		},
		methods:{
			giveAdvice:function(){
				this.$emit('give-advice',this.ul_index);
			}
		},
		props: ['pos','title','subTitle','isShow','chooseText','isTem','temperature']
	}
</script>
<style scoped>
	/*p{
		margin:0;
	}
	.head_vue{
		width: 100%;
		height:100px;
	}
	.jz-nav{
		margin-bottom: 0;
		background-color: transparent;
		border-bottom:0;
	}
	.fixed-nav{
		position:fixed;
		width: 100%;
		height:100px;
		top:0;
		left:0;
	}
	.navbar-header-icon{
		position: absolute;
		top: 12px;
		right: 15px;
		width:22px;
		height:22px;
		background:url(../../assets/images/more.png) no-repeat;
		background-size: contain;
		z-index: 9999;
		display: none;
	}
	.navbar-logo{
		position: absolute;
		display: inline-block;
		width:201px;
		height:49px;
		top:26px;
		left:20px;
		background:url(../../assets/images/logo.png) no-repeat;
		background-size: 100% 100%;
		z-index: 1000;
	}
	.dropBox{
		position: absolute;
		top: 15px;
		left: 163px;
		display: inline-block;
		width: 140px;
		height:50px;
		border-radius: 5px;
		background-color: #091555;
	}
	.dropBox .dropdown{
		width:100%;
		height:100%;
	}
	.dropBox .dropdown button{
		width:100%;
		height:100%;
		background-color: #091555;
		font-size:18px;
		color: #fff;
		font-family:'SourceHanSansSC-regular';
	}
	.dropBox .dropdown button .caret{
		margin-left: 5px;
		margin-bottom: 5px;
		border-top: 8px dashed;
		border-right: 8px solid transparent;
		border-left: 8px solid transparent;
	}
	.dropBox .dropdown.open>.dropdown-toggle.btn-default:focus, .dropBox .dropdown.open>.dropdown-toggle.btn-default:hover{
		background-color: #091555;
		color: #fff;
		border-color:#ccc;
	}
	.dropBox .dropdown .dropdown-menu{
		background-color: #091555;
		color: #fff;
		border-color:#ccc;
		font-size: 16px;
	}
	.dropBox .dropdown .dropdown-menu>li>a{
		color: #fff;
	}
	.dropBox .dropdown .dropdown-menu>li>a:focus,.dropBox .dropdown .dropdown-menu>li>a:hover{
		background-color: #091555;
	}
	.navbar .navbar-title{
		color: #f0f0f0;
		padding:0;
		position: relative;
		text-decoration: none;
	}
	.navbar .navbar-title h1{
		font-size: 48px;
		font-family: Roboto;
		font-weight: normal;
		color: #009688;
		line-height: 70px;
		margin-top: 0;
		margin-bottom: 0;
		margin-top:10px;
	}
	.navbar .navbar-title h4{
		font-size: 20px;
		font-family: Roboto;
		margin-top: 0;
		margin-bottom:0;
		height:30px;
		line-height: 30px;
	}
	.navbar-date{
		position: absolute;
		right:20px;
		top:0;
		height:100px;
		text-align: center;
		color: #4A4D4C;
		font-family: 'Roboto';
	}
	.navbar-date .total-date{
		margin-top: 25px;
		margin-bottom: 5px;
	}
	.navbar-date .day{
		float:left;
		font-size: 20px;
		height:30px;
		line-height:30px;
		margin-left: 10px;
	}
	.navbar-date .date{
		float:left;
		font-size: 20px;
		height:30px;
		line-height: 30px;
	}
	.navbar-date .time{
		font-size: 20px;
		height:20px;
		line-height: 20px;
	}*/
	p{
		margin:0;
	}
	.head_vue{
		width: 100%;
		height:10rem;
	}
	.jz-nav{
		margin-bottom: 0;
		background-color: transparent;
		border-bottom:0;
	}
	.fixed-nav{
		position:fixed;
		width: 100%;
		height:10rem;
		top:0;
		left:0;
	}
	.navbar-header-icon{
		position: absolute;
		top: 1.2rem;
		right: 1.5rem;
		width:2.2rem;
		height:2.2rem;
		background:url(../../assets/images/more.png) no-repeat;
		background-size: contain;
		z-index: 9999;
		display: none;
	}
	.navbar-logo{
		position: absolute;
		display: inline-block;
		width:20.1rem;
		height:4.9rem;
		top:2.6rem;
		left:2rem;
		background:url(../../assets/images/logo.png) no-repeat;
		background-size: 100% 100%;
		z-index: 1000;
	}
	.dropBox{
		position: absolute;
		top: 1.5rem;
		left: 16.3rem;
		display: inline-block;
		width: 14rem;
		height:5rem;
		border-radius: .5rem;
		background-color: #091555;
	}
	.dropBox .dropdown{
		width:100%;
		height:100%;
	}
	.dropBox .dropdown button{
		width:100%;
		height:100%;
		background-color: #091555;
		font-size:1.8rem;
		color: #fff;
		font-family:'SourceHanSansSC-regular';
	}
	.dropBox .dropdown button .caret{
		margin-left: .5rem;
		margin-bottom: .5rem;
		border-top: .8rem dashed;
		border-right: .8rem solid transparent;
		border-left: .8rem solid transparent;
	}
	.dropBox .dropdown.open>.dropdown-toggle.btn-default:focus, .dropBox .dropdown.open>.dropdown-toggle.btn-default:hover{
		background-color: #091555;
		color: #fff;
		border-color:#ccc;
	}
	.dropBox .dropdown .dropdown-menu{
		background-color: #091555;
		color: #fff;
		border-color:#ccc;
		font-size: 1.6rem;
	}
	.dropBox .dropdown .dropdown-menu>li>a{
		color: #fff;
	}
	.dropBox .dropdown .dropdown-menu>li>a:focus,.dropBox .dropdown .dropdown-menu>li>a:hover{
		background-color: #091555;
	}
	.navbar .navbar-title{
		color: #f0f0f0;
		padding:0;
		position: relative;
		text-decoration: none;
	}
	.navbar .navbar-title h1{
		font-size: 4.8rem;
		font-family: Roboto;
		font-weight: normal;
		color: #009688;
		line-height: 7rem;
		margin-top: 0;
		margin-bottom: 0;
		margin-top:1rem;
	}
	.navbar .navbar-title h4{
		font-size: 2rem;
		font-family: Roboto;
		margin-top: 0;
		margin-bottom:0;
		height:3rem;
		line-height: 3rem;
	}
	.temperature{
		/*position: absolute;
		right: 14rem;
		top: 0;
		height:10rem;*/
		text-align: center;
		color: #4A4D4C;
		font-family: 'Roboto';
	}
	.temperature p{
		height: 2rem;
		line-height: 2rem;
		font-size: 2rem;
	}
	.navbar-date{
		position: absolute;
		right:2rem;
		top:0;
		height:10rem;
		text-align: center;
		color: #4A4D4C;
		font-family: 'Roboto';
	}
	.navbar-date .total-date{
		margin-top: 1.5rem;
		margin-bottom: .5rem;
	}
	.navbar-date .day{
		float:left;
		font-size: 2rem;
		height:3rem;
		line-height:3rem;
		margin-left: 1rem;
	}
	.navbar-date .date{
		float:left;
		font-size: 2rem;
		height:3rem;
		line-height: 3rem;
	}
	.navbar-date .time{
		font-size: 2rem;
		height:2rem;
		line-height: 2rem;
	}
</style>