<template>
  <div class="page-container">
  <!--工具栏-->
  <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
    <el-form :inline="true" :model="filters" :size="size">
      <el-form-item>
        <el-button size="medium" @click="handleAdd" :style="{'background-color':themeColor,'color':'#fff','border-color':themeColor}">新增</el-button>
      </el-form-item>
    </el-form>
  </div>
  <div class="toolbar" style="float:right;padding-top:10px;padding-right:15px;">
    <el-form :inline="true" :size="size">
      <el-form-item style="width:300px;">
        <!-- <el-col :span="11">
            <el-date-picker type="date" placeholder="起始时间" v-model="form.date1" style="width: 100%;" size="medium" :picker-options="pickerOptions0"></el-date-picker>
          </el-col>
          <el-col class="line" :span="2" style="color:#BBBBBB">—</el-col>
          <el-col :span="11">
            <el-date-picker type="date" placeholder="结束时间" v-model="form.date2" style="width: 100%;" size="medium" :picker-options="pickerOptions1"></el-date-picker>
          </el-col> -->
          <el-date-picker size="medium" v-model="dateArr" type="daterange" range-separator="—" start-placeholder="起始时间" end-placeholder="结束时间"></el-date-picker>
      </el-form-item>
      <!-- <el-form-item style="width:110px;">
        <el-select v-model="device" size="medium" placeholder="设备类型">
            <el-option label="普车" value="1"></el-option>
            <el-option label="数控车床" value="2"></el-option>
            <el-option label="刨床" value="3"></el-option>
            <el-option label="铣床" value="4"></el-option>
            <el-option label="磨床" value="5"></el-option>
            <el-option label="镗床" value="6"></el-option>
          </el-select>
      </el-form-item> -->
      <el-form-item style="width:110px;">
        <el-select v-model="status" size="medium" placeholder="维修状态">
            <el-option label="待检修" value="0"></el-option>
            <el-option label="已完成" value="1"></el-option>
          </el-select>
      </el-form-item>
      <el-form-item>
        <!-- <el-input v-model="filters.name" prefix-icon="iconfont icon-ali-search" size="medium" style="color:#101010" placeholder="请输入设备名称或设备编号"></el-input> -->
        <el-autocomplete  prefix-icon="iconfont icon-ali-search" size="medium" style="color:#101010" popper-class="auto-select" v-model="dataForm.device2" :fetch-suggestions="querySearch" placeholder="请输入设备名称或设备编号" :trigger-on-focus="false" @select="handleSelect2" clearable></el-autocomplete>
      </el-form-item>
      <el-form-item>
        <el-button size="medium" @click="searchPage()" :style="{'background-color':themeColor,'color':'#fff','border-color':themeColor}">查询</el-button>
      </el-form-item>
    </el-form>
  </div>
  <!--表格内容栏-->
  <Maintenance-repair-table :height="tableHeight" :data="pageResult" :columns="filterColumns" :rowstatus="tableRowClassName" @findPage="findPage" @handleEdit="handleEdit" @handleDelete="handleDelete" @handleCheck="handleCheck" @complete="complete" :rowA="rowA" :rowB="rowB" :rowC="rowC" :rowD="rowD">
  </Maintenance-repair-table>
  <!--新增编辑界面-->
  <el-dialog :title="operation?'新增':'修改'" width="50%" :visible.sync="dialogVisible" custom-class="dialogRepair" center>
    <el-form :model="dataForm" label-width="100px" :rules="dataFormRules" ref="dataForm" :size="size"
      label-position="right">
      <el-form-item label="故障设备" prop="device">
        <el-autocomplete class="inline-input" v-model="dataForm.device" :fetch-suggestions="querySearch" placeholder="请输入内容" :trigger-on-focus="false" @select="handleSelect" clearable></el-autocomplete>
      </el-form-item>
      <el-form :inline="true" label-width="100px" class="demo-form-inline" :model="equipmentForm" ref="equipmentForm">
        <el-form-item label="设备名称" prop="name">
          <el-input id="equipmentName" v-model="equipmentForm.name" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="设备类型" prop="type">
          <el-input id="equipmentType" v-model="equipmentForm.type" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="设备编号" prop="number">
          <el-input id="equipmentNumber" v-model="equipmentForm.number" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="设备型号" prop="category">
          <el-input id="equipmentCategory" v-model="equipmentForm.category" :disabled="true"></el-input>
        </el-form-item>
      </el-form>
      <el-form-item label="故障时间" prop="time" class="inputLengthA">
        <el-date-picker v-model="dataForm.time" type="datetime" placeholder="请选择保养时间" prefix-icon="iconfont icon-ali-calendar-range" :clearable="false"></el-date-picker>
      </el-form-item>
      <div class="sub-title">故障原因</div>
      <el-form-item label-width="0" prop="failureCause">
        <el-input type="textarea" :rows="3" placeholder="请填写具体故障的原因！" v-model="dataForm.failureCause" resize="none"></el-input>
      </el-form-item>
      <div class="sub-title">解决办法</div>
      <el-form-item label-width="0" prop="solution">
        <el-input type="textarea" :rows="3" placeholder="请填写具体故障的解决办法！" v-model="dataForm.solution" resize="none"></el-input>
      </el-form-item>
      <el-form :inline="true" label-width="100px">
        <el-form-item label="维修人" class="inputLengthB" prop="repair">
          <!-- <el-select v-model="repair" placeholder="请选择维修人">
            <el-option label="童金富" value="0"></el-option>
          </el-select> -->
          <el-input v-model="dataForm.repair" placeholder="请填写维修人"></el-input>
        </el-form-item>
        <el-form-item label="验收人" class="inputLengthB" prop="acceptor">
          <!-- <el-select v-model="acceptor" placeholder="请选择验收人">
            <el-option label="陈育广" value="0"></el-option>
          </el-select> -->
          <el-input v-model="dataForm.acceptor" placeholder="请填写验收人"></el-input>
        </el-form-item>
      </el-form>
      <el-form-item label="当前状态">
        <el-radio-group v-model="radio">
          <el-radio :label="1">已完成</el-radio>
          <el-radio :label="0">待检修</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="medium" @click.native="dialogVisible = false" class="cancel-button">取消</el-button>
      <el-button size="medium" type="primary" @click.native="submitForm" :loading="editLoading" class="define-button">确定</el-button>
    </div>
  </el-dialog>
  <!--查看界面-->
  <el-dialog title="查看" width="50%" :visible.sync="dialogVisibleA" custom-class="dialogRepair" center>
    <el-form :model="refForm" label-width="100px" :rules="refFormRules" ref="refForm" :size="size"
      label-position="right">
      <!-- <el-form-item label="故障设备" prop="device">
        <el-autocomplete class="inline-input" v-model="refForm.device" :fetch-suggestions="querySearch" placeholder="请输入内容" :trigger-on-focus="false" @select="handleSelect" clearable></el-autocomplete>
      </el-form-item> -->
      <el-form :inline="true" label-width="100px" class="demo-form-inline">
        <el-form-item label="设备名称" prop="name">
          <el-input id="equipmentName" v-model="refForm.name" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="设备类型" prop="type">
          <el-input id="equipmentType" v-model="refForm.type" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="设备编号" prop="number">
          <el-input id="equipmentNumber" v-model="refForm.number" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="设备型号" prop="category">
          <el-input id="equipmentCategory" v-model="refForm.category" :disabled="true"></el-input>
        </el-form-item>
      </el-form>
      <el-form-item label="故障时间" prop="time" class="inputLengthA">
        <!-- <el-date-picker v-model="refForm.time" type="datetime" placeholder="请选择保养时间" prefix-icon="iconfont icon-ali-calendar-range" :clearable="false"></el-date-picker> -->
        <el-input v-model="refForm.time"></el-input>
      </el-form-item>
      <div class="sub-title">故障原因</div>
      <el-form-item label-width="0" prop="failureCause">
        <el-input type="textarea" :rows="3" v-model="refForm.failureCause" resize="none"></el-input>
      </el-form-item>
      <div class="sub-title">解决办法</div>
      <el-form-item label-width="0" prop="solution">
        <el-input type="textarea" :rows="3" v-model="refForm.solution" resize="none"></el-input>
      </el-form-item>
      <el-form :inline="true" label-width="100px">
        <el-form-item label="维修人" class="inputLengthB" prop="repair">
          <!-- <el-select v-model="repair" placeholder="请选择维修人">
            <el-option label="童金富" value="0"></el-option>
          </el-select> -->
          <el-input v-model="refForm.repair"></el-input>
        </el-form-item>
        <el-form-item label="验收人" class="inputLengthB" prop="acceptor">
          <!-- <el-select v-model="acceptor" placeholder="请选择验收人">
            <el-option label="陈育广" value="0"></el-option>
          </el-select> -->
          <el-input v-model="refForm.acceptor"></el-input>
        </el-form-item>
      </el-form>
      <el-form-item label="当前状态">
        {{refForm.radio}}
      </el-form-item>
    </el-form>
  </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import MaintenanceRepairTable from "@/views/Core/MaintenanceRepairTable"
import { format } from "@/utils/datetime"
export default {
  components:{
    MaintenanceRepairTable
  },
  data() {
    // var validatePass = (rule, value, callback) => {
    //  var newVal = this.dataForm.file.split(".");
   //        if (newVal[newVal.length-1] ==="docx") {
   //          callback(new Error('请输入密码'));
   //        } else {
   //          callback();
   //        }
   //    };
    return {
      size: 'small',
      tableHeight:null,
      device:'',
      status:'',
      radio:1,
      dateArr:[],
      form: {
        date1: '',
        date2: ''
      },
      filters: {
        name: ''
      },
      columns: [],
      rowA:[],
      rowB:[],
      rowC:[],
      rowD:[],
      filterColumns: [],
      pageRequest: { currPage: 1, pageSize: 10 },
      pageParams: { currPage: 1, pageSize: 10 },
      pageResult: {},
      operation: false, // true:新增, false:编辑
      dialogVisible: false, // 新增编辑界面是否显示
      editLoading: false,
      dialogVisibleA: false,
      dataFormRules: {
        name: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        device: [
          { required: true, message: '请输入设备名称或设备编号', trigger: 'blur' }
        ],
        time: [
          { required: true, message: '请选择故障时间', trigger: 'blur' }
        ]
      },
      // 新增编辑界面数据
      dataForm: {
        id: 0,
        name: '',
        password: '123456',
        deptId: 1,
        deptName: '',
        email: 'test@qq.com',
        mobile: '13889700023',
        status: 1,
        // userRoles: [],
        file:'',
        device:'',
        device2:'',
        time:'',
        planProduction:'',
        failureCause:'',
        solution:'',
        repair:'',
        acceptor:''
      },
      refForm: {
        device:'',
        name:'',
        type:'',
        number:'',
        category:'',
        time:'',
        failureCause:'',
        solution:'',
        repair:'',
        acceptor:'',
        radio:''
      },
      refFormRules:{
        name: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ]
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
          if(this.planTime.date2 != ""){
            return time.getTime()>this.planTime.date2;
          }
        }
      },
      pickerOptionsB:{
        disabledDate:(time)=>{
          return time.getTime()<this.planTime.date1;
        }
      },
      fileList:[{
        name:'food.jpeg',
        url:'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
      }],
      isSuccess:true,
      tips:'',
      planTime:{
        date1:'',
        date2:''
      },
      equipmentAll:[],
      equipmentForm:{
        name:'',
        type:'',
        number:'',
        category:''
      },
      equipmentForm2:{
        nameCode:''
      },
      equipment:{},
      addParams:{},
      completeParams:{},
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
      let _this = this;
      if(data !== null) {
        data.pageRequest.status = _this.status;
        data.pageRequest.nameCode = _this.dataForm.device2;
        data.pageRequest.startTime = _this.dateArr[0];
        data.pageRequest.endTime = _this.dateArr[1];
        _this.pageRequest = data.pageRequest
      }
      //这里是不调接口的
      _this.$api.maintenance.findRepairPage(_this.pageRequest).then((res) => {
        var repairArray = res.data.data.repair.data;
        repairArray.forEach(function(value,index){
          switch(value.status){
            case 0:
              value.status = '待检修';
              break;
            case 1:
              value.status = '已完成';
          }
          // if(value.id<10){
          //   value.id = '0'+value.id;
          // }
        })
        _this.pageResult = res.data.data.repair;
        console.log(_this.pageResult)
        // this.findUserRoles()
      }).then(data!=null?data.callback:'')
      $.get('/xaj/maintenance/searchRepairRecordList',_this.pageRequest).then((res) => {
        var repairArray = res.data;
        repairArray.forEach(function(value,index){
          switch(value.status){
            case 0:
              value.status = '待检修';
              break;
            case 1:
              value.status = '已完成';
          }
          // if(value.id<10){
          //   value.id = '0'+value.id;
          // }
        })
        _this.pageResult = res;
        console.log(_this.pageResult)
        // this.findUserRoles()
      }).then(data!=null?data.callback:'')
    },
    // 查询分页数据
    searchPage: function () {
      let _this = this;
      if(_this.dateArr == null){
        _this.dateArr = [];
      }
      if(_this.dataForm.device2==""){
        _this.equipmentForm2.nameCode = "";
      }
      _this.pageParams = {currPage: 1, pageSize: 10,startTime: _this.dateArr[0],endTime: _this.dateArr[1],status: _this.status, nameCode: _this.dataForm.device2};
      _this.pageRequest.pageSize = 10;
      _this.pageRequest.currPage = 1;
      $.get('/xaj/maintenance/searchRepairRecordList',_this.pageParams).then((res) => {
        var repairArray = res.data;
        repairArray.forEach(function(value,index){
          switch(value.status){
            case 0:
              value.status = '待检修';
              break;
            case 1:
              value.status = '已完成';
          }
          // if(value.id<10){
          //   value.id = '0'+value.id;
          // }
        })
        _this.pageResult = res;
        console.log(_this.pageResult)
        // this.findUserRoles()
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
      var params = {id:data.params[0].id};
      // this.$api.task.batchDelete(data.params).then(data!=null?data.callback:'')
      $.ajax({
        type:'POST',
        url:'/xaj/maintenance/deleteRepairRecord',
        data:params,
        success:function(res){
          console.log(res);
          // _this.dialogVisible = false;
          _this.editLoading = false;
        }
      }).then(data!=null?data.callback:'')
    },
    // 显示新增界面
    handleAdd: function () {
      this.dialogVisible = true
      this.operation = true
      this.dataForm = Object.assign({})
      this.equipmentForm = Object.assign({})
    },
    // 显示编辑界面
    handleEdit: function (params) {
      let _this = this;
      _this.dialogVisible = true
      _this.operation = false
      console.log(params);
      _this.dataForm = {
        time:params.row.breakDate,
        failureCause:params.row.reason,
        solution:params.row.method,
        repair:params.row.repairPerson,
        acceptor:params.row.checkPerson,
        device:params.row.machine+params.row.machineNumber
      }
      _this.equipmentForm = {
        number:params.row.machineNumber,
        name:params.row.machine,
        type:params.row.machineType,
        category:params.row.modelNumber
      }
      switch(params.row.status){
        case '已完成':
          _this.radio = 1;
          break;
        case '待检修':
          _this.radio = 0;
          break;
      }
      // _this.radio = params.row.status;
      console.log(_this.radio);
      _this.id = params.row.id;
      // let userRoles = []
      // for(let i=0,len=params.row.userRoles.length; i<len; i++) {
      //  userRoles.push(params.row.userRoles[i].roleId)
      // }
      // this.dataForm.userRoles = userRoles
    },
    handleCheck: function (params) {
      console.log(params);
      let _this = this;
      _this.refForm.device = params.row.machine;
      _this.refForm.name = params.row.machine;
      _this.refForm.type = params.row.machineType;
      _this.refForm.number = params.row.machineNumber;
      _this.refForm.category = params.row.modelNumber;
      _this.refForm.time = params.row.breakDate;
      _this.refForm.failureCause = params.row.reason;
      _this.refForm.solution = params.row.method;
      _this.refForm.repair = params.row.repairPerson;
      _this.refForm.acceptor = params.row.checkPerson;
      _this.refForm.radio = params.row.status;
      _this.dialogVisibleA = true
    },
    // 编辑
    submitForm: function () {
      let _this = this;
      if(_this.operation){
        _this.$refs.dataForm.validate((valid) => {
          if (valid) {
              _this.editLoading = true
              _this.addParams = {
                machineNumber: _this.equipmentForm.number,
                machine: _this.equipmentForm.name,
                machineType: _this.equipmentForm.type,
                modelNumber: _this.equipmentForm.category,
                breakDate: _this.dataForm.time,
                reason: _this.dataForm.failureCause,
                method: _this.dataForm.solution,
                repairPerson: _this.dataForm.repair,
                checkPerson: _this.dataForm.acceptor,
                status: _this.radio
              }
              console.log(_this.addParams);
              $.ajax({
                  type:'GET',
                  url:'/xaj/maintenance/addRepairRecord',
                  data:_this.addParams,
                  success:function(data){
                    console.log(data);
                    _this.dialogVisible = false;
                    _this.editLoading = false;
                    _this.findPage(null);
                    _this.$refs['dataForm'].resetFields();
                    _this.$refs['equipmentForm'].resetFields();
                    _this.radio = 1;
                    if(data.status==true){
                      _this.$message({message: '新增成功', type: 'success'})
                    }
                  }
              })
          }
        })
      }else{
        _this.$refs.dataForm.validate((valid) => {
          if (valid) {
              _this.editLoading = true
              _this.dataForm.time = new Date(_this.dataForm.time);
              _this.addParams = {
                machineNumber: _this.equipmentForm.number,
                machine: _this.equipmentForm.name,
                machineType: _this.equipmentForm.type,
                modelNumber: _this.equipmentForm.category,
                breakDate: _this.dataForm.time,
                reason: _this.dataForm.failureCause,
                method: _this.dataForm.solution,
                repairPerson: _this.dataForm.repair,
                checkPerson: _this.dataForm.acceptor,
                status: _this.radio,
                id:_this.id
              }
              console.log(_this.addParams);
              $.ajax({
                  type:'GET',
                  url:'/xaj/maintenance/updateRepairRecord',
                  data:_this.addParams,
                  success:function(data){
                    console.log(data);
                    _this.dialogVisible = false;
                    _this.editLoading = false;
                    _this.findPage(null);
                    _this.$refs['dataForm'].resetFields();
                    _this.$refs['equipmentForm'].resetFields();
                    _this.radio = 1;
                    if(data.status==true){
                      _this.$message({message: '修改成功', type: 'success'})
                    }
                  }
              })
          }
        })
      }
    },
    complete:function(arr){
        let _this = this;
        console.log(arr);
        var status;
        switch(arr[1].status){
          case '待检修':
            status = 0;
            break;
          case '已完成':
            status = 1;
        }
        _this.completeParams = {
          id: arr[1].id,
          status: status
        }
        console.log(_this.completeParams);
        $.ajax({
            type:'GET',
            url:'/xaj/maintenance/updateRepairRecordStatus',
            data:_this.completeParams,
            success:function(data){
              console.log(data);
              _this.findPage(null);
            }
        })
    },
    // 获取部门列表
    // findDeptTree: function () {
    //  this.$api.dept.findDeptTree().then((res) => {
    //    this.deptData = res.data
    //  })
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
//         displayFilterColumnsDialog: function () {
//       this.$refs.tableColumnFilterDialog.setDialogVisible(true)
//         },
    // 处理表格列过滤显示
//         handleFilterColumns: function (data) {
//       this.filterColumns = data.filterColumns
//       this.$refs.tableColumnFilterDialog.setDialogVisible(false)
//         },
    // 处理表格列过滤显示
        initColumns: function () {
      this.columns = [
        // {prop:"id",label:"序号",minWidth:70},
        {prop:"machineNumber", label:"设备编号", minWidth:80},
        {prop:"machine", label:"设备名称", minWidth:120},
        {prop:"modelNumber", label:"设备型号", minWidth:120},
        {prop:"reason", label:"故障原因", minWidth:120},
        {prop:"breakDate", label:"故障时间", minWidth:150},
        {prop:"completeDate", label:"完成时间", minWidth:150},
        {prop:"repairPerson", label:"维修人", minWidth:80},
        {prop:"checkPerson", label:"验收人", minWidth:80},
        {prop:"status",label:"维修状态",minWidth:80}
      ]
      this.filterColumns = JSON.parse(JSON.stringify(this.columns));
        },
      handleError(err,file,fileList){
        console.log(err)
      },
      handleExceed(files,fileList){
        console.log(files)
      },
      onChange(file,fileList){
        
      },
      tableRowClassName({row, rowIndex}){
      var length = $(".el-table .el-table__body-wrapper tbody tr:eq(0) td").length - 1;
          if(row.status == "待检修"){
            $(".el-table .el-table__body-wrapper tbody tr:eq("+rowIndex+") td:eq("+(length-1)+")").css({"color":"#FF9800"});
            if(this.rowA.indexOf(rowIndex)<0){
              this.rowA.push(rowIndex);
            }
            if(this.rowB.indexOf(rowIndex)<0){
              this.rowB.push(rowIndex);
            }
            if(this.rowC.indexOf(rowIndex)<0){
              this.rowC.push(rowIndex);
            }
            if(this.rowD.indexOf(rowIndex)>-1){
              this.rowD.splice(this.rowD.indexOf(rowIndex),1);
            }
          }else if(row.status == "已完成"){
            $(".el-table .el-table__body-wrapper tbody tr:eq("+rowIndex+") td:eq("+(length-1)+")").css({"color":"#3F51B5"});
            if(this.rowB.indexOf(rowIndex)<0){
              this.rowB.push(rowIndex);
            }
            if(this.rowD.indexOf(rowIndex)<0){
              this.rowD.push(rowIndex);
            }
            if(this.rowA.indexOf(rowIndex)>-1){
              this.rowA.splice(this.rowB.indexOf(rowIndex),1);
            }
            if(this.rowC.indexOf(rowIndex)>-1){
              this.rowC.splice(this.rowC.indexOf(rowIndex),1);
            }
          }
      },
      querySearch(queryString,cb){
        var equipmentAll = this.equipmentAll;
        var results = queryString ? equipmentAll.filter(this.createFilter(queryString)) : equipmentAll;
        //调用callback返回建议列表的数据
        cb(results);
      },
      createFilter(queryString){
        return(equipmentAll) => {
          return(equipmentAll.value.toLowerCase().indexOf(queryString.toLowerCase())>-1);
        }
      },
      loadAll(){
        // return[
        //   {value:"数控车床（01#）",name:"数控车床（01#）",type:"数控车床",number:"01#",category:"CA6150A"},
        //   {value:"数控车床（02#）",name:"数控车床（02#）",type:"数控车床",number:"02#",category:"CA6150A"},
        //   {value:"数控车床（03#）",name:"数控车床（03#）",type:"数控车床",number:"03#",category:"CA6150A"}
        // ]
      },
      handleSelect(item){
        console.log(item);
        this.equipmentForm = {name:item.name,type:item.type,number:item.number,category:item.category};
      },
      handleSelect2(item){
        console.log(item);
        this.equipmentForm2 = {nameCode:item.value};
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
    // this.findDeptTree()
    _this.initColumns()
    setTimeout(function(){
      $.ajax({
          type:'GET',
          url:'/xaj/configuration/searchAllMachine',
          success:function(data){
            var newArr = [];
            $.each(data,function(index,value){
              if(value!==null){
                newArr.push(value);
              }
            })
            var nameArr = [];
            $.each(newArr,function(index,value){
              var flag = true;
              if(nameArr.length>0){
                $.each(nameArr,function(i,a){
                  if(nameArr[i].value == newArr[index].machine){
                    flag=false;
                  }
                })
              }
              if(flag){
                nameArr.push({value:newArr[index].machine,name:newArr[index].machineName,type:newArr[index].machineType,number:newArr[index].machineNumber,category:newArr[index].modelNumber});
              }
            })
            var numberArr = [];
            $.each(newArr,function(index,value){
              var flag = true;
              if(numberArr.length>0){
                $.each(numberArr,function(i,a){
                  if(numberArr[i].value == newArr[index].machineNumber){
                    flag=false;
                  }
                })
              }
              if(flag){
                numberArr.push({value:newArr[index].machineNumber,name:newArr[index].machineName,type:newArr[index].machineType,number:newArr[index].machineNumber,category:newArr[index].modelNumber});
              }
            })
            _this.equipmentAll = nameArr.concat(numberArr);
            console.log(_this.equipmentAll);
          }
        })
    },1000)
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
  line-height: 36px;
  color: #fff;
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
.tip_spec{
  position: absolute;
  top: 50px;
  width: 100%;
}
.downloadModal{
  color: #009688;
  font-size: 16px;
  font-family: 'SourceHanSansSC-regular';
}
.dialogRepair .inputLengthA .el-select{
  width: 34%;
}
.dialogRepair .inputLengthA .el-date-editor{
  width: 34%;
}
.dialogRepair .inputLengthB .el-select{
  width: 94%;
}
.dialogRepair .inputLengthA .el-input--prefix .el-input__inner{
  padding-left:15px;
}
.dialogRepair .inputLengthA .el-input__prefix{
  left: auto;
  right: 5px;
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
    font-size: 26px;
    color: #101010;
    font-family: 'SourceHanSansSC-regular';
    text-align: center;
}
.el-form-item__label{
    color: #101010;
}
.el-radio__input.is-checked+.el-radio__label{
  color: inherit;
}
.sub-title{
  font-size: 18px;
  color: #000;
  font-family: 'SourceHanSansSC-regular';
  margin-bottom:10px;
}
.dialogRepair .el-dialog__body{
  height:400px;
  overflow: auto;
}
.el-date-editor--daterange.el-input__inner{
  width: 100%;
}
</style>