<template>
	<div class="comprehensive">
		<header-vue :pos="pos" :title="title" :subTitle="subTitle"></header-vue>
		<div class="xaj-main clearfix">
			<div class="col-dl-2 left_block">
				<div class="left_block_main">
					<div class="left_block_box">
						<div class="dl-tit clearfix">
							<b class="icon"></b>
							<span class="tit">设备运行情况</span>
						</div>
						<div class="left_block_box_main_pre">
							<div id="w1" style="width:100%;height:100%;"></div>
						</div>
					</div>
					<div class="left_block_box">
						<div class="dl-tit clearfix">
							<b class="icon"></b>
							<span class="tit">设备综合利用率</span>
						</div>
						<div class="left_block_box_main">
							<div id="w2" style="width:100%;height:100%;"></div>
						</div>
					</div>
					<!-- <div class="left_block_box">
						<div class="dl-tit clearfix">
							<b class="icon"></b>
							<span class="tit">人员综合操作效率</span>
						</div>
						<div class="left_block_box_main_pre">
							<div id="w3" style="width:100%;height:100%;"></div>
						</div>
					</div> -->
				</div>
			</div>
			<div class="col-dl-8 middle_block">
				<div class="middle_block_main">
					<div class="middle_block_one">
						<ul class="middle-list clearfix">
							<li v-for="item in list">
								<p class="title">{{item.title}}</p>
								<p class="value">
									<span class="val">{{item.value}}</span>
									<span class="txt">{{item.text}}</span>
								</p>
							</li>
						</ul>
						<div class="middle-main">
							<div class="dl-tit clearfix">
								<b class="icon"></b>
								<span class="tit">设备运行监测</span>
								<ul class="clearfix">
									<li><b class="s-icon pro"></b>生产</li>
									<li><b class="s-icon sta"></b>开机</li>
									<li><b class="s-icon err"></b>故障</li>
									<li><b class="s-icon sto"></b>关机</li>
								</ul>
							</div>
							<div class="middle_block_one_main clearfix">
							<div class="middle_block_one_main_inner">
								<div class="middle_section">
									<h4>金工班</h4>
									<ul class="clearfix">
										<li v-for="item in tableA" class="machine-item">
											<div class="machine-item-left">
												<div class="machine-item-imgbox">
													<b v-if="item.state==0" class="s-icon sto"></b>
													<b v-else-if="item.state==1" class="s-icon sta"></b>
													<b v-else-if="item.state==2" class="s-icon pro"></b>
													<b v-else class="s-icon err"></b>
													<img :src="item.imgSrc">
												</div>
												<div class="machine-item-name">{{item.machinename}}</div>
											</div>
											<div class="machine-item-right">
												<el-progress :text-inside="true" :stroke-width="18" :percentage="item.progress" color="#009688"></el-progress>
												<div class="machine-item-person"><i class="iconfont icon-ali-user1"></i>{{item.name}}</div>
											</div>
										</li>
									</ul>
								</div>
								<div class="middle_section">
									<h4>注塑班</h4>
									<ul class="clearfix">
										<li v-for="item in tableB" class="machine-item">
											<div class="machine-item-left">
												<div class="machine-item-imgbox">
													<b v-if="item.state==0" class="s-icon sto"></b>
													<b v-else-if="item.state==1" class="s-icon sta"></b>
													<b v-else-if="item.state==2" class="s-icon pro"></b>
													<b v-else class="s-icon err"></b>
													<img :src="item.imgSrc">
												</div>
												<div class="machine-item-name">{{item.machinename}}</div>
											</div>
											<div class="machine-item-right">
												<el-progress :text-inside="true" :stroke-width="18" :percentage="item.progress" color="#009688"></el-progress>
												<div class="machine-item-person"><i class="iconfont icon-ali-user1"></i>{{item.name}}</div>
											</div>
										</li>
									</ul>
								</div>
								<!-- <div class="middle_section">
									<h4>模压班</h4>
									<ul class="clearfix">
										<li v-for="item in tableC" class="machine-item">
											<div class="machine-item-left">
												<div class="machine-item-imgbox">
													<b v-if="item.state==0" class="s-icon sto"></b>
													<b v-else-if="item.state==1" class="s-icon sta"></b>
													<b v-else-if="item.state==2" class="s-icon pro"></b>
													<b v-else class="s-icon err"></b>
													<img :src="item.imgSrc">
												</div>
												<div class="machine-item-name">{{item.machinename}}</div>
											</div>
											<div class="machine-item-right">
												<el-progress :text-inside="true" :stroke-width="18" :percentage="item.progress" color="#009688"></el-progress>
												<div class="machine-item-person"><i class="iconfont icon-ali-user1"></i>{{item.name}}</div>
											</div>
										</li>
									</ul>
								</div> -->
								<div class="middle_section">
									<h4>缠绕班</h4>
									<ul class="clearfix">
										<li v-for="item in tableD" class="machine-item">
											<div class="machine-item-left">
												<div class="machine-item-imgbox">
													<b v-if="item.state==0" class="s-icon sto"></b>
													<b v-else-if="item.state==1" class="s-icon sta"></b>
													<b v-else-if="item.state==2" class="s-icon pro"></b>
													<b v-else class="s-icon err"></b>
													<img :src="item.imgSrc">
												</div>
												<div class="machine-item-name">{{item.machinename}}</div>
											</div>
											<div class="machine-item-right">
												<el-progress :text-inside="true" :stroke-width="18" :percentage="item.progress" color="#009688"></el-progress>
												<div class="machine-item-person"><i class="iconfont icon-ali-user1"></i>{{item.name}}</div>
											</div>
										</li>
									</ul>
								</div>
							</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="col-dl-2 right_block">
				<div class="right_block_main">
					<div class="right_block_box">
						<div class="dl-tit clearfix">
							<b class="icon"></b>
							<span class="tit">月计划达成率</span>
						</div>
						<div class="right_block_box_main">
							<div id="w6" style="width:100%;height:100%;"></div>
						</div>
					</div>
					<div class="right_block_box">
						<div class="dl-tit clearfix">
							<b class="icon"></b>
							<span class="tit">月任务单状态分布</span>
						</div>
						<div class="right_block_box_main">
							<div id="w7" style="width:100%;height:100%;"></div>
						</div>
					</div>	
					<div class="right_block_box">
						<div class="dl-tit clearfix">
							<b class="icon"></b>
							<span class="tit">月生产物料数TOP5</span>
						</div>
						<div class="right_block_box_main_pre">
							<div id="w8" style="width:100%;height:100%;"></div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<!-- <footer-vue></footer-vue> -->
	</div>
</template>
<script>
	import Header from './Header.vue'
	// import Footer from './Footer.vue'
	import axios from 'axios'
	export default{
		name:'workshop',
		data(){
			return{
				pos:true,
				title:'综合信息看板',
				subTitle:'Comprehensive information board',
				plannedCompletionRate:86.6667,
				avgRate:86.0,
				activationRate:86.6,
				xAxisDate:['6/19','6/20','6/21','6/22','6/23','6/24','6/25'],
				elList:[4000,6000,8000,10000,5000,7000,4000],
				euList:[71,80,56,65,75,70,90],
				time:['8:00','9:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00'],
				realTimeA:[],
				realTimeB:[],
				standardTimeA:4,
				standardTimeB:30,
				list: [{title:'当前任务单总数',text:'个',value:134},
					   {title:'本月新增任务单数',text:'个',value:30},
					   {title:'本月新增工单数',text:'个',value:136},
					   {title:'本月生产物料数',text:'个',value:43420},
					   {title:'本月设备平均利用率',text:'%',value:83.68},
					   // {title:'本月人员平均操作效率',text:'%',value:81.27}
					   ],
				tableA:[
					{state:0,imgSrc:require('@/assets/images/machine.png'),machinename:'JG01',progress:72,name:'章正洪'},
					{state:1,imgSrc:require('@/assets/images/machine.png'),machinename:'JG01',progress:82,name:'章正洪'},
					{state:2,imgSrc:require('@/assets/images/machine.png'),machinename:'JG01',progress:52,name:'章正洪'},
					{state:3,imgSrc:require('@/assets/images/machine.png'),machinename:'JG01',progress:42,name:'章正洪'},
					{state:0,imgSrc:require('@/assets/images/machine.png'),machinename:'JG01',progress:72,name:'章正洪'},
					{state:1,imgSrc:require('@/assets/images/machine.png'),machinename:'JG01',progress:82,name:'章正洪'},
					{state:2,imgSrc:require('@/assets/images/machine.png'),machinename:'JG01',progress:52,name:'章正洪'},
					{state:3,imgSrc:require('@/assets/images/machine.png'),machinename:'JG01',progress:42,name:'章正洪'},
					{state:0,imgSrc:require('@/assets/images/machine.png'),machinename:'JG01',progress:72,name:'章正洪'},
					{state:1,imgSrc:require('@/assets/images/machine.png'),machinename:'JG01',progress:82,name:'章正洪'},
					{state:2,imgSrc:require('@/assets/images/machine.png'),machinename:'JG01',progress:52,name:'章正洪'},
					{state:3,imgSrc:require('@/assets/images/machine.png'),machinename:'JG01',progress:42,name:'章正洪'},
					{state:0,imgSrc:require('@/assets/images/machine.png'),machinename:'JG01',progress:72,name:'章正洪'},
					{state:1,imgSrc:require('@/assets/images/machine.png'),machinename:'JG01',progress:82,name:'章正洪'},
					{state:2,imgSrc:require('@/assets/images/machine.png'),machinename:'JG01',progress:52,name:'章正洪'},
					{state:3,imgSrc:require('@/assets/images/machine.png'),machinename:'JG01',progress:42,name:'章正洪'},
					{state:0,imgSrc:require('@/assets/images/machine.png'),machinename:'JG01',progress:72,name:'章正洪'},
					{state:1,imgSrc:require('@/assets/images/machine.png'),machinename:'JG01',progress:82,name:'章正洪'},
					{state:2,imgSrc:require('@/assets/images/machine.png'),machinename:'JG01',progress:52,name:'章正洪'},
					{state:3,imgSrc:require('@/assets/images/machine.png'),machinename:'JG01',progress:42,name:'章正洪'},
					{state:0,imgSrc:require('@/assets/images/machine.png'),machinename:'JG01',progress:72,name:'章正洪'},
					{state:1,imgSrc:require('@/assets/images/machine.png'),machinename:'JG01',progress:82,name:'章正洪'},
					{state:2,imgSrc:require('@/assets/images/machine.png'),machinename:'JG01',progress:52,name:'章正洪'},
					{state:3,imgSrc:require('@/assets/images/machine.png'),machinename:'JG01',progress:42,name:'章正洪'},
					{state:0,imgSrc:require('@/assets/images/machine.png'),machinename:'JG01',progress:72,name:'章正洪'},
					{state:1,imgSrc:require('@/assets/images/machine.png'),machinename:'JG01',progress:82,name:'章正洪'},
					{state:2,imgSrc:require('@/assets/images/machine.png'),machinename:'JG01',progress:52,name:'章正洪'},
					{state:3,imgSrc:require('@/assets/images/machine.png'),machinename:'JG01',progress:42,name:'章正洪'},
					{state:0,imgSrc:require('@/assets/images/machine.png'),machinename:'JG01',progress:72,name:'章正洪'},
					{state:1,imgSrc:require('@/assets/images/machine.png'),machinename:'JG01',progress:82,name:'章正洪'},
					{state:2,imgSrc:require('@/assets/images/machine.png'),machinename:'JG01',progress:52,name:'章正洪'},
					{state:3,imgSrc:require('@/assets/images/machine.png'),machinename:'JG01',progress:42,name:'章正洪'},
					{state:0,imgSrc:require('@/assets/images/machine.png'),machinename:'JG01',progress:72,name:'章正洪'},
					{state:1,imgSrc:require('@/assets/images/machine.png'),machinename:'JG01',progress:82,name:'章正洪'},
					{state:2,imgSrc:require('@/assets/images/machine.png'),machinename:'JG01',progress:52,name:'章正洪'},
					{state:3,imgSrc:require('@/assets/images/machine.png'),machinename:'JG01',progress:42,name:'章正洪'},
					{state:0,imgSrc:require('@/assets/images/machine.png'),machinename:'JG01',progress:72,name:'章正洪'},
					{state:1,imgSrc:require('@/assets/images/machine.png'),machinename:'JG01',progress:82,name:'章正洪'},
					{state:2,imgSrc:require('@/assets/images/machine.png'),machinename:'JG01',progress:52,name:'章正洪'},
					{state:3,imgSrc:require('@/assets/images/machine.png'),machinename:'JG01',progress:42,name:'章正洪'},
					{state:0,imgSrc:require('@/assets/images/machine.png'),machinename:'JG01',progress:72,name:'章正洪'},
					{state:1,imgSrc:require('@/assets/images/machine.png'),machinename:'JG01',progress:82,name:'章正洪'},
					{state:2,imgSrc:require('@/assets/images/machine.png'),machinename:'JG01',progress:52,name:'章正洪'},
					{state:3,imgSrc:require('@/assets/images/machine.png'),machinename:'JG01',progress:42,name:'章正洪'},
					{state:0,imgSrc:require('@/assets/images/machine.png'),machinename:'JG01',progress:72,name:'章正洪'},
					{state:1,imgSrc:require('@/assets/images/machine.png'),machinename:'JG01',progress:82,name:'章正洪'},
					{state:2,imgSrc:require('@/assets/images/machine.png'),machinename:'JG01',progress:52,name:'章正洪'},
					{state:3,imgSrc:require('@/assets/images/machine.png'),machinename:'JG01',progress:42,name:'章正洪'},
					{state:0,imgSrc:require('@/assets/images/machine.png'),machinename:'JG01',progress:72,name:'章正洪'},
					{state:1,imgSrc:require('@/assets/images/machine.png'),machinename:'JG01',progress:82,name:'章正洪'},
					{state:2,imgSrc:require('@/assets/images/machine.png'),machinename:'JG01',progress:52,name:'章正洪'},
					{state:3,imgSrc:require('@/assets/images/machine.png'),machinename:'JG01',progress:42,name:'章正洪'},
				],
				tableB:[
					{state:0,imgSrc:require('@/assets/images/machine1.png'),machinename:'JG01',progress:72,name:'章正洪'},
					{state:1,imgSrc:require('@/assets/images/machine1.png'),machinename:'JG01',progress:82,name:'章正洪'}
				],
				// tableC:[
				// 	{state:0,imgSrc:require('@/assets/images/machine.png'),machinename:'JG01',progress:72,name:'章正洪'}
				// ],
				tableD:[
					{state:0,imgSrc:require('@/assets/images/machine2.png'),machinename:'JG01',progress:72,name:'章正洪'},
					{state:2,imgSrc:require('@/assets/images/machine2.png'),machinename:'JG01',progress:62,name:'章正洪'}
				],
				month:'',
				date:'',
				planCount: 99999,
				completeCount: 89999,
				producting:73,
				starting:26,
				fault:1,
				stop:undefined,
				taskProgress:[89.1,62.3,92.4,81.9],
				taskProgress_none:[10.9,37.7,7.6,18.1],
				scheduleNum:['金工班','注塑班','模压班','缠绕班'],
				scheduleNumCopy:['金工班','注塑班','模压班','缠绕班'],
				planRate:[89.1,62.3,92.4,81.9],
				rate:83.6,
				production:20,
				unpaid:undefined,
				success:112,
				unput:15,
				w8max:10000,
				w8yAxis:['无油立式真空泵气缸体\n（WLW100-01）','无油立式真空泵气缸体\n（WLW100-01）','无油立式真空泵气缸体\n（WLW100-01）','无油立式真空泵气缸体\n（WLW100-01）','无油立式真空泵气缸体\n（WLW100-01）'],
				w8data:[8700,8100,7700,6500,4300],
				chart_fontSize_10:10,
				chart_fontSize_12:12,
				chart_fontSize_14:14,
				chart_fontSize_16:16,
				chart_fontSize_18:18,
				chart_fontSize_40:40
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


			let _this = this;
			axios.get('/xaj/getDateList').then(function(res){
		   		console.log(res.data);
		   		_this.xAxisDate = res.data;
		   	}).catch(function(error){
				console.log(error);
			})
			console.log(_this.xAxisDate);
			function repage(){
		   		var win_height = $(window).height();
		   		// console.log(win_height);
		   		var nav_heihgt = $(".fixed-nav").height();
		   		var gap_height = 15;
		   		var tit_height = $(".dl-tit").css("height").split("px")[0];
		   		console.log(tit_height);
		   		var bottom_height = 16;
		   		var left_change_val = win_height - nav_heihgt - gap_height - tit_height*2 - bottom_height;
		   		var left_block_one = left_change_val*0.5;
		   		var left_block_two = left_change_val - left_block_one;
		   		var middle_change_val = win_height - nav_heihgt - gap_height*1 - tit_height - bottom_height;
		   		var middle_block_one = middle_change_val - $(".middle-list").height();
		   		console.log("middle_block_one:",middle_block_one);
		   		var right_change_val = win_height - nav_heihgt - gap_height*2 - tit_height*3 - bottom_height;
		   		var right_block_one = right_change_val*0.33;
		   		var right_block_two = (right_change_val - right_block_one)/2;
		   		$(".left_block_box_main_pre").height(left_block_one);
		   		$(".left_block_box_main").height(left_block_two);
		   		$(".middle_block_one_main").height(middle_block_one);
		   		$(".right_block_box_main_pre").height(right_block_one);
		   		$(".right_block_box_main").height(right_block_two);
		   	}
		   	repage();
		   	
		   	var timer = setInterval(function(){
				//获取当前滚动条高度
				var current = $(".middle_block_one_main").scrollTop();
				// console.log(current);
				var scrollh = $(".middle_block_one_main_inner").height() - $(".middle_block_one_main").height();
				// console.log($(".middle_block_one_main_inner").height(),$(".middle_block_one_main").height(),scrollh);
				if(current >= scrollh){
					//滚动到底端，返回到顶端
					// clearInterval(timer);
					$(".middle_block_one_main").animate({scrollTop:0},500);
					// $(".middle_block_one_main").scrollTop(0)
				}else{
					$(".middle_block_one_main").animate({scrollTop:current+$(".machine-item").height()},500);
					// $(".middle_block_one_main").scrollTop(current+$(".machine-item").height());
				}
			},5000)

		   	var date = new Date();
		   	_this.month = date.getMonth();
		   	_this.date = date.getDate();
		   	_this.month = _this.month + 1;
		   	$(".month").html(_this.month+'月');
		   	$(".hao").html(_this.date+'日');
		   	var mychartW1 = _this.$echarts.init(document.getElementById("w1"));
		   	var mychartW2 = _this.$echarts.init(document.getElementById("w2"));
		   	// var mychartW3 = _this.$echarts.init(document.getElementById("w3"));
		   	var mychartW6 = _this.$echarts.init(document.getElementById("w6"));
		   	var mychartW7 = _this.$echarts.init(document.getElementById("w7"));
		   	var mychartW8 = _this.$echarts.init(document.getElementById("w8"));
		   	_this.chart_fontSize_10 = document.documentElement.clientWidth*10/1920*1;
		   	_this.chart_fontSize_12 = document.documentElement.clientWidth*10/1920*1.2;
		   	_this.chart_fontSize_14 = document.documentElement.clientWidth*10/1920*1.4;
		   	_this.chart_fontSize_16 = document.documentElement.clientWidth*10/1920*1.6;
		   	_this.chart_fontSize_18 = document.documentElement.clientWidth*10/1920*1.8;
		   	_this.chart_fontSize_40 = document.documentElement.clientWidth*10/1920*4;
		   	mychartW1.setOption({
		   		legend: {
					orient: 'vertical',
					right:'10%',
					top:'center',
					textStyle:{
						fontSize:_this.chart_fontSize_14,
						color:'#101010',
						fontFamily:'SourceHanSansSC-regular'
					},
					data:[{name:'开机',icon:'rect'},{name:'生产',icon:'rect'},{name:'故障',icon:'rect'},{name:'关机',icon:'rect'}]
				},
				series: [
					{
						type:'pie',
						radius:'70%',
						center:['38%','50%'],
						clockwise:false,
						minAngle:20,
						// minShowLabelAngle:0,
						label:{
							normal:{
								show:true,
								position:'inner',
								color:'#fff',
								fontSize:_this.chart_fontSize_14,
								fontFamily:'Roboto',
								formatter:function(params){
									if(params.value!=undefined){
										return params.percent.toFixed(0)+'%';
									}
								}
							}
						},
						data:[
							{value:_this.producting,name:'生产',itemStyle:{color:'#8BC34A'}},
							{value:_this.starting,name:'开机',itemStyle:{color:'#5E75F0'}},
							{value:_this.stop,name:'关机',itemStyle:{color:'#605E5E'}},
							{value:_this.fault,name:'故障',itemStyle:{color:'#FF9800'}}
						]
					}
				]
		   	})
		   	mychartW2.setOption({
		   		grid:{
					left:2*_this.chart_fontSize_10,
					right:2*_this.chart_fontSize_10,
					top:3*_this.chart_fontSize_10,
					bottom:3*_this.chart_fontSize_10
				},
				xAxis:{
					type:'category',
					axisLine:{
						lineStyle:{
							color:'#848080'
						}
					},
					axisLabel:{
						color:'#101010',
						fontSize:_this.chart_fontSize_16,
						fontFamily:'SourceHanSansSC-regular'
					},
					axisTick:{
						inside:true,
						length:6,
						lineStyle:{
							color:'#848080'
						}
					},
					data:_this.scheduleNum
				},
				yAxis:{
					show:false
				},
				series:[{
					name:'完成产量',
					type:'bar',
					stack:'产量',
					itemStyle:{
						color:'#92c657'
					},
					data:_this.taskProgress
				},{
					name:'计划产量',
					type:'bar',
					barWidth:'40%',
					stack:'产量',
					label:{
						show:true,
						position:'top',
						color:'#101010',
						fontSize:_this.chart_fontSize_18,
						fontFamily:'SourceHanSansSC-regular',
						formatter:function(params){
							return (100-params.value);
						}
					},
					itemStyle:{
						color:'transparent',
						borderColor:'#848181',
						borderWidth:1,
						borderType:'dashed',
						opacity:1
					},
					data:_this.taskProgress_none
				}]
		   	})
		  //  	mychartW3.setOption({
				// grid:{
				// 	left:2*_this.chart_fontSize_10,
				// 	right:2*_this.chart_fontSize_10,
				// 	top:2*_this.chart_fontSize_10,
				// 	bottom:3*_this.chart_fontSize_10
				// },
				// xAxis:{
				// 	type:'category',
				// 	axisLine:{
				// 		lineStyle:{
				// 			color:'#848080'
				// 		}
				// 	},
				// 	axisLabel:{
				// 		color:'#101010',
				// 		fontSize:_this.chart_fontSize_16,
				// 		fontFamily:'SourceHanSansSC-regular'
				// 	},
				// 	axisTick:{
				// 		inside:true,
				// 		length:6,
				// 		lineStyle:{
				// 			color:'#848080'
				// 		}
				// 	},
				// 	data:_this.scheduleNum
				// },
				// yAxis:{
				// 	show:false
				// },
				// series:[{
				// 	name:'危险区域',
				// 	type:'bar',
				// 	stack:'区域',
				// 	itemStyle:{
				// 		color:'#99060B'
				// 	},
				// 	data:[75,75]
				// },{
				// 	name:'警告区域',
				// 	type:'bar',
				// 	stack:'区域',
				// 	itemStyle:{
				// 		color:'#FF9800'
				// 	},
				// 	data:[15,15]
				// },{
				// 	name:'安全区域',
				// 	type:'bar',
				// 	barWidth:'10%',
				// 	stack:'区域',
				// 	itemStyle:{
				// 		color:'#259B24'
				// 	},
				// 	data:[10,10]
				// },{
				// 	name:'产能达成率',
				// 	type:'bar',
				// 	barGap:0,
				// 	barWidth:'50%',
				// 	label:{
				// 		show:true,
				// 		position:'top',
				// 		color:'#101010',
				// 		fontSize:_this.chart_fontSize_18,
				// 		fontFamily:'SourceHanSansSC-regular',
				// 		formatter:'{c}'
				// 	},
				// 	itemStyle:{
				// 		color:'#5E75F0'
				// 	},
				// 	markPoint:{
				// 		data:[{
				// 			type : 'min',
				// 			symbol:'image://static/bell.png',
				// 			symbolSize:3*_this.chart_fontSize_10,
				// 			symbolOffset:[0,-4*_this.chart_fontSize_10],
				// 			label:{
				// 				show:false
				// 			}
				// 		}]
				// 	},
				// 	data:_this.planRate
				// }]
		  //  	})
		   	mychartW6.setOption({
				series: [
					{
						type:'pie',
						radius:['70%','80%'],
						clockwise:false,
						hoverAnimation:false,
						label:{
							normal:{
								show:false,
								position:'center',
								formatter:'{d}%'
							},
							emphasis:{
								show:false,
								textStyle:{
									color:'#223771',
									fontSize:_this.chart_fontSize_40,
									fontFamily:'Roboto'
								}
							}
						},
						data:[
							{value:_this.rate,name:'完成',itemStyle:{color:'#30CE3F'},label:{show:true,color:'#223771',fontSize:_this.chart_fontSize_40,fontFamily:'Roboto'}},
							{value:100-_this.rate,name:'未完成',itemStyle:{color:'#EEECE1'}}
						]
					}
				]
		   	})
		   	function RandomNumBoth(Min,Max){
			            var Range = Max - Min;
			            var Rand = Math.random();
			            var num = Min + Math.round(Rand * Range); //四舍五入
			            return num;
			}
		   	var x1,x2,x3;
			for (var i=0;i<13;i++){
				x1 =RandomNumBoth(0,2)
				x2 =RandomNumBoth(0,20)
				_this.realTimeA.push(Number(3+x1).toFixed(1))
				_this.realTimeB.push(Number(20+x2).toFixed(1))
			}
		   	mychartW7.setOption({
		   		legend: {
					orient: 'vertical',
					right:'10%',
					top:'center',
					textStyle:{
						fontSize:_this.chart_fontSize_14,
						color:'#101010',
						fontFamily:'SourceHanSansSC-regular'
					},
					data:[{name:'未派单',icon:'rect'},{name:'未投产',icon:'rect'},{name:'生产中',icon:'rect'},{name:'已完工',icon:'rect'}]
				},
				series: [
					{
						type:'pie',
						radius:'90%',
						center:['35%','50%'],
						clockwise:false,
						minAngle:20,
						label:{
							normal:{
								show:true,
								position:'inner',
								color:'#fff',
								fontSize:_this.chart_fontSize_14,
								fontFamily:'Roboto',
								formatter:function(params){
									if(params.value!=undefined){
										return params.percent.toFixed(0)+'%';
									}
								}
							}
						},
						data:[
							{value:_this.production,name:'生产中',itemStyle:{color:'#8BC34A'}},
							{value:_this.unpaid,name:'未派单',itemStyle:{color:'#FF9800'}},
							{value:_this.success,name:'已完工',itemStyle:{color:'#605E5E'}},
							{value:_this.unput,name:'未投产',itemStyle:{color:'#3F51B5'}}
						]
					}
				]
		   	})
		   	mychartW8.setOption({
		   		grid:{
					top:2*_this.chart_fontSize_10,
					left: 16*_this.chart_fontSize_10,
			        right: 3*_this.chart_fontSize_10,
			        bottom: 4*_this.chart_fontSize_10,
				},
			    xAxis: {
			        type: 'value',
			        min:0,
			        max:10000,
			       	show: false
			    },
			    yAxis: {
			        type: 'category',
		            axisLine: {
		                lineStyle: {
		                    color: '#848080'
		                }
		            },
		            axisTick: {
		            	inside:true,
						length:6,
						lineStyle:{
							color:'#848080'
						}
		            },
		            axisLabel: {
		                color:'#000',
		                fontFamily:'SourceHanSansSC-regular',
		                fontSize:_this.chart_fontSize_14,
		                rotate:20,
		                interval:0
		            },
		            inverse:true,
		            data:['无油立式真空泵气缸体\n（WLW100-01）','无油立式真空泵气缸体\n（WLW100-01）','无油立式真空泵气缸体\n（WLW100-01）','无油立式真空泵气缸体\n（WLW100-01）','无油立式真空泵气缸体\n（WLW100-01）']
			    },
			    series: [
			        {
			            type:'bar',
			            barWidth:'60%',
			            data:[8700,8100,7700,6500,4300],
			            label:{
							show:true,
							position:'right',
							color:'#060606',
							fontSize:_this.chart_fontSize_16,
							fontFamily:'Roboto',
							formatter:function(params){
								return params.value/1000 + 'K';
							}
						},
			            itemStyle:{
			            	color:'#259B24'
			            }
			        }

			    ]
		   	})
			function myWebsocketPush(){
				var url = window.location.hostname;
		   		// console.log(url);
				// var wsServer = 'ws://192.168.101.252:8081/websocket';
				var wsServer = 'ws://'+url+':8081'+'/websocket';
				// console.log(wsServer);
			    var websocket = new WebSocket(wsServer);
				websocket.onopen = function(evt){
					onOpen(evt);
				}
				websocket.onmessage = function(evt){
					onMessage(evt);
				}
				websocket.onerror = function(evt){
					onError(evt);
				}
				websocket.onclose = function(evt){
					onClose(evt);
				}
				function onOpen(evt){
					console.log("正在连接中...");
				}
				function onError(evt){
					console.log("连接失败");
				}
				function onClose(evt){
					console.log("连接中断");
				}
				function onMessage(evt){
					// console.log(evt);
					var data = JSON.parse(evt.data);
					// console.log(data);
					$.each(data,function(index,value){
						if(value.title=="综合信息看板"){
							console.log(value);
							_this.list[0].value = value.countMission;
							_this.list[1].value = value.newMonthMisson;
							_this.list[2].value = value.newMonthWorkingOrder;
							_this.list[3].value = value.totalMonthMaterial;
							_this.list[4].value = value.avgMachineAvailability;
							// _this.list[5].value = value.avgPeopleAvailability;
							$.each(value.machineWorkingStatus,function(index,value){
								if(value.statusName=="开机"){
									_this.starting = value.statusPercent;
									if(_this.starting==0){
										_this.starting=undefined;
									}
								}else if(value.statusName=="关机"){
									_this.stop = value.statusPercent;
									if(_this.stop==0){
										_this.stop=undefined;
									}
								}else if(value.statusName=="加工"){
									_this.producting = value.statusPercent;
									if(_this.producting==0){
										_this.producting=undefined;
									}
								}else{
									_this.fault = value.statusPercent;
									if(_this.fault==0){
										_this.fault=undefined;
									}
								}
							})
							mychartW1.setOption({
								legend: {
									orient: 'vertical',
									right:'10%',
									top:'center',
									textStyle:{
										fontSize:_this.chart_fontSize_14,
										color:'#101010',
										fontFamily:'SourceHanSansSC-regular'
									},
									data:[{name:'开机',icon:'rect'},{name:'生产',icon:'rect'},{name:'故障',icon:'rect'},{name:'关机',icon:'rect'}]
								},
								series: [
									{
										type:'pie',
										radius:'70%',
										center:['38%','50%'],
										clockwise:false,
										minAngle:20,
										label:{
											normal:{
												show:true,
												position:'inner',
												color:'#fff',
												fontSize:_this.chart_fontSize_14,
												fontFamily:'Roboto',
												formatter:function(params){
													if(params.value!=undefined){
														return params.percent.toFixed(0)+'%';
													}
												}
											}
										},
										data:[
											{value:_this.producting,name:'生产',itemStyle:{color:'#8BC34A'}},
											{value:_this.starting,name:'开机',itemStyle:{color:'#5E75F0'}},
											{value:_this.stop,name:'关机',itemStyle:{color:'#605E5E'}},
											{value:_this.fault,name:'故障',itemStyle:{color:'#FF9800'}}
										]
									}
								]
						   	})
						   	_this.scheduleNum = [];
						   	_this.taskProgress = [];
						   	_this.taskProgress_none = [];
						   	$.each(value.machineAvailability,function(index,value){
						   		_this.scheduleNum.push(value.groupName);
						   		_this.taskProgress.push(value.availability);
						   		_this.taskProgress_none.push((100-value.availability).toFixed(1));
						   	})
						   	// console.log(_this.taskProgress_none);
						   	mychartW2.setOption({
						   		grid:{
									left:2*_this.chart_fontSize_10,
									right:2*_this.chart_fontSize_10,
									top:3*_this.chart_fontSize_10,
									bottom:3*_this.chart_fontSize_10
								},
								xAxis:{
									type:'category',
									axisLine:{
										lineStyle:{
											color:'#848080'
										}
									},
									axisLabel:{
										color:'#101010',
										fontSize:_this.chart_fontSize_16,
										fontFamily:'SourceHanSansSC-regular',
										interval:0
									},
									axisTick:{
										inside:true,
										length:6,
										lineStyle:{
											color:'#848080'
										}
									},
									data:_this.scheduleNum
								},
								yAxis:{
									show:false
								},
								series:[{
									name:'完成产量',
									type:'bar',
									stack:'产量',
									itemStyle:{
										color:'#92c657'
									},
									data:_this.taskProgress
								},{
									name:'计划产量',
									type:'bar',
									barWidth:'40%',
									stack:'产量',
									label:{
										show:true,
										position:'top',
										color:'#101010',
										fontSize:_this.chart_fontSize_18,
										fontFamily:'SourceHanSansSC-regular',
										formatter:function(params){
											var index = params.dataIndex;
											return _this.taskProgress[index];
										}
									},
									itemStyle:{
										color:'transparent',
										borderColor:'#848181',
										borderWidth:1,
										borderType:'dashed',
										opacity:1
									},
									data:_this.taskProgress_none
								}]
						   	})
						   	_this.scheduleNumCopy = [];
						   	_this.planRate = [];
						   	$.each(value.peopleAvailability,function(index,value){
						   		_this.scheduleNumCopy.push(value.groupName);
						   		_this.planRate.push(value.availability)
						   	})
						  //  	mychartW3.setOption({
								// grid:{
								// 	left:2*_this.chart_fontSize_10,
								// 	right:2*_this.chart_fontSize_10,
								// 	top:2*_this.chart_fontSize_10,
								// 	bottom:3*_this.chart_fontSize_10
								// },
								// xAxis:{
								// 	type:'category',
								// 	axisLine:{
								// 		lineStyle:{
								// 			color:'#848080'
								// 		}
								// 	},
								// 	axisLabel:{
								// 		color:'#101010',
								// 		fontSize:_this.chart_fontSize_16,
								// 		fontFamily:'SourceHanSansSC-regular'
								// 	},
								// 	axisTick:{
								// 		inside:true,
								// 		length:6,
								// 		lineStyle:{
								// 			color:'#848080'
								// 		}
								// 	},
								// 	data:_this.scheduleNumCopy
								// },
								// yAxis:{
								// 	show:false
								// },
								// series:[{
								// 	name:'危险区域',
								// 	type:'bar',
								// 	stack:'区域',
								// 	itemStyle:{
								// 		color:'#99060B'
								// 	},
								// 	data:[75,75]
								// },{
								// 	name:'警告区域',
								// 	type:'bar',
								// 	stack:'区域',
								// 	itemStyle:{
								// 		color:'#FF9800'
								// 	},
								// 	data:[15,15]
								// },{
								// 	name:'安全区域',
								// 	type:'bar',
								// 	barWidth:'10%',
								// 	stack:'区域',
								// 	itemStyle:{
								// 		color:'#259B24'
								// 	},
								// 	data:[10,10]
								// },{
								// 	name:'产能达成率',
								// 	type:'bar',
								// 	barGap:0,
								// 	barWidth:'50%',
								// 	label:{
								// 		show:true,
								// 		position:'top',
								// 		color:'#101010',
								// 		fontSize:_this.chart_fontSize_18,
								// 		fontFamily:'SourceHanSansSC-regular',
								// 		formatter:'{c}'
								// 	},
								// 	itemStyle:{
								// 		color:'#5E75F0'
								// 	},
								// 	markPoint:{
								// 		data:[{
								// 			type : 'min',
								// 			symbol:'image://static/bell.png',
								// 			symbolSize:3*_this.chart_fontSize_10,
								// 			symbolOffset:[0,-4*_this.chart_fontSize_10],
								// 			label:{
								// 				show:false
								// 			}
								// 		}]
								// 	},
								// 	data:_this.planRate
								// }]
						  //  	})
						   	_this.rate = value.completionRate;
						   	mychartW6.setOption({
						   		series: [
									{
										type:'pie',
										radius:['70%','80%'],
										clockwise:false,
										hoverAnimation:false,
										label:{
											normal:{
												show:false,
												position:'center',
												formatter:'{d}%'
											},
											emphasis:{
												show:false,
												textStyle:{
													color:'#223771',
													fontSize:_this.chart_fontSize_40,
													fontFamily:'Roboto'
												}
											}
										},
										data:[
											{value:_this.rate,name:'完成',itemStyle:{color:'#30CE3F'},label:{show:true,color:'#223771',fontSize:_this.chart_fontSize_40,fontFamily:'Roboto'}},
											{value:(100-_this.rate).toFixed(1),name:'未完成',itemStyle:{color:'#EEECE1'}}
										]
									}
								]
						   	})
						   	$.each(value.monthMissionStatus,function(index,value){
						   		if(value.statusName == "未派单"){
						   			_this.unpaid = value.statusPercent;
						   			if(_this.unpaid == 0){
						   				_this.unpaid = undefined;
						   			}
						   		}else if(value.statusName == "未投产"){
						   			_this.unput = value.statusPercent;
						   			if(_this.unput == 0){
						   				_this.unput = undefined;
						   			}
						   		}else if(value.statusName == "生产中"){
						   			_this.production = value.statusPercent;
						   			if(_this.production == 0){
						   				_this.production = undefined;
						   			}
						   		}else{
						   			_this.success = value.statusPercent;
						   			if(_this.success == 0){
						   				_this.success = undefined;
						   			}
						   		}
						   	})
					   		mychartW7.setOption({
						   		legend: {
									orient: 'vertical',
									right:'10%',
									top:'center',
									textStyle:{
										fontSize:_this.chart_fontSize_14,
										color:'#101010',
										fontFamily:'SourceHanSansSC-regular'
									},
									data:[{name:'未派单',icon:'rect'},{name:'未投产',icon:'rect'},{name:'生产中',icon:'rect'},{name:'已完工',icon:'rect'}]
								},
								series: [
									{
										type:'pie',
										radius:'90%',
										center:['35%','50%'],
										clockwise:false,
										minAngle:20,
										label:{
											normal:{
												show:true,
												position:'inner',
												color:'#fff',
												fontSize:_this.chart_fontSize_14,
												fontFamily:'Roboto',
												formatter:function(params){
													if(params.value!=undefined){
														return params.percent.toFixed(0)+'%';
													}
												}
											}
										},
										data:[
											{value:_this.production,name:'生产中',itemStyle:{color:'#8BC34A'}},
											{value:_this.unpaid,name:'未派单',itemStyle:{color:'#FF9800'}},
											{value:_this.success,name:'已完工',itemStyle:{color:'#605E5E'}},
											{value:_this.unput,name:'未投产',itemStyle:{color:'#3F51B5'}}
										]
									}
								]
						   	})
						   	_this.w8yAxis = [];
						   	_this.w8data = [];
						   	$.each(value.rankingList,function(index,value){
						   		var arr = value.material.split("(");
						   		if(arr[1]!=undefined){
						   			arr[1] = "("+arr[1];
						   			var newStr = arr.join('\n');
						   		}else{
						   			var newStr = arr[0];
						   		}
								_this.w8yAxis.push(newStr);
								_this.w8data.push(value.totalQuantity);
						   	})
						   	mychartW8.setOption({
						   		grid:{
									top:2*_this.chart_fontSize_10,
									left: 16*_this.chart_fontSize_10,
							        right: 3*_this.chart_fontSize_10,
							        bottom: 4*_this.chart_fontSize_10,
								},
							    xAxis: {
							        type: 'value',
							        min:0,
							        max:_this.w8max,
							       	show: false
							    },
							    yAxis: {
							        type: 'category',
						            axisLine: {
						                lineStyle: {
						                    color: '#848080'
						                }
						            },
						            axisTick: {
						            	inside:true,
										length:6,
										lineStyle:{
											color:'#848080'
										}
						            },
						            axisLabel: {
						                color:'#000',
						                fontFamily:'SourceHanSansSC-regular',
						                fontSize:_this.chart_fontSize_14,
						                rotate:20,
						                interval:0
						            },
						            inverse:true,
						            data:_this.w8yAxis
							    },
							    series: [
							        {
							            type:'bar',
							            barWidth:'60%',
							            data:_this.w8data,
							            label:{
											show:true,
											position:'right',
											color:'#060606',
											fontSize:_this.chart_fontSize_16,
											fontFamily:'Roboto',
											formatter:function(params){
												return params.value/1000 + 'K';
											}
										},
							            itemStyle:{
							            	color:'#259B24'
							            }
							        }
							    ]
						   	})
						   	_this.tableA = [];
						   	_this.tableB = [];
						   	_this.tableD = [];
						   	$.each(value.machineMonitor,function(index,value){
						   		if(value.groupId == 17){
						   			//金工班
						   			if(value.machineType == 'CNC'){
						   				_this.tableA.push({state:value.status,imgSrc:require('@/assets/images/machine2-copy.png'),machinename:value.machineNumber,progress:value.progress,name:value.name})
						   			}else{
						   				_this.tableA.push({state:value.status,imgSrc:require('@/assets/images/machine.png'),machinename:value.machineNumber,progress:value.progress,name:value.name})
						   			}
						   		}else if(value.groupId == 18){
						   			//注塑班
						   			_this.tableB.push({state:value.status,imgSrc:require('@/assets/images/machine1.png'),machinename:value.machineNumber,progress:value.progress,name:value.name})
						   		}else{
						   			//缠绕班
						   			_this.tableD.push({state:value.status,imgSrc:require('@/assets/images/machine2.png'),machinename:value.machineNumber,progress:value.progress,name:value.name})
						   		}
						   	})
						   
						}
					})
				}
			}
			myWebsocketPush();
		   	setTimeout(function(){
				window.onresize = function(){
					repage();
					mychartW1.resize();
					mychartW2.resize();
					// mychartW3.resize();
					mychartW6.resize();
					mychartW7.resize();
					mychartW8.resize();
				}
			},200);
		},
		methods:{
			cutStr:function(str){
				return str.split('%')[0];
			},
			changeNum:function(num){
				var aNew,newNum;
				if(num>9999){
					newNum = num/10000;
					newNum = newNum.toString();
					var re = /([0-9]+.[0-9]{1})[0-9]*/;
					aNew = newNum.replace(re,"$1");
					return aNew+'万';
				}
			}
			// decimal:function(str){
			// 	var aNew;
			// 	var re = /([0-9]+.[0-9]{1})[0-9]*/;
			// 	aNew = str.replace(re,"$1");
			// 	var array = aNew.split('.');
			// 	var bNew;
			// 	if(array[1]==0){
			// 		bNew = array[0];
			// 	}else{
			// 		bNew = array.join(".");
			// 	}
			// 	return bNew;
			// }
		},
		components:{
			'header-vue':Header,
			// 'footer-vue':Footer
		}
	}
</script>
<style>
	/*ul{
		list-style: none;
	}
	ul,p,h4{
		margin:0;
		padding:0;
	}
	.comprehensive{
		width:100%;
		height:100%;
		position: fixed;
		top:0;
	}
	.xaj-main{
		padding:0 15px;
	}
	.left_block_main{
		margin-left:-15px;
		margin-right:-10px;
	}
	.left_block_box{
		box-shadow: 0px 0px 3px 1px rgba(172,200,197,1);
		border-radius: 10px;
		margin-bottom: 15px;
	}
	.left_block_box:last-child{
		margin-bottom: 0;
	}
	.middle-main{
		box-shadow: 0px 0px 3px 1px rgba(172,200,197,1);
		border-radius: 10px;
	}
	.middle_block_main{
		margin-left: -10px;
		margin-right: -10px;
	}
	.right_block_main{
		margin-left: -10px;
		margin-right: -15px;
	}
	.middle_block_two_pre_left{
		width:50%;
		float:left;
		padding-right:5px;
		box-sizing: border-box;
	}
	.middle_block_two_pre_right{
		width:50%;
		float:left;
		padding-left:5px;
		box-sizing: border-box;
	}
	.middle_block_two_pre_box{
		background-color: rgba(2,0,8,0.5);
		border-radius: 4px;
	}
	.dl-tit{
		padding: 3px 8px 0;
		height:30px;
		text-align: left;
		box-sizing: border-box;
		display: flex;
		align-items:center;
		position:relative;
	}
	.dl-tit .icon{
		display: inline-block;
		width:6px;
		height:21px;
		border-radius: 6px;
		background-color: #009688;
	}
	.dl-tit .tit{
		font-size: 18px;
		color: #4B536A;
		font-family: 'Roboto';
		margin-left: 10px;
	}
	.dl-tit .en_tit{
		font-size: 14px;
		color: #edeef0;
		margin-left: 10px;
		position: relative;
		bottom:2px;
	}
	.dl-tit ul{
		float: right;
		margin-right:5px;
		position: absolute;
		right:8px;
	}
	.dl-tit ul li{
		float:left;
		font-size: 14px;
		color: #111;
		font-family: 'Roboto';
		margin-right: 10px;
		display: flex;
		align-items: center;
	}
	.dl-tit ul li:last-child{
		margin-right: 0;
	}
	.dl-tit ul li b{
		margin-right:5px;
	}
	.s-icon{
		display: inline-block;
		width: 10px;
		height: 19px;
		border-radius: 20px;
	}
	.s-icon.icon-big{
		width: 24px;
		height: 24px;
		top:0;
	}
	.s-icon.pro{
		background-color:#8BC34A;
	}
	.s-icon.sta{
		background-color:#2948F4;
	}
	.s-icon.err{
		background-color:#FF9800;
	}
	.s-icon.sto{
		background-color:#605E5E;
	}
	.right_block_box{
		box-shadow: 0px 0px 3px 1px rgba(172,200,197,1);
		border-radius: 10px;
		margin-bottom: 15px;
	}
	.right_block_box:last-child{
		margin-bottom: 0;
	}
	.col-dl-2{
		width: 24%;
		padding-left:15px;
		padding-right:15px;
		float: left;
		box-sizing: border-box;
	}
	.col-dl-8{
		width: 52%;
		padding-left:15px;
		padding-right:15px;
		float: left;
		box-sizing: border-box;
	}
	.middle_table{
		float: left;
		width: 50%;
		height: 100%;
		overflow: hidden;
	}
	.middle_table>.table>thead>tr>td{
		font-size:16px;
		color: #D5D1D1;
		font-family: 'SourceHanSansSC-regular';
	}
	.middle_table>.table>tbody>tr>td{
		border-top:0;
		font-size:16px;
		color: #D5D1D1;
		font-family: 'SourceHanSansSC-regular';
		padding:13px 8px;
	}
	.middle_block_one_main{
		overflow-x: hidden;
	}
	.middle_block_one_main_inner{
		padding:12px 17px;
		box-sizing: border-box;
	}
	.middle_section h4{
		font-family: 'Roboto';
		color: #111;
		font-size: 16px;
		text-align: left;
		margin-bottom:13px;
	}
	.c5_l1,.c5_l2{
		width: 100%;
		height: 50%;

	}
	.c5_l1>div{
		width: 50%;
		height: 100%;
		float: left;
	}
	.c5_l2>div{
		width: 50%;
		height: 100%;
		float: left;
	}
	.middle-list{
		width:100%;
		border-radius: 10px;
		box-shadow: 0px 0px 3px 1px rgba(172,200,197,1);
		margin-bottom: 15px;
	}
	.middle-list li{
		width: 16.66%;
		float:left;
		height:80px;
		text-align: center;
	}
	.middle-list li .title{
		margin-top: 6px;
		line-height: 30px;
		font-size: 16px;
		color: #4B536A;
		font-family: 'Roboto';
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.middle-list li .subtext{
		line-height: 19px;
		font-size:13px;
		color: #fff;
	}
	.middle-list li .val{
		line-height: 46px;
		font-size: 28px;
		color: #223771;
		font-family: 'Roboto';
	}
	.middle-list li .txt{
		line-height: 26px;
		font-size: 18px;
		color: #4B536A;
		font-family: 'Roboto';
	}
	.machine-item{
		float: left;
		margin-right: 20px;
		margin-bottom: 20px;
	}
	.machine-item-left{
		float: left;
	}
	.machine-item-imgbox{
		border:1px solid #bbb;
		position: relative;
		width: 60px;
		box-sizing: border-box;
		height: 45px;
		display: flex;
		align-items: flex-end;
		justify-content: center;
	}
	.machine-item-imgbox b{
		position: absolute;
		top: 5px;
		left: 5px;
	}
	.machine-item-imgbox img{
		width: 28px;
		height: 28px;
	}
	.machine-item-name{
		color: #111;
		font-size: 16px;
		font-family: 'Roboto';
		text-align: center;
	}
	.machine-item-right{
		float: left;
		margin-left: 7px;
		width: 83px;
	}
	.machine-item-right .el-progress-bar__outer{
		border-radius: 0;
	}
	.machine-item-right .el-progress-bar__inner{
		border-radius: 0;
	}
	.machine-item-person{
		margin-top: 6px;
		text-align: left;
		font-size: 14px;
		color: #101010;
		font-family: 'SourceHanSansSC-regular';
	}
	.machine-item-person i{
		margin-right: 6px;
	}*/


ul{
	list-style: none;
}
ul,p,h4{
	margin:0;
	padding:0;
}
.comprehensive{
	width:100%;
	height:100%;
	position: fixed;
	top:0;
}
.xaj-main{
	padding:0 1.5rem;
}
.left_block_main{
	margin-left:-1.5rem;
	margin-right:-1rem;
}
.left_block_box{
	box-shadow: 0px 0px .3rem .1rem rgba(172,200,197,1);
	border-radius: 1rem;
	margin-bottom: 15px;
}
.left_block_box:last-child{
	margin-bottom: 0;
}
.middle-main{
	box-shadow: 0px 0px .3rem .1rem rgba(172,200,197,1);
	border-radius: 1rem;
}
.middle_block_main{
	margin-left: -1rem;
	margin-right: -1rem;
}
.right_block_main{
	margin-left: -1rem;
	margin-right: -1.5rem;
}
.middle_block_two_pre_left{
	width:50%;
	float:left;
	padding-right:.5rem;
	box-sizing: border-box;
}
.middle_block_two_pre_right{
	width:50%;
	float:left;
	padding-left:.5rem;
	box-sizing: border-box;
}
.middle_block_two_pre_box{
	background-color: rgba(2,0,8,0.5);
	border-radius: .4rem;
}
.dl-tit{
	padding: .3rem .8rem 0;
	height:3rem;
	text-align: left;
	box-sizing: border-box;
	display: flex;
	align-items:center;
	position: relative;
}
.dl-tit .icon{
	display: inline-block;
	width:.6rem;
	height:2.1rem;
	border-radius: .6rem;
	background-color: #009688;
}
.dl-tit .tit{
	font-size: 1.8rem;
	color: #4B536A;
	font-family: 'Roboto';
	margin-left: 1rem;
}
.dl-tit .en_tit{
	font-size: 1.4rem;
	color: #edeef0;
	margin-left: 1rem;
	position: relative;
	bottom:.2rem;
}
.dl-tit ul{
	float: right;
	margin-right:.5rem;
	position: absolute;
	right:.8rem;
}
.dl-tit ul li{
	float:left;
	font-size: 1.4rem;
	color: #111;
	font-family: 'Roboto';
	margin-right: 1rem;
	display: flex;
	align-items: center;
}
.dl-tit ul li:last-child{
	margin-right: 0;
}
.dl-tit ul li b{
	margin-right:.5rem;
}
.s-icon{
	display: inline-block;
	width: 1rem;
	height: 1.9rem;
	border-radius: 2rem;
}
.s-icon.icon-big{
	width: 2.4rem;
	height: 2.4rem;
	top:0;
}
.s-icon.pro{
	background-color:#8BC34A;
}
.s-icon.sta{
	background-color:#2948F4;
}
.s-icon.err{
	background-color:#FF9800;
}
.s-icon.sto{
	background-color:#605E5E;
}
.right_block_box{
	box-shadow: 0px 0px .3rem .1rem rgba(172,200,197,1);
	border-radius: 1rem;
	margin-bottom: 15px;
}
.right_block_box:last-child{
	margin-bottom: 0;
}
.col-dl-2{
	width: 24%;
	padding-left:1.5rem;
	padding-right:1.5rem;
	float: left;
	box-sizing: border-box;
}
.col-dl-8{
	width: 52%;
	padding-left:1.5rem;
	padding-right:1.5rem;
	float: left;
	box-sizing: border-box;
}
.middle_table{
	float: left;
	width: 50%;
	height: 100%;
	overflow: hidden;
}
.middle_table>.table>thead>tr>td{
	font-size:1.6rem;
	color: #D5D1D1;
	font-family: 'SourceHanSansSC-regular';
}
.middle_table>.table>tbody>tr>td{
	border-top:0;
	font-size:1.6rem;
	color: #D5D1D1;
	font-family: 'SourceHanSansSC-regular';
	padding:1.3rem .8rem;
}
.middle_block_one_main{
	overflow-x: hidden;
}
.middle_block_one_main_inner{
	padding:1.2rem 1.7rem;
	box-sizing: border-box;
}
.middle_section h4{
	font-family: 'Roboto';
	color: #111;
	font-size: 1.6rem;
	text-align: left;
	margin-bottom:1.3rem;
}
.c5_l1,.c5_l2{
	width: 100%;
	height: 50%;

}
.c5_l1>div{
	width: 50%;
	height: 100%;
	float: left;
}
.c5_l2>div{
	width: 50%;
	height: 100%;
	float: left;
}
.middle-list{
	width:100%;
	border-radius: 1rem;
	box-shadow: 0px 0px .3rem .1rem rgba(172,200,197,1);
	margin-bottom: 15px;
}
.middle-list li{
	width: 20%;
	float:left;
	height:8rem;
	text-align: center;
}
.middle-list li .title{
	margin-top: .6rem;
	line-height: 3rem;
	font-size: 1.6rem;
	color: #4B536A;
	font-family: 'Roboto';
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}
.middle-list li .value{
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}
.middle-list li .subtext{
	line-height: 1.9rem;
	font-size:1.3rem;
	color: #fff;
}
.middle-list li .val{
	line-height: 4.6rem;
	font-size: 2.8rem;
	color: #223771;
	font-family: 'Roboto';
}
.middle-list li .txt{
	line-height: 2.6rem;
	font-size: 1.8rem;
	color: #4B536A;
	font-family: 'Roboto';
}
.machine-item{
	float: left;
	margin-right: 2rem;
	margin-bottom: 2rem;
}
.machine-item-left{
	float: left;
}
.machine-item-imgbox{
	border:1px solid #bbb;
	position: relative;
	width: 6rem;
	box-sizing: border-box;
	height: 4.5rem;
	display: flex;
	align-items: flex-end;
	justify-content: center;
}
.machine-item-imgbox b{
	position: absolute;
	top: .3rem;
	left: .3rem;
}
.machine-item-imgbox img{
	width: 4rem;
	height: 3.3rem;
	margin-left: 1.2rem;
}
.machine-item-name{
	color: #111;
	font-size: 1.6rem;
	font-family: 'Roboto';
	text-align: center;
}
.machine-item-right{
	float: left;
	margin-left: .7rem;
	width: 8.3rem;
}
.machine-item-right .el-progress-bar__outer{
	border-radius: 0;
}
.machine-item-right .el-progress-bar__inner{
	border-radius: 0;
}
.machine-item-person{
	margin-top: .6rem;
	text-align: left;
	font-size: 1.4rem;
	color: #101010;
	font-family: 'SourceHanSansSC-regular';
}
.machine-item-person i{
	margin-right: .6rem;
}
</style>