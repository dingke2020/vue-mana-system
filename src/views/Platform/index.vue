<template>
	<div class="check-order">
		<Small-head></Small-head>
		<div class="main-container">
			<ul class="clearfix">
				<li v-for="(item,index) in list" class="piece">
					<div class="section-one clearfix">
						<p class="code">{{item.workingNumber}}</p>
						<p v-if="item.status==0" class="status status-get">待领单</p>
						<p v-else-if="item.status==1" class="status status-producing">生产中</p>
						<p v-else-if="item.status==2" class="status status-finish">已完工</p>
					</div>
					<h4 class="title">{{item.materialName}}</h4>
					<div class="section-two clearfix">
						<div class="detail">
							<p class="text">规格型号：<span class="text-bolder">{{item.specifications}}</span></p>
							<p class="text">计划生产量：<span class="text-bolder">{{item.planQuantity}}</span></p>
							<p class="text">生产设备：<span class="text-bolder">{{item.machine}}</span></p>
							<p class="text">工作中心：<span class="text-bolder">{{item.productionProcessesName}}</span></p>
						</div>
						<div class="detail-chart">
							<div :id="'s_'+item.eid" style="width:100%;height:100%"></div>
						</div>
					</div>
					<el-row class="btn-group">
						<!-- <el-button v-show="showPushButton(item)" class="success-unfill" @click="handleCheck(item)">查看工艺</el-button> -->
						<!-- <el-button v-show="showPushButton(item)" class="success-unfill">获取工艺</el-button> -->
						<!-- <el-button v-show="item.status==0" class="success-unfill" @click="handleProgram(item)">查看程序</el-button> -->
						<el-button v-show="showProcessButton(item)" class="success-unfill" @click="handleRecord(item)">查看工艺记录</el-button>
						<el-button v-show="item.status==0" class="success-fill" @click="handleGet(item)">领单</el-button>
						<el-button v-show="showPushButton(item)" class="primary-fill" @click="handlePush(item)">报工</el-button>
					</el-row>
				</li>
			</ul>
			<!-- <input id="icCard" type="text" autofocus="autofocus" style="display:none;"> -->
		</div>
		<el-dialog :title="state?'查看工艺':'获取工艺'" width="88%" :visible.sync="dialogVisibleB" custom-class="platformDialogB" center>
			<el-form v-if="state">
				<div class="header clearfix">
					<p>物料名称：<span>{{materialName}}</span></p>
					<p>规格型号：<span>{{specifications}}</span></p>
					<p>生产工序：<span>{{productionProcessesName}}</span></p>
				</div>
				<div class="tech-body clearfix">
					<div class="table-mode">
						<ul class="head clearfix">
							<li>运行模式</li>
							<li>油温</li>
							<li>冷却时间</li>
							<li>环境温度</li>
						</ul>
						<ul class="body clearfix">
							<li>{{process_sheet.mode}}</li>
							<li>{{process_sheet.oil}}</li>
							<li>{{process_sheet.cool}}</li>
							<li>{{process_sheet.environment}}</li>
						</ul>
					</div>
					<!-- <div class="table-temperature">
						<div class="table-temperature-head">
							<div><img :src="process_sheet.temperature.img"></div>
							<div>{{process_sheet.temperature.name}}</div>
						</div>
						<div class="table-temperature-body">
							<ul class="head clearfix">
								<li v-for="item in process_sheet.temperature.text">{{item}}</li>
							</ul>
							<ul class="body clearfix">
								<li v-for="item in process_sheet.temperature.value">{{item}}</li>
							</ul>
						</div>
					</div> -->
					<div class="table-group clearfix">
						<div v-for="item in process_sheet.group" class="table-example">
							<div class="table-example-head">
								<div><img :src="item.img"></div>
								<div v-for="point in item.name">{{point}}</div>
							</div>
							<div class="table-example-body">
								<ul class="head clearfix">
									<li v-for="piece in item.text">{{piece}}</li>
								</ul>
								<ul v-for="block in item.list" class="body clearfix">
									<li v-for="grain in block.value">{{grain}}</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</el-form>
		</el-dialog>
		<el-dialog :title="operation?'领单':'报工'" width="75%" :visible.sync="dialogVisible" custom-class="platformDialog" @close="dialogClose" center>
			<el-form v-if="operation" v-show="!successTip">
				<h4 class="get-title">请刷取您的员工卡，完成领单！</h4>
				<el-input id="getter" type="text" :autofocus="true" v-model="icCardNum" maxlength="100"></el-input>
				<!-- <el-button class="get-card" @click="handleBrush" :loading="editLoadingA">员工卡号</el-button> -->
			</el-form>
		    <el-form :model="dataForm" :rules="dataFormRules" ref="dataForm" label-width="130px" :size="size" label-position="right" v-if="!operation" v-show="!successTip">
		      <div class="sub-title">工单信息：</div>
		      <el-form :inline="true" label-width="130px" class="demo-form-inline">
		        <el-form-item label="工单号">
		          <el-input id="workingNumber" v-model="working.workingNumber" :disabled="true"></el-input>
		        </el-form-item>
		        <el-form-item label="工作中心">
		          <el-input id="workingProductionProcessesName" v-model="working.productionProcessesName" :disabled="true"></el-input>
		        </el-form-item>
		        <el-form-item label="物料名称">
		          <el-input id="workingMaterialName" v-model="working.materialName" :disabled="true"></el-input>
		        </el-form-item>
		        <el-form-item label="物料编码">
		          <el-input id="workingMaterialCode" v-model="working.materialCode" :disabled="true"></el-input>
		        </el-form-item>
		        <el-form-item label="规格型号">
		          <el-input id="workingSpecifications" v-model="working.specifications" :disabled="true"></el-input>
		        </el-form-item>
		        <el-form-item label="计划生产量">
		          <el-input id="workingPlanQuantity" v-model="working.planQuantity" :disabled="true"></el-input>
		        </el-form-item>
		        <el-form-item label="生产设备">
		          <el-input id="workingMachine" v-model="working.machine" :disabled="true"></el-input>
		        </el-form-item>
		        <el-form-item label="生产人员">
		          <el-input id="workingPerson" v-model="working.name" :disabled="true"></el-input>
		        </el-form-item>
		      </el-form>
			  <div class="sub-title">请填写生产配件数，进行报工：</div>
			  <el-form-item label="生产物料数" class="inputLength" prop="num">
			  	<el-input type="number" id="producingNum" v-model="dataForm.num"></el-input>
				<el-button @click="clear()">清空</el-button>
			  </el-form-item>
		    </el-form>
		    <div slot="footer" class="dialog-footer" v-if="!operation">
		      <el-button size="medium" @click.native="dialogVisible = false" class="cancel-button">取消</el-button>
		      <el-button size="medium" type="primary" @click.native="submitForm" :loading="editLoading" class="define-button">确定</el-button>
		    </div>
		    <el-form v-if="successTip">
		    	<h4 class="get-title">{{successTitle}}成功！</h4>
				<i class="el-icon-circle-check success-icon"></i>
		    </el-form>
		  </el-dialog>
		  <el-dialog :title="deal?'查看工艺记录':'查看程序'" width="88%" :visible.sync="dialogVisibleC" custom-class="platformDialogC" center>
		  	<div class="header clearfix">
				<p>物料名称：<span>{{materialName}}</span></p>
				<p>规格型号：<span>{{specifications}}</span></p>
				<p>生产工序：<span>{{productionProcessesName}}</span></p>
			</div>
		  	<el-form v-if="deal" style="margin-top:18px;max-height:400px;">
				<el-table :data="tableData" border style="width:100%" :header-cell-style="{'background-color':'#FFF','color':'#424242','font-size':'16px'}" class="parameter">
		        <!-- <el-table-column prop="temperature" label="环境温度" min-width="100" header-align="center" align="center"></el-table-column> -->
		        <el-table-column prop="productionCount" label="加工数量" min-width="100" header-align="center" align="center"></el-table-column>
		        <el-table-column prop="processParameters" label="变更工艺参数" min-width="300" header-align="center" align="center"></el-table-column>
		        <el-table-column prop="collectTime" label="采集时间" min-width="200" header-align="center" align="center"></el-table-column>
		        <el-table-column label="操作" min-width="100" header-align="center" align="center">
			        <template slot-scope="scope">
			          <el-button size="mini" @click="handleCheck(scope.$index, scope.row)" :style="{'color':themeColor,'border-color':themeColor}">查看工艺</el-button>
			        </template>
			      </el-table-column>
		      </el-table>
		  	</el-form>
		  	<el-form v-else style="margin-top:18px;" label-width="90px" label-position="left">
		  		<el-form-item label="程序号：">
		  			<div class="program_icon">G54</div>
		  		</el-form-item>
		  		<el-form-item label="程序代码：">
		  			<div class="program_txt">
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
		  		</el-form-item>
		  	</el-form>
		  </el-dialog>
	</div>
</template>
<script>
import SmallHead from '@/views/HeadBar/SmallHead'
import axios from 'axios'
export default{
	data(){
		return{
			list:[
				// {id:'001',jobNumber:"RT-WLW100-01-26",status:0,title:"无油立式真空泵气缸体（WLW100-01）",type:"WLW100",planCount:100,machine:"scsb002",workcenter:"内磨圆",name:"无油立式真空泵气缸体",code:"WLW100-01",person:"王志忠"},
				// {id:'002',jobNumber:"RT-WLW100-01-26",status:0,title:"无油立式真空泵气缸体（WLW100-01）",type:"WLW100",planCount:100,machine:"scsb002",workcenter:"内磨圆",name:"无油立式真空泵气缸体",code:"WLW100-01",person:"王志忠"},
				// {id:'003',jobNumber:"RT-WLW100-01-26",status:0,title:"无油立式真空泵气缸体（WLW100-01）",type:"WLW100",planCount:100,machine:"scsb002",workcenter:"内磨圆",name:"无油立式真空泵气缸体",code:"WLW100-01",person:"王志忠"},
				// {id:'004',jobNumber:"RT-WLW100-01-26",status:1,title:"无油立式真空泵气缸体（WLW100-01）",type:"WLW100",planCount:100,machine:"scsb002",workcenter:"内磨圆",name:"无油立式真空泵气缸体",code:"WLW100-01",person:"王志忠"},
				// {id:'005',jobNumber:"RT-WLW100-01-26",status:1,title:"无油立式真空泵气缸体（WLW100-01）",type:"WLW100",planCount:100,machine:"scsb002",workcenter:"内磨圆",name:"无油立式真空泵气缸体",code:"WLW100-01",person:"王志忠"},
				// {id:'006',jobNumber:"RT-WLW100-01-26",status:1,title:"无油立式真空泵气缸体（WLW100-01）",type:"WLW100",planCount:100,machine:"scsb002",workcenter:"内磨圆",name:"无油立式真空泵气缸体",code:"WLW100-01",person:"王志忠"},
				// {id:'007',jobNumber:"RT-WLW100-01-26",status:1,title:"无油立式真空泵气缸体（WLW100-01）",type:"WLW100",planCount:100,machine:"scsb002",workcenter:"内磨圆",name:"无油立式真空泵气缸体",code:"WLW100-01",person:"王志忠"},
				// {id:'008',jobNumber:"RT-WLW100-01-26",status:1,title:"无油立式真空泵气缸体（WLW100-01）",type:"WLW100",planCount:100,machine:"scsb002",workcenter:"内磨圆",name:"无油立式真空泵气缸体",code:"WLW100-01",person:"王志忠"}
			],
			size:'small',
			dialogVisibleC:false,
			deal:true,
			dialogVisibleB:false,
			state:false,
			dialogVisible:false,
			operation:false,
			successTip:false,
			successTitle: '',
			editLoading: false,
			editLoadingA: false,
			working:{},
			materialName:'',
			specifications:'',
			productionProcessesName:'',
			icCardNum:'',
			dataForm:{
				num:''
			},
			dataFormRules:{
				num: [
					{ required: true, message: '请输入生产物料数', trigger: 'blur' }
				]
			},
			process_sheet:{
				mode:'全自动',
				oil:56.5,
				cool:20,
				environment:35.8,
				temperature:{
					img:require('@/assets/images/temperature.png'),
					name:'设定值',
					text:['一段','二段','三段','四段','五段','六段','七段','八段'],
					value:[30.9,33.6,33.9,32.5,28.6,25.6,28.8,32.5]
				},
				group:[
					{
						img:require('@/assets/images/1.png'),
						name:['压力','速度','位置'],
						text:['一段','二段','三段','低压','高压'],
						list:[
							{value:[30.9,33.6,33.9,32.5,28.6]},
							{value:[30.9,33.6,33.9,32.5,28.6]},
							{value:[33.6,33.9,32.5,28.6]}
						]
					},
					{
						img:require('@/assets/images/2.png'),
						name:[],
						text:['五段','四段','三段','二段','一段'],
						list:[
							{value:[30.9,33.6,33.9,32.5,28.6]},
							{value:[30.9,33.6,33.9,32.5,28.6]},
							{value:[30.9,33.6,33.9,32.5,28.6]}
						]
					},
					{
						img:require('@/assets/images/3.png'),
						name:['压力','速度','位置'],
						text:['六段','五段','四段','三段','二段','一段'],
						list:[
							{value:[30.9,33.6,33.9,32.5,28.6,28.6]},
							{value:[30.9,33.6,33.9,32.5,28.6,28.6]},
							{value:[33.6,33.9,32.5,28.6,28.6]}
						]
					},
					{
						img:require('@/assets/images/4.png'),
						name:['压力','速度','位置'],
						text:['进一','进二'],
						list:[
							{value:[30.9,33.6]},
							{value:[30.9,33.6]},
							{value:[30.9,33.6]}
						]
					},
					{
						img:require('@/assets/images/7.png'),
						name:['压力','速度','时间'],
						text:['五段','四段','三段','二段','一段'],
						list:[
							{value:[33.6,33.9,32.5,28.6,28.6]},
							{value:[33.6,33.9,32.5,28.6,28.6]},
							{value:[33.6,33.9,32.5,28.6,28.6]}
						]
					},
					{
						img:require('@/assets/images/6.png'),
						name:['压力','速度','位置'],
						text:['退一','退二'],
						list:[
							{value:[30.9,33.6]},
							{value:[30.9,33.6]},
							{value:[30.9,33.6]}
						]
					},
					{
						img:require('@/assets/images/5.png'),
						name:['压力','速度','位置'],
						text:['一段','二段','三段','四段','五段'],
						list:[
							{value:[33.6,33.9,32.5,28.6,28.6]},
							{value:[33.6,33.9,32.5,28.6,28.6]},
							{value:[33.6,33.9,32.5,28.6,28.6]}
						]
					},
					{
						img:require('@/assets/images/8.png'),
						name:['压力','速度','位置'],
						text:[],
						list:[
							{value:[30.9]},
							{value:[30.9]},
							{value:[30.9]}
						]
					}
				]
			},
			imgSrc:require('@/assets/images/temperature.png'),
			imgSrc1:require('@/assets/images/1.png'),
			paramsSearch:{},
			mychartS:'',
			formParams:{},
			orderParams:{},
			isProducing:true,
			tableData:[
				{temperature:28.5,processQuantity:50,changeProcessParameter:'一段压力：50；二段压力：55',updateTime:'2019-07-04 15:46:24'}
			]
		}
	},
	mounted(){
		let _this = this;
		_this.findPage();
		setTimeout(function(){
			var aHeight = $(".check-order").height();
			// console.log(aHeight);
			var winHeight = $(window).height();
			if(aHeight<$(window).height()){
				$(".check-order").height(winHeight - 92);
			}
		},500);
	},
	methods:{
		findPage(){
			let _this = this;
			_this.list = [];
			_this.paramsSearch = {
				mobile: localStorage.getItem('mobile'),
				icCardNum: localStorage.getItem('icCardNum'),
				name: localStorage.getItem('name'),
				groupId: localStorage.getItem('groupId'),
				currPage: 1,
				pageSize: 10
			}
			console.log(_this.paramsSearch);
			axios.get('/xaj/workingOrder/searchWorkOrder',{params:_this.paramsSearch}).then(function(res){
				// console.log(res);
				var arr = res.data.data;
				console.log(arr);
				$.each(arr,function(index,value){
					_this.list.push({
						workingNumber:value.workingNumber,
						status:value.status,
						materialName:value.materialName,
						materialCode:value.materialCode,
						specifications:value.specifications,
						planQuantity:value.planQuantity,
						machine:value.machine,
						productionProcessesName:value.productionProcessesName,
						progress:value.progress,
						name:value.name,
						id:value.id,
						productionId:value.productionId,
						icCardNum:value.icCardNum,
						eid:index
					})
				})
			}).catch(function(error){
				console.log(error);
			})
			setTimeout(function(){
				console.log(_this.list);
				$.each(_this.list,function(index,value){
				_this.mychartS = "mychartS_"+value.eid;
				_this.mychartS = _this.$echarts.init(document.getElementById("s_"+value.eid));
				// console.log(_this.mychartS);
				_this.mychartS.setOption({
					series:[{
						type:'pie',
						radius:['80%','90%'],
						center:['50%','50%'],
						clockwise:false,
						hoverAnimation:false,
						label:{
							color:'#000',
							fontSize:24,
							position:'center',
							fontFamily:'Roboto',
							formatter:'{d}%',
							show:false
						},
						data:[
							{value:value.progress,name:'完成',itemStyle:{color:'#06AC02'},label:{show:true}},
							{value:(100-value.progress),name:'未完成',itemStyle:{color:'#EEECE1'}}
						]
					}]
				})
			})
			},500);
		},
		handleRecord(str){
			let _this = this;
			_this.dialogVisibleC = true;
			_this.deal = true;
			console.log(str);
			_this.materialName = str.materialName;
			_this.specifications = str.specifications;
			_this.productionProcessesName = str.productionProcessesName;
			_this.tableData = [];
			$.ajax({
				type:'GET',
				url:'/xaj/workingOrder/checkProcessParameters',
				data:{
					currPage:1,
					pageSize:10,
					machine:str.machine
				},
				success:function(res){
					console.log(res);
					var data = res.data;
					_this.tableData = data;
					// $.each(data,function(index,value){
					// 	_this.tableData.push({
					// 		productionCount:value.productionCount,processParameters:value.processParameters,collectTime:value.collectTime
					// 	})
					// })
				}
			})
		},
		handleProgram(str){
			this.dialogVisibleC = true;
			this.deal = false;
		},
		handleCheck(index,str){
			let _this = this;
			// _this.dialogVisibleC = false;
			_this.state = true;
			console.log(str);
			_this.materialName = str.materialName;
			_this.specifications = str.specifications;
			_this.productionProcessesName = str.productionProcessesName;
			$.ajax({
		        type:'GET',
		        url:'/xaj/process/findProcessParametersDetail',
		        data:{id:str.id},
		        success:function(res){
		          // console.log(res);
		          $.each(res,function(tab,item){
		            if(item.fieldName=="运行状态"){
		              switch(item.data){
		                case 0:
		                  item.data = "手动";
		                  break;
		                case 3:
		                  item.data = "半自动";
		                  break;
		                case 5:
		                  item.data = "电眼全自动";
		                  break;
		                case 9:
		                  item.data = "时间全自动";
		                  break;
		                case 16:
		                  item.data = "调模使用";
		                  break;
		              }
		              _this.process_sheet.mode = item.data
		            }
		            if(item.fieldName=="油温"){
		              _this.process_sheet.oil = item.data
		            }
		            if(item.fieldName=="冷却时间"){
		              _this.process_sheet.cool = item.data
		            }
		            if(item.fieldName=="环境温度"){
		              _this.process_sheet.environment = item.data
		            }
		            if(item.fieldName=="关模一段压力"){
		              _this.process_sheet.group[0].list[0].value[0] = item.data
		            }
		            if(item.fieldName=="关模二段压力"){
		              _this.process_sheet.group[0].list[0].value[1] = item.data
		            }
		            if(item.fieldName=="关模三段压力"){
		              _this.process_sheet.group[0].list[0].value[2] = item.data
		            }
		            if(item.fieldName=="关模低段压力"){
		              _this.process_sheet.group[0].list[0].value[3] = item.data
		            }
		            if(item.fieldName=="关模高段压力"){
		              _this.process_sheet.group[0].list[0].value[4] = item.data
		            }
		            if(item.fieldName=="关模一段速度"){
		              _this.process_sheet.group[0].list[1].value[0] = item.data
		            }
		            if(item.fieldName=="关模二段速度"){
		              _this.process_sheet.group[0].list[1].value[1] = item.data
		            }
		            if(item.fieldName=="关模三段速度"){
		              _this.process_sheet.group[0].list[1].value[2] = item.data
		            }
		            if(item.fieldName=="关模低段速度"){
		              _this.process_sheet.group[0].list[1].value[3] = item.data
		            }
		            if(item.fieldName=="关模高段速度"){
		              _this.process_sheet.group[0].list[1].value[4] = item.data
		            }
		            if(item.fieldName=="关模一段位置"){
		              _this.process_sheet.group[0].list[2].value[0] = item.data
		            }
		            if(item.fieldName=="关模二段位置"){
		              _this.process_sheet.group[0].list[2].value[1] = item.data
		            }
		            if(item.fieldName=="关模三段位置"){
		              _this.process_sheet.group[0].list[2].value[2] = item.data
		            }
		            if(item.fieldName=="关模低段位置"){
		              _this.process_sheet.group[0].list[2].value[3] = item.data
		            }
		            if(item.fieldName=="开模五段压力"){
		              _this.process_sheet.group[1].list[0].value[0] = item.data
		            }
		            if(item.fieldName=="开模四段压力"){
		              _this.process_sheet.group[1].list[0].value[1] = item.data
		            }
		            if(item.fieldName=="开模三段压力"){
		              _this.process_sheet.group[1].list[0].value[2] = item.data
		            }
		            if(item.fieldName=="开模二段压力"){
		              _this.process_sheet.group[1].list[0].value[3] = item.data
		            }
		            if(item.fieldName=="开模一段压力"){
		              _this.process_sheet.group[1].list[0].value[4] = item.data
		            }
		            if(item.fieldName=="开模五段速度"){
		              _this.process_sheet.group[1].list[1].value[0] = item.data
		            }
		            if(item.fieldName=="开模四段速度"){
		              _this.process_sheet.group[1].list[1].value[1] = item.data
		            }
		            if(item.fieldName=="开模三段速度"){
		              _this.process_sheet.group[1].list[1].value[2] = item.data
		            }
		            if(item.fieldName=="开模二段速度"){
		              _this.process_sheet.group[1].list[1].value[3] = item.data
		            }
		            if(item.fieldName=="开模一段速度"){
		              _this.process_sheet.group[1].list[1].value[4] = item.data
		            }
		            if(item.fieldName=="开模五段位置"){
		              _this.process_sheet.group[1].list[2].value[0] = item.data
		            }
		            if(item.fieldName=="开模四段位置"){
		              _this.process_sheet.group[1].list[2].value[1] = item.data
		            }
		            if(item.fieldName=="开模三段位置"){
		              _this.process_sheet.group[1].list[2].value[2] = item.data
		            }
		            if(item.fieldName=="开模二段位置"){
		              _this.process_sheet.group[1].list[2].value[3] = item.data
		            }
		            if(item.fieldName=="开模一段位置"){
		              _this.process_sheet.group[1].list[2].value[4] = item.data
		            }
		            if(item.fieldName=="射胶六段压力"){
		              _this.process_sheet.group[2].list[0].value[0] = item.data
		            }
		            if(item.fieldName=="射胶五段压力"){
		              _this.process_sheet.group[2].list[0].value[1] = item.data
		            }
		            if(item.fieldName=="射胶四段压力"){
		              _this.process_sheet.group[2].list[0].value[2] = item.data
		            }
		            if(item.fieldName=="射胶三段压力"){
		              _this.process_sheet.group[2].list[0].value[3] = item.data
		            }
		            if(item.fieldName=="射胶二段压力"){
		              _this.process_sheet.group[2].list[0].value[4] = item.data
		            }
		            if(item.fieldName=="射胶一段压力"){
		              _this.process_sheet.group[2].list[0].value[5] = item.data
		            }
		            if(item.fieldName=="射胶六段速度"){
		              _this.process_sheet.group[2].list[1].value[0] = item.data
		            }
		            if(item.fieldName=="射胶五段速度"){
		              _this.process_sheet.group[2].list[1].value[1] = item.data
		            }
		            if(item.fieldName=="射胶四段速度"){
		              _this.process_sheet.group[2].list[1].value[2] = item.data
		            }
		            if(item.fieldName=="射胶三段速度"){
		              _this.process_sheet.group[2].list[1].value[3] = item.data
		            }
		            if(item.fieldName=="射胶二段速度"){
		              _this.process_sheet.group[2].list[1].value[4] = item.data
		            }
		            if(item.fieldName=="射胶一段速度"){
		              _this.process_sheet.group[2].list[1].value[5] = item.data
		            }
		            if(item.fieldName=="射胶六段位置"){
		              _this.process_sheet.group[2].list[2].value[0] = item.data
		            }
		            if(item.fieldName=="射胶五段位置"){
		              _this.process_sheet.group[2].list[2].value[1] = item.data
		            }
		            if(item.fieldName=="射胶四段位置"){
		              _this.process_sheet.group[2].list[2].value[2] = item.data
		            }
		            if(item.fieldName=="射胶三段位置"){
		              _this.process_sheet.group[2].list[2].value[3] = item.data
		            }
		            if(item.fieldName=="射胶二段位置"){
		              _this.process_sheet.group[2].list[2].value[4] = item.data
		            }
		            if(item.fieldName=="托模进一压力"){
		              _this.process_sheet.group[3].list[0].value[0] = item.data
		            }
		            if(item.fieldName=="托模进二压力"){
		              _this.process_sheet.group[3].list[0].value[1] = item.data
		            }
		            if(item.fieldName=="托模进一速度"){
		              _this.process_sheet.group[3].list[1].value[0] = item.data
		            }
		            if(item.fieldName=="托模进二速度"){
		              _this.process_sheet.group[3].list[1].value[1] = item.data
		            }
		            if(item.fieldName=="托模进一位置"){
		              _this.process_sheet.group[3].list[2].value[0] = item.data
		            }
		            if(item.fieldName=="托模进二位置"){
		              _this.process_sheet.group[3].list[2].value[1] = item.data
		            }
		            if(item.fieldName=="保压五段压力"){
		              _this.process_sheet.group[4].list[0].value[0] = item.data
		            }
		            if(item.fieldName=="保压四段压力"){
		              _this.process_sheet.group[4].list[0].value[1] = item.data
		            }
		            if(item.fieldName=="保压三段压力"){
		              _this.process_sheet.group[4].list[0].value[2] = item.data
		            }
		            if(item.fieldName=="保压二段压力"){
		              _this.process_sheet.group[4].list[0].value[3] = item.data
		            }
		            if(item.fieldName=="保压一段压力"){
		              _this.process_sheet.group[4].list[0].value[4] = item.data
		            }
		            if(item.fieldName=="保压五段速度"){
		              _this.process_sheet.group[4].list[1].value[0] = item.data
		            }
		            if(item.fieldName=="保压四段速度"){
		              _this.process_sheet.group[4].list[1].value[1] = item.data
		            }
		            if(item.fieldName=="保压三段速度"){
		              _this.process_sheet.group[4].list[1].value[2] = item.data
		            }
		            if(item.fieldName=="保压二段速度"){
		              _this.process_sheet.group[4].list[1].value[3] = item.data
		            }
		            if(item.fieldName=="保压一段速度"){
		              _this.process_sheet.group[4].list[1].value[4] = item.data
		            }
		            if(item.fieldName=="保压五段时间"){
		              _this.process_sheet.group[4].list[2].value[0] = item.data
		            }
		            if(item.fieldName=="保压四段时间"){
		              _this.process_sheet.group[4].list[2].value[1] = item.data
		            }
		            if(item.fieldName=="保压三段时间"){
		              _this.process_sheet.group[4].list[2].value[2] = item.data
		            }
		            if(item.fieldName=="保压二段时间"){
		              _this.process_sheet.group[4].list[2].value[3] = item.data
		            }
		            if(item.fieldName=="保压一段时间"){
		              _this.process_sheet.group[4].list[2].value[4] = item.data
		            }
		            if(item.fieldName=="托模退一压力"){
		              _this.process_sheet.group[5].list[0].value[0] = item.data
		            }
		            if(item.fieldName=="托模退二压力"){
		              _this.process_sheet.group[5].list[0].value[1] = item.data
		            }
		            if(item.fieldName=="托模退一速度"){
		              _this.process_sheet.group[5].list[1].value[0] = item.data
		            }
		            if(item.fieldName=="托模退二速度"){
		              _this.process_sheet.group[5].list[1].value[1] = item.data
		            }
		            if(item.fieldName=="托模退一位置"){
		              _this.process_sheet.group[5].list[2].value[0] = item.data
		            }
		            if(item.fieldName=="托模退二位置"){
		              _this.process_sheet.group[5].list[2].value[1] = item.data
		            }
		            if(item.fieldName=="储料一段压力"){
		              _this.process_sheet.group[6].list[0].value[0] = item.data
		            }
		            if(item.fieldName=="储料二段压力"){
		              _this.process_sheet.group[6].list[0].value[1] = item.data
		            }
		            if(item.fieldName=="储料三段压力"){
		              _this.process_sheet.group[6].list[0].value[2] = item.data
		            }
		            if(item.fieldName=="储料四段压力"){
		              _this.process_sheet.group[6].list[0].value[3] = item.data
		            }
		            if(item.fieldName=="储料五段压力"){
		              _this.process_sheet.group[6].list[0].value[4] = item.data
		            }
		            if(item.fieldName=="储料一段速度"){
		              _this.process_sheet.group[6].list[1].value[0] = item.data
		            }
		            if(item.fieldName=="储料二段速度"){
		              _this.process_sheet.group[6].list[1].value[1] = item.data
		            }
		            if(item.fieldName=="储料三段速度"){
		              _this.process_sheet.group[6].list[1].value[2] = item.data
		            }
		            if(item.fieldName=="储料四段速度"){
		              _this.process_sheet.group[6].list[1].value[3] = item.data
		            }
		            if(item.fieldName=="储料五段速度"){
		              _this.process_sheet.group[6].list[1].value[4] = item.data
		            }
		            if(item.fieldName=="储料一段位置"){
		              _this.process_sheet.group[6].list[2].value[0] = item.data
		            }
		            if(item.fieldName=="储料二段位置"){
		              _this.process_sheet.group[6].list[2].value[1] = item.data
		            }
		            if(item.fieldName=="储料三段位置"){
		              _this.process_sheet.group[6].list[2].value[2] = item.data
		            }
		            if(item.fieldName=="储料四段位置"){
		              _this.process_sheet.group[6].list[2].value[3] = item.data
		            }
		            if(item.fieldName=="储料五段位置"){
		              _this.process_sheet.group[6].list[2].value[4] = item.data
		            }
		            if(item.fieldName=="射退压力"){
		              _this.process_sheet.group[7].list[0].value[0] = item.data
		            }
		            if(item.fieldName=="射退速度"){
		              _this.process_sheet.group[7].list[1].value[0] = item.data
		            }
		            if(item.fieldName=="射退位置"){
		              _this.process_sheet.group[7].list[2].value[0] = item.data
		            }
		          })
		        }
		      })
			  _this.dialogVisibleB = true;
		},
		handleGet(str){
			let _this = this;
			console.log(str);
			_this.dialogVisible = true;
			$(".platformDialog").css({"margin-top":"15vh"});
			_this.operation = true;
			_this.orderParams = {
				id:str.id,
				productionId:str.productionId,
				workingNumber:str.workingNumber,
				groupId:localStorage.getItem('groupId')
				// icCardNum:$(this).val()
			}
			_this.icCardNum = '';
			// $('#getter').focus();
			setTimeout(function(){
				$('#getter').focus();
				$('input').bind('input propertychange', function() {
					console.log($(this).val());
					_this.orderParams.icCardNum = $(this).val();
					var iccard = localStorage.getItem('icCardNum');
					console.log(iccard);
					if(iccard == _this.orderParams.icCardNum){
						// console.log("haha");
						$.ajax({
							type:'GET',
							url:'/xaj/workingOrder/receiveWorkingOrder',
							data:_this.orderParams,
							success:function(data){
								console.log(data);
								_this.editLoadingA = false;
								_this.findPage();
								_this.successTitle = '领单';
								_this.successTip = true;
								setTimeout(function(){
									_this.dialogVisible = false;
								},500)
							}
						})
					}
				})
			},300)
			
		},
		handlePush(str){
			console.log(str);
			this.working = {workingNumber:str.workingNumber,productionProcessesName:str.productionProcessesName,materialName:str.materialName,materialCode:str.materialCode,specifications:str.specifications,planQuantity:str.planQuantity,machine:str.machine,name:str.name,id:str.id,productionId:str.productionId};
			this.dialogVisible = true;
			$(".platformDialog").css({"margin-top":"10vh"});
			this.operation = false;
		},
		handleBrush(){
			let _this = this;
			console.log(_this.orderParams);
			_this.editLoadingA = true;

		},
		dialogClose(){
			this.successTip = false;
		},
		submitForm: function () {
			let _this = this;
			_this.$refs.dataForm.validate((valid) => {
				if (valid) {
					// _this.$confirm('确认提交吗？', '提示', {}).then(() => {
						_this.editLoading = true;
						_this.formParams = {
							id:_this.working.id,
							workingNumber:_this.working.workingNumber,
							productionProcessesName:_this.working.productionProcessesName,
							materialName:_this.working.materialName,
							materialCode:_this.working.materialCode,
							specifications:_this.working.specifications,
							planQuantity:_this.working.planQuantity,
							machine:_this.working.machine,
							name:_this.working.name,
							jobBookingQuantity:_this.dataForm.num,
							mobile:localStorage.getItem('mobile'),
							groupId:localStorage.getItem('groupId')
						}
						$.ajax({
							type:'POST',
							url:'/xaj/workingOrder/bookingJob',
							data:_this.formParams,
							success:function(res){
								console.log(res);
								_this.findPage();
								// this.$message({ message: '操作成功', type: 'success' })
								_this.dialogVisible = false;
								_this.editLoading = false;
								_this.$refs['dataForm'].resetFields();
							}
						})
					// })
				}
			})
		},
		showPushButton(item){
			// console.log(item);
			if(item.progress!=100 && item.status!=0){
				return true;
			}
		},
		showProcessButton(item){
			// console.log(item);
			// if(item.machine!=null){
			// 	if(item.machine.indexOf('注塑机')!=-1){
			// 		// console.log(item.machine);
			// 		return true;
			// 	}
			// }
			if(item.productionProcessesName!=null){
				if(item.productionProcessesName == "注射成型"){
					// console.log(item.productionProcessesName);
					return true;
				}
			}
		},
		clear(){
			let _this = this;
			_this.dataForm.num = '';
		}
	},
	components:{
		SmallHead
	}
}
</script>
<style>
	ul,p,h1,h2,h3,h4{
		margin:0;
		padding:0;
	}
	li{
		list-style: none;
		margin:0;
	}
	.check-order{
		background-color: #EEEDED;
		padding:16px 11px;
	}
	.check-order .main-container{
		
	}
	.piece{
		float: left;
		width: calc(33.33% - 10px);
		margin-right: 15px;
		margin-bottom: 16px;
		background-color: #fff;
		height: 210px;
		padding:10px 12px;
		box-sizing: border-box;
	}
	.piece:nth-child(3n){
		margin-right: 0;
	}
	.section-one{
		margin-bottom: 7px;
	}
	.code{
		float: left;
		line-height: 24px;
		font-size: 12px;
		color: #757474;
		font-family: 'Roboto';
	}
	.status{
		float: right;
		border:1px solid #D9D7D7;
		border-radius: 10px;
		width: 70px;
		font-size: 14px;
		height: 25px;
		line-height: 25px;
		text-align: center;
	}
	.status-producing{
		color: #259B24;
		border-color: #259B24;
	}
	.status-get{
		color: #FF9800;
		border-color: #FF9800;
	}
	.status-push{
		color: #3F51B5;
		border-color: #3F51B5;
	}
	.status-lock{
		color: #E51C23;
		border-color: #E51C23;
	}
	.status-finish{
		color: #605E5E;
		border-color: #605E5E;
	}
	.title{
		font-size: 16px;
		color: #000;
		font-weight: normal;
		font-family: 'Roboto';
		text-align: left;
		margin-bottom: 5px;
	}
	.section-two{
		margin-bottom: 7px;
	}
	.detail{
		float: left;
		width: calc(100% - 83px);
	}
	.detail p{
		font-size: 12px;
		color: #757474;
		text-align: left;
		font-family: 'Roboto';
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.detail p span{
		font-size: 16px;
		color: #000;
	}
	.detail-chart{
		float: left;
		width: 83px;
		height: 83px;
	}
	.btn-group{
		display: flex;
		justify-content: flex-end;
	}
	.btn-group button{
		min-width: calc(25% - 3.75px);
		text-align: center;
		padding:12px 5px;
	}
	.btn-group .el-button+.el-button{
		margin-left: 5px;
	}
	.btn-group .success-unfill{
		border-color:#009688;
		color: #009688;
	}
	.btn-group .success-fill{
		border-color: #009688;
		background-color: #009688;
		color: #fff;
	}
	.btn-group .primary-fill{
		border-color: #3F51B5;
		background-color: #3F51B5;
		color: #fff;
	}
	.el-dialog__header{
	  padding:7px 8px 5px 11px;
	  height: 20px;
	  line-height: 20px;
	  text-align: left;
	  background-color:#009688;
	}
	.el-dialog__title{
	  font-size: 18px;
	  line-height: 20px;
	  color: #fff;
	  font-family: 'SourceHanSansSC-regular';
	}
	.el-dialog__headerbtn{
	  top: 7px;
	  font-size: 20px;
	}
	.el-dialog--center .el-dialog__body{
		padding:12px 12px 15px;
	}
	.el-input.is-disabled .el-input__inner{
		color: #1989fa;
	}
	.el-dialog__headerbtn .el-dialog__close{
	  color: #fff;
	}
	.el-dialog__headerbtn:focus .el-dialog__close, .el-dialog__headerbtn:hover .el-dialog__close{
	  color: #fff;
	}
	.sub-title{
	  font-size: 16px;
	  color: #000;
	  font-family: 'SourceHanSansSC-regular';
	  margin-bottom:8px;
	}
	.demo-form-inline{
	  padding-top:11px;
	  border:1px solid #bbb;
	  margin-bottom:10px;
	}
	.cancel-button{
	  width: 40%;
	  height: 60px;
	  background: #D0CFCF;
	  color: #000;
	  border-color: #D0CFCF;
	  font-size: 20px;
	  font-family: 'Microsoft Yahei';
	}
	.cancel-button:focus, .cancel-button:hover{
	  background: #D0CFCF;
	  color: #000;
	  border-color: #D0CFCF;
	}
	.define-button{
	  width: 40%;
	  height: 60px;
	  background: #009688;
	  color: #fff;
	  border-color: #009688;
	  font-size: 20px;
	  font-family: 'Microsoft Yahei';
	}
	.define-button:focus, .define-button:hover{
	  background: #009688;
	  color: #fff;
	  border-color: #009688;
	}
	.platformDialog .inputLength .el-input{
		width: 32%;
	}
	.platformDialog .get-title{
		font-size: 28px;
		color: #101010;
		font-family: 'SourceHanSansSC-regular';
		font-weight: normal;
		text-align: center;
		margin-top: 60px;
		margin-bottom: 60px;
	}
	.platformDialog .get-card{
		display: block;
		font-size: 14px;
		color: #101010;
		font-family: 'Roboto';
		height: 54px;
		width: 239px;
		margin:16px auto 138px;
		border-color: #616262;
	}
	.platformDialog .success-icon{
		font-size: 60px;
		width: 72px;
		display: block;
		color: #259B24;
		margin:11px auto 137px;
	}
	.platformDialogB .header p{
		float: left;
		margin-right: 32px;
		font-size: 16px;
		color: #424242;
		font-family: 'Roboto';
	}
	.platformDialogB .header p:last-child{
		margin-right: 0;
	}
	.platformDialogB .header p span{
		font-size: 14px;
		color: #000;
		font-weight: bold;
	}
	.platformDialogC .header p{
		float: left;
		margin-right: 32px;
		font-size: 16px;
		color: #424242;
		font-family: 'Roboto';
	}
	.platformDialogC .header p:last-child{
		margin-right: 0;
	}
	.platformDialogC .header p span{
		font-size: 14px;
		color: #000;
		font-weight: bold;
	}
	.platformDialogB .tech-body{
		border:1px solid #BBB;
		margin-top:10px;
		padding:5px 17px 13px;
		height: 400px;
		overflow-x: hidden;
	}
	.platformDialogB .table-mode{
		float: left;
		margin-bottom:12px;
		width: 100%;
	}
	.platformDialogB .table-mode .head li{
		float: left;
		min-width: 66px;
		line-height: 24px;
		font-size: 16px;
		color: #101010;
		font-family: 'SourceHanSansSC-regular';
		text-align: left;
		margin-right: 10px;
	}
	.platformDialogB .table-mode .head li:last-child{
		margin-right: 0;
	}
	.platformDialogB .table-mode ul.body{
		display: flex;
		justify-content: flex-start;
	}
	.platformDialogB .table-mode .body li{
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
	.platformDialogB .table-mode .body li:last-child{
		margin-right: 0;
	}
	.platformDialogB .table-temperature{
		float: left;
		margin-bottom:20px;
		width: 100%;
	}
	.platformDialogB .table-temperature .table-temperature-head{
		float: left;
	}
	.platformDialogB .table-temperature .table-temperature-head div{
		min-width: 56px;
		line-height: 32px;
		font-size: 18px;
		color: #080808;
		font-family: 'Roboto';
		text-align: center;
		margin-right: 3px;
		margin-bottom: 3px;
	}
	.platformDialogB .table-temperature .table-temperature-head div img{
		width: 15px;
		height: 30px;
		display: block;
		margin:0 auto;
	}
	.platformDialogB .table-temperature .table-temperature-head div:first-child{
		line-height: 30px;
		height: 30px;
		margin-bottom: 0;
	}
	.platformDialogB .table-temperature .table-temperature-head div:last-child{
		margin-bottom: 0;
	}
	.platformDialogB .table-temperature .table-temperature-body{
		float: left;
	}
	.platformDialogB .table-temperature ul.head{
		display: flex;
		align-items: flex-end;
		height: 30px;
	}
	.platformDialogB .table-temperature .head li{
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
	.platformDialogB .table-temperature .head li img{
		width: 15px;
		height: 30px;
		display: block;
		margin:0 auto;
	}
	.platformDialogB .table-temperature .head li:last-child{
		margin-right: 0;
	}
	.platformDialogB .table-temperature ul.body{
		display: flex;
		justify-content: center;
	}
	.platformDialogB .table-temperature .body li{
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
	.platformDialogB .table-temperature .body li:last-child{
		margin-right: 0;
	}
	.platformDialogB .table-group .table-example{
		float: left;
		margin-bottom: 18px;
		margin-right: 8px;
	}
	.platformDialogB .table-group .table-example .table-example-head{
		float: left;
	}
	.platformDialogB .table-group .table-example .table-example-head div{
		min-width: 46px;
		line-height: 32px;
		font-size: 18px;
		color: #080808;
		font-family: 'Roboto';
		text-align: center;
		margin-right: 3px;
		margin-bottom: 3px;
	}
	.platformDialogB .table-group .table-example .table-example-head div img{
		width: 25px;
		height: 25px;
		display: block;
		margin:0 auto;
	}
	.platformDialogB .table-group .table-example .table-example-head div:first-child{
		line-height: 30px;
		height: 30px;
		margin-bottom: 0;
	}
	.platformDialogB .table-group .table-example .table-example-head div:last-child{
		margin-bottom: 0;
	}
	.platformDialogB .table-group .table-example .table-example-body{
		float: left;
	}
	.platformDialogB .table-group .table-example ul.head{
		display: flex;
		align-items: flex-end;
		height: 30px;
	}
	.platformDialogB .table-group .table-example .head li{
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
	.platformDialogB .table-group .table-example .head li img{
		width: 30px;
		height: 30px;
		display: block;
		margin:0 auto;
	}
	.platformDialogB .table-group .table-example .head li:last-child{
		margin-right: 0;
	}
	.platformDialogB .table-group .table-example ul.body{
		display: flex;
		justify-content: center;
		margin-bottom: 3px;
	}
	.platformDialogB .table-group .table-example ul.body:last-child{
		margin-bottom: 0;
	}
	.platformDialogB .table-group .table-example .body li{
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
	.platformDialogB .table-group .table-example .body li:last-child{
		margin-right: 0;
	}
	.program_icon{
		float: left;
		min-width:160px;
		text-align: center;
		height: 60px;
		line-height: 60px;
		color: #080808;
		font-size: 20px;
		font-family: 'Roboto';
		font-weight: 600;
		background-color: #C1CAF9;
	}
	.program_txt{
		height: 410px;
		border:1px solid #BBB;
		padding:10px;
		box-sizing: border-box;
		color: #080808;
		font-size: 14px;
		font-family: 'Roboto';
		text-align: left;
		overflow-x: hidden;
		text-overflow: ellipsis;
	}
	.parameter .cell{
	    height: 40px;
	    line-height: 40px;
	    white-space: nowrap;
	}
</style>