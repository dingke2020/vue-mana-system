<template>
  <div class="page-container">
	<!--工具栏-->
	<div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
		<el-form :inline="true" :model="filters" :size="size">
			<el-form-item>
				<el-button size="medium" @click="handleAdd" :style="{'background-color':themeColor,'color':'#fff','border-color':themeColor}">新增</el-button>
			</el-form-item>
			<el-form-item>
				<el-button size="medium" @click="handleImport" :style="{'background-color':themeColor,'color':'#fff','border-color':themeColor}">EXECL导入</el-button>
			</el-form-item>
		</el-form>
	</div>
	<div class="toolbar" style="float:right;padding-top:10px;padding-right:15px;">
		<el-form :inline="true" :size="size">
			<el-form-item label="" style="width:150px;" v-show="isRole">
	          <el-select v-model="group" size="medium" placeholder="请选择部门">
	            <el-option v-for="(item,index) in departments" :label="item.label" :value="item.value" :key="index"></el-option>
	          </el-select>
	        </el-form-item>
			<el-form-item style="width:300px;">
				<!-- <el-col :span="11">
			      <el-date-picker type="date" placeholder="起始时间" v-model="form.date1" style="width: 100%;" size="medium" :picker-options="pickerOptions0" :clearable="false"></el-date-picker>
			    </el-col>
			    <el-col class="line" :span="2" style="color:#BBBBBB">—</el-col>
			    <el-col :span="11">
			      <el-date-picker type="date" placeholder="结束时间" v-model="form.date2" style="width: 100%;" size="medium" :picker-options="pickerOptions1" :clearable="false"></el-date-picker>
			    </el-col> -->
			    <el-date-picker size="medium" v-model="dateArr" type="daterange" range-separator="—" start-placeholder="起始时间" end-placeholder="结束时间"></el-date-picker>
			</el-form-item>
			<el-form-item style="width:120px;">
				<el-select v-model="select" size="medium" placeholder="所有状态">
			      <el-option label="未派单" value="0"></el-option>
			      <el-option label="未投产" value="1"></el-option>
			      <el-option label="生产中" value="2"></el-option>
			      <el-option label="已完工" value="3"></el-option>
			      <el-option label="已锁定" value="4"></el-option>
			    </el-select>
			</el-form-item>
			<el-form-item>
				<!-- <el-input v-model="filters.name" prefix-icon="iconfont icon-ali-search" size="medium" style="color:#101010" placeholder="请输入物料名称或编码"></el-input> -->
				<el-autocomplete  prefix-icon="iconfont icon-ali-search" size="medium" style="color:#101010" popper-class="auto-select" v-model="dataForm.material2" :fetch-suggestions="querySearch" placeholder="请输入物料名称或编码" :trigger-on-focus="false" @select="handleSelect2" clearable></el-autocomplete>
			</el-form-item>
			<el-form-item>
				<el-button size="medium" @click="searchPage()" :style="{'background-color':themeColor,'color':'#fff','border-color':themeColor}">查询</el-button>
			</el-form-item>
		</el-form>
		<!--表格显示列界面-->
		
	</div>
	<!--表格内容栏-->
	<Task-table :height="tableHeight" :data="pageResult" :columns="filterColumns" :rowstatus="tableRowClassName" @handleDelete="handleDelete" @handleEdit="handleEdit" :rowA="rowA" :rowB="rowB" :rowC="rowC" :text="text" @handle-lock="handleLock" @findPage="findPage">
	</Task-table>
	<!--新增编辑界面-->
	<el-dialog :title="operation?'新增':'修改'" width="50%" :visible.sync="dialogVisible" custom-class="dialogTask" center>
		<el-form :model="dataForm" label-width="110px" :rules="dataFormRules" ref="dataForm" :size="size"
			label-position="right">
			<el-form-item label="生产任务单" prop="missionNumber" class="inputLength">
				<el-input v-model="dataForm.missionNumber" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="生产物料" prop="material" class="inputLengthA">
				<el-autocomplete popper-class="auto-select" v-model="dataForm.material" :fetch-suggestions="querySearch" placeholder="请输入内容" :trigger-on-focus="false" @select="handleSelect" clearable></el-autocomplete>
			</el-form-item>
			<el-form :inline="true" label-width="110px" class="demo-form-inline" :model="materialForm" ref="materialForm">
				<el-form-item label="物料名称" prop="name">
					<el-input id="materialName" v-model="materialForm.name" :disabled="true"></el-input>
				</el-form-item>
				<el-form-item label="物料编码" prop="code">
					<el-input id="materialCode" v-model="materialForm.code" :disabled="true"></el-input>
				</el-form-item>
				<el-form-item label="规格型号" prop="type">
					<el-input id="materialType" v-model="materialForm.type" :disabled="true"></el-input>
				</el-form-item>
			</el-form>
			<el-form-item label="计划生产量" prop="planQuantity" class="inputLength">
				<el-input v-model="dataForm.planQuantity" auto-complete="off"></el-input>
			</el-form-item>
			<el-form :inline="true" label-width="110px" :model="refForm" :rules="refFormRules" ref="refForm">
				<el-form-item label="计划投产时间" prop="startTime">
					<el-date-picker type="date" placeholder="起始时间" v-model="refForm.startTime" style="width: 88%;" size="medium" :picker-options="pickerOptionsA" :clearable="false"></el-date-picker>
				</el-form-item>
				<el-form-item label="计划完工时间" prop="endTime">
					<el-date-picker type="date" placeholder="结束时间" v-model="refForm.endTime" style="width: 88%;" size="medium" :picker-options="pickerOptionsB" :clearable="false"></el-date-picker>
				</el-form-item>
			</el-form>
			
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button size="medium" @click.native="dialogVisible = false" class="cancel-button">取消</el-button>
			<el-button size="medium" type="primary" @click.native="submitForm" :loading="editLoading" class="define-button">确定</el-button>
		</div>
	</el-dialog>
	<!--锁定界面-->
	<el-dialog title="确认" width="50%" :visible.sync="dialogVisibleB" center>
      <h4 class="lockTip"><i class="el-icon-warning"></i>锁定任务单前，请确认该任务单下所有工单已完成阶段报工！</h4>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click.native="dialogVisibleB = false" class="cancel-button">取消</el-button>
        <el-button size="medium" type="primary" @click.native="submitFormLock" :loading="editLoading" class="define-button">确认锁定</el-button>
      </div>
    </el-dialog>
    <!--导入界面-->
	<el-dialog title="导入" width="50%" :visible.sync="dialogVisibleC" custom-class="dialogTask" center>
		<el-form label-width="110px" label-position="right" :size="size">
			<el-form-item style="margin-right:80px;">
				<el-upload :action="fileUrl" :on-success="handleSuccess" :on-error="handleError" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel" :limit="1" :on-exceed="handleExceed" :before-upload="beforeUpload" :on-change="onChange" style="padding-top:90px;">
					<div slot="tip" class="el-upload__tip tip_spec" :class="isSuccess?'success':'error'">{{tips}}</div>
					<el-button size="medium">点击导入</el-button>
					<div slot="tip" class="el-upload__tip">说明：导入文件类型必须为execl格式，您可以先点击下载模板 <a :href="downloadUrl" class="downloadModal">下载模板</a></div>
				</el-upload>
			</el-form-item>
		</el-form>
	</el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import TaskTable from "@/views/Core/TaskTable"
import TableColumnFilterDialog from "@/views/Core/TableColumnFilterDialog"
import { format } from "@/utils/datetime"
import axios from 'axios'
export default {
	components:{
		TaskTable,
		TableColumnFilterDialog
	},
	data() {
		var checkMissionNumber = (rule, value, callback) => {
			if(!value){
				return callback(new Error('请输入任务单号'));
			}
			var params = {
				missionNumber:value,
				groupId: localStorage.getItem('groupId')
			}
			if(value == this.initNum){
				console.log("原任务单号："+this.initNum)
				callback();
			}else{
				$.ajax({
					type:'GET',
					url:'/xaj/mission/checkRepeat',
					data:params,
					success:function(data){
						if(data.status==true){
							callback();
						}else{
							callback(new Error(data.msg));
						}
					}
				})
			}
	    };
		return {
			size: 'small',
			isRole:false,
			tableHeight:null,
			form: {
				date1: '',
				date2: ''
			},
			dateArr:[],
			select:'',
			filters: {
				name: ''
			},
			columns: [],
			text:[],
			rowA:[],
			rowB:[],
			rowC:[],
			filterColumns: [],
			pageRequest: { groupId: '',currPage: 1, pageSize: 10 },
			pageParams: { groupId: '',currPage: 1, pageSize: 10 },
			pageResult: {},
			operation: false, // true:新增, false:编辑
			dialogVisible: false, // 新增编辑界面是否显示
			dialogVisibleB: false, // 确认界面是否显示
			dialogVisibleC: false, // 导入界面是否显示
			editLoading: false,
			dataFormRules: {
				name: [
					{ required: true, message: '请输入用户名', trigger: 'blur' }
				],
				missionNumber: [
					{ required: true, validator:checkMissionNumber, trigger:'blur'}
				],
				material: [
					{ required: true, message: '请输入物料名称或物料编码', trigger: 'blur' }
				],
				planQuantity: [
					{ required: true, message: '请输入数量', trigger: 'blur' }
				],
				
				// file: [
				// 	{validator:validatePass, trigger:'change' }
				// ]
			},
			refFormRules:{
				startTime: [
					{ required: true, message: '请输入投产时间', trigger: 'blur' }
				],
				endTime: [
					{ required: true, message: '请输入完工时间', trigger: 'blur' }
				]
			},
			// 新增编辑界面数据
			formParams:{},
			dataForm: {
				material:'',
				planQuantity:'',
				missionNumber:'',
				material2:''
			},
			materialForm:{
				name:'',
				code:'',
				type:''
			},
			materialForm2:{
				name:'',
				code:'',
				type:''
			},
			refForm:{
				startTime:'',
				endTime:''
			},
			deptData: [],
			deptTreeProps: {
				label: 'name',
				children: 'children'
			},
			roles: [],
			pickerOptions0:{
				disabledDate:(time)=>{
					if(this.form.date2 != ""){
						return time.getTime()>this.form.date2;
					}
				}
			},
			pickerOptions1:{
				disabledDate:(time)=>{
					return time.getTime()<this.form.date1;
				}
			},
			pickerOptionsA:{
				disabledDate:(time)=>{
					if(this.refForm.endTime != ""){
						return time.getTime()>this.refForm.endTime;
					}
				}
			},
			pickerOptionsB:{
				disabledDate:(time)=>{
					return time.getTime()<this.refForm.startTime;
				}
			},
			fileList:[{
				name:'food.jpeg',
				url:'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
			}],
			isSuccess:true,
			tips:'',
			materialAll:[],
			material:{},
			lockId:'',
			lockStatus:'',
			group:'',
			departments:[
		        {value:17,label:'金工车间'},
		        {value:18,label:'注塑车间'},
		        {value:20,label:'缠绕车间'}
	      	],
			downloadUrl:'',
			fileUrl:'',
			initNum:'',
			id:''
		}
		
	},
	computed:{
	    ...mapState({
	      themeColor: state=>state.app.themeColor,
	      collapse: state=>state.app.collapse
	    })
	},
	methods: {
		// 获取分页数据
		findPage: function (data) {
			console.log(data);
			let _this = this;
			// console.log("haha");
			if(data !== null) {
				data.pageRequest.status = _this.select;
				data.pageRequest.nameCode = _this.dataForm.material2;
				data.pageRequest.startTime = _this.dateArr[0];
				data.pageRequest.endTime = _this.dateArr[1];
				data.pageRequest.gid = _this.group;
				_this.pageRequest = data.pageRequest;
			}

			// this.pageParams.columnFilters = {name: {name:'name', value:this.filters.name}}
			//这是不调接口的
			_this.$api.task.findPage().then((res) => {
				// 加载列表数据
				console.log(res);
				var newArray = res.data.data.data;
				newArray.forEach(function(value,index){
					switch(value.status){
						case 0:
							value.status = '未派单';
							break;
						case 1:
							value.status = '未投产';
							break;
						case 2:
							value.status = '生产中';
							break;
						case 3:
							value.status = '已完工';
							break;
						case 4:
							value.status = '已锁定';
					}
					if(value.isLock == 1){
						value.status = '已锁定';
					}
					// if(value.id<10){
					// 	value.id = '0'+value.id;
					// }
					if(value.progress!=""){
						value.progress = value.progress+'%';
					}
				})
				_this.pageResult = res.data.data;
			}).then(data!=null?data.callback:'')
			$.get('/xaj/mission/searchByCondition',_this.pageRequest).then((res) => {
				console.log(res);
				var newArray = res.data;
				newArray.forEach(function(value,index){
					switch(value.status){
						case 0:
							value.status = '未派单';
							break;
						case 1:
							value.status = '未投产';
							break;
						case 2:
							value.status = '生产中';
							break;
						case 3:
							value.status = '已完工';
							break;
						case 4:
							value.status = '已锁定';
					}
					if(value.isLock == 1){
						value.status = '已锁定';
					}
					// if(value.id<10){
					// 	value.id = '0'+value.id;
					// }
					if(value.progress!=""){
						value.progress = value.progress+'%';
					}
				})
				_this.pageResult = res;
				// _this.pageRequest = {currPage: 1, pageSize: 10 ,groupId: 16};
				console.log(_this.pageResult);
				console.log(_this.pageParams.currPage,_this.pageParams.pageSize);
			}).then(data!=null?data.callback:'')
		},
		// 查询分页数据
		searchPage: function () {
			let _this = this;
			console.log(_this.dateArr,_this.select,_this.materialForm2.code,_this.dataForm.material2);
			if(_this.dateArr == null){
				_this.dateArr = [];
			}
			if(_this.dataForm.material2==""){
				_this.materialForm2.code = "";
			}
			_this.pageParams = {currPage: 1, pageSize: 10 ,roleId: parseInt(localStorage.getItem('roleId')),groupId: parseInt(localStorage.getItem('groupId')),startTime: _this.dateArr[0],endTime: _this.dateArr[1],status: _this.select,nameCode: _this.dataForm.material2,gid:_this.group};
			_this.pageRequest.pageSize = 10;
      		_this.pageRequest.currPage = 1;
			// this.pageParams.columnFilters = {name: {name:'name', value:this.filters.name}}
			$.get('/xaj/mission/searchByCondition',_this.pageParams).then((res) => {
				console.log(res);
				var newArray = res.data;
				newArray.forEach(function(value,index){
					switch(value.status){
						case 0:
							value.status = '未派单';
							break;
						case 1:
							value.status = '未投产';
							break;
						case 2:
							value.status = '生产中';
							break;
						case 3:
							value.status = '已完工';
							break;
						case 4:
							value.status = '已锁定';
					}
					if(value.isLock == 1){
						value.status = '已锁定';
					}
					// if(value.id<10){
					// 	value.id = '0'+value.id;
					// }
					if(value.progress!=""){
						value.progress = value.progress+'%';
					}
				})
				_this.pageResult = res;
				console.log(_this.pageResult);
				console.log(_this.pageParams.currPage,_this.pageParams.pageSize);
			}).then()
		},
		// 加载用户角色信息
		findUserRoles: function () {
			this.$api.role.findAll().then((res) => {
				// 加载角色集合
				this.roles = res.data	
			})
		},
		// 批量删除
		handleDelete: function (data) {
			console.log(data);
			let _this = this;
			var params = {id:data.params[0].id,groupId:parseInt(localStorage.getItem('groupId'))};
			// this.$api.task.batchDelete(data.params).then(data!=null?data.callback:'')
			$.ajax({
				type:'POST',
				url:'/xaj/mission/delete',
				data:params,
				success:function(res){
					console.log(res);
					// _this.dialogVisible = false;
					_this.editLoading = false;
				}
			}).then(data!=null?data.callback:'')
			// _this.findPage(null);
		},
		// 显示新增界面
		handleAdd: function () {
			this.dialogVisible = true
			this.operation = true
			this.dataForm = Object.assign({})
			this.materialForm = Object.assign({})
			this.refForm = Object.assign({})
		},
		//显示编辑界面
		handleEdit: function(params) {
			let _this = this;
			_this.dialogVisible = true;
			_this.operation = false;
			console.log(params);
			_this.dataForm = {
				missionNumber:params.row.missionNumber,
				material:params.row.material,
				planQuantity:params.row.planQuantity
			}
			_this.materialForm = {
				name:params.row.materialName,
				code:params.row.materialCode,
				type:params.row.specifications
			}
			// _this.refForm = {
			// 	startTime:params.row.startTime,
			// 	endTime:params.row.endTime
			// }
			_this.initNum = params.row.missionNumber;
			_this.id = params.row.id;
		},
		// 显示导入界面
		handleImport: function () {
			let _this = this;
			// var baseUrl = 'http://192.168.101.252:8080';
			var baseUrl = axios.defaults.baseURL;
			console.log(baseUrl);
			var groupId = parseInt(localStorage.getItem('groupId'));
			var userName = localStorage.getItem('name');
			_this.dialogVisibleC = true;
			_this.downloadUrl = baseUrl+'/xaj/mission/download';
			_this.fileUrl = baseUrl+'/xaj/mission/import?groupId='+groupId+'&userName='+userName;
			// this.dataForm = Object.assign({}, params.row)
			// let userRoles = []
			// for(let i=0,len=params.row.userRoles.length; i<len; i++) {
			// 	userRoles.push(params.row.userRoles[i].roleId)
			// }
			// this.dataForm.userRoles = userRoles
		},
		// 编辑
		submitForm: function () {
			let _this = this;
			if(_this.operation){
			_this.$refs.dataForm.validate((valid) => {
				if (valid) {
					_this.$refs.refForm.validate((validA) =>{
					if(validA){
					// _this.$confirm('确认提交吗？', '提示', {}).then(() => {
						_this.editLoading = true;
						_this.formParams = {
							groupId:parseInt(localStorage.getItem('groupId')),
							missionNumber:_this.dataForm.missionNumber,
							material:_this.dataForm.material,
							planQuantity:_this.dataForm.planQuantity,
							materialName:$('#materialName').val(),
							materialCode:$('#materialCode').val(),
							specifications:$('#materialType').val(),
							startTime:_this.refForm.startTime,
							endTime:_this.refForm.endTime,
							name:localStorage.getItem('name')
						}
						console.log(_this.formParams,_this.dataForm.missionNumber,$('#materialCode').val());
						// let params = Object.assign({}, _this.dataForm);
						// console.log(params);
						// let userRoles = []
						// for(let i=0,len=params.userRoles.length; i<len; i++) {
						// 	let userRole = {
						// 		userId: params.id,
						// 		roleId: params.userRoles[i]
						// 	}
						// 	userRoles.push(userRole)
						// }
						// params.userRoles = userRoles
						// this.$api.task.save(_this.dataForm).then((res) => {
						// 	this.editLoading = false
						// 	if(res.code == 200) {
						// 		this.$message({ message: '操作成功', type: 'success' })
						// 		this.dialogVisible = false
						// 		// this.$refs['dataForm'].resetFields()
						// 	} else {
						// 		this.$message({message: '操作失败, ' + res.msg, type: 'error'})
						// 	}
						// 	this.findPage(null)
						// })
						$.ajax({
							type:'POST',
							url:'/xaj/mission/addMission',
							data:_this.formParams,
							success:function(data){
								console.log(data);
								// this.$message({ message: '操作成功', type: 'success' })
								_this.dialogVisible = false;
								_this.editLoading = false;
								_this.findPage(null);
								_this.$refs['dataForm'].resetFields();
								_this.$refs['materialForm'].resetFields();
								_this.$refs['refForm'].resetFields();
								if(data.status==true){
                    				_this.$message({message: '新增成功', type: 'success'})
                  				}
							}
						})
						
					// })
				}
				})
				}
			})
			}else{
				_this.$refs.dataForm.validate((valid) => {
					if (valid) {
						_this.$refs.refForm.validate((validA) =>{
							if(validA){
								_this.editLoading = true;
								_this.formParams = {
									groupId:parseInt(localStorage.getItem('groupId')),
									missionNumber:_this.dataForm.missionNumber,
									material:_this.dataForm.material,
									planQuantity:_this.dataForm.planQuantity,
									materialName:$('#materialName').val(),
									materialCode:$('#materialCode').val(),
									specifications:$('#materialType').val(),
									startTime:_this.refForm.startTime,
									endTime:_this.refForm.endTime,
									name:localStorage.getItem('name'),
									id:_this.id
								}
								console.log(_this.formParams,_this.dataForm.missionNumber,$('#materialCode').val());
								$.ajax({
									type:'POST',
									url:'/xaj/mission/updateMission',
									data:_this.formParams,
									success:function(data){
										console.log(data);
										_this.dialogVisible = false;
										_this.editLoading = false;
										_this.findPage(null);
										_this.$refs['dataForm'].resetFields();
										_this.$refs['materialForm'].resetFields();
										_this.$refs['refForm'].resetFields();
										if(data.status==true){
		                    				_this.$message({message: '修改成功', type: 'success'})
		                  				}
									}
								})
							}
						})
					}
				})
			}
		},
		submitFormLock: function(){
			let _this = this;
			var params = {id:_this.lockId,lockStatus:_this.lockStatus};
			$.ajax({
				type:'POST',
				url:'/xaj/mission/isLockMission',
				data:params,
				success:function(res){
					console.log(res);
					// this.$message({ message: '操作成功', type: 'success' })
					_this.dialogVisibleB = false;
					_this.editLoading = false;
					// _this.$refs['dataForm'].resetFields()
				}
			})
			_this.findPage(null);
		},
		// 获取部门列表
		// findDeptTree: function () {
		// 	this.$api.dept.findDeptTree().then((res) => {
		// 		this.deptData = res.data
		// 	})
		// },
		// 菜单树选中
      	deptTreeCurrentChangeHandle (data, node) {
        	this.dataForm.deptId = data.id
        	this.dataForm.deptName = data.name
		},
		// 时间格式化
      	dateFormat: function (row, column, cellValue, index){
          	return format(row[column.property])
      	},
		// 处理表格列过滤显示
      	displayFilterColumnsDialog: function () {
			this.$refs.tableColumnFilterDialog.setDialogVisible(true)
      	},
		// 处理表格列过滤显示
      	handleFilterColumns: function (data) {
			this.filterColumns = data.filterColumns
			this.$refs.tableColumnFilterDialog.setDialogVisible(false)
      	},
		// 处理表格列过滤显示
      	initColumns: function () {
			this.columns = [
				// {prop:"id",label:"序号", minWidth:50},
				{prop:"groupName", label:"部门", minWidth:80},
				{prop:"missionNumber", label:"任务单", minWidth:110},
				{prop:"materialName", label:"物料名称", minWidth:160},
				{prop:"materialCode", label:"物料编码", minWidth:100},
				{prop:"specifications", label:"规格型号", minWidth:90},
				{prop:"planQuantity", label:"计划生产量", minWidth:100},
				{prop:"startTime", label:"计划开始时间", minWidth:110},
				{prop:"endTime", label:"计划完成时间", minWidth:110},
				{prop:"updateTime", label:"新增时间", minWidth:120}, 
				{prop:"createName",label:"下单人",minWidth:70},
				{prop:"status", label:"状态", minWidth:70},
				{prop:"progress",label:"进度",minWidth:70},
				{prop:"productionTime",label:"生产用时",minWidth:80}
			]
			this.filterColumns = JSON.parse(JSON.stringify(this.columns));
      	},
		tableRowClassName({row, rowIndex}){
			var length = $(".el-table .el-table__body-wrapper tbody tr:eq(0) td").length - 1;
	        if(row.status == "生产中"){
	        	$(".el-table .el-table__body-wrapper tbody tr:eq("+rowIndex+") td:eq("+(length-3)+")").css({"color":"#259B24"});
	        	if(this.rowA.indexOf(rowIndex)<0){
	        		this.rowA.push(rowIndex);
	        	}
	        	if(this.text.indexOf(rowIndex)<0){
	        		this.text.push(rowIndex);
	        	}
	        	if(this.rowB.indexOf(rowIndex)>-1){
	        		this.rowB.splice(this.rowB.indexOf(rowIndex),1);
	        	}
	        	if(this.rowC.indexOf(rowIndex)>-1){
	        		this.rowC.splice(this.rowC.indexOf(rowIndex),1);
	        	}
	        }else if(row.status == "已锁定"){
	        	$(".el-table .el-table__body-wrapper tbody tr:eq("+rowIndex+") td:eq("+(length-3)+")").css({"color":"#E51C23"});
	        	if(this.rowA.indexOf(rowIndex)<0){
	        		this.rowA.push(rowIndex);
	        	}
	        	if(this.text.indexOf(rowIndex)>-1){
	        		this.text.splice(this.text.indexOf(rowIndex),1)
	        	}
	        	if(this.rowB.indexOf(rowIndex)>-1){
	        		this.rowB.splice(this.rowB.indexOf(rowIndex),1);
	        	}
	        	if(this.rowC.indexOf(rowIndex)>-1){
	        		this.rowC.splice(this.rowC.indexOf(rowIndex),1);
	        	}
	        }else if(row.status == "已完工"){
	        	$(".el-table .el-table__body-wrapper tbody tr:eq("+rowIndex+") td:eq("+(length-3)+")").css({"color":"#605E5E"});
	        	if(this.rowA.indexOf(rowIndex)>-1){
	        		this.rowA.splice(this.rowA.indexOf(rowIndex),1);
	        	}
	        	if(this.rowB.indexOf(rowIndex)>-1){
	        		this.rowB.splice(this.rowB.indexOf(rowIndex),1);
	        	}
	        	if(this.text.indexOf(rowIndex)>-1){
	        		this.text.splice(this.text.indexOf(rowIndex),1);
	        	}
	        	if(this.rowC.indexOf(rowIndex)>-1){
	        		this.rowC.splice(this.rowC.indexOf(rowIndex),1);
	        	}
	        	return 'success-row';
	        }else if(row.status == "未派单"){
	        	$(".el-table .el-table__body-wrapper tbody tr:eq("+rowIndex+") td:eq("+(length-3)+")").css({"color":"#FF9800"});
	        	if(this.rowA.indexOf(rowIndex)<0){
	        		this.rowA.push(rowIndex);
	        	}
	        	if(this.text.indexOf(rowIndex)<0){
	        		this.text.push(rowIndex);
	        	}
	        	if(this.rowB.indexOf(rowIndex)<0){
	        		this.rowB.push(rowIndex);
	        	}
	        	if(this.rowC.indexOf(rowIndex)<0){
	        		this.rowC.push(rowIndex);
	        	}
	        }else if(row.status == "未投产"){
	        	$(".el-table .el-table__body-wrapper tbody tr:eq("+rowIndex+") td:eq("+(length-3)+")").css({"color":"#3F51B5"});
	        	if(this.rowA.indexOf(rowIndex)<0){
	        		this.rowA.push(rowIndex);
	        	}
	        	if(this.text.indexOf(rowIndex)<0){
	        		this.text.push(rowIndex);
	        	}
	        	if(this.rowB.indexOf(rowIndex)<0){
	        		this.rowB.push(rowIndex);
	        	}
	        	if(this.rowC.indexOf(rowIndex)>-1){
	        		this.rowC.splice(this.rowC.indexOf(rowIndex),1);
	        	}
	        }
	        $(".el-table .el-table__body-wrapper tbody tr:eq("+rowIndex+") td:eq("+(length-2)+")").css({"color":"#259B24"});
	        // console.log(this.text);
	    },
	    handleSuccess(response,file,fileList){
	    	let _this = this;
	    	console.log(response);
	    	setTimeout(function(){
				_this.dialogVisibleC = false;
				_this.findPage(null);
				_this.$message({message: '导入成功', type: 'success'})
	    	},500);
	    },
	    handleError(err,file,fileList){
	    	console.log(err)
	    },
	    handleExceed(files,fileList){
	    	console.log(files)
	    },
	    beforeUpload(file){
	    	console.log(file)
	    	var filename = file.name;
	    	this.dataForm.file = filename;
	    	$("#myFile").val(filename);
	    	var filetype = filename.split(".");
	    	console.log(filetype[filetype.length-1].toLowerCase( ));
	    	if(filetype[filetype.length-1].toLowerCase( )=='xls'||filetype[filetype.length-1].toLowerCase( )=="xlsx"){
	    		this.tips="导入成功";
	    		this.isSuccess = true;
	    		return true;
	    	}else{
	    		this.tips="文件类型错误";
	    		this.isSuccess = false;
	    		// return false;
	    	}
	    },
	    onChange(file,fileList){
	    	
	    },
	    querySearch(queryString,cb){
	    	var materialAll = this.materialAll;
	    	var results = queryString ? materialAll.filter(this.createFilter(queryString)) : materialAll;
	    	//调用callback返回建议列表的数据
	    	cb(results);
	    	// console.log(results);
	    },
	    createFilter(queryString){
	    	return(materialAll) => {
	    		return(materialAll.value.toLowerCase().indexOf(queryString.toLowerCase())>-1);
	    	}
	    },
	    loadAll(){
	    	// return[
	    	// 	{value:"无油立式真空泵气缸体（WLW100-01）",name:"无油立式真空泵气缸体",code:"WLW100-01",type:"WLW-100"},
	    	// 	{value:"无油立式真空泵气缸体（WLW150-01）",name:"无油立式真空泵气缸体",code:"WLW150-01",type:"WLW-150"},
	    	// 	{value:"无油立式真空泵气缸体（WLW200-01）",name:"无油立式真空泵气缸体",code:"WLW200-01",type:"WLW-200"},
	    	// 	{value:"无油立式真空泵气缸体（WLW300-01）",name:"无油立式真空泵气缸体",code:"WLW300-01",type:"WLW-300"},
	    	// 	{value:"无油立式真空泵气缸体（WLW50-01）",name:"无油立式真空泵气缸体",code:"WLW50-01",type:"WLW-50"},
	    	// 	{value:"无油立式真空泵连杆（WLW150-6601）",name:"无油立式真空泵连杆",code:"WLW150-6601",type:"WLW-150"},
	    	// 	{value:"无油立式真空泵气缸盖(上）（WLW100-02-S）",name:"无油立式真空泵气缸盖(上）",code:"WLW100-02-S",type:"WLW-100"}
	    	// ]
	    },
	    handleSelect(item){
	    	console.log(item);
	    	this.materialForm = {name:item.name,code:item.code,type:item.type};
	    	console.log(this.materialForm);
	    	// $("#materialName").val(item.name);
	    	// $("#materialCode").val(item.code);
	    	// $("#materialType").val(item.type);
	    },
	    handleSelect2(item){
	    	console.log(item);
	    	this.materialForm2 = {name:item.name,code:item.code,type:item.type};
	    	console.log(this.materialForm2);
	    	// $("#materialName").val(item.name);
	    	// $("#materialCode").val(item.code);
	    	// $("#materialType").val(item.type);
	    },
	    handleLock:function(data){
	    	let _this = this;
	      // console.log(arr);
	      // this.lockId = arr[1].id;
	      // this.lockStatus = arr[1].isLock;
	      // this.dialogVisibleB = true;
	    	$.ajax({
				type:'POST',
				url:'/xaj/mission/isLockMission',
				data:data.params,
				success:function(res){
					console.log(res);
					// this.$message({ message: '操作成功', type: 'success' })
					// _this.dialogVisibleB = false;
					_this.editLoading = false;
					// _this.$refs['dataForm'].resetFields()
				}
			}).then(data!=null?data.callback:'')
	    }
	},
	mounted() {
		let _this = this;
		function repage(){
			var win_height = $(window).height();
			var nav_heihgt = $(".headbar").height();
			var tab_height = $(".tabs").height();
			var gap = 200;
			_this.tableHeight = win_height - nav_heihgt - tab_height - gap;
		}
		repage();
		if(parseInt(localStorage.getItem('roleId'))==1||parseInt(localStorage.getItem('roleId'))==2){
			_this.isRole = true;
		}else{
			_this.isRole = false;
		}
		// this.findDeptTree()
		_this.initColumns();
		// console.log(this.filterColumns);
		// console.log(this.rowA,this.rowB,this.text);
		setTimeout(function(){
			$.ajax({
	    		type:'GET',
	    		url:'/xaj/mission/searchMaterial',
	    		data:{
	    			groupId:localStorage.getItem('groupId')
	    		},
	    		success:function(data){
	    			var newArr = [];
		            $.each(data,function(index,value){
		              if(value!==null){
		                newArr.push(value);
		              }
		            })
	    			$.each(newArr,function(index,value){
	    				_this.materialAll.push({
	    					value:value.material,
	    					name:value.materialName,
	    					code:value.materialCode,
	    					type:value.specifications
	    				})
	    			})
	    		}
	    	})
		},500)
		
		// axios.get('/xaj/mission/searchMaterial?materialName=无油立式真空泵气缸体&groupId=16').then(function(res){
	 //    		_this.material = res.data;
	 //    		console.log(_this.material);
	 //    	})
		// console.log(_this.materialAll);
		// _this.findPage();
		// console.log(_this.pageResult);
		// var date = new Date();
		// $.ajax({
		// 	type:'POST',
		// 	url:'/xaj/mission/addMission',
		// 	data:{
		// 		groupId:16,
		// 		missionNumber:'asd',
		// 		material:'无油立式真空泵气缸体（WLW100-01）',
		// 		planQuantity:123,
		// 		materialName:"无油立式真空泵气缸体",
		// 		materialCode:"WLW100-01",
		// 		specifications:"WLW-100",
		// 		startTime:date,
		// 		endTime:date
		// 	},
		// 	success:function(res){
		// 		console.log(res);
		// 	}
		// })
	}
}
</script>

<style>
.el-input__prefix{
	color: #101010;
}
.el-input--medium .el-input__icon{
	font-size: 20px;
}
.el-date-editor .el-range__icon{
  font-size: 20px;
  color: #101010;
}
.el-table .success-row {
    color: #8e8d8d;
}
.el-dialog__header{
	padding:13px 17px 11px 22px;
	height: 36px;
	line-height: 36px;
	text-align: left;
	background-color:#009688;
}
.el-dialog__title{
	font-size: 24px;
	color: #fff;
	line-height: 36px;
	font-family: 'SourceHanSansSC-regular';
}
.el-dialog__headerbtn{
	top: 13px;
	font-size: 32px;
}
.el-dialog__headerbtn .el-dialog__close{
	color: #fff;
}
.el-dialog__headerbtn:focus .el-dialog__close, .el-dialog__headerbtn:hover .el-dialog__close{
	color: #fff;
}
.error{
	color: #e51c23;
}
.success{
	color: #009688;
}
.dialogTask .el-upload-list{
	position: absolute;
	top:0;
	padding:0px 5px 5px;
	border:1px solid #bbb;
	width: 100%;
	height: 50px;
	box-sizing: border-box;
}
.tip_spec{
	position: absolute;
	top: 50px;
	width: 100%;
}
.el-upload__tip{
	font-size: 14px;
}
.dialogTask .el-upload{
	width: 100%;
}
.dialogTask .el-upload .el-button{
	background: #009688;
	border-color: #fff;
	font-size: 28px;
	font-family: 'Microsoft Yahei';
	color: #fff;
	width: 100%;
	height: 80px;
}
.downloadModal{
	color: #009688;
	font-size: 16px;
	font-family: 'SourceHanSansSC-regular';
}
.dialogTask .inputLength .el-input{
	width: 34%;
}
/*.dialogTask .inputLengthA .el-autocomplete{
	width: 400px;
}*/
.auto-select{
	width: auto;
}
.demo-form-inline{
	padding-top:22px;
	border:1px solid #bbb;
	margin-bottom:18px;
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
.lockTip{
    font-size: 18px;
    margin:30px 0;
    color: #101010;
    font-family: 'SourceHanSansSC-regular';
    text-align: center;
}
.lockTip .el-icon-warning{
  color: #E6A23C;
  font-size: 28px;
  margin-right: 5px;
  position: relative;
  top: 3px;
}
.el-form-item__label{
  	color: #101010;
}
.auto-select{
	width: auto !important;
}
.el-date-editor--daterange.el-input__inner{
	width: 100%;
}
</style>