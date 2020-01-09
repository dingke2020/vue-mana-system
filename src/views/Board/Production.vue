<template>
	<div class="production">
		<header-vue :pos="pos" :title="title" :subTitle="subTitle"></header-vue>
		<div class="main-content container-fluid">
			<div class="section-one">
				<ul class="clearfix">
					<li class="left box-mini box-bg">
						<div class="dl-tit clearfix">
							<b class="icon"></b>
							<span class="tit">周工单达成率</span>
						</div>
						<div class="chart">
							<div id="mychart1" style="width:100%;height:100%;"></div>
						</div>
					</li>
					<li class="left box-mini box-bg">
						<div class="dl-tit clearfix">
							<b class="icon"></b>
							<span class="tit">工单状态分布</span>
						</div>
						<div class="chart">
							<div id="mychart2" style="width:100%;height:100%;"></div>
						</div>
					</li>
					<li class="left box-big box-bg">
						<div class="dl-tit clearfix">
							<b class="icon"></b>
							<span class="tit">工单生产进度</span>
							<ul>
								<li><b class="s_icon pro"></b>生产进度</li>
								<li><b class="s_icon sta"></b>生产时长</li>
							</ul>
						</div>
						<div class="chart">
							<div id="mychart4" style="width:100%;height:100%;"></div>
						</div>
					</li>
				</ul>
			</div>
			<div class="section-two box-bg">
				<div class="dl-tit clearfix" style="margin-bottom:18px;">
					<b class="icon"></b>
					<span class="tit">工单列表</span>
				</div>
				<div class="table-box scroll_bg">
					<div class="table-mg" style="position:relative;">
						<table class="table table-hover table-striped table-title" style="position:absolute;z-index:100">
							<thead>
								<tr>
									<td style="border-bottom:0;" width="4%">序号</td>
									<td style="border-bottom:0;" width="9%">工单号</td>
									<td style="border-bottom:0;" width="9%">物料名称</td>
									<td style="border-bottom:0;" width="6%">物料编码</td>
									<td style="border-bottom:0;" width="6%">规格型号</td>
									<td style="border-bottom:0;" width="7%">计划生产量</td>
									<td style="border-bottom:0;" width="8%">计划开始时间</td>
									<td style="border-bottom:0;" width="8%">计划完成时间</td>
									<td style="border-bottom:0;" width="6%">工作中心</td>
									<td style="border-bottom:0;" width="6%">生产设备</td>
									<td style="border-bottom:0;" width="6%">生产人员</td>
									<td style="border-bottom:0;" width="6%">完工数量</td>
									<td style="border-bottom:0;" width="4%">进度</td>
									<td style="border-bottom:0;" width="7%">生产时间</td>
									<td style="border-bottom:0;" width="8%">状态</td>
								</tr>
							</thead>
						</table>
					</div>
					<div class="table-box-body" style="position:relative;">
						<div id="table-box" class="swiper-container">
							<div class="swiper-main">
								<div v-for="item in items" class="swiper-slide clearfix">
									<div style="border-bottom:0;width:4%;height:100%;">{{item.id}}</div>
									<div style="border-bottom:0;width:9%;height:100%;">{{item.orderNumber}}</div>
									<div style="border-bottom:0;width:9%;height:100%;">{{item.materialName}}</div>
									<div style="border-bottom:0;width:6%;height:100%;">{{item.materialCode}}</div>
									<div style="border-bottom:0;width:6%;height:100%;">{{item.specification}}</div>
									<div style="border-bottom:0;width:7%;height:100%;">{{item.planQuantity}}</div>
									<div style="border-bottom:0;width:8%;height:100%;">{{item.planStarttime}}</div>
									<div style="border-bottom:0;width:8%;height:100%;">{{item.planCompletetime}}</div>
									<div style="border-bottom:0;width:6%;height:100%;">{{item.workshop}}</div>
									<div style="border-bottom:0;width:6%;height:100%;">{{item.productionEquipment}}</div>
									<div style="border-bottom:0;width:6%;height:100%;">{{item.productionPerson}}</div>
									<div style="border-bottom:0;width:6%;height:100%;">{{item.completeQuantity}}</div>
									<div style="border-bottom:0;width:4%;height:100%;" class="complete-rate">{{item.progress}}</div>
									<div style="border-bottom:0;width:7%;height:100%;">{{item.productionTime}}</div>
									<div style="border-bottom:0;width:8%;height:100%;">
										<div v-if="item.state==='生产中'" class="tag tag-success">生产中</div>
										<div v-else-if="item.state==='待派单'" class="tag tag-warn">待派单</div>
										<div v-else-if="item.state==='待领单'" class="tag tag-primary">待领单</div>
										<div v-else class="tag tag-danger">已完成</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	import Header from './Header.vue'
	import axios from 'axios'
	import 'swiper/dist/css/swiper.css'
	import Swiper from 'Swiper'
	export default{
		data(){
			return{
				name:"Hello World!!!",
				pos:true,
				isShow:true,
				chooseText:'笔头车间',
				title:'生产进度看板',
				subTitle:'Production progress board',
				items:[
					{"id":"01","orderNumber":"RT-WLW100-01-26","materialName":"无油立式真空泵气缸体","materialCode":"WLW100-01","specification":"WLW100","planQuantity":100,"planStarttime":"2019-06-05","planCompletetime":"2019-06-06","workshop":"内圆磨","productionEquipment":"JG01","productionPerson":"张三","completeQuantity":65,"progress":"65%","productionTime":"03:32:35","state":"生产中"},
					{"id":"02","orderNumber":"RT-WLW100-01-11","materialName":"无油立式真空泵气缸体","materialCode":"WLW100-01","specification":"WLW100","planQuantity":100,"planStarttime":"2019-06-05","planCompletetime":"2019-06-06","workshop":"加工中心","productionEquipment":"ZS02","productionPerson":"王五","completeQuantity":80,"progress":"80%","productionTime":"03:32:35","state":"生产中"},
					{"id":"03","orderNumber":"RT-WLW100-01-10","materialName":"无油立式真空泵气缸体","materialCode":"WLW100-01","specification":"WLW100","planQuantity":100,"planStarttime":"2019-06-05","planCompletetime":"2019-06-06","workshop":"","productionEquipment":"","productionPerson":"","completeQuantity":0,"progress":"","productionTime":"","state":"待派单"},
					{"id":"04","orderNumber":"RT-WLW100-01-02","materialName":"无油立式真空泵气缸体","materialCode":"WLW100-01","specification":"WLW100","planQuantity":100,"planStarttime":"2019-06-05","planCompletetime":"2019-06-06","workshop":"加工中心","productionEquipment":"ZS01","productionPerson":"赵六","completeQuantity":34,"progress":"65%","productionTime":"03:32:35","state":"待领单"},
					{"id":"05","orderNumber":"RT-WLW100-01-10","materialName":"无油立式真空泵气缸体","materialCode":"WLW100-01","specification":"WLW100","planQuantity":100,"planStarttime":"2019-06-05","planCompletetime":"2019-06-06","workshop":"","productionEquipment":"","productionPerson":"","completeQuantity":0,"progress":"","productionTime":"","state":"待派单"},
					{"id":"06","orderNumber":"RT-WLW100-01-02","materialName":"无油立式真空泵气缸体","materialCode":"WLW100-01","specification":"WLW100","planQuantity":100,"planStarttime":"2019-06-05","planCompletetime":"2019-06-06","workshop":"加工中心","productionEquipment":"ZS01","productionPerson":"赵六","completeQuantity":100,"progress":"90%","productionTime":"03:32:35","state":"待领单"},
					{"id":"07","orderNumber":"RT-WLW100-01-10","materialName":"无油立式真空泵气缸体","materialCode":"WLW100-01","specification":"WLW100","planQuantity":100,"planStarttime":"2019-06-05","planCompletetime":"2019-06-06","workshop":"","productionEquipment":"","productionPerson":"","completeQuantity":0,"progress":"","productionTime":"","state":"待派单"},
					{"id":"08","orderNumber":"RT-WLW100-01-10","materialName":"无油立式真空泵气缸体","materialCode":"WLW100-01","specification":"WLW100","planQuantity":100,"planStarttime":"2019-06-05","planCompletetime":"2019-06-06","workshop":"","productionEquipment":"","productionPerson":"","completeQuantity":0,"progress":"","productionTime":"","state":"待派单"},
					{"id":"09","orderNumber":"RT-WLW100-01-02","materialName":"无油立式真空泵气缸体","materialCode":"WLW100-01","specification":"WLW100","planQuantity":100,"planStarttime":"2019-06-05","planCompletetime":"2019-06-06","workshop":"加工中心","productionEquipment":"ZS01","productionPerson":"赵六","completeQuantity":100,"progress":"90%","productionTime":"03:32:35","state":"待领单"},
					{"id":"10","orderNumber":"RT-WLW100-01-10","materialName":"无油立式真空泵气缸体","materialCode":"WLW100-01","specification":"WLW100","planQuantity":100,"planStarttime":"2019-06-05","planCompletetime":"2019-06-06","workshop":"","productionEquipment":"","productionPerson":"","completeQuantity":0,"progress":"","productionTime":"","state":"待派单"},
					// {"id":"11","orderNumber":"RT-WLW100-01-26","materialName":"无油立式真空泵气缸体","materialCode":"WLW100-01","specification":"WLW100","planQuantity":100,"planStarttime":"2019-06-05","planCompletetime":"2019-06-06","workshop":"内圆磨","productionEquipment":"JG01","productionPerson":"张三","completeQuantity":65,"progress":"65%","productionTime":"03:32:35","state":"生产中"},
					// {"id":"12","orderNumber":"RT-WLW100-01-11","materialName":"无油立式真空泵气缸体","materialCode":"WLW100-01","specification":"WLW100","planQuantity":100,"planStarttime":"2019-06-05","planCompletetime":"2019-06-06","workshop":"加工中心","productionEquipment":"ZS02","productionPerson":"王五","completeQuantity":80,"progress":"80%","productionTime":"03:32:35","state":"生产中"},
					// {"id":"13","orderNumber":"RT-WLW100-01-10","materialName":"无油立式真空泵气缸体","materialCode":"WLW100-01","specification":"WLW100","planQuantity":100,"planStarttime":"2019-06-05","planCompletetime":"2019-06-06","workshop":"","productionEquipment":"","productionPerson":"","completeQuantity":0,"progress":"","productionTime":"","state":"待派单"},
					// {"id":"14","orderNumber":"RT-WLW100-01-02","materialName":"无油立式真空泵气缸体","materialCode":"WLW100-01","specification":"WLW100","planQuantity":100,"planStarttime":"2019-06-05","planCompletetime":"2019-06-06","workshop":"加工中心","productionEquipment":"ZS01","productionPerson":"赵六","completeQuantity":34,"progress":"65%","productionTime":"03:32:35","state":"待领单"},
					// {"id":"15","orderNumber":"RT-WLW100-01-10","materialName":"无油立式真空泵气缸体","materialCode":"WLW100-01","specification":"WLW100","planQuantity":100,"planStarttime":"2019-06-05","planCompletetime":"2019-06-06","workshop":"","productionEquipment":"","productionPerson":"","completeQuantity":0,"progress":"","productionTime":"","state":"待派单"},
					// {"id":"16","orderNumber":"RT-WLW100-01-02","materialName":"无油立式真空泵气缸体","materialCode":"WLW100-01","specification":"WLW100","planQuantity":100,"planStarttime":"2019-06-05","planCompletetime":"2019-06-06","workshop":"加工中心","productionEquipment":"ZS01","productionPerson":"赵六","completeQuantity":100,"progress":"90%","productionTime":"03:32:35","state":"待领单"},
					// {"id":"17","orderNumber":"RT-WLW100-01-10","materialName":"无油立式真空泵气缸体","materialCode":"WLW100-01","specification":"WLW100","planQuantity":100,"planStarttime":"2019-06-05","planCompletetime":"2019-06-06","workshop":"","productionEquipment":"","productionPerson":"","completeQuantity":0,"progress":"","productionTime":"","state":"待派单"},
					// {"id":"18","orderNumber":"RT-WLW100-01-10","materialName":"无油立式真空泵气缸体","materialCode":"WLW100-01","specification":"WLW100","planQuantity":100,"planStarttime":"2019-06-05","planCompletetime":"2019-06-06","workshop":"","productionEquipment":"","productionPerson":"","completeQuantity":0,"progress":"","productionTime":"","state":"待派单"},
					// {"id":"19","orderNumber":"RT-WLW100-01-02","materialName":"无油立式真空泵气缸体","materialCode":"WLW100-01","specification":"WLW100","planQuantity":100,"planStarttime":"2019-06-05","planCompletetime":"2019-06-06","workshop":"加工中心","productionEquipment":"ZS01","productionPerson":"赵六","completeQuantity":100,"progress":"90%","productionTime":"03:32:35","state":"待领单"},
					// {"id":"20","orderNumber":"RT-WLW100-01-10","materialName":"无油立式真空泵气缸体","materialCode":"WLW100-01","specification":"WLW100","planQuantity":100,"planStarttime":"2019-06-05","planCompletetime":"2019-06-06","workshop":"","productionEquipment":"","productionPerson":"","completeQuantity":0,"progress":"","productionTime":"","state":"待派单"},
					// {"id":"21","orderNumber":"RT-WLW100-01-26","materialName":"无油立式真空泵气缸体","materialCode":"WLW100-01","specification":"WLW100","planQuantity":100,"planStarttime":"2019-06-05","planCompletetime":"2019-06-06","workshop":"内圆磨","productionEquipment":"JG01","productionPerson":"张三","completeQuantity":65,"progress":"65%","productionTime":"03:32:35","state":"生产中"},
					// {"id":"22","orderNumber":"RT-WLW100-01-11","materialName":"无油立式真空泵气缸体","materialCode":"WLW100-01","specification":"WLW100","planQuantity":100,"planStarttime":"2019-06-05","planCompletetime":"2019-06-06","workshop":"加工中心","productionEquipment":"ZS02","productionPerson":"王五","completeQuantity":80,"progress":"80%","productionTime":"03:32:35","state":"生产中"},
					// {"id":"23","orderNumber":"RT-WLW100-01-10","materialName":"无油立式真空泵气缸体","materialCode":"WLW100-01","specification":"WLW100","planQuantity":100,"planStarttime":"2019-06-05","planCompletetime":"2019-06-06","workshop":"","productionEquipment":"","productionPerson":"","completeQuantity":0,"progress":"","productionTime":"","state":"待派单"},
					// {"id":"24","orderNumber":"RT-WLW100-01-02","materialName":"无油立式真空泵气缸体","materialCode":"WLW100-01","specification":"WLW100","planQuantity":100,"planStarttime":"2019-06-05","planCompletetime":"2019-06-06","workshop":"加工中心","productionEquipment":"ZS01","productionPerson":"赵六","completeQuantity":34,"progress":"65%","productionTime":"03:32:35","state":"待领单"},
					// {"id":"25","orderNumber":"RT-WLW100-01-10","materialName":"无油立式真空泵气缸体","materialCode":"WLW100-01","specification":"WLW100","planQuantity":100,"planStarttime":"2019-06-05","planCompletetime":"2019-06-06","workshop":"","productionEquipment":"","productionPerson":"","completeQuantity":0,"progress":"","productionTime":"","state":"待派单"},
					// {"id":"26","orderNumber":"RT-WLW100-01-02","materialName":"无油立式真空泵气缸体","materialCode":"WLW100-01","specification":"WLW100","planQuantity":100,"planStarttime":"2019-06-05","planCompletetime":"2019-06-06","workshop":"加工中心","productionEquipment":"ZS01","productionPerson":"赵六","completeQuantity":100,"progress":"90%","productionTime":"03:32:35","state":"待领单"},
					// {"id":"27","orderNumber":"RT-WLW100-01-10","materialName":"无油立式真空泵气缸体","materialCode":"WLW100-01","specification":"WLW100","planQuantity":100,"planStarttime":"2019-06-05","planCompletetime":"2019-06-06","workshop":"","productionEquipment":"","productionPerson":"","completeQuantity":0,"progress":"","productionTime":"","state":"待派单"},
					// {"id":"28","orderNumber":"RT-WLW100-01-10","materialName":"无油立式真空泵气缸体","materialCode":"WLW100-01","specification":"WLW100","planQuantity":100,"planStarttime":"2019-06-05","planCompletetime":"2019-06-06","workshop":"","productionEquipment":"","productionPerson":"","completeQuantity":0,"progress":"","productionTime":"","state":"待派单"},
					// {"id":"29","orderNumber":"RT-WLW100-01-02","materialName":"无油立式真空泵气缸体","materialCode":"WLW100-01","specification":"WLW100","planQuantity":100,"planStarttime":"2019-06-05","planCompletetime":"2019-06-06","workshop":"加工中心","productionEquipment":"ZS01","productionPerson":"赵六","completeQuantity":100,"progress":"90%","productionTime":"03:32:35","state":"待领单"},
					// {"id":"30","orderNumber":"RT-WLW100-01-10","materialName":"无油立式真空泵气缸体","materialCode":"WLW100-01","specification":"WLW100","planQuantity":100,"planStarttime":"2019-06-05","planCompletetime":"2019-06-06","workshop":"","productionEquipment":"","productionPerson":"","completeQuantity":0,"progress":"","productionTime":"","state":"待派单"}
				],
				activeIndex:0,
				rate:82,
				producting:66,
				putorder:24,
				getorder:10,
				productionSchedule:[75,60,62,50,40,30,20,50,80,85,60,70,40,55,20,40,58,64],
				productionTime:[1.5,0.9,1,0.7,0.4,0.3,0.2,0.7,1.7,1.8,1,1.6,0.5,0.7,0.2,0.5,0.8,1],
				scheduleNum:['JG01','JG02','JG03','ZS01','ZS02','ZS03','ZS04','MY01','MY02','MY03','MY04','MY05','MY06','MY07','MY08','JG05','JG06','ZS09'],
				planCount: 10000,
				completeCount: 9999,
				chart_fontSize_10:10,
				chart_fontSize_14:14,
				chart_fontSize_16:16
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
			function repage(){
				var win_height = $(window).height();
		   		var nav_heihgt = $(".fixed-nav").height();
		   		var gap_height = 15;
		   		var tit_height = $(".dl-tit").css("height").split("px")[0];
		   		var change_val = win_height - nav_heihgt - gap_height*2 - tit_height;
		   		var block_two = change_val * 0.62;
		   		var block_one = change_val - block_two;
		   		$(".chart").height(block_one);
		   		$(".section-two").height(block_two-20);
		   		var table_title_A = $(".table-box .table-title").height();
		   		$(".table-box").height(block_two-table_title_A-10+20);
		   		$(".table-box .table-mg").height(table_title_A);
		   		$(".table-box-body").height(block_two-2*table_title_A+10);
			}
			repage();

			var timer = setInterval(function(){
				//获取当前滚动条高度
				var current = $(".swiper-container").scrollTop();
				// console.log(current);
				var scrollh = $(".swiper-main").height() - $(".swiper-container").height();
				// console.log($(".swiper-main").height(),$(".swiper-container").height(),current,scrollh);
				if(current >= scrollh){
					//滚动到底端，返回到顶端
					// clearInterval(timer);
					$(".swiper-container").animate({scrollTop:0},500);
					// $(".swiper-container").scrollTop(0)
				}else{
					$(".swiper-container").animate({scrollTop:current+$(".swiper-slide").height()},500);
					// $(".swiper-container").scrollTop(current+$(".swiper-slide").height());
					
				}
			},5000)

			// var swiperA_h = $(".table-box-body").height();
			// var swiperA_len = $(".table-box-body .swiper-wrapper").children().length;
			// var swiperA_s_h = $(".table-box-body .swiper-wrapper .swiper-slide").height();
			// console.log(swiperA_h,swiperA_len,swiperA_s_h);
			// if(swiperA_h>=swiperA_len*swiperA_s_h){
			// 	var swiperA = new Swiper('#table-box',{
			// 		direction:'vertical',
			//         slidesPerView: 'auto',
			//         autoplay:{
			//         	delay:1000,
			//         	disableOnInteraction: false
			//         }
			// 	})
			// }else{
			// 	var swiperA = new Swiper('#table-box',{
			// 		direction:'vertical',
			//         slidesPerView: 'auto',
			//         loop:true,
			//         autoplay:{
			//         	delay:1000,
			//         	disableOnInteraction: false
			//         }
			// 	})
			// }

			// setInterval(function(){
		 //   		if(_this.activeIndex<_this.items.length-1){
		 //   			_this.activeIndex +=1;
		 //   		}else{
		 //   			_this.activeIndex = 0;
		 //   		}
		 //   	},1000);
			var mychart1 = _this.$echarts.init(document.getElementById('mychart1'));
			var mychart2 = _this.$echarts.init(document.getElementById('mychart2'));
			var mychart4 = _this.$echarts.init(document.getElementById('mychart4'));
			_this.chart_fontSize_10 = document.documentElement.clientWidth*10/1920*1;
			_this.chart_fontSize_14 = document.documentElement.clientWidth*10/1920*1.4;
			_this.chart_fontSize_16 = document.documentElement.clientWidth*10/1920*1.6;
			mychart1.setOption({
				series: [
					{
						type:'pie',
						radius:['60%','70%'],
						clockwise:false,
						label:{
							normal:{
								show:false,
								position:'center',
								formatter:'{d}%'
							},
							emphasis:{
								show:false,
								textStyle:{
									color:'#1C1B1B',
									fontSize:4*_this.chart_fontSize_10,
									fontFamily:'Roboto'
								}
							}
						},
						data:[
							{value:_this.rate,name:'完成',itemStyle:{color:'#0070C0'},label:{show:true,color:'#1C1B1B',fontSize:4*_this.chart_fontSize_10,fontFamily:'Roboto'}},
							{value:100-_this.rate,name:'未完成',itemStyle:{color:'#EEECE1'}}
						]
					}
				]
			});
			mychart2.setOption({
				legend: {
					orient: 'vertical',
					right:'5%',
					top:'center',
					textStyle:{
						fontSize:_this.chart_fontSize_14,
						color:'#101010',
						fontFamily:'SourceHanSansSC-regular'
					},
					data:[{name:'待派单',icon:'rect'},{name:'待领单',icon:'rect'},{name:'生产中',icon:'rect'}]
				},
				series: [
					{
						type:'pie',
						radius:'60%',
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
							{value:_this.producting,name:'生产中',itemStyle:{color:'#8BC34A'}},
							{value:_this.putorder,name:'待派单',itemStyle:{color:'#FF9800'}},
							{value:_this.getorder,name:'待领单',itemStyle:{color:'#3F51B5'}}
						]
					}
				]
			});
			mychart4.setOption({
				grid:{
					left:2*_this.chart_fontSize_10,
					right:2*_this.chart_fontSize_10,
					top:3*_this.chart_fontSize_10,
					bottom:3.5*_this.chart_fontSize_10
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
						fontSize:_this.chart_fontSize_14,
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
				yAxis:[{
					show:false
				},{
					show:false
				}],
				series:[{
					name:'生产进度',
					type:'bar',
					yAxisIndex:0,
					label:{
						show:true,
						position:'top',
						color:'#101010',
						fontSize:_this.chart_fontSize_14,
						fontFamily:'SourceHanSansSC-regular',
						formatter:'{c}%'
					},
					itemStyle:{
						color:'#259B24'
					},
					data:_this.productionSchedule
				},{
					name:'生产时长',
					type:'bar',
					yAxisIndex:1,
					barGap:'10%',
					label:{
						show:true,
						position:'top',
						color:'#101010',
						fontSize:_this.chart_fontSize_14,
						fontFamily:'SourceHanSansSC-regular'
					},
					itemStyle:{
						color:'#393C95'
					},
					data:_this.productionTime
				}]
			})
			function myWebsocketPush(){
				var url = window.location.hostname;
		   		// console.log(url);
				// var wsServer = 'ws://192.168.101.252:8081/websocket';
				var wsServer = 'ws://'+url+':8081'+'/websocket';
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
					var data = JSON.parse(evt.data);
					// console.log(data);
					$.each(data,function(index,value){
						if(value.title=="生产进度看板"){
							console.log(value);
							_this.rate = value.weekCompletionRate;
							mychart1.setOption({
								series: [
									{
										type:'pie',
										radius:['60%','70%'],
										clockwise:false,
										label:{
											normal:{
												show:false,
												position:'center',
												formatter:'{d}%'
											},
											emphasis:{
												show:false,
												textStyle:{
													color:'#1C1B1B',
													fontSize:4*_this.chart_fontSize_10,
													fontFamily:'Roboto'
												}
											}
										},
										data:[
											{value:_this.rate,name:'完成',itemStyle:{color:'#0070C0'},label:{show:true,color:'#1C1B1B',fontSize:4*_this.chart_fontSize_10,fontFamily:'Roboto'}},
											{value:(100-_this.rate).toFixed(1),name:'未完成',itemStyle:{color:'#EEECE1'}}
										]
									}
								]
							});
							$.each(value.missionStatus,function(index,value){
								if(value.statusName=="待派单"){
									_this.putorder = value.statusPercent;
									if(_this.putorder == 0){
										_this.putorder = undefined;
									}
								}else if(value.statusName=="待领单"){
									_this.getorder = value.statusPercent;
									if(_this.getorder == 0){
										_this.getorder = undefined;
									}
								}else{
									_this.producting = value.statusPercent;
									if(_this.producting == 0){
										_this.producting = undefined;
									}
								}
							})
							mychart2.setOption({
								legend: {
									orient: 'vertical',
									right:'5%',
									top:'center',
									textStyle:{
										fontSize:_this.chart_fontSize_14,
										color:'#101010',
										fontFamily:'SourceHanSansSC-regular'
									},
									data:[{name:'待派单',icon:'rect'},{name:'待领单',icon:'rect'},{name:'生产中',icon:'rect'}]
								},
								series: [
									{
										type:'pie',
										radius:'60%',
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
											{value:_this.producting,name:'生产中',itemStyle:{color:'#8BC34A'}},
											{value:_this.putorder,name:'待派单',itemStyle:{color:'#FF9800'}},
											{value:_this.getorder,name:'待领单',itemStyle:{color:'#3F51B5'}}
										]
									}
								]
							});
							_this.scheduleNum = [];
							_this.productionSchedule = [];
							_this.productionTime = [];
							$.each(value.projectProgress,function(index,value){
								_this.scheduleNum.push(value.machine);
								_this.productionSchedule.push(value.progress);
								_this.productionTime.push(value.productionTime);
							})
							mychart4.setOption({
								grid:{
									left:2*_this.chart_fontSize_10,
									right:2*_this.chart_fontSize_10,
									top:3*_this.chart_fontSize_10,
									bottom:3.5*_this.chart_fontSize_10
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
										fontSize:_this.chart_fontSize_14,
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
								yAxis:[{
									show:false
								},{
									show:false
								}],
								dataZoom:[
									{
										show:true,
										start:0,
										end:25
									}
								],
								series:[{
									name:'生产进度',
									type:'bar',
									yAxisIndex:0,
									label:{
										show:true,
										position:'top',
										color:'#101010',
										fontSize:_this.chart_fontSize_14,
										fontFamily:'SourceHanSansSC-regular',
										formatter:'{c}%'
									},
									itemStyle:{
										color:'#259B24'
									},
									data:_this.productionSchedule
								},{
									name:'生产时长',
									type:'bar',
									yAxisIndex:1,
									barGap:'10%',
									label:{
										show:true,
										position:'top',
										color:'#101010',
										fontSize:_this.chart_fontSize_14,
										fontFamily:'SourceHanSansSC-regular'
									},
									itemStyle:{
										color:'#393C95'
									},
									data:_this.productionTime
								}]
							})
							// swiperA.removeSlide([31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60]);
							_this.items = [];
							$.each(value.productionList,function(index,value){
								switch(value.status){
									case 0:
										value.status = '待派单';
										break;
									case 1:
										value.status = '待领单';
										break;
									case 2:
										value.status = '生产中';
										break;
								}
								_this.items.push({"id":value.id,"orderNumber":value.workingNumber,"materialName":value.materialName,"materialCode":value.materialCode,"specification":value.specifications,"planQuantity":value.planQuantity,"planStarttime":value.startTime,"planCompletetime":value.endTime,"workshop":value.productionProcessesName,"productionEquipment":value.machine,"productionPerson":value.name,"completeQuantity":value.nowQuantity,"progress":value.progress,"productionTime":value.productionTime,"state":value.status})
							})
						}
					})
				}
			}
			myWebsocketPush();
			setTimeout(function(){
				window.onresize = function(){
					repage();
					mychart1.resize();
					mychart2.resize();
					mychart4.resize();
				}
			},200);
		},
		methods:{
			showAdvice:function(advice){
				console.log(advice);
				switch(advice){
					case 0:
						this.chooseText = '笔头车间';
						break;
					case 1:
						this.chooseText = '马卡车间';
						break;
					case 2:
						this.chooseText = '笔芯车间';
						break;
					case 3:
						this.chooseText = '总二车间';
						break;
				}
			},
			cutStr:function(str){
				return str.split('%')[0];
			},
			decimal:function(str){
				var aNew;
				var re = /([0-9]+.[0-9]{1})[0-9]*/;
				aNew = str.replace(re,"$1");
				var array = aNew.split('.');
				var bNew;
				if(array[1]==0){
					bNew = array[0];
				}else{
					bNew = array.join(".");
				}
				return bNew;
			},
			cutRod:function(str){
				return str.split('-')[1];
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
		},
		components:{
			'header-vue':Header
		}
	}
</script>
<style scoped>
	/*ul{
		list-style: none;
	}
	ul,p,h4{
		margin:0;
		padding:0;
	}
	.production{
		width:100%;
		height:100%;
		position: fixed;
		top:0;
	}
	.section-one{
		margin-bottom: 15px;
	}
	.section-two{
		position: relative;
		padding: 10px;
	}
	.box-mini{
		width: 18.2%;
		margin-right: 16px;
	}
	.box-big{
		width: calc(63.6% - 32px);
	}
	.box-bg{
		box-shadow: 0px 0px 3px 1px rgba(172,200,197,1);
		border-radius: 10px;
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
	.s-icon.pro{
		background-color: #8BC34A;
	}
	.table-box{
		position: relative;
		height: 100%;
	}
	.table-box table{
		margin-bottom:0;
	}
	.table-box table thead{
		background: #EEF4F4;
	}
	.table-box table thead tr td{
		color: #424242;
		font-size: 20px;
		font-family: 'Roboto';
	}
	.table-box table>thead>tr>td{
		padding:14px;
		box-sizing: border-box;
	}
	.table-box .table-box-body .swiper-slide{
		height: 50px;
	}
	.table-box .table-box-body .swiper-slide>div{
		color: #0B0B0B;
		font-size: 20px;
		font-family: 'Roboto';
		border:none;
		display: block;
		float: left;
	}
	.table-box .table-box-body .swiper-slide>div{
		padding:14px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		box-sizing: border-box;
	}
	.table-box .table-box-body .swiper-slide div.complete-rate{
		color: #8BC34A;
	}
	.table-box .table-box-body .swiper-slide div .tag{
		width:80%;
		height: 30px;
		line-height:30px;
		margin:0 auto;
		border-radius: 4px;
		color: #fff;
		font-size: 14px;
		font-family: 'Microsoft Yahei';
	}
	.table-box .table-box-body .swiper-slide div .tag-success{
		background-color: #259B24;
	}
	.table-box .table-box-body .swiper-slide div .tag-warn{
		background-color: #FF9800;
	}
	.table-box .table-box-body .swiper-slide div .tag-primary{
		background-color: #3F51B5;
	}
	.table-box .table-box-body .swiper-slide div .tag-danger{
		background-color: #595959;
	}
	.table-box .table-box-body .swiper-slide:nth-of-type(odd){
		background-color: transparent;
	}
	.table-box .table-box-body .swiper-slide:nth-of-type(even){
		background-color: #F4F3F3;
	}
	.scroll_bg{
		overflow: hidden;
		position: relative;
	}
	.scroll_content{
		position: absolute;
		transition: top 0.5s;
		z-index: 99;
	}
	.swiper-container {
      width: 100%;
	  height:100%;
    }
    .main-content{
    	padding:0px 20px 15px;
    }*/
    ul{
		list-style: none;
	}
	ul,p,h4{
		margin:0;
		padding:0;
	}
	.production{
		width:100%;
		height:100%;
		position: fixed;
		top:0;
	}
	.section-one{
		margin-bottom: 15px;
	}
	.section-two{
		position: relative;
		padding: 1rem;
		overflow: hidden;
	}
	.box-mini{
		width: 18.2%;
		margin-right: 1.6rem;
	}
	.box-big{
		width: calc(63.6% - 3.2rem);
	}
	.box-bg{
		box-shadow: 0px 0px .3rem .1rem rgba(172,200,197,1);
		border-radius: 10px;
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
	.s-icon.pro{
		background-color: #8BC34A;
	}
	.table-box{
		position: relative;
		/*height: 100%;*/
	}
	.table-box table{
		margin-bottom:0;
	}
	.table-box table thead{
		background: #EEF4F4;
	}
	.table-box table thead tr td{
		color: #424242;
		font-size: 2rem;
		font-family: 'Roboto';
	}
	.table-box table>thead>tr>td{
		padding:1.4rem;
		box-sizing: border-box;
	}
	/*.table-box .table-box-body{
		overflow-x: hidden;
	}*/
	.table-box .table-box-body .swiper-main{
		padding-bottom:20px;
	}
	.table-box .table-box-body .swiper-slide{
		height: 5rem;
		/*transition: all ease 0.5s;*/
	}
	.table-box .table-box-body .swiper-slide>div{
		color: #0B0B0B;
		font-size: 2rem;
		font-family: 'Roboto';
		border:none;
		display: block;
		float: left;
	}
	.table-box .table-box-body .swiper-slide>div{
		padding:1.4rem;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		box-sizing: border-box;
	}
	.table-box .table-box-body .swiper-slide div.complete-rate{
		color: #8BC34A;
	}
	.table-box .table-box-body .swiper-slide div .tag{
		width:80%;
		height: 3rem;
		line-height:3rem;
		margin:0 auto;
		border-radius: .4rem;
		color: #fff;
		font-size: 1.4rem;
		font-family: 'Microsoft Yahei';
	}
	.table-box .table-box-body .swiper-slide div .tag-success{
		background-color: #259B24;
	}
	.table-box .table-box-body .swiper-slide div .tag-warn{
		background-color: #FF9800;
	}
	.table-box .table-box-body .swiper-slide div .tag-primary{
		background-color: #3F51B5;
	}
	.table-box .table-box-body .swiper-slide div .tag-danger{
		background-color: #595959;
	}
	.table-box .table-box-body .swiper-slide:nth-of-type(odd){
		background-color: transparent;
	}
	.table-box .table-box-body .swiper-slide:nth-of-type(even){
		background-color: #F4F3F3;
	}
	.scroll_bg{
		overflow: hidden;
		position: relative;
	}
	.scroll_content{
		position: absolute;
		transition: top 0.5s;
		z-index: 99;
	}
	.swiper-container {
      width: 100%;
	  height:100%;
    }
    .main-content{
    	padding:0px 2rem 1.5rem;
    }
    .s_icon{
		display: inline-block;
		width: 2rem;
		height: 1.2rem;
	}
	.pro{
		background-color:#259B24;
	}
	.sta{
		background-color: #393C95;
	}
</style>