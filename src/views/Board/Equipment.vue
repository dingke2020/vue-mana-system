<template>
	<div class="equipment">
		<header-vue :pos="pos" :title="title" :subTitle="subTitle"></header-vue>
		<div class="xaj-main clearfix">
			<div class="col-xaj-2 left_block">
				<div class="left_block_main">
					<div class="block_box">
						<div class="xaj-tit clearfix">
							<b class="icon"></b>
							<span class="tit">设备列表</span>
						</div>
						<div class="device_list">
							<ul>
								<li :title="item.name" v-for="(item,index) in device_list" class="device_item" :class="item.active==true?'active':''" @click="handleClick(index,item.type,item.name,item.model)">
									<a href="javascript:;">
										<b v-if="item.state==0" class="device_icon sto"></b>
										<b v-else-if="item.state==1" class="device_icon sta"></b>
										<b v-else-if="item.state==2" class="device_icon pro"></b>
										<b v-else class="device_icon err"></b>
										{{item.name}}
									</a>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
			<div class="col-xaj-7 middle_block">
				<div class="middle_block_main">
					<div class="middle_block_one">
						<div class="block_box">
							<div class="xaj-tit clearfix">
								<b class="icon"></b>
								<span class="tit">设备运行记录</span>
								<ul>
									<li><b class="s_icon pro"></b>生产</li>
									<li><b class="s_icon sta"></b>开机</li>
									<li v-if="isCNC"><b class="s_icon err"></b>故障</li>
									<li><b class="s_icon sto"></b>关机</li>
								</ul>
							</div>
							<div class="middle_block_box_main">
								<div id="e1" style="width:100%;height:100%;"></div>
							</div>
						</div>
					</div>
					<div class="middle_block_title clearfix">
						<div class="title-item">
							<span class="name">生产物料</span>
							<span class="value">{{materialName}}</span>
						</div>
						<div class="title-item">
							<span class="name">生产工序</span>
							<span class="value">{{productionProcessesName}}</span>
						</div>
						<div class="title-item">
							<span class="name">生产人员</span>
							<span class="value">{{name}}</span>
						</div>
					</div>
					<div class="middle_block_bottom">
						<!-- <div class="cnc clearfix">
							<div class="cnc_left">
								<div class="block_box">
									<div class="xaj-tit clearfix">
										<b class="icon"></b>
										<span class="tit">实时监控</span>
									</div>
									<div class="middle_block_box_main_pre">
										<div class="realTime_section">
											<ul class="clearfix">
												<li>
													<p>当前程序号：</p>
													<div class="freeing">G54</div>
												</li>
												<li>
													<p>当前刀具号：</p>
													<div class="freeing">008</div>
												</li>
												<li>
													<p>运行模式：</p>
													<div class="freeing">自动</div>
												</li>
											</ul>
										</div>
										<div class="realTime_section clearfix">
											<ul class="clearfix">
												<li>
													<p>主轴转速：</p>
													<div class="troubling">3000 r/min</div>
												</li>
												<li>
													<p>主轴倍率：</p>
													<div class="troubling">1.5</div>
												</li>
												<li>
													<p>主轴负载：</p>
													<div class="troubling">70%</div>
												</li>
											</ul>
											<ul class="spec clearfix">
												<li>
													<p>进给倍率：</p>
													<div class="warning">50%</div>
												</li>
											</ul>
										</div>
										<div class="realTime_section_spec">
											<ul class="clearfix">
												<li>
													<p>机械坐标：</p>
													<div class="warning">
														<p>X:69.208</p>
														<p>Y:-33.178</p>
														<p>Z:180.231</p>
													</div>
												</li>
												<li>
													<p>相对坐标：</p>
													<div class="warning">
														<p>X:69.208</p>
														<p>Y:-33.178</p>
														<p>Z:180.231</p>
													</div>
												</li>
												<li>
													<p>绝对坐标：</p>
													<div class="warning">
														<p>X:69.208</p>
														<p>Y:-33.178</p>
														<p>Z:180.231</p>
													</div>
												</li>
												<li>
													<p>XYZ轴进给：</p>
													<div class="warning">
														<p>X:2.208</p>
														<p>Y:-3.178</p>
														<p>Z:0.231</p>
													</div>
												</li>
											</ul>
										</div>
									</div>
								</div>
							</div>
							<div class="cnc_right">
								<div class="block_box">
									<div class="info">
										G0G40G94G54G17G15G90Z100;<br/>
										M03S1000;<br/>
										X0Y0Z5<br/>
										G42G1X19.798Y0D01<br/>
										Z-4<br/>
										G3X0Y-19.798R14<br/>
										X-19.798Y0<br/>
										Y19.987X0<br/><br/>
										X19.987Y0<br/>
										G1X7.5<br/>
										G3 I-7.5<br/>
										G1Y-5<br/>
										G0Z100<br/>
										G40X0Y0;<br/>
										G28G91Z0<br/>
										Y0<br/>
										M30;
									</div>
								</div>
							</div>
						</div> -->
						<div class="cnc_copy">
							<div class="block_box">
								<div class="xaj-tit clearfix">
									<b class="icon"></b>
									<span class="tit">{{bigTitle}}</span>
								</div>
								<div class="middle_block_box_main_pre">
									<div v-if="!isCNC" class="middle_box clearfix">
									<div class="left" style="width:85%;overflow:auto">
									<div class="table-mode">
							            <ul class="head clearfix">
							              <li>运行模式</li>
							              <!-- <li>油温</li> -->
							              <!-- <li>电机温度</li>
							              <li>环境温度</li> -->
							            </ul>
							            <ul class="body clearfix">
							              <li>{{process_sheet.mode}}</li>
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
							            <div v-for="item in process_sheet.group" class="table-example">
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
							          		<div v-for="item in cList" :class="item.position">
								          		<b class="cname">{{item.name}}</b>
								          		<img v-show="item.img!=''" class="cimg" :src="item.img">
								          		<b class="cvalue">{{item.value}}</b>
								          		<b class="cunit">{{item.unit}}</b>
								          	</div>
							          	</div>
							          </div>
							        </div>
							        <div class="left" style="width:15%">
							        	<ul class="rList">
							        		<li v-for="item in rList">
							        			<h4>{{item.title}}</h4>
							        			<p><span>{{item.num}}</span>{{item.unit}}</p>
							        		</li>
							        	</ul>
							        </div>
									</div>
									<div v-else class="middle_box">
									<div class="realTime_section">
										<ul class="impt clearfix">
											<li>
												<p>当前程序号：</p>
												<div class="freeing">{{programNumber}}</div>
											</li>
											<li v-if="isMode">
												<p>运行模式：</p>
												<div class="freeing">{{mode}}</div>
											</li>
										</ul>
									</div>
									<div class="realTime_section clearfix">
										<ul class="spec clearfix">
											<li v-if="isMainAxleSpeed">
												<p>主轴转速：</p>
												<div class="troubling">{{mainAxle.speed}}</div>
											</li>
											<li v-if="isMainAxleLoad">
												<p>主轴负载：</p>
												<div class="troubling">{{mainAxle.load}}</div>
											</li>
										</ul>
										<ul class="spec clearfix">
											<li v-if="isFeedRatio">
												<p>进给倍率：</p>
												<div class="warning">{{feed.ratio}}</div>
											</li>
											<li v-if="isFeedSpeed">
												<p>进给速度：</p>
												<div class="warning">{{feed.speed}}</div>
											</li>
										</ul>
									</div>
									<div class="realTime_section_spec">
										<ul class="clearfix">
											<li>
												<p>机械坐标：</p>
												<div class="warning">
													<p>X:{{machineCoord.x}}</p>
													<p>Y:{{machineCoord.y}}</p>
													<p>Z:{{machineCoord.z}}</p>
												</div>
											</li>
											<li>
												<p>相对坐标：</p>
												<div class="warning">
													<p>X:{{relativeCoord.x}}</p>
													<p>Y:{{relativeCoord.y}}</p>
													<p>Z:{{relativeCoord.z}}</p>
												</div>
											</li>
											<li>
												<p>绝对坐标：</p>
												<div class="warning">
													<p>X:{{absoluteCoord.x}}</p>
													<p>Y:{{absoluteCoord.y}}</p>
													<p>Z:{{absoluteCoord.z}}</p>
												</div>
											</li>
											<li v-if="isMoved">
												<p>剩余移动量：</p>
												<div class="warning">
													<p>X:{{movedNum.x}}</p>
													<p>Y:{{movedNum.y}}</p>
													<p>Z:{{movedNum.z}}</p>
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
			</div>
			<div class="col-xaj-3 right_block">
				<div class="right_block_main">
					<div class="block_box mg15">
						<div class="right_block_one">
							<div id="e2" style="width:100%;height:100%;"></div>
						</div>
					</div>
					<div class="block_box mg15">
						<div class="right_block_two">
							<div v-if="iswarn" class="warn_block">
								<p>{{alarm.id}}</p>
								<h3><img :src="imgSrc">{{alarm.title}}</h3>
								<h4><i class="iconfont icon-ali-clock"></i>{{alarm.time}}</h4>
								<div class="warn_code"><span class="txt">报警号：</span>{{alarm.num}}</div>
								<div class="warn_time"><span class="txt">报警时间：</span>{{alarm.timeing}}</div>
							</div>
							<div v-else class="warn_box">无告警！</div>
						</div>
					</div>
					<div class="block_box">
						<div class="xaj-tit clearfix">
							<b class="icon"></b>
							<span class="tit">设备基本信息</span>
						</div>
						<div class="right_block_three">
							<img :src="deviceSrc">
							<h3>{{chooseTitle}}</h3>
							<h4>{{chooseModel}}</h4>
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
	export default{
		data(){
			return{
				title:'设备运行监测',
				pos:true,
				subTitle:'Equipment operation monitoring',
				device_list:[
					{"state":2,"name":"注塑机38","model":"DY1500B","type":"注塑机","active":true},
					{"state":2,"name":"注塑机39","model":"HTK3600-F5","type":"注塑机"},
					{"state":2,"name":"注塑机40","model":"HTL600-F7B","type":"注塑机"},
					{"state":2,"name":"注塑机41","model":"HTL280","type":"注塑机"},
					{"state":2,"name":"注塑机42","model":"NHTX140","type":"注塑机"},
					{"state":2,"name":"注塑机43","model":"NHTX1000","type":"注塑机"},
					{"state":2,"name":"立式加工中心31","type":"加工中心"},
					{"state":2,"name":"立式加工中心32","type":"加工中心"},
					{"state":2,"name":"卧式加工中心33","type":"加工中心"},
					{"state":2,"name":"卧式加工中心34","type":"加工中心"},
					{"state":2,"name":"加工中心33","type":"加工中心"},
					{"state":2,"name":"数控升降台铣床36","type":"加工中心"},
					{"state":2,"name":"5轴车铣加工中心37","type":"加工中心"}
				],
				chooseTitle:'注塑机38',
				chooseModel:'DY1500B',
				materialName:'无油立式真空泵气缸体（WLW100-01）',
				productionProcessesName:'内磨圆',
				name:'章正洪',
				runs_range:172800,
				process_num_range:2000,
				workingTime:28860,
				workingTimeCopy:'',
				productionTime:25250,
				productionTimeCopy:'',
				alarmAllTime:3610,
				alarmAllTimeCopy:'',
				productionNum:362,
				productionNumCopy:'',
				iswarn:false,
				isCNC:false,
				bigTitle:'实时监控',
				imgSrc:require('@/assets/images/bell.png'),
				deviceSrc:require('@/assets/images/zsj.png'),
				time_start: '',
      			time_end: '',
      			run_ss0: [],
			    run_ss1: [],
			    run_ss2: [],
			    run_ss3: [],
			    alarm:{
			    	id:'',
			    	title:'',
			    	time:'',
			    	num:'',
			    	timeing:''
			    },
			    programNumber:'G54',
			    mode:'自动',
			    mainAxle:{
			    	speed:'3000 r/min',
			    	load:'70'
			    },
			    feed:{
			    	ratio:'70%',
			    	speed:'20'
			    },
			    machineCoord:{
			    	x:'69.208',
			    	y:'-33.178',
			    	z:'180.231'
			    },
			    relativeCoord:{
			    	x:'69.208',
			    	y:'-33.178',
			    	z:'180.231'
			    },
			    absoluteCoord:{
			    	x:'69.208',
			    	y:'-33.178',
			    	z:'180.231'
			    },
			    movedNum:{
			    	x:'2.208',
			    	y:'-3.178',
			    	z:'0.231'
			    },
			    isMode:true,
			    isMainAxleSpeed:true,
			    isMainAxleLoad:true,
			    isFeedSpeed:true,
			    isFeedRatio:true,
			    isMoved:true,
			    chart_fontSize_10:10,
			    chart_fontSize_16:16,
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
			            text:['一段','二段','三段','四段','五段','六段','七段','八段','九段'],
			            list:[
			              {value:[{num:30.9},{num:33.6},{num:33.9},{num:32.5},{num:28.6},{num:0},{num:0},{num:0},{num:0}]}
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

	        $.ajax({
	        	type:'GET',
	        	url:'/xaj/configuration/findCollectMachine',
	        	success:function(data){
	        		// console.log(data);
	        		_this.device_list = [];
	        		$.each(data,function(index,value){
	        			_this.device_list.push({"state":value.status,"name":value.machineNumber,"model":value.modelNumber,"type":value.machineType})
	        			_this.device_list[0].active = true;
	        			_this.chooseTitle = _this.device_list[0].name;
						_this.chooseModel = _this.device_list[0].model;
	        			if(_this.device_list[0].type=='注塑机'){
							_this.isCNC = false;
							_this.deviceSrc = require('@/assets/images/zsj.png');
							// _this.iswarn = false;
							_this.bigTitle = '工艺参数';
						}else if(_this.device_list[0].type=='加工中心'){
							_this.isCNC = true;
							_this.deviceSrc = require('@/assets/images/cnc.png');
							// _this.iswarn = false;
							_this.bigTitle = '实时监控';
						}
	        		})
	        	}
	        })

	        $(".left_top").css({"left":-$(".left_top").width()})
	        $(".right_top").css({"right":-$(".right_top").width()})
	        $(".left_bottom").css({"left":-$(".left_bottom").width()})
	        $(".right_bottom").css({"right":-$(".right_bottom").width()})
	        var timer = setInterval(function(){
				//获取当前滚动条高度
				var current = $(".device_list").scrollTop();
				// console.log(current);
				var scrollh = $(".device_list ul").height() - $(".device_list").height();
				// console.log(current,$(".device_list ul").height(),$(".device_list").height(),scrollh);
				if(current+2 >= scrollh){
					//滚动到底端，返回到顶端
					// clearInterval(timer);
					$(".device_list").animate({scrollTop:0},500);
					// $(".device_list").scrollTop(0)
				}else{
					$(".device_list").animate({scrollTop:current+$(".device_item").height()},500);
					// $(".device_list").scrollTop(current+$(".device_item").height());
					
				}
			},5000)
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
		   	_this.time_start = new Date('2019-08-08 00:00:00');
		   	_this.time_end = new Date('2019-08-08 24:00:00');
		   	var run_ss0 = [{'starttime':'2019-08-08 08:00:00','endtime':'2019-08-08 09:30:00'},{'starttime':'2019-08-08 12:00:00','endtime':'2019-08-08 13:30:00'}];
		   	$.each(run_ss0,function(index,value){
		   		_this.run_ss0.push([new Date(value.starttime),0],[new Date(value.endtime),0])
		   		if(_this.run_ss0[_this.run_ss0.length-1][0]!=new Date(value.starttime)){
					_this.run_ss0.splice(_this.run_ss0.length,0,undefined);
				}
		   	})
		   	var run_ss1 = [{'starttime':'2019-08-08 09:30:00','endtime':'2019-08-08 10:20:00'},{'starttime':'2019-08-08 13:30:00','endtime':'2019-08-08 14:20:00'}];
		   	$.each(run_ss1,function(index,value){
		   		_this.run_ss1.push([new Date(value.starttime),1],[new Date(value.endtime),1])
		   		if(_this.run_ss1[_this.run_ss1.length-1][1]!=new Date(value.starttime)){
					_this.run_ss1.splice(_this.run_ss1.length,1,undefined);
				}
		   	})
		   	var run_ss2 = [{'starttime':'2019-08-08 10:20:00','endtime':'2019-08-08 11:40:00'},{'starttime':'2019-08-08 14:20:00','endtime':'2019-08-08 15:40:00'}];
		   	$.each(run_ss2,function(index,value){
		   		_this.run_ss2.push([new Date(value.starttime),2],[new Date(value.endtime),2])
		   		if(_this.run_ss2[_this.run_ss2.length-1][2]!=new Date(value.starttime)){
					_this.run_ss2.splice(_this.run_ss2.length,2,undefined);
				}
		   	})
		   	var run_ss3 = [{'starttime':'2019-08-08 11:40:00','endtime':'2019-08-08 12:00:00'},{'starttime':'2019-08-08 15:40:00','endtime':'2019-08-08 16:00:00'}];
		   	$.each(run_ss3,function(index,value){
		   		_this.run_ss3.push([new Date(value.starttime),3],[new Date(value.endtime),3])
		   		if(_this.run_ss3[_this.run_ss3.length-1][3]!=new Date(value.starttime)){
					_this.run_ss3.splice(_this.run_ss3.length,3,undefined);
				}
		   	})
		   	console.log(_this.run_ss0);
		   	var mychartE1 = _this.$echarts.init(document.getElementById("e1"));
		   	var mychartE2 = _this.$echarts.init(document.getElementById("e2"));
		   	_this.chart_fontSize_10 = document.documentElement.clientWidth*10/1920*1;
		   	_this.chart_fontSize_16 = document.documentElement.clientWidth*10/1920*1.6;
		   	mychartE1.setOption({
		   		grid: {
					top: 2*_this.chart_fontSize_10,
					right: 2*_this.chart_fontSize_10,
					bottom: 3.5*_this.chart_fontSize_10,
					left: 5*_this.chart_fontSize_10
				},
				xAxis: {
					type: 'time',
					axisLine: {
						show:false,
						lineStyle: {
							color: '#e8e8e8'
						}
					},
					axisTick: {
						show:false,
						alignWithLabel: false,
						lineStyle: {
							color: '#e8e8e8'
						}
					},
					axisLabel: {
						color: '#060606',
						fontFamily:'Roboto',
						fontSize:_this.chart_fontSize_16,
						formatter: function(value){
							var date = new Date(value);
							var h = (date.getHours()< 10 ? '0'+(date.getHours()) : date.getHours()) + ':';
							var m = (date.getMinutes()< 10 ? '0'+(date.getMinutes()) : date.getMinutes());
							return h+m;
						}
					},
					splitLine: {
						show: false
					}
				},
				yAxis: {
					gridIndex: 0,
					type: 'value',
					min:0,
					max:3,
					splitNumber: 4,
					axisLine: {
						show: false
					},
					axisTick: {
						show: false
					},
					axisLabel: {
						color: '#060606',
						show: true,
						fontFamily:'Roboto',
						fontSize:_this.chart_fontSize_16,
						formatter:function(value,index){
							switch (value){
								case 0 :
									return '关机';
									break;
								case 1 :
									return '开机';
									break;
								case 2 :
									return '生产';
									break;
								default :
									return '故障'
							}
						}
					},
					splitLine: {
						show: true,
						lineStyle: {
							color: '#e4e3e3'
						}
					}
				},
				series: [
					// {
					// 	name:'.anchor',
				 //        type:'line', 
				 //        showSymbol:false, 
				 //       	data:[[_this.time_start,0],[_this.time_end,0]],
				 //        itemStyle:{normal:{opacity:0}},
				 //        lineStyle:{normal:{opacity:0}}
					// },
					{
						type: 'line',
						name: '关机',
						symbolSize: 0,
						lineStyle: {
							color: '#737172',
							width:4
						},
						data: _this.run_ss0
					},
					{
						type: 'line',
						name: '开机',
						symbolSize: 0,
						lineStyle: {
							color: '#3F51B5',
							width:4
						},
						data: _this.run_ss1
					},
					{
						type: 'line',
						name: '生产',
						symbolSize: 0,
						lineStyle: {
							color: '#259B24',
							width:4
						},
						data: _this.run_ss2
					},
					{
						type: 'line',
						name: '故障',
						symbolSize: 0,
						lineStyle: {
							color: '#FF9800',
							width:4
						},
						data: _this.run_ss3
					}
				]
		   	})
		   	// var runs_range = 172800;
		   	// var process_num_range = 2000;
		   	mychartE2.setOption({
		   		grid: [
					{top:'2%',height:'32%',left:8.5*_this.chart_fontSize_10,right:'2%',show:false},
					{top:'34%',height:'32%',left:8.5*_this.chart_fontSize_10,right:'2%',show:false},
					{top:'66%',height:'32%',left:8.5*_this.chart_fontSize_10,right:'2%',show:false},
					// {top:'74%',height:'24%',left:8.5*_this.chart_fontSize_10,right:'2%',show:false}
				],
				xAxis: [
					{type: 'value',gridIndex:0,position:'top',max:0.8*_this.runs_range,axisLine:{show:false,lineStyle:{color:'#bbb'}},axisTick:{show:false},axisLabel:{show:false},splitLine:{show:false}},
					{type: 'value',gridIndex:1,max:0.8*_this.runs_range,axisLine:{show:false,lineStyle:{color:'#bbb'}},axisTick:{show:false},axisLabel:{show:false},splitLine:{show:false}},
					{type: 'value',gridIndex:2,max:0.8*_this.runs_range,axisLine:{show:false,lineStyle:{color:'#bbb'}},axisTick:{show:false},axisLabel:{show:false},splitLine:{show:false}},
					// {type: 'value',gridIndex:3,max:0.8*_this.process_num_range,axisLine:{show:false,lineStyle:{color:'#bbb'}},axisTick:{show:false},axisLabel:{show:false},splitLine:{show:false}}
				],
				yAxis: [
					{type: 'category',gridIndex:0,axisLine:{show:false,lineStyle:{color:'#bbb'}},axisTick:{show:false},axisLabel:{show:true,color:'#010A37',fontFamily:'Roboto',fontSize:_this.chart_fontSize_16,margin:10},data:['运行时长']},
					{type: 'category',gridIndex:1,axisLine:{show:false,lineStyle:{color:'#bbb'}},axisTick:{show:false},axisLabel:{show:true,color:'#010A37',fontFamily:'Roboto',fontSize:_this.chart_fontSize_16,margin:10},data:['生产时长']},
					{type: 'category',gridIndex:2,axisLine:{show:false,lineStyle:{color:'#bbb'}},axisTick:{show:false},axisLabel:{show:true,color:'#010A37',fontFamily:'Roboto',fontSize:_this.chart_fontSize_16,margin:10},data:['故障时长']},
					// {type: 'category',gridIndex:3,axisLine:{show:false,lineStyle:{color:'#bbb'}},axisTick:{show:false},axisLabel:{show:true,color:'#010A37',fontFamily:'Roboto',fontSize:_this.chart_fontSize_16,margin:10},data:['生产件数']}
				],
				series: [
					{
						name: '运行时长',
						type: 'bar',
						xAxisIndex:0,
						yAxisIndex:0,
						stack:'运行时长',
						itemStyle: {
							color: '#009688'	
						},
						barWidth: '50%',
						markPoint: {
							label: {
								color: '#060606',
								fontSize: _this.chart_fontSize_16,
								fontFamily: 'Roboto',
								show: true,
								offset: [0,28],
								formatter: function(params){
									var time = params.value;
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
							itemStyle: {
								color: 'transparent',
								borderColor: 'transparent',
								shadowColor: 'transparent'
							},
							data: [
								{name: '运行时长',value:_this.workingTime,xAxis:0.65*_this.runs_range,yAxis:0}
							] 
						},
						data:[_this.workingTime]
					},
					{
						name: '运行总时长',
						type: 'bar',
						xAxisIndex:0,
						yAxisIndex:0,
						stack:'运行时长',
						itemStyle: {
							color: '#fff',
							barBorderColor: '#BDBABA',
							barBorderWidth: 1
						},
						data:[0.5*_this.runs_range-_this.workingTime]
					},
					{
						name: '生产时长',
						type: 'bar',
						xAxisIndex:1,
						yAxisIndex:1,
						stack: '生产时长',
						itemStyle: {
							color: '#259B24'
						},
						barWidth: '50%',
						markPoint: {
							label: {
								color: '#060606',
								fontSize: _this.chart_fontSize_16,
								fontFamily: 'Roboto',
								show: true,
								offset: [0,28],
								formatter: function(params){
									var time = params.value;
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
							itemStyle: {
								color: 'transparent',
								borderColor: 'transparent',
								shadowColor: 'transparent'
							},
							data: [
								{name: '生产时长',value:_this.productionTime,xAxis:0.65*_this.runs_range,yAxis:1}
							] 
						},
						data:[_this.productionTime]
					},
					{
						name: '生产总时长',
						type: 'bar',
						xAxisIndex:1,
						yAxisIndex:1,
						stack:'生产时长',
						itemStyle: {
							color: '#fff',
							barBorderColor: '#BDBABA',
							barBorderWidth: 1
						},
						data:[0.5*_this.runs_range-_this.productionTime]
					},
					{
						name: '故障时长',
						type: 'bar',
						xAxisIndex:2,
						yAxisIndex:2,
						stack:'故障时长',
						barWidth: '50%',
						itemStyle: {
							color: '#FF9800'
						},
						markPoint: {
							label: {
								color: '#060606',
								fontSize: _this.chart_fontSize_16,
								fontFamily: 'Roboto',
								show: true,
								offset: [0,28],
								formatter: function(params){
									var time = params.value;
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
							itemStyle: {
								color: 'transparent',
								borderColor: 'transparent',
								shadowColor: 'transparent'
							},
							data: [
								{name: '故障时长',value:_this.alarmAllTime,xAxis:0.65*_this.runs_range,yAxis:2}
							] 
						},
						data:[_this.alarmAllTime]
					},
					{
						name: '故障总时长',
						type: 'bar',
						xAxisIndex:2,
						yAxisIndex:2,
						stack:'故障时长',
						itemStyle: {
							color: '#fff',
							barBorderColor: '#BDBABA',
							barBorderWidth: 1
						},
						data:[0.5*_this.runs_range-_this.alarmAllTime]
					},
					// {
					// 	name: '加工件数',
					// 	type: 'bar',
					// 	xAxisIndex:3,
					// 	yAxisIndex:3,
					// 	stack:'加工件数',
					// 	barWidth: '50%',
					// 	itemStyle: {
					// 		color: '#3F51B5'
					// 	},
					// 	markPoint: {
					// 		label: {
					// 			color: '#060606',
					// 			fontSize: 16,
					// 			fontFamily: 'Roboto',
					// 			show: true,
					// 			offset: [0,25]
					// 		},
					// 		itemStyle: {
					// 			color: 'transparent',
					// 			borderColor: 'transparent',
					// 			shadowColor: 'transparent'
					// 		},
					// 		data: [
					// 			{name: '加工件数',value:_this.productionNum,xAxis:0.65*_this.process_num_range,yAxis:2}
					// 		] 
					// 	},
					// 	data:[_this.productionNum]
					// },
					// {
					// 	name: '加工总件数',
					// 	type: 'bar',
					// 	xAxisIndex:3,
					// 	yAxisIndex:3,
					// 	stack:'加工件数',
					// 	itemStyle: {
					// 		color: '#fff',
					// 		barBorderColor: '#BDBABA',
					// 		barBorderWidth: 1
					// 	},
					// 	data:[0.5*_this.process_num_range-_this.productionNum]
					// }
				]
		   	})
			function myWebsocketPush(){
				var url = window.location.hostname;
		   		// console.log(url);
				// var wsServer = 'ws://192.168.2.85:8081/websocket';
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
					$.each(data,function(index,value){
						// console.log(_this.device_list);
						$.each(value.machineList,function(tab,val){
							// console.log(val);
							$.each(_this.device_list,function(i,v){
								if(val.machineNumber == v.name){
									v.state = val.status;
								}
							})
						})
						if(value.title!=""){
						if(_this.chooseTitle == value.title){
							console.log(value);
							_this.materialName = value.materialName;
							_this.productionProcessesName = value.productionProcessesName;
							_this.name = value.name;
							if(value.remark){
								_this.iswarn = true;
								_this.alarm.title = value.remark;
								_this.alarm.time = value.alarmTime;
								_this.alarm.timeing = value.alarmingTime;
							}else{
								_this.iswarn = false;
							}
							_this.workingTime = _this.changeDatetime(value.workingTime);
							_this.workingTimeCopy = _this.changeDatetime(value.workingTime);
							if(_this.workingTime>0.5*_this.runs_range){
								_this.workingTime = 0.5*_this.runs_range;
							}
							// console.log(_this.workingTime);
							_this.productionTime = _this.changeDatetime(value.productionTime);
							_this.productionTimeCopy = _this.changeDatetime(value.productionTime);
							if(_this.productionTime>0.5*_this.runs_range){
								_this.productionTime = 0.5*_this.runs_range;
							}
							_this.alarmAllTime = _this.changeDatetime(value.alarmAllTime);
							_this.alarmAllTimeCopy = _this.changeDatetime(value.alarmAllTime);
							if(_this.alarmAllTime>0.5*_this.runs_range){
								_this.alarmAllTime = 0.5*_this.runs_range;
							}
							mychartE2.setOption({
						   		grid: [
									{top:'2%',height:'32%',left:8.5*_this.chart_fontSize_10,right:'2%',show:false},
									{top:'34%',height:'32%',left:8.5*_this.chart_fontSize_10,right:'2%',show:false},
									{top:'66%',height:'32%',left:8.5*_this.chart_fontSize_10,right:'2%',show:false},
									// {top:'74%',height:'24%',left:8.5*_this.chart_fontSize_10,right:'2%',show:false}
								],
								xAxis: [
									{type: 'value',gridIndex:0,position:'top',max:0.8*_this.runs_range,axisLine:{show:false,lineStyle:{color:'#bbb'}},axisTick:{show:false},axisLabel:{show:false},splitLine:{show:false}},
									{type: 'value',gridIndex:1,max:0.8*_this.runs_range,axisLine:{show:false,lineStyle:{color:'#bbb'}},axisTick:{show:false},axisLabel:{show:false},splitLine:{show:false}},
									{type: 'value',gridIndex:2,max:0.8*_this.runs_range,axisLine:{show:false,lineStyle:{color:'#bbb'}},axisTick:{show:false},axisLabel:{show:false},splitLine:{show:false}},
									// {type: 'value',gridIndex:3,max:0.8*_this.process_num_range,axisLine:{show:false,lineStyle:{color:'#bbb'}},axisTick:{show:false},axisLabel:{show:false},splitLine:{show:false}}
								],
								yAxis: [
									{type: 'category',gridIndex:0,axisLine:{show:false,lineStyle:{color:'#bbb'}},axisTick:{show:false},axisLabel:{show:true,color:'#010A37',fontFamily:'Roboto',fontSize:_this.chart_fontSize_16,margin:10},data:['运行时长']},
									{type: 'category',gridIndex:1,axisLine:{show:false,lineStyle:{color:'#bbb'}},axisTick:{show:false},axisLabel:{show:true,color:'#010A37',fontFamily:'Roboto',fontSize:_this.chart_fontSize_16,margin:10},data:['生产时长']},
									{type: 'category',gridIndex:2,axisLine:{show:false,lineStyle:{color:'#bbb'}},axisTick:{show:false},axisLabel:{show:true,color:'#010A37',fontFamily:'Roboto',fontSize:_this.chart_fontSize_16,margin:10},data:['故障时长']},
									// {type: 'category',gridIndex:3,axisLine:{show:false,lineStyle:{color:'#bbb'}},axisTick:{show:false},axisLabel:{show:true,color:'#010A37',fontFamily:'Roboto',fontSize:_this.chart_fontSize_16,margin:10},data:['生产件数']}
								],
								series: [
									{
										name: '运行时长',
										type: 'bar',
										xAxisIndex:0,
										yAxisIndex:0,
										stack:'运行时长',
										itemStyle: {
											color: '#009688'	
										},
										barWidth: '50%',
										markPoint: {
											label: {
												color: '#060606',
												fontSize: _this.chart_fontSize_16,
												fontFamily: 'Roboto',
												show: true,
												offset: [0,28],
												formatter: function(params){
													var time = params.value;
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
											itemStyle: {
												color: 'transparent',
												borderColor: 'transparent',
												shadowColor: 'transparent'
											},
											data: [
												{name: '运行时长',value:_this.workingTimeCopy,xAxis:0.65*_this.runs_range,yAxis:0}
											] 
										},
										data:[_this.workingTime]
									},
									{
										name: '运行总时长',
										type: 'bar',
										xAxisIndex:0,
										yAxisIndex:0,
										stack:'运行时长',
										itemStyle: {
											color: '#fff',
											barBorderColor: '#BDBABA',
											barBorderWidth: 1
										},
										data:[0.5*_this.runs_range-_this.workingTime]
									},
									{
										name: '生产时长',
										type: 'bar',
										xAxisIndex:1,
										yAxisIndex:1,
										stack: '生产时长',
										itemStyle: {
											color: '#259B24'
										},
										barWidth: '50%',
										markPoint: {
											label: {
												color: '#060606',
												fontSize: _this.chart_fontSize_16,
												fontFamily: 'Roboto',
												show: true,
												offset: [0,28],
												formatter: function(params){
													var time = params.value;
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
											itemStyle: {
												color: 'transparent',
												borderColor: 'transparent',
												shadowColor: 'transparent'
											},
											data: [
												{name: '生产时长',value:_this.productionTimeCopy,xAxis:0.65*_this.runs_range,yAxis:1}
											] 
										},
										data:[_this.productionTime]
									},
									{
										name: '生产总时长',
										type: 'bar',
										xAxisIndex:1,
										yAxisIndex:1,
										stack:'生产时长',
										itemStyle: {
											color: '#fff',
											barBorderColor: '#BDBABA',
											barBorderWidth: 1
										},
										data:[0.5*_this.runs_range-_this.productionTime]
									},
									{
										name: '故障时长',
										type: 'bar',
										xAxisIndex:2,
										yAxisIndex:2,
										stack:'故障时长',
										barWidth: '50%',
										itemStyle: {
											color: '#FF9800'
										},
										markPoint: {
											label: {
												color: '#060606',
												fontSize: _this.chart_fontSize_16,
												fontFamily: 'Roboto',
												show: true,
												offset: [0,28],
												formatter: function(params){
													var time = params.value;
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
											itemStyle: {
												color: 'transparent',
												borderColor: 'transparent',
												shadowColor: 'transparent'
											},
											data: [
												{name: '故障时长',value:_this.alarmAllTimeCopy,xAxis:0.65*_this.runs_range,yAxis:2}
											] 
										},
										data:[_this.alarmAllTime]
									},
									{
										name: '故障总时长',
										type: 'bar',
										xAxisIndex:2,
										yAxisIndex:2,
										stack:'故障时长',
										itemStyle: {
											color: '#fff',
											barBorderColor: '#BDBABA',
											barBorderWidth: 1
										},
										data:[0.5*_this.runs_range-_this.alarmAllTime]
									},
									// {
									// 	name: '加工件数',
									// 	type: 'bar',
									// 	xAxisIndex:3,
									// 	yAxisIndex:3,
									// 	stack:'加工件数',
									// 	barWidth: '50%',
									// 	itemStyle: {
									// 		color: '#3F51B5'
									// 	},
									// 	markPoint: {
									// 		label: {
									// 			color: '#060606',
									// 			fontSize: 16,
									// 			fontFamily: 'Roboto',
									// 			show: true,
									// 			offset: [0,25]
									// 		},
									// 		itemStyle: {
									// 			color: 'transparent',
									// 			borderColor: 'transparent',
									// 			shadowColor: 'transparent'
									// 		},
									// 		data: [
									// 			{name: '加工件数',value:_this.productionNum,xAxis:0.65*_this.process_num_range,yAxis:2}
									// 		] 
									// 	},
									// 	data:[_this.productionNum]
									// },
									// {
									// 	name: '加工总件数',
									// 	type: 'bar',
									// 	xAxisIndex:3,
									// 	yAxisIndex:3,
									// 	stack:'加工件数',
									// 	itemStyle: {
									// 		color: '#fff',
									// 		barBorderColor: '#BDBABA',
									// 		barBorderWidth: 1
									// 	},
									// 	data:[0.5*_this.process_num_range-_this.productionNum]
									// }
								]
						   	})
							var run_ss0 = [];
							var run_ss1 = [];
							var run_ss2 = [];
							var run_ss3 = [];
							_this.run_ss0 = [];
							_this.run_ss1 = [];
							_this.run_ss2 = [];
							_this.run_ss3 = [];
							$.each(value.tdList,function(i,v){
								var date = new Date(v.startDate);
								var y = date.getFullYear()+'-';
								var m = date.getMonth()+1;
								m = m<10 ? '0'+m+'-':m+'-';
								var d = date.getDate();
								d = d<10 ? '0'+d:d;
								// console.log(y+m+d);
								_this.time_start = new Date(y+m+d+' 00:00:00');
								_this.time_end = new Date(y+m+d+' 24:00:00');
								var timestamp = Date.parse(_this.time_start);
								var time = timestamp + 86400000;
								var newdate = new Date(time);
								var Y = newdate.getFullYear()+'-';
								var M = newdate.getMonth()+1;
								M = M<10 ? '0'+M+'-':M+'-';
								var D = newdate.getDate();
								D = D<10 ? '0'+D:D;
								// console.log(Y+M+D);
								// _this.time_end = new Date(Y+M+D+' 08:00:00');
								if(v.status == 0){
									//是关机
									run_ss0.push({'starttime':v.startDate,'endtime':v.endDate});
									$.each(run_ss0,function(index,value){
								   		_this.run_ss0.push([new Date(value.starttime),0],[new Date(value.endtime),0])
								   		if(_this.run_ss0[_this.run_ss0.length-1][0]!=new Date(value.starttime)){
											_this.run_ss0.splice(_this.run_ss0.length,0,undefined);
										}
								   	})
								}else if(v.status == 1){
									//是开机
									run_ss1.push({'starttime':v.startDate,'endtime':v.endDate});
									$.each(run_ss1,function(index,value){
								   		_this.run_ss1.push([new Date(value.starttime),1],[new Date(value.endtime),1])
								   		if(_this.run_ss1[_this.run_ss1.length-1][1]!=new Date(value.starttime)){
											_this.run_ss1.splice(_this.run_ss1.length,1,undefined);
										}
								   	})
								}else if(v.status == 2){
									//是生产
									run_ss2.push({'starttime':v.startDate,'endtime':v.endDate});
									// var run_ss2 = [{'starttime':'2019-08-08 10:20:00','endtime':'2019-08-08 11:40:00'}];
									// console.log(run_ss2);
									$.each(run_ss2,function(index,value){
								   		_this.run_ss2.push([new Date(value.starttime),2],[new Date(value.endtime),2])
								   		if(_this.run_ss2[_this.run_ss2.length-1][2]!=new Date(value.starttime)){
											_this.run_ss2.splice(_this.run_ss2.length,2,undefined);
										}
								   	})
								}else if(v.status == 3){
									//是故障
									run_ss3.push({'starttime':v.startDate,'endtime':v.endDate});
									$.each(run_ss3,function(index,value){
								   		_this.run_ss3.push([new Date(value.starttime),3],[new Date(value.endtime),3])
								   		if(_this.run_ss3[_this.run_ss3.length-1][3]!=new Date(value.starttime)){
											_this.run_ss3.splice(_this.run_ss3.length,3,undefined);
										}
								   	})
								}
							})
							// _this.time_start = new Date('2019-08-08 08:00:00');
		   		// 			_this.time_end = new Date('2019-08-09 08:00:00');
							// console.log(_this.time_start,_this.time_end,_this.run_ss2);
							if(_this.isCNC){
								mychartE1.setOption({
							   		grid: {
										top: 2*_this.chart_fontSize_10,
										right: 2*_this.chart_fontSize_10,
										bottom: 3.5*_this.chart_fontSize_10,
										left: 5*_this.chart_fontSize_10
									},
									xAxis: {
										type: 'time',
										axisLine: {
											show:false,
											lineStyle: {
												color: '#e8e8e8'
											}
										},
										axisTick: {
											show:false,
											alignWithLabel: false,
											lineStyle: {
												color: '#e8e8e8'
											}
										},
										axisLabel: {
											color: '#060606',
											fontFamily:'Roboto',
											fontSize:_this.chart_fontSize_16,
											formatter: function(value){
												var date = new Date(value);
												var h = (date.getHours()< 10 ? '0'+(date.getHours()) : date.getHours()) + ':';
												var m = (date.getMinutes()< 10 ? '0'+(date.getMinutes()) : date.getMinutes());
												return h+m;
											}
										},
										splitLine: {
											show: false
										}
									},
									yAxis: {
										gridIndex: 0,
										type: 'value',
										min:0,
										max:3,
										splitNumber: 4,
										axisLine: {
											show: false
										},
										axisTick: {
											show: false
										},
										axisLabel: {
											color: '#060606',
											show: true,
											fontFamily:'Roboto',
											fontSize:_this.chart_fontSize_16,
											formatter:function(value,index){
												switch (value){
													case 0 :
														return '关机';
														break;
													case 1 :
														return '开机';
														break;
													case 2 :
														return '生产';
														break;
													case 3:
														return '故障';
														break;
												}
											}
										},
										splitLine: {
											show: true,
											lineStyle: {
												color: '#e4e3e3'
											}
										}
									},
									series: [
										{
											name:'.anchor',
									        type:'line', 
									        showSymbol:false, 
									       	data:[[_this.time_start,0],[_this.time_end,0]],
									        itemStyle:{normal:{opacity:0}},
									        lineStyle:{normal:{opacity:0}}
										},
										{
											type: 'line',
											name: '关机',
											symbolSize: 0,
											lineStyle: {
												color: '#737172',
												width:4
											},
											data: _this.run_ss0
										},
										{
											type: 'line',
											name: '开机',
											symbolSize: 0,
											lineStyle: {
												color: '#3F51B5',
												width:4
											},
											data: _this.run_ss1
										},
										{
											type: 'line',
											name: '生产',
											symbolSize: 0,
											lineStyle: {
												color: '#259B24',
												width:4
											},
											data: _this.run_ss2
										},
										{
											type: 'line',
											name: '故障',
											symbolSize: 0,
											lineStyle: {
												color: '#FF9800',
												width:4
											},
											data: _this.run_ss3
										}
									]
							   	})
								_this.isMode = false;
								_this.isMainAxleSpeed = false;
								_this.isMainAxleLoad = false;
								_this.isFeedRatio = false;
								_this.isFeedSpeed = false;
								_this.isMoved = false;
								$.each(value.cdList,function(tab,item){
									if(item.fieldName=="当前正在执行的程序号"){
										_this.programNumber = item.cncData;
									}
									if(item.fieldName=="运行模式"){
										_this.isMode = true;
										_this.mode = item.cncData;
									}
									if(item.fieldName=="主轴实际转速"){
										_this.isMainAxleSpeed = true;
										_this.mainAxle.speed = item.cncData;
									}
									if(item.fieldName=="主轴负载"){
										_this.isMainAxleLoad = true;
										_this.mainAxle.load = item.cncData;
									}
									if(item.fieldName=="实际进给率"||item.fieldName=="进给倍率"){
										_this.isFeedRatio = true;
										_this.feed.ratio = item.cncData;
									}
									if(item.fieldName=="实际进给速率"||item.fieldName=="进给速度"){
										_this.isFeedSpeed = true;
										_this.feed.speed = item.cncData;
									}
									if(item.fieldName=="机械坐标（X轴）"){
										_this.machineCoord.x = item.cncData;
									}
									if(item.fieldName=="机械坐标（Y轴）"){
										_this.machineCoord.y = item.cncData;
									}
									if(item.fieldName=="机械坐标（Z轴）"){
										_this.machineCoord.z = item.cncData;
									}
									if(item.fieldName=="相对坐标（X轴）"){
										_this.relativeCoord.x = item.cncData;
									}
									if(item.fieldName=="相对坐标（Y轴）"){
										_this.relativeCoord.y = item.cncData;
									}
									if(item.fieldName=="相对坐标（Z轴）"){
										_this.relativeCoord.z = item.cncData;
									}
									if(item.fieldName=="绝对坐标（X轴）"){
										_this.absoluteCoord.x = item.cncData;
									}
									if(item.fieldName=="绝对坐标（Y轴）"){
										_this.absoluteCoord.Y = item.cncData;
									}
									if(item.fieldName=="绝对坐标（Z轴）"){
										_this.absoluteCoord.z = item.cncData;
									}
									if(item.fieldName=="剩余移动量（X轴）"){
										_this.isMoved = true;
										_this.movedNum.x = item.cncData;
									}
									if(item.fieldName=="剩余移动量（Y轴）"){
										_this.isMoved = true;
										_this.movedNum.y = item.cncData;
									}
									if(item.fieldName=="剩余移动量（Z轴）"){
										_this.isMoved = true;
										_this.movedNum.z = item.cncData;
									}
								})
							}else{
								mychartE1.setOption({
							   		grid: {
										top: 2*_this.chart_fontSize_10,
										right: 2*_this.chart_fontSize_10,
										bottom: 3.5*_this.chart_fontSize_10,
										left: 5*_this.chart_fontSize_10
									},
									xAxis: {
										type: 'time',
										axisLine: {
											show:false,
											lineStyle: {
												color: '#e8e8e8'
											}
										},
										axisTick: {
											show:false,
											alignWithLabel: false,
											lineStyle: {
												color: '#e8e8e8'
											}
										},
										axisLabel: {
											color: '#060606',
											fontFamily:'Roboto',
											fontSize:_this.chart_fontSize_16,
											formatter: function(value){
												var date = new Date(value);
												var h = (date.getHours()< 10 ? '0'+(date.getHours()) : date.getHours()) + ':';
												var m = (date.getMinutes()< 10 ? '0'+(date.getMinutes()) : date.getMinutes());
												return h+m;
											}
										},
										splitLine: {
											show: false
										}
									},
									yAxis: {
										gridIndex: 0,
										type: 'value',
										min:0,
										max:2,
										splitNumber: 3,
										axisLine: {
											show: false
										},
										axisTick: {
											show: false
										},
										axisLabel: {
											color: '#060606',
											show: true,
											fontFamily:'Roboto',
											fontSize:_this.chart_fontSize_16,
											formatter:function(value,index){
												switch (value){
													case 0 :
														return '关机';
														break;
													case 1 :
														return '开机';
														break;
													case 2 :
														return '生产';
														break;
												}
											}
										},
										splitLine: {
											show: true,
											lineStyle: {
												color: '#e4e3e3'
											}
										}
									},
									series: [
										{
											name:'.anchor',
									        type:'line', 
									        showSymbol:false, 
									       	data:[[_this.time_start,0],[_this.time_end,0]],
									        itemStyle:{normal:{opacity:0}},
									        lineStyle:{normal:{opacity:0}}
										},
										{
											type: 'line',
											name: '关机',
											symbolSize: 0,
											lineStyle: {
												color: '#737172',
												width:4
											},
											data: _this.run_ss0
										},
										{
											type: 'line',
											name: '开机',
											symbolSize: 0,
											lineStyle: {
												color: '#3F51B5',
												width:4
											},
											data: _this.run_ss1
										},
										{
											type: 'line',
											name: '生产',
											symbolSize: 0,
											lineStyle: {
												color: '#259B24',
												width:4
											},
											data: _this.run_ss2
										}
									]
							   	})
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
										_this.process_sheet.mode = item.realData
									}
									if(item.fieldName=="压力"){
										_this.process_sheet.group[0].list[0].value[0].num = item.realData
									}
									if(item.fieldName=="速度"){
										_this.process_sheet.group[0].list[1].value[0].num = item.realData
									}
									if(item.fieldName=="温度一段"){
										_this.process_sheet.group[1].list[0].value[0].num = item.realData
									}
									if(item.fieldName=="温度二段"){
										_this.process_sheet.group[1].list[0].value[1].num = item.realData
									}
									if(item.fieldName=="温度三段"){
										_this.process_sheet.group[1].list[0].value[2].num = item.realData
									}
									if(item.fieldName=="温度四段"){
										_this.process_sheet.group[1].list[0].value[3].num = item.realData
									}
									if(item.fieldName=="温度五段"){
										_this.process_sheet.group[1].list[0].value[4].num = item.realData
									}
									if(item.fieldName=="温度六段"){
										_this.process_sheet.group[1].list[0].value[5].num = item.realData
									}
									if(item.fieldName=="温度七段"){
										_this.process_sheet.group[1].list[0].value[6].num = item.realData
									}
									if(item.fieldName=="温度八段"){
										_this.process_sheet.group[1].list[0].value[7].num = item.realData
									}
									if(item.fieldName=="温度九段"){
										_this.process_sheet.group[1].list[0].value[8].num = item.realData
									}
									if(item.fieldName=="模座"){
										_this.cList[0].value = item.realData
									}
									if(item.fieldName=="射出"){
										_this.cList[1].value = item.realData
									}
									if(item.fieldName=="托模"){
										_this.cList[2].value = item.realData
									}
									if(item.fieldName=="油温"){
										_this.cList[3].value = item.realData
									}
									if(item.fieldName=="开模总数"){
										_this.rList[0].num = item.realData
									}
									if(item.fieldName=="全程计时"){
										_this.rList[1].num = item.realData
									}
									if(item.fieldName=="动作计时"){
										_this.rList[2].num = item.realData
									}
									// if(item.fieldName=="油温"){
									// 	_this.process_sheet.oil = item.data
									// }
									// if(item.fieldName=="关模一段压力"){
									// 	_this.process_sheet.group[0].list[0].value[0] = item.data
									// }
									// if(item.fieldName=="关模二段压力"){
									// 	_this.process_sheet.group[0].list[0].value[1] = item.data
									// }
									// if(item.fieldName=="关模三段压力"){
									// 	_this.process_sheet.group[0].list[0].value[2] = item.data
									// }
									// if(item.fieldName=="关模低段压力"){
									// 	_this.process_sheet.group[0].list[0].value[3] = item.data
									// }
									// if(item.fieldName=="关模高段压力"){
									// 	_this.process_sheet.group[0].list[0].value[4] = item.data
									// }
									// if(item.fieldName=="关模一段速度"){
									// 	_this.process_sheet.group[0].list[1].value[0] = item.data
									// }
									// if(item.fieldName=="关模二段速度"){
									// 	_this.process_sheet.group[0].list[1].value[1] = item.data
									// }
									// if(item.fieldName=="关模三段速度"){
									// 	_this.process_sheet.group[0].list[1].value[2] = item.data
									// }
									// if(item.fieldName=="关模低段速度"){
									// 	_this.process_sheet.group[0].list[1].value[3] = item.data
									// }
									// if(item.fieldName=="关模高段速度"){
									// 	_this.process_sheet.group[0].list[1].value[4] = item.data
									// }
									// if(item.fieldName=="关模一段位置"){
									// 	_this.process_sheet.group[0].list[2].value[0] = item.data
									// }
									// if(item.fieldName=="关模二段位置"){
									// 	_this.process_sheet.group[0].list[2].value[1] = item.data
									// }
									// if(item.fieldName=="关模三段位置"){
									// 	_this.process_sheet.group[0].list[2].value[2] = item.data
									// }
									// if(item.fieldName=="关模低段位置"){
									// 	_this.process_sheet.group[0].list[2].value[3] = item.data
									// }
									// if(item.fieldName=="开模五段压力"){
									// 	_this.process_sheet.group[1].list[0].value[0] = item.data
									// }
									// if(item.fieldName=="开模四段压力"){
									// 	_this.process_sheet.group[1].list[0].value[1] = item.data
									// }
									// if(item.fieldName=="开模三段压力"){
									// 	_this.process_sheet.group[1].list[0].value[2] = item.data
									// }
									// if(item.fieldName=="开模二段压力"){
									// 	_this.process_sheet.group[1].list[0].value[3] = item.data
									// }
									// if(item.fieldName=="开模一段压力"){
									// 	_this.process_sheet.group[1].list[0].value[4] = item.data
									// }
									// if(item.fieldName=="开模五段速度"){
									// 	_this.process_sheet.group[1].list[1].value[0] = item.data
									// }
									// if(item.fieldName=="开模四段速度"){
									// 	_this.process_sheet.group[1].list[1].value[1] = item.data
									// }
									// if(item.fieldName=="开模三段速度"){
									// 	_this.process_sheet.group[1].list[1].value[2] = item.data
									// }
									// if(item.fieldName=="开模二段速度"){
									// 	_this.process_sheet.group[1].list[1].value[3] = item.data
									// }
									// if(item.fieldName=="开模一段速度"){
									// 	_this.process_sheet.group[1].list[1].value[4] = item.data
									// }
									// if(item.fieldName=="开模五段位置"){
									// 	_this.process_sheet.group[1].list[2].value[0] = item.data
									// }
									// if(item.fieldName=="开模四段位置"){
									// 	_this.process_sheet.group[1].list[2].value[1] = item.data
									// }
									// if(item.fieldName=="开模三段位置"){
									// 	_this.process_sheet.group[1].list[2].value[2] = item.data
									// }
									// if(item.fieldName=="开模二段位置"){
									// 	_this.process_sheet.group[1].list[2].value[3] = item.data
									// }
									// if(item.fieldName=="开模一段位置"){
									// 	_this.process_sheet.group[1].list[2].value[4] = item.data
									// }
									// if(item.fieldName=="射胶六段压力"){
									// 	_this.process_sheet.group[2].list[0].value[0] = item.data
									// }
									// if(item.fieldName=="射胶五段压力"){
									// 	_this.process_sheet.group[2].list[0].value[1] = item.data
									// }
									// if(item.fieldName=="射胶四段压力"){
									// 	_this.process_sheet.group[2].list[0].value[2] = item.data
									// }
									// if(item.fieldName=="射胶三段压力"){
									// 	_this.process_sheet.group[2].list[0].value[3] = item.data
									// }
									// if(item.fieldName=="射胶二段压力"){
									// 	_this.process_sheet.group[2].list[0].value[4] = item.data
									// }
									// if(item.fieldName=="射胶一段压力"){
									// 	_this.process_sheet.group[2].list[0].value[5] = item.data
									// }
									// if(item.fieldName=="射胶六段速度"){
									// 	_this.process_sheet.group[2].list[1].value[0] = item.data
									// }
									// if(item.fieldName=="射胶五段速度"){
									// 	_this.process_sheet.group[2].list[1].value[1] = item.data
									// }
									// if(item.fieldName=="射胶四段速度"){
									// 	_this.process_sheet.group[2].list[1].value[2] = item.data
									// }
									// if(item.fieldName=="射胶三段速度"){
									// 	_this.process_sheet.group[2].list[1].value[3] = item.data
									// }
									// if(item.fieldName=="射胶二段速度"){
									// 	_this.process_sheet.group[2].list[1].value[4] = item.data
									// }
									// if(item.fieldName=="射胶一段速度"){
									// 	_this.process_sheet.group[2].list[1].value[5] = item.data
									// }
									// if(item.fieldName=="射胶六段位置"){
									// 	_this.process_sheet.group[2].list[2].value[0] = item.data
									// }
									// if(item.fieldName=="射胶五段位置"){
									// 	_this.process_sheet.group[2].list[2].value[1] = item.data
									// }
									// if(item.fieldName=="射胶四段位置"){
									// 	_this.process_sheet.group[2].list[2].value[2] = item.data
									// }
									// if(item.fieldName=="射胶三段位置"){
									// 	_this.process_sheet.group[2].list[2].value[3] = item.data
									// }
									// if(item.fieldName=="射胶二段位置"){
									// 	_this.process_sheet.group[2].list[2].value[4] = item.data
									// }
									// if(item.fieldName=="托模进一压力"){
									// 	_this.process_sheet.group[3].list[0].value[0] = item.data
									// }
									// if(item.fieldName=="托模进二压力"){
									// 	_this.process_sheet.group[3].list[0].value[1] = item.data
									// }
									// if(item.fieldName=="托模进一速度"){
									// 	_this.process_sheet.group[3].list[1].value[0] = item.data
									// }
									// if(item.fieldName=="托模进二速度"){
									// 	_this.process_sheet.group[3].list[1].value[1] = item.data
									// }
									// if(item.fieldName=="托模进一位置"){
									// 	_this.process_sheet.group[3].list[2].value[0] = item.data
									// }
									// if(item.fieldName=="托模进二位置"){
									// 	_this.process_sheet.group[3].list[2].value[1] = item.data
									// }
									// if(item.fieldName=="保压五段压力"){
									// 	_this.process_sheet.group[4].list[0].value[0] = item.data
									// }
									// if(item.fieldName=="保压四段压力"){
									// 	_this.process_sheet.group[4].list[0].value[1] = item.data
									// }
									// if(item.fieldName=="保压三段压力"){
									// 	_this.process_sheet.group[4].list[0].value[2] = item.data
									// }
									// if(item.fieldName=="保压二段压力"){
									// 	_this.process_sheet.group[4].list[0].value[3] = item.data
									// }
									// if(item.fieldName=="保压一段压力"){
									// 	_this.process_sheet.group[4].list[0].value[4] = item.data
									// }
									// if(item.fieldName=="保压五段速度"){
									// 	_this.process_sheet.group[4].list[1].value[0] = item.data
									// }
									// if(item.fieldName=="保压四段速度"){
									// 	_this.process_sheet.group[4].list[1].value[1] = item.data
									// }
									// if(item.fieldName=="保压三段速度"){
									// 	_this.process_sheet.group[4].list[1].value[2] = item.data
									// }
									// if(item.fieldName=="保压二段速度"){
									// 	_this.process_sheet.group[4].list[1].value[3] = item.data
									// }
									// if(item.fieldName=="保压一段速度"){
									// 	_this.process_sheet.group[4].list[1].value[4] = item.data
									// }
									// if(item.fieldName=="保压五段时间"){
									// 	_this.process_sheet.group[4].list[2].value[0] = item.data
									// }
									// if(item.fieldName=="保压四段时间"){
									// 	_this.process_sheet.group[4].list[2].value[1] = item.data
									// }
									// if(item.fieldName=="保压三段时间"){
									// 	_this.process_sheet.group[4].list[2].value[2] = item.data
									// }
									// if(item.fieldName=="保压二段时间"){
									// 	_this.process_sheet.group[4].list[2].value[3] = item.data
									// }
									// if(item.fieldName=="保压一段时间"){
									// 	_this.process_sheet.group[4].list[2].value[4] = item.data
									// }
									// if(item.fieldName=="托模退一压力"){
									// 	_this.process_sheet.group[5].list[0].value[0] = item.data
									// }
									// if(item.fieldName=="托模退二压力"){
									// 	_this.process_sheet.group[5].list[0].value[1] = item.data
									// }
									// if(item.fieldName=="托模退一速度"){
									// 	_this.process_sheet.group[5].list[1].value[0] = item.data
									// }
									// if(item.fieldName=="托模退二速度"){
									// 	_this.process_sheet.group[5].list[1].value[1] = item.data
									// }
									// if(item.fieldName=="托模退一位置"){
									// 	_this.process_sheet.group[5].list[2].value[0] = item.data
									// }
									// if(item.fieldName=="托模退二位置"){
									// 	_this.process_sheet.group[5].list[2].value[1] = item.data
									// }
									// if(item.fieldName=="储料一段压力"){
									// 	_this.process_sheet.group[6].list[0].value[0] = item.data
									// }
									// if(item.fieldName=="储料二段压力"){
									// 	_this.process_sheet.group[6].list[0].value[1] = item.data
									// }
									// if(item.fieldName=="储料三段压力"){
									// 	_this.process_sheet.group[6].list[0].value[2] = item.data
									// }
									// if(item.fieldName=="储料四段压力"){
									// 	_this.process_sheet.group[6].list[0].value[3] = item.data
									// }
									// if(item.fieldName=="储料五段压力"){
									// 	_this.process_sheet.group[6].list[0].value[4] = item.data
									// }
									// if(item.fieldName=="储料一段速度"){
									// 	_this.process_sheet.group[6].list[1].value[0] = item.data
									// }
									// if(item.fieldName=="储料二段速度"){
									// 	_this.process_sheet.group[6].list[1].value[1] = item.data
									// }
									// if(item.fieldName=="储料三段速度"){
									// 	_this.process_sheet.group[6].list[1].value[2] = item.data
									// }
									// if(item.fieldName=="储料四段速度"){
									// 	_this.process_sheet.group[6].list[1].value[3] = item.data
									// }
									// if(item.fieldName=="储料五段速度"){
									// 	_this.process_sheet.group[6].list[1].value[4] = item.data
									// }
									// if(item.fieldName=="储料一段位置"){
									// 	_this.process_sheet.group[6].list[2].value[0] = item.data
									// }
									// if(item.fieldName=="储料二段位置"){
									// 	_this.process_sheet.group[6].list[2].value[1] = item.data
									// }
									// if(item.fieldName=="储料三段位置"){
									// 	_this.process_sheet.group[6].list[2].value[2] = item.data
									// }
									// if(item.fieldName=="储料四段位置"){
									// 	_this.process_sheet.group[6].list[2].value[3] = item.data
									// }
									// if(item.fieldName=="储料五段位置"){
									// 	_this.process_sheet.group[6].list[2].value[4] = item.data
									// }
									// if(item.fieldName=="射退压力"){
									// 	_this.process_sheet.group[7].list[0].value[0] = item.data
									// }
									// if(item.fieldName=="射退速度"){
									// 	_this.process_sheet.group[7].list[1].value[0] = item.data
									// }
									// if(item.fieldName=="射退位置"){
									// 	_this.process_sheet.group[7].list[2].value[0] = item.data
									// }
								})
							}
						}
						}
					})
				}
			}
			myWebsocketPush();
			setTimeout(function(){
				window.onresize = function(){
					mychartE1.resize();
					mychartE2.resize();
				}
			},200)
		},
		methods:{
			handleClick:function(index,type,name,model){
				let _this = this;
				_this.chooseTitle = name;
				_this.chooseModel = model;
				if(type=='注塑机'){
					_this.isCNC = false;
					_this.deviceSrc = require('@/assets/images/zsj.png');
					// _this.iswarn = false;
					_this.bigTitle = '工艺参数';
				}else if(type=='加工中心'){
					_this.isCNC = true;
					_this.deviceSrc = require('@/assets/images/cnc.png');
					// _this.iswarn = false;
					_this.bigTitle = '实时监控';
				}
				$(".device_list ul li").eq(index).addClass("active").siblings().removeClass("active");
				
			},
			repage:function(){
				console.log("haha");
				var win_height = $(window).height();
		   		// console.log(win_height);
		   		var nav_heihgt = $(".fixed-nav").height();
		   		var gap_height = 15;
		   		var tit_height = $(".xaj-tit").css("height").split("px")[0];
		   		var left_change_val = win_height - nav_heihgt - gap_height*1 - tit_height*1;
		   		var middle_change_val = win_height - nav_heihgt - gap_height - tit_height - $(".middle_block_title").height() - 28;
		   		var middle_block_one = middle_change_val*0.26;
		   		var middle_block_two = middle_change_val - middle_block_one;
		   		var right_change_val = win_height - nav_heihgt - gap_height*3 - tit_height;
		   		var right_block_one = middle_block_one + 30;
		   		var right_block_two = right_change_val - right_block_one*2;
		   		$(".device_list").height(left_change_val);
		   		$(".middle_block_box_main").height(middle_block_one);
		   		$(".middle_block_box_main_pre").height(middle_block_two - tit_height - 36);
		   		$(".cnc_right .info").height(middle_block_two - 24);
		   		$(".right_block_one,.right_block_two").height(right_block_one);
		   		$(".warn_block h3,.warn_block h4").css({"margin-bottom":right_block_one*0.09});
		   		$(".right_block_three").height(right_block_two);
		   		if(win_height>850){
		   			$(".warn_block .warn_code").css({"bottom":right_block_one*0.03+31});
		   		}
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
	/*ul{
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
		padding:0 15px 15px;
	}
	.col-xaj-2{
		width: 12%;
		padding-left:15px;
		padding-right:15px;
		float: left;
		box-sizing: border-box;
	}
	.left_block_main{
		margin-left:-15px;
		margin-right:-10px;
	}
	.block_box{
		box-shadow: 0px 0px 3px 1px rgba(172,200,197,1);
		border-radius: 10px;
	}
	.xaj-tit{
		padding: 3px 8px 0;
		height:30px;
		text-align: left;
		box-sizing: border-box;
		display: flex;
		align-items:center;
		position:relative;
	}
	.xaj-tit .icon{
		display: inline-block;
		width:6px;
		height:21px;
		border-radius: 6px;
		background-color: #009688;
	}
	.xaj-tit .tit{
		font-size: 18px;
		color: #4B536A;
		font-family: 'Roboto';
		margin-left: 10px;
	}
	.xaj-tit .en_tit{
		font-size: 14px;
		color: #edeef0;
		margin-left: 10px;
		position: relative;
		bottom:2px;
	}
	.xaj-tit ul{
		float: right;
		margin-right:5px;
		position: absolute;
		right:8px;
	}
	.xaj-tit ul li{
		float:left;
		font-size: 14px;
		color: #060606;
		font-family: 'SourceHanSansSC-regular';
		margin-right: 19px;
		display: flex;
		align-items: center;
	}
	.xaj-tit ul li:last-child{
		margin-right: 0;
	}
	.xaj-tit ul li b{
		margin-right:3px;
	}
	.device_list{
		margin-top: 25px;
		overflow-x: hidden;
	}
	.device_item{
		height: 48px;
		line-height:48px;
		text-align: left;
		padding-left: 6%;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.device_item.active{
		background-color: #D2D2D2;
	}
	.device_item a{
		text-decoration: none;
		color:#101010;
		font-size: 16px;
		font-family: 'SourceHanSansSC-regular';
	}
	.device_icon{
		display: inline-block;
		position: relative;
		top:3px;
		width: 20px;
		height: 20px;
		border-radius: 100%;
		margin-right: 6%;
	}
	.pro{
		background-color:#259B24;
	}
	.sta{
		background-color: #3F51B5;
	}
	.err{
		background-color: #FF9800;
	}
	.sto{
		background-color: #737172;
	}
	.s_icon{
		display: inline-block;
		position: relative;
		top:3px;
		width: 20px;
		height: 12px;
	}
	.col-xaj-7{
		width: 66%;
		padding-left:15px;
		padding-right:15px;
		float: left;
		box-sizing: border-box;
	}
	.middle_block_main{
		margin-left: -10px;
		margin-right: -10px;
	}
	.middle_block_one{
		margin-bottom: 15px;
	}
	.middle_block_title{
		margin-top: 16px;
		margin-bottom: 12px;
		height: 40px;
		line-height: 40px;
	}
	.middle_block_title .title-item{
		float: left;
		margin-right: 24px;
		display: flex;
	}
	.middle_block_title .title-item:last-child{
		margin-right: 0;
	}
	.middle_block_title .title-item .name{
		color: #101010;
		font-size: 18px;
		font-family: 'SourceHanSansSC-bold';
		font-weight: 600;
		margin-right: 10px;
	}
	.middle_block_title .title-item .value{
		color: #101010;
		font-size: 16px;
		font-family: 'SourceHanSansSC-bold';
		display: inline-block;
		background-color: #E3E2E2;
		max-width: 300px;
		padding:0 20px;
		white-space: nowrap;
		overflow:hidden;
		text-overflow: ellipsis;
	}
	.middle_block_box_main_pre{
		padding:18px 22px;
		box-sizing: border-box;
		overflow-x: hidden;
	}
	.realTime_section{
		margin-bottom: 30px;
		position: relative;
	}
	.realTime_section ul.impt li{
		float: left;
		width: 23.65%;
		margin-right:1.8%;
	}
	.realTime_section ul li p{
		font-size: 16px;
		color: #101010;
		font-family: 'SourceHanSansSC-regular';
		margin-bottom: 10px;
		text-align: left;
		white-space: nowrap;
	}
	.realTime_section ul li div{
		font-size: 20px;
		color: #080808;
		font-family: 'Roboto';
		text-align: center;
		height: 60px;
		line-height: 60px;
		white-space: nowrap;
	}
	.realTime_section ul li div.freeing{
		background-color: #C1CAF9;
	}
	.realTime_section ul li div.troubling{
		background-color: #FBC1C3;
	}
	.realTime_section ul li div.warning{
		background-color: #F7DCB5;
	}
	.realTime_section ul.spec{
		float: left;
		display: flex;
		justify-content: center;
		align-items:center;
		margin-right: 1%;
	}
	.realTime_section ul.spec li{
		float: left;
		margin-right: 2.2%;
	}
	.realTime_section_spec ul li{
		float: left;
		width: 23.65%;
		margin-right:1.8%;
	}
	.realTime_section_spec ul li:last-child{
		margin-right:0;
	}
	.realTime_section_spec ul li p{
		font-size: 16px;
		color: #101010;
		font-family: 'SourceHanSansSC-regular';
		margin-bottom: 10px;
		text-align: left;
	}
	.realTime_section_spec ul li div{
		height: 195px;
		padding-top:45px;
		box-sizing: border-box;
	}
	.realTime_section_spec ul li div.warning{
		background-color: #F7DCB5;
	}
	.realTime_section_spec ul li div p{
		font-size: 20px;
		color: #101010;
		font-family: 'SourceHanSansSC-regular';
		margin-bottom: 10px;
		text-align: center;
		white-space: nowrap;
		overflow:hidden;
		text-overflow: ellipsis;
	}
	.cnc_left{
		float: left;
		width: 72%;
		margin-right:16px;
	}
	.cnc_right{
		float: left;
		width:calc(28% - 16px);
	}
	.cnc_right .info{
		padding:12px 16px;
		box-sizing: border-box;
		overflow-x: hidden;
		text-align: left;
		text-overflow: ellipsis;
		font-size: 16px;
		color: #101010;
		font-family: 'SourceHanSansSC-regular';
	}
	.col-xaj-3{
		width: 22%;
		padding-left:15px;
		padding-right:15px;
		float: left;
		box-sizing: border-box;
	}
	.right_block_main{
		margin-left:-10px;
		margin-right:-15px;
	}
	.mg15{
		margin-bottom: 15px;
	}
	.warn_box{
		width: 100%;
		height:100%;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #6B6B6C;
		font-size: 16px;
		font-family: 'Roboto';
		font-weight: 600;
	}
	.warn_block{
		padding: 10px 10px 10px 20px;
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		position: relative;
	}
	.warn_block p{
		text-align: right;
		color: #010A37;
		font-size: 12px;
		font-family: 'Roboto';
	}
	.warn_block h3{
		text-align: center;
		color: #C1070E;
		font-size: 20px;
		font-family: 'Microsoft Yahei';
		margin-top: 10px;
		margin-bottom: 5px;
	}
	.warn_block h3 img{
		width: 25px;
		height: 25px;
		position: relative;
		top: 5px;
		margin-right: 5px;
	}
	.warn_block h4{
		text-align: center;
		color: #010A37;
		font-size: 20px;
		font-family: 'Roboto';
		margin-bottom: 5px;
	}
	.warn_block h4 i{
		margin-right: 5px;
	}
	.warn_block div{
		color: #010A37;
		font-size: 16px;
		font-family: 'Roboto';
		text-align: left;
	}
	.warn_block .warn_code{
		position: absolute;
		bottom: 31px;
		width: 90%;
		white-space: nowrap;
		overflow:hidden;
		text-overflow: ellipsis;
	}
	.warn_block .warn_time{
		position: absolute;
		bottom:10px;
		width: 90%;
		white-space: nowrap;
		overflow:hidden;
		text-overflow: ellipsis;
	}
	.warn_block div .txt{
		color: #282C44;
		font-size: 14px;
		font-family: 'Roboto';
	}
	.right_block_three img{
		margin:18px auto;
		width: 51%;
		height: auto;
	}
	.right_block_three h3{
		color: #282C44;
		font-size: 16px;
		font-family: 'Roboto';
		font-weight: 600;
		text-align: center;
		white-space: nowrap;
		overflow:hidden;
		text-overflow: ellipsis;
		margin-bottom: 6px;
	}
	.right_block_three h4{
		color: #282C44;
		font-size: 14px;
		font-family: 'Roboto';
		text-align: center;
		white-space: nowrap;
		overflow:hidden;
		text-overflow: ellipsis;
	}
	.middle_block_box_main_pre .table-mode{
    float: left;
    margin-bottom:12px;
    width: 100%;
  }
  .middle_block_box_main_pre .table-mode .head li{
    float: left;
    min-width: 66px;
    line-height: 24px;
    font-size: 16px;
    color: #101010;
    font-family: 'SourceHanSansSC-regular';
    text-align: left;
    margin-right: 10px;
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
    min-width: 66px;
    line-height: 32px;
    font-size: 18px;
    color: #080808;
    font-family: 'Roboto';
    text-align: center;
    background-color: #C1CAF9;
    margin-right: 10px;
  }
  .middle_block_box_main_pre .table-mode .body li:last-child{
    margin-right: 0;
  }
  .middle_block_box_main_pre .table-temperature{
    float: left;
    margin-bottom:20px;
    width: 100%;
  }
  .middle_block_box_main_pre .table-temperature .table-temperature-head{
    float: left;
  }
  .middle_block_box_main_pre .table-temperature .table-temperature-head div{
    min-width: 56px;
    line-height: 32px;
    font-size: 18px;
    color: #080808;
    font-family: 'Roboto';
    text-align: center;
    margin-right: 3px;
    margin-bottom: 3px;
  }
  .middle_block_box_main_pre .table-temperature .table-temperature-head div img{
    width: 15px;
    height: 30px;
    display: block;
    margin:0 auto;
  }
  .middle_block_box_main_pre .table-temperature .table-temperature-head div:first-child{
    line-height: 30px;
    height: 30px;
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
    height: 30px;
  }
  .middle_block_box_main_pre .table-temperature .head li{
    display: flex;
    align-items: flex-end;
    float: left;
    min-width: 66px;
    height: 30px;
    line-height: 24px;
    font-size: 16px;
    color: #101010;
    font-family: 'SourceHanSansSC-regular';
    text-align: left;
    margin-right: 5px;
  }
  .middle_block_box_main_pre .table-temperature .head li img{
    width: 15px;
    height: 30px;
    display: block;
    margin:0 auto;
  }
  .middle_block_box_main_pre .table-temperature .head li:last-child{
    margin-right: 0;
  }
  .middle_block_box_main_pre .table-temperature ul.body{
    display: flex;
    justify-content: center;
    margin-bottom: 3px;
  }
  .middle_block_box_main_pre .table-temperature ul.body:last-child{
  	margin-bottom: 0;
  }
  .middle_block_box_main_pre .table-temperature .body li{
    float: left;
    min-width: 66px;
    line-height: 32px;
    font-size: 18px;
    color: #080808;
    font-family: 'Roboto';
    text-align: center;
    background-color: #FBC1C3;
    margin-right: 5px;
  }
  .middle_block_box_main_pre .table-temperature .body li:last-child{
    margin-right: 0;
  }
  .middle_block_box_main_pre .table-group .table-example{
    float: left;
    margin-bottom: 18px;
    margin-right: 8px;
  }
  .middle_block_box_main_pre .table-group .table-example .table-example-head{
    float: left;
  }
  .middle_block_box_main_pre .table-group .table-example .table-example-head div{
    min-width: 46px;
    line-height: 32px;
    font-size: 18px;
    color: #080808;
    font-family: 'Roboto';
    text-align: center;
    margin-right: 3px;
    margin-bottom: 3px;
  }
  .middle_block_box_main_pre .table-group .table-example .table-example-head div img{
    width: 25px;
    height: 25px;
    display: block;
    margin:0 auto;
  }
  .middle_block_box_main_pre .table-group .table-example .table-example-head div:first-child{
    line-height: 30px;
    height: 30px;
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
    height: 30px;
  }
  .middle_block_box_main_pre .table-group .table-example .head li{
    display: flex;
    align-items: flex-end;
    float: left;
    min-width: 66px;
    height: 30px;
    line-height: 24px;
    font-size: 16px;
    color: #101010;
    font-family: 'SourceHanSansSC-regular';
    text-align: left;
    margin-right: 3px;
  }
  .middle_block_box_main_pre .table-group .table-example .head li img{
    width: 30px;
    height: 30px;
    display: block;
    margin:0 auto;
  }
  .middle_block_box_main_pre .table-group .table-example .head li:last-child{
    margin-right: 0;
  }
  .middle_block_box_main_pre .table-group .table-example ul.body{
    display: flex;
    justify-content: center;
    margin-bottom: 3px;
  }
  .middle_block_box_main_pre .table-group .table-example ul.body:last-child{
    margin-bottom: 0;
  }
  .middle_block_box_main_pre .table-group .table-example .body li{
    float: left;
    min-width: 66px;
    line-height: 32px;
    font-size: 18px;
    color: #080808;
    font-family: 'Roboto';
    text-align: center;
    background-color: #F7DCB5;
    margin-right: 3px;
  }
  .middle_block_box_main_pre .table-group .table-example .body li:last-child{
    margin-right: 0;
  }*/
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
	.col-xaj-2{
		width: 12%;
		padding-left:1.5rem;
		padding-right:1.5rem;
		float: left;
		box-sizing: border-box;
	}
	.left_block_main{
		margin-left:-1.5rem;
		margin-right:-1rem;
	}
	.block_box{
		box-shadow: 0px 0px .3rem .1rem rgba(172,200,197,1);
		border-radius: 1rem;
	}
	.xaj-tit{
		padding: .3rem .8rem 0;
		height:3rem;
		text-align: left;
		box-sizing: border-box;
		display: flex;
		align-items:center;
		position:relative;
	}
	.xaj-tit .icon{
		display: inline-block;
		width:.6rem;
		height:2.1rem;
		border-radius: .6rem;
		background-color: #009688;
	}
	.xaj-tit .tit{
		font-size: 1.8rem;
		color: #4B536A;
		font-family: 'Roboto';
		margin-left: 1rem;
	}
	.xaj-tit .en_tit{
		font-size: 1.4rem;
		color: #edeef0;
		margin-left: 1rem;
		position: relative;
		bottom:.2rem;
	}
	.xaj-tit ul{
		float: right;
		margin-right:.5rem;
		position: absolute;
		right:.8rem;
	}
	.xaj-tit ul li{
		float:left;
		font-size: 1.4rem;
		color: #060606;
		font-family: 'SourceHanSansSC-regular';
		margin-right: 1.9rem;
		display: flex;
		align-items: center;
	}
	.xaj-tit ul li:last-child{
		margin-right: 0;
	}
	.xaj-tit ul li b{
		margin-right:.3rem;
	}
	.device_list{
		overflow-x: hidden;
	}
	.device_item{
		height: 4.8rem;
		line-height:4.8rem;
		text-align: left;
		padding-left: 6%;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.device_item.active{
		background-color: #D2D2D2;
	}
	.device_item a{
		text-decoration: none;
		color:#101010;
		font-size: 1.6rem;
		font-family: 'SourceHanSansSC-regular';
	}
	.device_icon{
		display: inline-block;
		position: relative;
		top:.3rem;
		width: 2rem;
		height: 2rem;
		border-radius: 100%;
		margin-right: 6%;
	}
	.pro{
		background-color:#259B24;
	}
	.sta{
		background-color: #3F51B5;
	}
	.err{
		background-color: #FF9800;
	}
	.sto{
		background-color: #737172;
	}
	.s_icon{
		display: inline-block;
		width: 2rem;
		height: 1.2rem;
	}
	.col-xaj-7{
		width: 66%;
		padding-left:1.5rem;
		padding-right:1.5rem;
		float: left;
		box-sizing: border-box;
	}
	.middle_block_main{
		margin-left: -1rem;
		margin-right: -1rem;
	}
	.middle_block_one{
		margin-bottom: 15px;
	}
	.middle_block_title{
		margin-top: 1.6rem;
		margin-bottom: 1.2rem;
		height: 4rem;
		line-height: 4rem;
	}
	.middle_block_title .title-item{
		float: left;
		margin-right: 2.4rem;
		display: flex;
	}
	.middle_block_title .title-item:last-child{
		margin-right: 0;
	}
	.middle_block_title .title-item .name{
		color: #101010;
		font-size: 1.8rem;
		font-family: 'SourceHanSansSC-bold';
		font-weight: 600;
		margin-right: 1rem;
	}
	.middle_block_title .title-item .value{
		color: #101010;
		font-size: 1.6rem;
		font-family: 'SourceHanSansSC-bold';
		display: inline-block;
		background-color: #E3E2E2;
		max-width: 30rem;
		padding:0 2rem;
		white-space: nowrap;
		overflow:hidden;
		text-overflow: ellipsis;
	}
	.middle_block_box_main_pre{
		padding:18px 22px;
		box-sizing: border-box;
		overflow-x: hidden;
	}
	.realTime_section{
		margin-bottom: 3rem;
		position: relative;
	}
	.realTime_section ul.impt li{
		float: left;
		width: 23.65%;
		margin-right:1.8%;
	}
	.realTime_section ul li p{
		font-size: 1.6rem;
		color: #101010;
		font-family: 'SourceHanSansSC-regular';
		margin-bottom: 1rem;
		text-align: left;
		white-space: nowrap;
	}
	.realTime_section ul li div{
		font-size: 2rem;
		color: #080808;
		font-family: 'Roboto';
		text-align: center;
		height: 6rem;
		line-height: 6rem;
		white-space: nowrap;
	}
	.realTime_section ul li div.freeing{
		background-color: #C1CAF9;
	}
	.realTime_section ul li div.troubling{
		background-color: #FBC1C3;
	}
	.realTime_section ul li div.warning{
		background-color: #F7DCB5;
	}
	.realTime_section ul.spec{
		float: left;
		display: flex;
		justify-content: center;
		align-items:center;
		margin-right: 1%;
	}
	.realTime_section ul.spec li{
		float: left;
		margin-right: 2.2%;
	}
	.realTime_section_spec ul li{
		float: left;
		width: 23.65%;
		margin-right:1.8%;
	}
	.realTime_section_spec ul li:last-child{
		margin-right:0;
	}
	.realTime_section_spec ul li p{
		font-size: 1.6rem;
		color: #101010;
		font-family: 'SourceHanSansSC-regular';
		margin-bottom: 1rem;
		text-align: left;
	}
	.realTime_section_spec ul li div{
		height: 16.5rem;
		padding-top:3rem;
		box-sizing: border-box;
	}
	.realTime_section_spec ul li div.warning{
		background-color: #F7DCB5;
	}
	.realTime_section_spec ul li div p{
		font-size: 2rem;
		color: #101010;
		font-family: 'SourceHanSansSC-regular';
		margin-bottom: 1rem;
		text-align: center;
		white-space: nowrap;
		overflow:hidden;
		text-overflow: ellipsis;
	}
	.cnc_left{
		float: left;
		width: 72%;
		margin-right:1.6rem;
	}
	.cnc_right{
		float: left;
		width:calc(28% - 1.6rem);
	}
	.cnc_right .info{
		padding:1.2rem 1.6rem;
		box-sizing: border-box;
		overflow-x: hidden;
		text-align: left;
		text-overflow: ellipsis;
		font-size: 1.6rem;
		color: #101010;
		font-family: 'SourceHanSansSC-regular';
	}
	.col-xaj-3{
		width: 22%;
		padding-left:1.5rem;
		padding-right:1.5rem;
		float: left;
		box-sizing: border-box;
	}
	.right_block_main{
		margin-left:-1rem;
		margin-right:-1.5rem;
	}
	.mg15{
		margin-bottom: 15px;
	}
	.warn_box{
		width: 100%;
		height:100%;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #6B6B6C;
		font-size: 1.6rem;
		font-family: 'Roboto';
		font-weight: 600;
	}
	.warn_block{
		padding: 1rem 1rem 1rem 2rem;
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		position: relative;
	}
	.warn_block p{
		text-align: right;
		color: #010A37;
		font-size: 1.2rem;
		font-family: 'Roboto';
	}
	.warn_block h3{
		text-align: center;
		color: #C1070E;
		font-size: 2rem;
		font-family: 'Microsoft Yahei';
		margin-top: 1rem;
		margin-bottom: .5rem;
	}
	.warn_block h3 img{
		width: 2.5rem;
		height: 2.5rem;
		position: relative;
		top: .5rem;
		margin-right: .5rem;
	}
	.warn_block h4{
		text-align: center;
		color: #010A37;
		font-size: 2rem;
		font-family: 'Roboto';
		margin-bottom: .5rem;
	}
	.warn_block h4 i{
		margin-right: .5rem;
	}
	.warn_block div{
		color: #010A37;
		font-size: 1.6rem;
		font-family: 'Roboto';
		text-align: left;
	}
	.warn_block .warn_code{
		position: absolute;
		bottom: 3.1rem;
		width: 90%;
		white-space: nowrap;
		overflow:hidden;
		text-overflow: ellipsis;
	}
	.warn_block .warn_time{
		position: absolute;
		bottom:1rem;
		width: 90%;
		white-space: nowrap;
		overflow:hidden;
		text-overflow: ellipsis;
	}
	.warn_block div .txt{
		color: #282C44;
		font-size: 1.4rem;
		font-family: 'Roboto';
	}
	.right_block_three img{
		margin:1.8rem auto;
		width: 51%;
		height: auto;
		min-height: 10rem;
	}
	.right_block_three h3{
		color: #282C44;
		font-size: 1.6rem;
		font-family: 'Roboto';
		font-weight: 600;
		text-align: center;
		white-space: nowrap;
		overflow:hidden;
		text-overflow: ellipsis;
		margin-bottom: .6rem;
	}
	.right_block_three h4{
		color: #282C44;
		font-size: 1.4rem;
		font-family: 'Roboto';
		text-align: center;
		white-space: nowrap;
		overflow:hidden;
		text-overflow: ellipsis;
	}
	.middle_block_box_main_pre .table-mode{
    /*float: left;*/
    margin-bottom:1.2rem;
    /*width: 100%;*/
  }
  .middle_block_box_main_pre .table-mode .head li{
    float: left;
    min-width: 6.6rem;
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
    min-width: 6.6rem;
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
  .middle_block_box_main_pre .table-group .table-example{
    float: left;
    margin-bottom: 1.8rem;
    margin-right: .8rem;
  }
  .middle_block_box_main_pre .table-group .table-example .table-example-head{
    float: left;
  }
  .middle_block_box_main_pre .table-group .table-example .table-example-head div{
    min-width: 4.6rem;
    line-height: 3.2rem;
    font-size: 1.8rem;
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
    min-width: 6.6rem;
    height: 3rem;
    line-height: 2.4rem;
    font-size: 1.6rem;
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
  	min-width: 6.6rem;
  	margin-right: .6rem;
  }
  .middle_block_box_main_pre .table-group .table-example .body li b{
    float: left;
    min-width: 6.6rem;
    line-height: 3.2rem;
    font-size: 1.8rem;
    color: #080808;
    font-family: 'Roboto';
    text-align: center;
    background-color: #F7DCB5;
    margin-right: .3rem;
  }
  .middle_block_box_main_pre .table-group .table-example .body li span{
  	float: left;
  	line-height: 3.2rem;
    font-size: 1.8rem;
    color: #080808;
    font-family: 'Roboto';
    text-align: center;
    width: 2rem;
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
  	width: 50%;
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
  	font-size: 2.0rem;
    color: #080808;
    font-family: 'Roboto';
    margin-right: .3rem;
  }
  .cvalue{
  	font-size: 1.8rem;
  	color: #FF6600;
  	font-family: 'Roboto';
  	margin-right: .3rem;
  }
  .cunit{
  	font-size: 1.8rem;
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
	font-size: 2.4rem;
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
</style>