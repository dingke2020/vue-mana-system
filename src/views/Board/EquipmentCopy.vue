<template>
	<div class="equipment">
		<header-vue :pos="pos" :title="title" :subTitle="subTitle" :isTem="isTem" :temperature="temperature"></header-vue>
		<div class="xaj-main">
			<ul class="clearfix">
				<li class="left_block_box">
					<div class="dl-tit clearfix">
						<b class="icon"></b>
						<span class="tit">注塑机运行时长</span>
					</div>
					<div class="left_block_box_main">
						<div id="e1" style="width:100%;height:100%;"></div>
					</div>
				</li>
				<li v-for="node in deviceList" class="middle_block_box_main_pre">
					<div class="middle_box clearfix">
						<div class="left" style="width:80%;overflow:auto">
							<div class="table-mode">
					            <ul class="head clearfix">
					              <li>运行模式</li>
					              <!-- <li>油温</li> -->
					              <!-- <li>电机温度</li>
					              <li>环境温度</li> -->
					            </ul>
					            <ul class="body clearfix">
					              <li>{{node.process_sheet.mode}}</li>
					              <!-- <li>{{process_sheet.oil}}</li> -->
					              <!-- <li>{{process_sheet.electric}}</li>
					              <li>{{process_sheet.environment}}</li> -->
					            </ul>
					        </div>
					        <!-- <div class="table-temperature">
					            <div class="table-temperature-head">
					              <div><img :src="process_sheet.temperature.img"></div>
					              <div>{{process_sheet.temperature.name1}}</div>
					              <div>{{process_sheet.temperature.name}}</div>
					            </div>
					            <div class="table-temperature-body">
					              <ul class="head clearfix">
					                <li v-for="item in process_sheet.temperature.text">{{item}}</li>
					              </ul>
					              <ul class="body clearfix">
					                <li v-for="item in process_sheet.temperature.value1">{{item}}</li>
					              </ul>
					              <ul class="body clearfix">
					                <li v-for="item in process_sheet.temperature.value">{{item}}</li>
					              </ul>
					            </div>
					        </div> -->
					        <div class="table-group clearfix">
					            <div v-for="item in node.process_sheet.group" class="table-example">
					              <div class="table-example-head">
					                <!-- <div><img :src="item.img"></div> -->
					                <div v-for="point in item.name">{{point}}</div>
					              </div>
					              <div class="table-example-body">
					                <ul class="head clearfix">
					                  <li v-for="piece in item.text">{{piece}}</li>
					                </ul>
					                <ul v-for="block in item.list" class="body clearfix">
					                  <li v-for="grain in block.value">
					                  	<b>{{grain.num}}</b>
					                  	<span v-if="grain.unit==null?false:true">{{grain.unit}}</span>
					                  </li>
					                </ul>
					              </div>
					            </div>
					        </div>
					        <div class="table-img clearfix">
					          	<div class="imgBox">
					          		<img :src="deviceSrc">
					          		<div v-for="item in node.cList" :class="item.position">
						          		<b class="cname">{{item.name}}</b>
						          		<img v-show="item.img!=''" class="cimg" :src="item.img">
						          		<b class="cvalue">{{item.value}}</b>
						          		<b class="cunit">{{item.unit}}</b>
						          	</div>
					          	</div>
					        </div>
				        </div>
				        <div class="left" style="width:20%">
				        	<ul class="rList">
				        		<li v-for="item in node.rList">
				        			<h4>{{item.title}}</h4>
				        			<p><span>{{item.num}}</span>{{item.unit}}</p>
				        		</li>
				        	</ul>
				        	<p class="bigTitle">{{node.bigTitle}}</p>
				        	<p class="smallTitle">{{node.smallTitle}}</p>
				        </div>
					</div>
				</li>
			</ul>
		</div>
	</div>
</template>
<script>
	import Header from './Header.vue'
	import axios from 'axios'
	export default{
		data(){
			return{
				title:'注塑机运行监测',
				pos:true,
				subTitle:'Equipment operation monitoring',
				isTem:true,
				temperature:28,
				deviceSrc:require('@/assets/images/zsj.png'),
				workingTime:['10:00:00','24:00:00','30:00:00','05:00:00','15:00:00'],
				workingTimeCopy:['10:00:00','10:00:00','10:00:00','10:00:00','10:00:00'],
				planTime:['10:00:00','10:00:00','10:00:00','10:00:00','10:00:00'],
				maxTime:86400,
				scheduleNum:['注塑机38','注塑机39','注塑机40','注塑机41','注塑机42'],
				process_sheet:{
			        mode:'全自动',
			        oil:56.5,
			        electric:45.6,
			        environment:35.8,
			        temperature:{
			          img:require('@/assets/images/temperature.png'),
			          name:'设定值',
			          text:['一段','二段','三段','四段','五段'],
			          value:[30.9,33.6,33.9,32.5,28.6],
			          name1:'实际温度',
			          value1:[30.9,33.6,33.9,32.5,28.6]
			        },
			        group:[
			          {
			            img:require('@/assets/images/1.png'),
			            name:['压力','速度'],
			            text:[],
			            list:[
			              {value:[{num:30.9,unit:'Bar'},{num:0,unit:'Bar'},{num:0,unit:'Bar'},{num:0,unit:'Bar'}]},
			              {value:[{num:30.9,unit:'%'},{num:0,unit:'%'},{num:0,unit:'%'},{num:0,unit:'%'}]}
			            ]
			          },
			          {
			            img:require('@/assets/images/2.png'),
			            name:[],
			            text:['一段','二段','三段','四段','五段'],
			            list:[
			              {value:[{num:30.9},{num:33.6},{num:33.9},{num:32.5},{num:28.6}]}
			            ]
			          },
			          {
			          	img:require('@/assets/images/3.png'),
			            name:[],
			            text:['六段','七段','八段','九段'],
			            list:[
			              {value:[{num:0},{num:0},{num:0},{num:0}]}
			            ]
			          },
			          // {
			          //   img:require('@/assets/images/3.png'),
			          //   name:['压力','速度','位置'],
			          //   text:['六段','五段','四段','三段','二段','一段'],
			          //   list:[
			          //     {value:[30.9,33.6,33.9,32.5,28.6,28.6]},
			          //     {value:[30.9,33.6,33.9,32.5,28.6,28.6]},
			          //     {value:[33.6,33.9,32.5,28.6,28.6]}
			          //   ]
			          // },
			          // {
			          //   img:require('@/assets/images/4.png'),
			          //   name:['压力','速度','位置'],
			          //   text:['进一','进二'],
			          //   list:[
			          //     {value:[{num:30.9,unit:'Bar'},{num:33.6,unit:'Bar'}]},
			          //     {value:[{num:30.9,unit:'%'},{num:33.6,unit:'%'}]},
			          //     {value:[{num:30.9,unit:'Bar'},{num:33.6,unit:'Bar'}]}
			          //   ]
			          // },
			          // {
			          //   img:require('@/assets/images/7.png'),
			          //   name:['压力','速度','时间'],
			          //   text:['五段','四段','三段','二段','一段'],
			          //   list:[
			          //     {value:[33.6,33.9,32.5,28.6,28.6]},
			          //     {value:[33.6,33.9,32.5,28.6,28.6]},
			          //     {value:[33.6,33.9,32.5,28.6,28.6]}
			          //   ]
			          // },
			          // {
			          //   img:require('@/assets/images/6.png'),
			          //   name:['压力','速度','位置'],
			          //   text:['退一','退二'],
			          //   list:[
			          //     {value:[30.9,33.6]},
			          //     {value:[30.9,33.6]},
			          //     {value:[30.9,33.6]}
			          //   ]
			          // },
			          // {
			          //   img:require('@/assets/images/5.png'),
			          //   name:['压力','速度','位置'],
			          //   text:['一段','二段','三段','四段','五段'],
			          //   list:[
			          //     {value:[33.6,33.9,32.5,28.6,28.6]},
			          //     {value:[33.6,33.9,32.5,28.6,28.6]},
			          //     {value:[33.6,33.9,32.5,28.6,28.6]}
			          //   ]
			          // },
			          // {
			          //   img:require('@/assets/images/8.png'),
			          //   name:['压力','速度','位置'],
			          //   text:[],
			          //   list:[
			          //     {value:[30.9]},
			          //     {value:[30.9]},
			          //     {value:[30.9]}
			          //   ]
			          // }
			        ]
			    },
			    cList:[
			    	{position:'left_top',name:'模座',value:225.3,unit:'mm',img:''},
			    	{position:'right_top',name:'射出',value:85.3,unit:'mm',img:''},
			    	{position:'left_bottom',name:'托模',value:44.2,unit:'mm',img:''},
			    	{position:'right_bottom',name:'油温',value:50,unit:'℃',img:require('@/assets/images/temperature.png')}
			    ],
			    rList:[
			    	{title:'开模总数',num:45535,unit:'cnt'},
			    	{title:'全程计时',num:1.7,unit:'sec'},
			    	{title:'动作计时',num:1.7,unit:'sec'},
			    	{title:'储料转数',num:0,unit:'RPM'}
			    ],
			    deviceList:[
			    	{
			    		bigTitle:'注塑机38',
			    		smallTitle:'NHTX100',
			    		process_sheet:{
					        mode:'全自动',
					        group:[
					          {
					            img:require('@/assets/images/1.png'),
					            name:['压力','速度'],
					            text:[],
					            list:[
					              {value:[{num:30.9,unit:'Bar'},{num:0,unit:'Bar'},{num:0,unit:'Bar'},{num:0,unit:'Bar'}]},
					              {value:[{num:30.9,unit:'%'},{num:0,unit:'%'},{num:0,unit:'%'},{num:0,unit:'%'}]}
					            ]
					          },
					          {
					            img:require('@/assets/images/2.png'),
					            name:[],
					            text:['一段','二段','三段','四段','五段'],
					            list:[
					              {value:[{num:30.9},{num:33.6},{num:33.9},{num:32.5},{num:28.6}]}
					            ]
					          },
					          {
					          	img:require('@/assets/images/3.png'),
					            name:[],
					            text:['六段','七段','八段','九段'],
					            list:[
					              {value:[{num:0},{num:0},{num:0},{num:0}]}
					            ]
					          }
					        ]
					    },
					    cList:[
					    	{position:'left_top',name:'模座',value:225.3,unit:'mm',img:''},
					    	{position:'right_top',name:'射出',value:85.3,unit:'mm',img:''},
					    	{position:'left_bottom',name:'托模',value:44.2,unit:'mm',img:''},
					    	{position:'right_bottom',name:'油温',value:50,unit:'℃',img:require('@/assets/images/temperature.png')}
					    ],
					    rList:[
					    	{title:'开模总数',num:45535,unit:'cnt'},
					    	{title:'全程计时',num:1.7,unit:'sec'},
					    	{title:'动作计时',num:1.7,unit:'sec'},
					    	{title:'储料转数',num:0,unit:'RPM'}
					    ]
			    	},
			    	{
			    		bigTitle:'注塑机39',
			    		smallTitle:'NHTX101',
			    		process_sheet:{
					        mode:'全自动',
					        group:[
					          {
					            img:require('@/assets/images/1.png'),
					            name:['压力','速度'],
					            text:[],
					            list:[
					              {value:[{num:30.9,unit:'Bar'},{num:0,unit:'Bar'},{num:0,unit:'Bar'},{num:0,unit:'Bar'}]},
					              {value:[{num:30.9,unit:'%'},{num:0,unit:'%'},{num:0,unit:'%'},{num:0,unit:'%'}]}
					            ]
					          },
					          {
					            img:require('@/assets/images/2.png'),
					            name:[],
					            text:['一段','二段','三段','四段','五段'],
					            list:[
					              {value:[{num:30.9},{num:33.6},{num:33.9},{num:32.5},{num:28.6}]}
					            ]
					          },
					          {
					          	img:require('@/assets/images/3.png'),
					            name:[],
					            text:['六段','七段','八段','九段'],
					            list:[
					              {value:[{num:0},{num:0},{num:0},{num:0}]}
					            ]
					          }
					        ]
					    },
					    cList:[
					    	{position:'left_top',name:'模座',value:225.3,unit:'mm',img:''},
					    	{position:'right_top',name:'射出',value:85.3,unit:'mm',img:''},
					    	{position:'left_bottom',name:'托模',value:44.2,unit:'mm',img:''},
					    	{position:'right_bottom',name:'油温',value:50,unit:'℃',img:require('@/assets/images/temperature.png')}
					    ],
					    rList:[
					    	{title:'开模总数',num:45535,unit:'cnt'},
					    	{title:'全程计时',num:1.7,unit:'sec'},
					    	{title:'动作计时',num:1.7,unit:'sec'},
					    	{title:'储料转数',num:0,unit:'RPM'}
					    ]
			    	},
			    	{
			    		bigTitle:'注塑机40',
			    		smallTitle:'NHTX102',
			    		process_sheet:{
					        mode:'全自动',
					        group:[
					          {
					            img:require('@/assets/images/1.png'),
					            name:['压力','速度'],
					            text:[],
					            list:[
					              {value:[{num:30.9,unit:'Bar'},{num:0,unit:'Bar'},{num:0,unit:'Bar'},{num:0,unit:'Bar'}]},
					              {value:[{num:30.9,unit:'%'},{num:0,unit:'%'},{num:0,unit:'%'},{num:0,unit:'%'}]}
					            ]
					          },
					          {
					            img:require('@/assets/images/2.png'),
					            name:[],
					            text:['一段','二段','三段','四段','五段'],
					            list:[
					              {value:[{num:30.9},{num:33.6},{num:33.9},{num:32.5},{num:28.6}]}
					            ]
					          },
					          {
					          	img:require('@/assets/images/3.png'),
					            name:[],
					            text:['六段','七段','八段','九段'],
					            list:[
					              {value:[{num:0},{num:0},{num:0},{num:0}]}
					            ]
					          }
					        ]
					    },
					    cList:[
					    	{position:'left_top',name:'模座',value:225.3,unit:'mm',img:''},
					    	{position:'right_top',name:'射出',value:85.3,unit:'mm',img:''},
					    	{position:'left_bottom',name:'托模',value:44.2,unit:'mm',img:''},
					    	{position:'right_bottom',name:'油温',value:50,unit:'℃',img:require('@/assets/images/temperature.png')}
					    ],
					    rList:[
					    	{title:'开模总数',num:45535,unit:'cnt'},
					    	{title:'全程计时',num:1.7,unit:'sec'},
					    	{title:'动作计时',num:1.7,unit:'sec'},
					    	{title:'储料转数',num:0,unit:'RPM'}
					    ]
			    	},
			    	{
			    		bigTitle:'注塑机41',
			    		smallTitle:'NHTX103',
			    		process_sheet:{
					        mode:'全自动',
					        group:[
					          {
					            img:require('@/assets/images/1.png'),
					            name:['压力','速度'],
					            text:[],
					            list:[
					              {value:[{num:30.9,unit:'Bar'},{num:0,unit:'Bar'},{num:0,unit:'Bar'},{num:0,unit:'Bar'}]},
					              {value:[{num:30.9,unit:'%'},{num:0,unit:'%'},{num:0,unit:'%'},{num:0,unit:'%'}]}
					            ]
					          },
					          {
					            img:require('@/assets/images/2.png'),
					            name:[],
					            text:['一段','二段','三段','四段','五段'],
					            list:[
					              {value:[{num:30.9},{num:33.6},{num:33.9},{num:32.5},{num:28.6}]}
					            ]
					          },
					          {
					          	img:require('@/assets/images/3.png'),
					            name:[],
					            text:['六段','七段','八段','九段'],
					            list:[
					              {value:[{num:0},{num:0},{num:0},{num:0}]}
					            ]
					          }
					        ]
					    },
					    cList:[
					    	{position:'left_top',name:'模座',value:225.3,unit:'mm',img:''},
					    	{position:'right_top',name:'射出',value:85.3,unit:'mm',img:''},
					    	{position:'left_bottom',name:'托模',value:44.2,unit:'mm',img:''},
					    	{position:'right_bottom',name:'油温',value:50,unit:'℃',img:require('@/assets/images/temperature.png')}
					    ],
					    rList:[
					    	{title:'开模总数',num:45535,unit:'cnt'},
					    	{title:'全程计时',num:1.7,unit:'sec'},
					    	{title:'动作计时',num:1.7,unit:'sec'},
					    	{title:'储料转数',num:0,unit:'RPM'}
					    ]
			    	},
			    	{
			    		bigTitle:'注塑机42',
			    		smallTitle:'NHTX104',
			    		process_sheet:{
					        mode:'全自动',
					        group:[
					          {
					            img:require('@/assets/images/1.png'),
					            name:['压力','速度'],
					            text:[],
					            list:[
					              {value:[{num:30.9,unit:'Bar'},{num:0,unit:'Bar'},{num:0,unit:'Bar'},{num:0,unit:'Bar'}]},
					              {value:[{num:30.9,unit:'%'},{num:0,unit:'%'},{num:0,unit:'%'},{num:0,unit:'%'}]}
					            ]
					          },
					          {
					            img:require('@/assets/images/2.png'),
					            name:[],
					            text:['一段','二段','三段','四段','五段'],
					            list:[
					              {value:[{num:30.9},{num:33.6},{num:33.9},{num:32.5},{num:28.6}]}
					            ]
					          },
					          {
					          	img:require('@/assets/images/3.png'),
					            name:[],
					            text:['六段','七段','八段','九段'],
					            list:[
					              {value:[{num:0},{num:0},{num:0},{num:0}]}
					            ]
					          }
					        ]
					    },
					    cList:[
					    	{position:'left_top',name:'模座',value:225.3,unit:'mm',img:''},
					    	{position:'right_top',name:'射出',value:85.3,unit:'mm',img:''},
					    	{position:'left_bottom',name:'托模',value:44.2,unit:'mm',img:''},
					    	{position:'right_bottom',name:'油温',value:50,unit:'℃',img:require('@/assets/images/temperature.png')}
					    ],
					    rList:[
					    	{title:'开模总数',num:45535,unit:'cnt'},
					    	{title:'全程计时',num:1.7,unit:'sec'},
					    	{title:'动作计时',num:1.7,unit:'sec'},
					    	{title:'储料转数',num:0,unit:'RPM'}
					    ]
			    	}
			    ]
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

	        // console.log(document.documentElement.clientWidth);
	        $(".left_top").css({"left":-$(".left_top").width()})
	        $(".right_top").css({"right":-$(".right_top").width()})
	        $(".left_bottom").css({"left":-$(".left_bottom").width()})
	        $(".right_bottom").css({"right":-$(".right_bottom").width()})
	        var timer2 = setInterval(function(){
				var current2 = $(".middle_block_box_main_pre").scrollTop();
				// console.log(current2);
				var scrollh2 = $(".middle_box").height() - $(".middle_block_box_main_pre").height();
				// console.log(current2,$(".middle_box").height(),$(".middle_block_box_main_pre").height(),scrollh2);
				if(current2+2 >= scrollh2){
					//滚动到底端，返回到顶端
					// clearInterval(timer);
					$(".middle_block_box_main_pre").animate({scrollTop:0},500);
					// $(".middle_block_box_main_pre").scrollTop(0)
				}else{
					$(".middle_block_box_main_pre").animate({scrollTop:current2+20},500);
					// $(".middle_block_box_main_pre").scrollTop(current2+20);
				}
			},5000)
			let _this = this;
		   	_this.repage();
		   	_this.chart_fontSize_10 = document.documentElement.clientWidth*10/1920*1;
		   	_this.chart_fontSize_12 = document.documentElement.clientWidth*10/1920*1.2;
		   	_this.chart_fontSize_16 = document.documentElement.clientWidth*10/1920*1.6;
		   	_this.chart_fontSize_18 = document.documentElement.clientWidth*10/1920*1.8;
		   	$.each(_this.workingTime,function(index,value){
		   		_this.workingTime[index] = _this.changeDatetime(value);
		   	})
		   	$.each(_this.workingTime,function(index,value){
		   		if(value>86400){
		   			value = 86400;
		   		}
		   		_this.workingTimeCopy[index] = value;
		   	})
		   	$.each(_this.workingTimeCopy,function(index,value){
		   		_this.planTime[index] = 86400 - value;
		   	})
		   	$.each(_this.scheduleNum,function(index,value){
		   		if(value.indexOf("机")!=-1){
		   			var arr = value.split("机");
					arr[0] = arr[0]+"机";
					var newStr = arr.join('\n');
					_this.scheduleNum[index] = newStr;
		   		}
		   	})
		   	var mychartE1 = _this.$echarts.init(document.getElementById("e1"));
		   	mychartE1.setOption({
		   		grid:{
					left:2*_this.chart_fontSize_10,
					right:2*_this.chart_fontSize_10,
					top:4*_this.chart_fontSize_10,
					bottom:4.3*_this.chart_fontSize_10
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
					type:'value',
					show:false,
					max:_this.maxTime
				},
				series:[{
					name:'完成产量',
					type:'bar',
					stack:'产量',
					itemStyle:{
						color:'#92c657'
					},
					data:_this.workingTimeCopy
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
							var time = _this.workingTime[index];
							var h;
							var minute;
							var s;
							if(time/60>=60){
								h = Math.floor(time/60/60);
								minute = Math.floor(time/60%60);
								s = Math.floor(time%60);
							}else{
								h = 0;
								minute = Math.floor(time/60);
								s = Math.floor(time%60);
							}
							h = h<10 ? '0'+h+':':h+':';
							minute = minute<10 ? '0'+minute+':':minute+':';
							s = s<10 ? '0'+s:s;
							return h+minute+s;
						}
					},
					itemStyle:{
						color:'transparent',
						borderColor:'#848181',
						borderWidth:1,
						borderType:'dashed',
						opacity:1
					},
					data:_this.planTime
				}]
		   	})
		   	function myWebsocketPush(){
		   		var url = window.location.hostname;
		   		// console.log(url);
				// var wsServer = 'ws://192.168.101.253:8081/websocket';
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
					// console.log(_this.chooseTitle);
					_this.scheduleNum = [];
					_this.workingTime = [];
					_this.workingTimeCopy = [];
					_this.planTime = [];
					$.each(data,function(index,value){
						// console.log(value.templete);
						if(value.templete != null){
							_this.temperature = value.templete;
						}
						$.each(value.ZSJChart,function(tab,item){
							// console.log(item);
							_this.scheduleNum.push(item.machine);
							_this.workingTime.push(item.time);
							if(_this.scheduleNum.length>5){
								_this.scheduleNum.splice(5);
							}
							if(_this.workingTime.length>5){
								_this.workingTime.splice(5);
							}
							$.each(_this.scheduleNum,function(index,value){
								_this.deviceList[index].bigTitle = value;
							})
							$.each(_this.workingTime,function(index,value){
						   		if(value>86400){
						   			value = 86400;
						   		}
						   		_this.workingTimeCopy[index] = value;
						   	})
						   	$.each(_this.workingTimeCopy,function(index,value){
						   		_this.planTime[index] = 86400 - value;
						   	})
						   	mychartE1.setOption({
						   		grid:{
									left:2*_this.chart_fontSize_10,
									right:2*_this.chart_fontSize_10,
									top:4*_this.chart_fontSize_10,
									bottom:4*_this.chart_fontSize_10
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
									type:'value',
									show:false,
									max:_this.maxTime
								},
								series:[{
									name:'完成产量',
									type:'bar',
									stack:'产量',
									itemStyle:{
										color:'#92c657'
									},
									data:_this.workingTimeCopy
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
											var time = _this.workingTime[index];
											var h;
											var minute;
											var s;
											if(time/60>=60){
												h = Math.floor(time/60/60);
												minute = Math.floor(time/60%60);
												s = Math.floor(time%60);
											}else{
												h = 0;
												minute = Math.floor(time/60);
												s = Math.floor(time%60);
											}
											h = h<10 ? '0'+h+':':h+':';
											minute = minute<10 ? '0'+minute+':':minute+':';
											s = s<10 ? '0'+s:s;
											return h+minute+s;
										}
									},
									itemStyle:{
										color:'transparent',
										borderColor:'#848181',
										borderWidth:1,
										borderType:'dashed',
										opacity:1
									},
									data:_this.planTime
								}]
						   	})
						})
						// console.log(_this.scheduleNum);
						// console.log(data);
						if(value.title!=""){
							$.each(_this.deviceList,function(idx,val){
								if(val.bigTitle == value.title){
									val.smallTitle = value.modelNumber;
									// console.log(value);
									$.each(value.cdList,function(tab,item){
										if(item.fieldName=="运行模式"){
											switch(item.realData){
												case "0":
													item.realData = "手动";
													break;
												case "3":
													item.realData = "半自动";
													break;
												case "5":
													item.realData = "电眼全自动";
													break;
												case "9":
													item.realData = "时间全自动";
													break;
												case "16":
													item.realData = "调模使用";
													break;
											}
											val.process_sheet.mode = item.realData
										}
										if(item.fieldName=="压力"){
											val.process_sheet.group[0].list[0].value[0].num = item.realData
										}
										if(item.fieldName=="速度"){
											val.process_sheet.group[0].list[1].value[0].num = item.realData
										}
										if(item.fieldName=="温度一段"){
											val.process_sheet.group[1].list[0].value[0].num = item.realData
										}
										if(item.fieldName=="温度二段"){
											val.process_sheet.group[1].list[0].value[1].num = item.realData
										}
										if(item.fieldName=="温度三段"){
											val.process_sheet.group[1].list[0].value[2].num = item.realData
										}
										if(item.fieldName=="温度四段"){
											val.process_sheet.group[1].list[0].value[3].num = item.realData
										}
										if(item.fieldName=="温度五段"){
											val.process_sheet.group[1].list[0].value[4].num = item.realData
										}
										if(item.fieldName=="温度六段"){
											val.process_sheet.group[2].list[0].value[0].num = item.realData
										}
										if(item.fieldName=="温度七段"){
											val.process_sheet.group[2].list[0].value[1].num = item.realData
										}
										if(item.fieldName=="温度八段"){
											val.process_sheet.group[2].list[0].value[2].num = item.realData
										}
										if(item.fieldName=="温度九段"){
											val.process_sheet.group[2].list[0].value[3].num = item.realData
										}
										if(item.fieldName=="模座"){
											val.cList[0].value = item.realData
										}
										if(item.fieldName=="射出"){
											val.cList[1].value = item.realData
										}
										if(item.fieldName=="托模"){
											val.cList[2].value = item.realData
										}
										if(item.fieldName=="油温"){
											val.cList[3].value = item.realData
										}
										if(item.fieldName=="开模总数"){
											val.rList[0].num = item.realData
										}
										if(item.fieldName=="全程计时"){
											val.rList[1].num = item.realData
										}
										if(item.fieldName=="动作计时"){
											val.rList[2].num = item.realData
										}
									})
								}
							})
						}
					})
				}
		   	}
		   	myWebsocketPush();
		   	setTimeout(function(){
				window.onresize = function(){
					_this.repage();
					mychartE1.resize();
				}
			},200);
		},
		methods:{
			repage:function(){
				// console.log("haha");
				var win_height = $(window).height();
		   		var nav_heihgt = $(".fixed-nav").height();
		   		var gap_height = 20;
		   		var tit_height = $(".dl-tit").css("height").split("px")[0];
		   		var middle_change_val = win_height - nav_heihgt - gap_height;
		   		// console.log(middle_change_val);
		   		var middle_block_one = middle_change_val*0.5 - 20;
		   		// console.log(middle_block_one);
		   		$(".middle_block_box_main_pre").height(middle_block_one);
		   		$(".left_block_box_main").height(middle_block_one - tit_height);
			},
			changeDatetime:function(str){
				var datestr = str;
				var dateArr = datestr.split(":");
				var newArr = [];
				var total,h,m,s;
				$.each(dateArr,function(index,value){
					value=value.replace(/\b(0+)/gi,"")
					if(value==""){
						value = "0";
					}
					value = parseInt(value);
					newArr.push(value);
				})
				if(newArr.length==1){
					total=0;
				}else{
					h = newArr[0]*3600;
					m = newArr[1]*60;
					s = newArr[2];
					total = h+m+s;
				}
				return total;
			}
		},
		components:{
			'header-vue':Header
		}
	}
</script>
<style scoped>
	ul{
		list-style: none;
	}
	ul,p,h3,h4{
		margin:0;
		padding:0;
	}
	.equipment{
		width:100%;
		height:100%;
		position: fixed;
		top:0;
	}
	.xaj-main{
		padding:0 1.5rem 1.5rem;
	}
	.xaj-main ul li.middle_block_box_main_pre{
		float: left;
		box-shadow: 0px 0px .3rem .1rem rgba(172,200,197,1);
		border-radius: 1rem;
		width: 33%;
		margin-right:0.5%;
		margin-bottom: 10px;
	}
	.xaj-main ul li.middle_block_box_main_pre:nth-child(3n){
		margin-right: 0;
	}
	.left_block_box{
		float: left;
		box-shadow: 0px 0px .3rem .1rem rgba(172,200,197,1);
		border-radius: 1rem;
		width: 33%;
		margin-right:0.5%;
		margin-bottom: 10px;
		padding:10px;
		box-sizing: border-box;
		overflow-x: hidden;
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
	.middle_block_box_main_pre{
		padding:10px;
		box-sizing: border-box;
		overflow-x: hidden;
	}
	.middle_block_box_main_pre .table-mode{
	    /*float: left;*/
	    margin-bottom:.9rem;
	    /*width: 100%;*/
	}
    .middle_block_box_main_pre .table-mode .head li{
	    float: left;
	    min-width: 5.6rem;
	    line-height: 2.4rem;
	    font-size: 1.6rem;
	    color: #101010;
	    font-family: 'SourceHanSansSC-regular';
	    text-align: left;
	    margin-right: 1rem;
	}
	.middle_block_box_main_pre .table-mode .head li:last-child{
    	margin-right: 0;
  	}
	.middle_block_box_main_pre .table-mode ul.body{
	    display: flex;
	    justify-content: flex-start;
	}
 	.middle_block_box_main_pre .table-mode .body li{
	    float: left;
	    min-width: 5.6rem;
	    line-height: 3.2rem;
	    font-size: 1.8rem;
	    color: #080808;
	    font-family: 'Roboto';
	    text-align: center;
	    background-color: #C1CAF9;
	    margin-right: 1rem;
  	}
  	.middle_block_box_main_pre .table-mode .body li:last-child{
    	margin-right: 0;
  	}
  	.middle_block_box_main_pre .table-temperature{
	    float: left;
	    margin-bottom:2rem;
	    width: 100%;
  	}
  	.middle_block_box_main_pre .table-temperature .table-temperature-head{
    	float: left;
  	}
  	.middle_block_box_main_pre .table-temperature .table-temperature-head div{
	    min-width: 5.6rem;
	    line-height: 3.2rem;
	    font-size: 1.8rem;
	    color: #080808;
	    font-family: 'Roboto';
	    text-align: center;
	    margin-right: .3rem;
	    margin-bottom: .3rem;
  	}
  	.middle_block_box_main_pre .table-temperature .table-temperature-head div img{
	    width: 1.5rem;
	    height: 3rem;
	    display: block;
	    margin:0 auto;
  	}
  	.middle_block_box_main_pre .table-temperature .table-temperature-head div:first-child{
	    line-height: 3rem;
	    height: 3rem;
	    margin-bottom: 0;
  	}
  	.middle_block_box_main_pre .table-temperature .table-temperature-head div:last-child{
    	margin-bottom: 0;
  	}
  	.middle_block_box_main_pre .table-temperature .table-temperature-body{
    	float: left;
  	}
  	.middle_block_box_main_pre .table-temperature ul.head{
	    display: flex;
	    align-items: flex-end;
	    height: 3rem;
  	}
  	.middle_block_box_main_pre .table-temperature .head li{
	    display: flex;
	    align-items: flex-end;
	    float: left;
	    min-width: 6.6rem;
	    height: 3rem;
	    line-height: 2.4rem;
	    font-size: 1.6rem;
	    color: #101010;
	    font-family: 'SourceHanSansSC-regular';
	    text-align: left;
	    margin-right: .5rem;
  	}
  	.middle_block_box_main_pre .table-temperature .head li img{
	    width: 1.5rem;
	    height: 3rem;
	    display: block;
	    margin:0 auto;
  	}
  	.middle_block_box_main_pre .table-temperature .head li:last-child{
    	margin-right: 0;
  	}
  	.middle_block_box_main_pre .table-temperature ul.body{
	    display: flex;
	    justify-content: center;
	    margin-bottom: .3rem;
  	}
  	.middle_block_box_main_pre .table-temperature ul.body:last-child{
  		margin-bottom: 0;
  	}
  	.middle_block_box_main_pre .table-temperature .body li{
	    float: left;
	    min-width: 6.6rem;
	    line-height: 3.2rem;
	    font-size: 1.8rem;
	    color: #080808;
	    font-family: 'Roboto';
	    text-align: center;
	    background-color: #FBC1C3;
	    margin-right: .5rem;
  	}
  	.middle_block_box_main_pre .table-temperature .body li:last-child{
    	margin-right: 0;
  	}
  	.middle_block_box_main_pre .table-group{
  		margin-bottom: 3rem;
  	}
  	.middle_block_box_main_pre .table-group .table-example{
	    float: left;
	    margin-bottom: .5rem;
	    margin-right: .8rem;
  	}
  	.middle_block_box_main_pre .table-group .table-example:nth-child(2){
  		margin-bottom: 0
  	}
  	.middle_block_box_main_pre .table-group .table-example .table-example-head{
    	float: left;
  	}
  	.middle_block_box_main_pre .table-group .table-example .table-example-head div{
	    min-width: 4.6rem;
	    line-height: 3.2rem;
	    font-size: 1.6rem;
	    color: #080808;
	    font-family: 'Roboto';
	    text-align: center;
	    margin-right: .3rem;
	    margin-bottom: .3rem;
  	}
  	.middle_block_box_main_pre .table-group .table-example .table-example-head div img{
	    width: 2.5rem;
	    height: 2.5rem;
	    display: block;
	    margin:0 auto;
  	}
  	.middle_block_box_main_pre .table-group .table-example .table-example-head div:first-child{
	    line-height: 3rem;
	    height: 3rem;
	    margin-bottom: 0;
  	}
  	.middle_block_box_main_pre .table-group .table-example .table-example-head div:last-child{
    	margin-bottom: 0;
  	}
  	.middle_block_box_main_pre .table-group .table-example .table-example-body{
    	float: left;
  	}
  	.middle_block_box_main_pre .table-group .table-example ul.head{
	    display: flex;
	    align-items: flex-end;
	    max-height: 3rem;
  	}
  	.middle_block_box_main_pre .table-group .table-example .head li{
	    display: flex;
	    align-items: flex-end;
	    float: left;
	    min-width: 3.3rem;
	    height: 3rem;
	    line-height: 2.4rem;
	    font-size: 1.4rem;
	    color: #101010;
	    font-family: 'SourceHanSansSC-regular';
	    text-align: left;
	    margin-right: .9rem;
  	}
  .middle_block_box_main_pre .table-group .table-example .head li img{
    width: 3rem;
    height: 3rem;
    display: block;
    margin:0 auto;
  }
  .middle_block_box_main_pre .table-group .table-example .head li:last-child{
    margin-right: 0;
  }
  .middle_block_box_main_pre .table-group .table-example ul.body{
    display: flex;
    justify-content: center;
    margin-bottom: .3rem;
  }
  .middle_block_box_main_pre .table-group .table-example ul.body:last-child{
    margin-bottom: 0;
  }
  .middle_block_box_main_pre .table-group .table-example .body li{
  	min-width: 3.6rem;
  	margin-right: .6rem;
  }
  .middle_block_box_main_pre .table-group .table-example .body li b{
    float: left;
    min-width: 3.2rem;
    line-height: 3.2rem;
    font-size: 1.5rem;
    color: #080808;
    font-family: 'Roboto';
    text-align: center;
    background-color: #F7DCB5;
    margin-right: .3rem;
  }
  .middle_block_box_main_pre .table-group .table-example .body li span{
  	float: left;
  	line-height: 3.2rem;
    font-size: 1.5rem;
    color: #080808;
    font-family: 'Roboto';
    text-align: center;
    width: 1.8rem;
  }
  .middle_block_box_main_pre .table-group .table-example .body li:last-child{
    margin-right: 0;
  }
  .table-img{
  	display: flex;
  	justify-content: center;
  }
  .imgBox{
  	float:left;
  	position: relative;
  	width: 40%;
  }
  .imgBox>img{
  	min-height: 12rem;
  }
  .imgBox img{
	width: 100%;
  }
  .left_top{
  	position: absolute;
  	top: 0;
  	left: -12rem;
  	min-width: 10rem;
  }
  .right_top{
  	position: absolute;
  	top: 0;
  	right: -12rem;
  	min-width: 10rem;
  }
  .left_bottom{
  	position: absolute;
  	bottom: 0;
  	left: -12rem;
  	min-width: 10rem;
  }
  .right_bottom{
  	position: absolute;
  	bottom: 0;
  	right: -12rem;
  	min-width: 10rem;
  }
  .cname{
  	font-size: 1.8rem;
    color: #080808;
    font-family: 'Roboto';
    margin-right: .3rem;
  }
  .cvalue{
  	font-size: 1.6rem;
  	color: #FF6600;
  	font-family: 'Roboto';
  	margin-right: .3rem;
  }
  .cunit{
  	font-size: 1.6rem;
  	color: #080808;
    font-family: 'Roboto';
  }
  .cimg{
  	max-width: 1.4rem;
  	margin-right: .3rem;
  }
  .rList{
  	padding:.5rem;
  	box-shadow: 0px 0px .3rem .1rem rgba(172,200,197,1);
	border-radius: 1rem;
  }
  .rList li{
  	margin-bottom: .2rem;
  }
  .rList li h4{
	font-size: 2rem;
    color: #080808;
    font-family: 'Roboto';
    font-weight: normal;
  }
  .rList p{
  	font-size: 1.6rem;
  	color: #080808;
    font-family: 'Roboto';
  }
  .rList p span{
	font-size: 1.8rem;
  	color: #FF6600;
  	font-family: 'Roboto';
  	margin-right: .2rem;
  }
  .bigTitle{
  	margin-top: 2rem;
  	font-size: 2.4rem;
  	color: #080808;
  	font-family: 'Roboto';
  	font-weight: bold;
  }
  .smallTitle{
  	margin-top: 0.5rem;
  	font-size: 1.8rem;
  	color: #080808;
  	font-family: 'Roboto';
  	font-weight: bold;
  }
</style>