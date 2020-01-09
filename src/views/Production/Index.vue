<template>
  <div class="page-container">
  <!--工具栏-->
  <!-- <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
    <el-form :inline="true" :model="filters" :size="size">
      <el-form-item>
        <el-button size="medium" @click="handleAdd" :style="{'background-color':themeColor,'color':'#fff','border-color':themeColor}">新增</el-button>
      </el-form-item>
      <el-form-item>
        <el-button size="medium" @click="handleEdit" :style="{'background-color':themeColor,'color':'#fff','border-color':themeColor}">EXECL导入</el-button>
      </el-form-item>
    </el-form>
  </div> -->
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
        <el-autocomplete  prefix-icon="iconfont icon-ali-search" size="medium" style="color:#101010" popper-class="auto-select" v-model="dataForm.material" :fetch-suggestions="querySearch" placeholder="请输入物料名称或编码" :trigger-on-focus="false" @select="handleSelect" clearable></el-autocomplete>
      </el-form-item>
      <el-form-item>
        <el-button size="medium" @click="searchPage()" :style="{'background-color':themeColor,'color':'#fff','border-color':themeColor}">查询</el-button>
      </el-form-item>
    </el-form>
    <!--表格显示列界面-->
    
  </div>
  <!--表格内容栏-->
  <Production-table :height="tableHeight" :data="pageResult" :columns="filterColumns" :rowstatus="tableRowClassName" @findPage="findPage" @handleDelete="handleDelete" :rowA="rowA" :rowB="rowB" :rowC="rowC" :rowD="rowD" :rowE="rowE" @re-dispatch="reDispatch" @dispatch="dispatch" @order-dec="orderDec" @report-record="reportRecord" >
  </Production-table>
  <!--派单界面-->
  <el-dialog :title="operation?'工单分解':'派单'" width="55%" :visible.sync="dialogVisible" custom-class="productionDialog" center>
    <el-form :model="dataForm" label-width="130px" :rules="dataFormRules" ref="dataForm" :size="size"
      label-position="right">
      <div class="sub-title">工单信息：</div>
      <el-form :inline="true" label-width="130px" class="demo-form-inline">
        <el-form-item label="工单号">
          <el-input id="workingNumber" v-model="working.Number" :disabled="true"></el-input>
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
      </el-form>
      <el-form-item label="分解工单数" prop="decNum" v-if="operation" class="inputLength">
        <el-input v-model="dataForm.decNum" auto-complete="off" type="number" min="1" :max="maxNum" @change="decNumChange"></el-input>
        <div class="tip_size tip_color" v-if="operation">说明：填写分解工单数后，系统默认根据母工单计划生产量自动平均分解！分解最多5个！</div>
      </el-form-item>
      <el-form-item id="splitOrder" label="各工单计划生产量" v-if="operation" class="average-production">
        <el-input size="medium" v-for="(item,index) in inputs" type="number" min="1" v-model="item.value" :key="index" @blur="splitBlur"></el-input>
      </el-form-item>
      <transition name="slide-fade"><span v-if="show" class="tips_procedure">{{tips_procedure}}</span></transition>
      <el-form :inline="true" label-width="130px" v-if="!operation" :model="refForm" :rules="refFormRules" ref="refForm">
        <div class="sub-title">请选择您要派单的设备和人员：</div>
        <el-form-item label="生产设备" prop="dev_value">
          <el-select v-model="refForm.dev_value" placeholder="请选择" @change="dev_change">
            <el-option v-for="item in dev_options" :key="item.index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="生产人员" prop="per_value">
          <el-select v-model="refForm.per_value" placeholder="请选择" @change="per_change">
            <el-option v-for="item in per_options" :key="item.index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="medium" @click.native="dialogVisible = false" class="cancel-button">取消</el-button>
      <el-button size="medium" type="primary" @click.native="submitForm" :loading="editLoading" class="define-button">确定</el-button>
    </div>
  </el-dialog>
  <!--报工界面-->
  <el-dialog :title="action?'确认':'报工记录'" width="50%" :visible.sync="dialogVisibleB" center>
    <h4 class="lockTip" v-if="action"><i class="el-icon-warning"></i>重新派单前，请确认上个员工已完成阶段报工！</h4>
    <div class="table-content" v-if="!action">
      <!-- <div class="table-title clearfix">
        <p>累计报工次数：<b>{{countReport}}</b></p>
        <p>累计生产数量：<b>{{countProject}}</b></p>
      </div> -->
      <el-table :data="tableData" border style="width:100%" stripe :header-cell-style="{'background-color':'#E8ECEB','color':'#424242'}">
        <el-table-column prop="id" label="序号" min-width="84" header-align="center" align="center" type="index" :index="indexExtend"></el-table-column>
        <el-table-column prop="machine" label="生产设备" min-width="150" header-align="center" align="center"></el-table-column>
        <el-table-column prop="name" label="生产人员" min-width="150" header-align="center" align="center"></el-table-column>
        <el-table-column prop="jobBookingQuantity" label="生产数量" min-width="131" header-align="center" align="center"></el-table-column>
        <el-table-column prop="updateTime" label="报工时间" min-width="201" header-align="center" align="center"></el-table-column>
      </el-table>
    </div>
    <div slot="footer" class="dialog-footer" v-if="action">
      <el-button size="medium" @click.native="dialogVisibleB = false" class="cancel-button">取消</el-button>
      <el-button size="medium" type="primary" @click.native="submitFormB" :loading="editLoadingB" class="define-button">确认重新派单</el-button>
    </div>
  </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ProductionTable from "@/views/Core/ProductionTable"
import { format } from "@/utils/datetime"
export default {
  components:{
    ProductionTable
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
      inputs:[{}],
      tableHeight:null,
      dev_options:[
        // {value:1,label:'scsb001'},
        // {value:2,label:'scsb002'},
        // {value:3,label:'scsb003'}
      ],
      per_options:[
        // {value:1,label:'章正洪'},
        // {value:2,label:'王志忠'},
        // {value:3,label:'汪小军'},
        // {value:4,label:'范天荣'}
      ],
      dev_value:'',
      per_value:'',
      tableData:[
        // {id:'01',machine:'scsb002',name:'范天荣',jobBookingQuantity:56,updateTime:'2019-06-16 8:12'},
        // {id:'02',machine:'scsb002',name:'方建阳',jobBookingQuantity:87,updateTime:'2019-06-16 8:12'},
        // {id:'03',machine:'scsb002',name:'汪明清',jobBookingQuantity:143,updateTime:'2019-06-16 8:12'}
      ],
      size: 'small',
      form: {
        date1: '',
        date2: ''
      },
      select:'',
      filters: {
        name: ''
      },
      columns: [],
      isRole:false,
      rowA:[],
      rowB:[],
      rowC:[],
      rowD:[],
      rowE:[],
      filterColumns: [],
      pageRequest: { groupId: '',currPage: 1, pageSize: 10 },
      pageParams: { groupId: '',currPage: 1, pageSize: 10 },
      pageResult: {},
      operation: true, // true:新增, false:编辑
      dialogVisible: false, // 新增编辑界面是否显示
      action:true,
      dialogVisibleB: false,
      editLoading: false,
      editLoadingB: false,
      dataFormRules: {
        name: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        decNum: [
          { required: true, message: '请输入数量', trigger: 'blur' }
        ]
        // file: [
        //  {validator:validatePass, trigger:'change' }
        // ]
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
        decNum:'',
        material:''
      },
      refForm:{
        dev_value:'',
        per_value:''
      },
      refFormRules: {
        dev_value: [
          { message: '请选择生产设备', trigger: 'change' }
        ],
        per_value: [
          { required: true, message: '请选择生产人员', trigger: 'change' }
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
      working:{},
      planTime:{
        date1:'',
        date2:''
      },
      material:'',
      paramsSend:{},
      paramsSplit:{},
      paramsResend:{},
      paramsCheck:{id:'',currPage:1,pageSize:10},
      countReport:'',
      countProject:'',
      dateArr:[],
      materialAll:[],
      group:'',
      departments:[
        {value:17,label:'金工车间'},
        {value:18,label:'注塑车间'},
        {value:20,label:'缠绕车间'}
      ],
      materialForm:{
        name:'',
        code:'',
        type:''
      },
      show:false,
      maxNum:null,
      tips_procedure:''
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
      if(data !== null) {
        data.pageRequest.status = _this.select;
        data.pageRequest.nameCode = _this.dataForm.material;
        data.pageRequest.startTime = _this.dateArr[0];
        data.pageRequest.endTime = _this.dateArr[1];
        data.pageRequest.gid = _this.group;
        _this.pageRequest = data.pageRequest
      }
      //这里是不调接口的
      _this.$api.production.findPage().then((res) => {
        // 加载角色集合
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
          if(value.id<10){
            value.id = '0'+value.id;
          }
          if(value.progress!=""){
            value.progress = value.progress+'%';
          }
        })
        _this.pageResult = res.data.data;
      }).then(data!=null?data.callback:'')
      $.get('/xaj/production/searchByCondition',_this.pageRequest).then((res) => {
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
          if(value.id<10){
            value.id = '0'+value.id;
          }
          if(value.progress!=""){
            value.progress = value.progress+'%';
          }
        })
        _this.pageResult = res;
        console.log(_this.pageResult)
        // this.findUserRoles()
      }).then(data!=null?data.callback:'')
    },
    // 查询分页数据
    searchPage: function () {
      let _this = this;
      console.log(_this.dateArr,_this.select,_this.materialForm.code,_this.dataForm.material);
      if(_this.dateArr == null){
        _this.dateArr = [];
      }
      if(_this.dataForm.material==""){
        _this.materialForm.code = "";
      }
      _this.pageParams = {currPage: 1, pageSize: 10 ,roleId: parseInt(localStorage.getItem('roleId')),groupId: parseInt(localStorage.getItem('groupId')),startTime: _this.dateArr[0],endTime: _this.dateArr[1],status: _this.select,nameCode: _this.dataForm.material,gid:_this.group};
      _this.pageRequest.pageSize = 10;
      _this.pageRequest.currPage = 1;
      // this.pageParams.columnFilters = {name: {name:'name', value:this.filters.name}}
      $.get('/xaj/production/searchByCondition',_this.pageParams).then((res) => {
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
          //  value.id = '0'+value.id;
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
      this.$api.production.batchDelete(data.params).then(data!=null?data.callback:'')
    },
    // 显示新增界面
    // handleAdd: function () {
    //   this.dialogVisible = true
    //   this.operation = true
    //   this.dataForm = {
    //     id: 0,
    //     name: '',
    //     password: '',
    //     deptId: 1,
    //     deptName: '',
    //     email: 'test@qq.com',
    //     mobile: '13889700023',
    //     status: 1,
    //     userRoles: []
    //   }
    // },
    // 显示编辑界面
    // handleEdit: function (params) {
    //   this.dialogVisible = true
    //   this.operation = false
    //   this.dataForm = Object.assign({}, params.row)
    //   let userRoles = []
    //   for(let i=0,len=params.row.userRoles.length; i<len; i++) {
    //    userRoles.push(params.row.userRoles[i].roleId)
    //   }
    //   this.dataForm.userRoles = userRoles
    // },
    // 编辑
    submitForm: function () {
      let _this = this;
      if(!_this.operation){
        _this.$refs.refForm.validate((validA) => {
          if (validA) {
            _this.editLoading = true;
            // console.log(_this.paramsSend);
            $.ajax({
              type:'POST',
              url:'/xaj/production/sendOrder',
              data:_this.paramsSend,
              success:function(data){
                console.log(data);
                _this.dialogVisible = false;
                _this.editLoading = false;
                _this.findPage(null);
                _this.$refs['refForm'].resetFields()
              }
            })
          }
        })
      }else{
        _this.$refs.dataForm.validate((valid) => {
          if (valid) {
            if(!_this.show){
              _this.editLoading = true
              $.ajax({
                type:'GET',
                url:'/xaj/production/splitOrder',
                data:_this.paramsSplit,
                success:function(data){
                  console.log(data);
                  _this.dialogVisible = false;
                  _this.editLoading = false;
                  _this.findPage(null);
                  _this.$refs['dataForm'].resetFields();
                  _this.inputs = [{}];
                }
              })
            } 
          }
        })
      }        
    },
    submitFormB: function () {
      let _this = this;
      // _this.$confirm('确认提交吗？', '提示', {}).then(() => {
        _this.editLoadingB = true
        // console.log(_this.paramsResend);
        $.ajax({
          type:'GET',
          url:'/xaj/production/resendOrder',
          data:_this.paramsResend,
          success:function(data){
            console.log(data);
            _this.dialogVisibleB = false;
            _this.editLoadingB = false;
            _this.findPage(null);
            // _this.$refs['refForm'].resetFields()
          }
        })
      // })
    },
    // 获取部门列表
    // findDeptTree: function () {
    //   this.$api.dept.findDeptTree().then((res) => {
    //     this.deptData = res.data
    //   })
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
        initColumns: function () {
      this.columns = [
        // {prop:"id", label:"序号", minWidth:50},
        {prop:"groupName", label:"部门", minWidth:80},
        {prop:"workingNumber", label:"工单号", minWidth:120},
        {prop:"materialName", label:"物料名称", minWidth:150},
        {prop:"materialCode", label:"物料编码", minWidth:100},
        {prop:"specifications", label:"规格型号", minWidth:90},
        {prop:"planQuantity", label:"计划生产量", minWidth:100},
        {prop:"startTime", label:"计划开始时间", minWidth:110},
        {prop:"endTime", label:"计划完成时间", minWidth:110},
        {prop:"productionProcessesName", label:"工作中心", minWidth:80},
        {prop:"machine", label:"生产设备", minWidth:80},
        {prop:"name", label:"生产人员", minWidth:80},
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
            if(this.rowE.indexOf(rowIndex)<0){
              this.rowE.push(rowIndex);
            }
            if(this.rowB.indexOf(rowIndex)>-1){
              this.rowB.splice(this.rowB.indexOf(rowIndex),1);
            }
            if(this.rowC.indexOf(rowIndex)>-1){
              this.rowC.splice(this.rowC.indexOf(rowIndex),1);
            }
            if(this.rowD.indexOf(rowIndex)>-1){
              this.rowD.splice(this.rowD.indexOf(rowIndex),1);
            }
          }else if(row.status == "已锁定"){
            $(".el-table .el-table__body-wrapper tbody tr:eq("+rowIndex+") td:eq("+(length-3)+")").css({"color":"#E51C23"});
            if(this.rowE.indexOf(rowIndex)<0){
              this.rowE.push(rowIndex);
            }
            if(this.rowA.indexOf(rowIndex)>-1){
              this.rowA.splice(this.rowA.indexOf(rowIndex),1);
            }
            if(this.rowB.indexOf(rowIndex)>-1){
              this.rowB.splice(this.rowB.indexOf(rowIndex),1);
            }
            if(this.rowC.indexOf(rowIndex)>-1){
              this.rowC.splice(this.rowC.indexOf(rowIndex),1);
            }
            if(this.rowD.indexOf(rowIndex)>-1){
              this.rowD.splice(this.rowD.indexOf(rowIndex),1);
            }
          }else if(row.status == "已完工"){
            $(".el-table .el-table__body-wrapper tbody tr:eq("+rowIndex+") td:eq("+(length-3)+")").css({"color":"#605E5E"});
            if(this.rowE.indexOf(rowIndex)<0){
              this.rowE.push(rowIndex);
            }
            if(this.rowA.indexOf(rowIndex)>-1){
              this.rowA.splice(this.rowA.indexOf(rowIndex),1);
            }
            if(this.rowB.indexOf(rowIndex)>-1){
              this.rowB.splice(this.rowB.indexOf(rowIndex),1);
            }
            if(this.rowC.indexOf(rowIndex)>-1){
              this.rowC.splice(this.rowC.indexOf(rowIndex),1);
            }
            if(this.rowD.indexOf(rowIndex)>-1){
              this.rowD.splice(this.rowD.indexOf(rowIndex),1);
            }
            return 'success-row';
          }else if(row.status == "未派单"){
            $(".el-table .el-table__body-wrapper tbody tr:eq("+rowIndex+") td:eq("+(length-3)+")").css({"color":"#FF9800"});
            if(this.rowB.indexOf(rowIndex)<0){
              this.rowB.push(rowIndex);
            }
            if(this.rowC.indexOf(rowIndex)<0){
              this.rowC.push(rowIndex);
            }
            if(this.rowA.indexOf(rowIndex)>-1){
              this.rowA.splice(this.rowA.indexOf(rowIndex),1);
            }
            if(this.rowE.indexOf(rowIndex)>-1){
              this.rowE.splice(this.rowE.indexOf(rowIndex),1);
            }
            if(this.rowD.indexOf(rowIndex)>-1){
              this.rowD.splice(this.rowD.indexOf(rowIndex),1);
            }
          }else if(row.status == "未投产"){
            $(".el-table .el-table__body-wrapper tbody tr:eq("+rowIndex+") td:eq("+(length-3)+")").css({"color":"#3F51B5"});
            if(this.rowA.indexOf(rowIndex)<0){
              this.rowA.push(rowIndex);
            }
            if(this.rowD.indexOf(rowIndex)>-1){
              this.rowD.splice(this.rowA.indexOf(rowIndex),1);
            }
            if(this.rowB.indexOf(rowIndex)>-1){
              this.rowB.splice(this.rowB.indexOf(rowIndex),1);
            }
            if(this.rowC.indexOf(rowIndex)>-1){
              this.rowC.splice(this.rowC.indexOf(rowIndex),1);
            }
            if(this.rowE.indexOf(rowIndex)>-1){
              this.rowE.splice(this.rowE.indexOf(rowIndex),1);
            }
          }
          $(".el-table .el-table__body-wrapper tbody tr:eq("+rowIndex+") td:eq("+(length-2)+")").css({"color":"#259B24"});
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
        //   {value:"无油立式真空泵气缸体（WLW100-01）",name:"无油立式真空泵气缸体",code:"WLW100-01",type:"WLW-100"},
        //   {value:"无油立式真空泵气缸体（WLW150-01）",name:"无油立式真空泵气缸体",code:"WLW150-01",type:"WLW-150"},
        //   {value:"无油立式真空泵连杆（WLW150-6601）",name:"无油立式真空泵连杆",code:"WLW150-6601",type:"WLW-150"},
        //   {value:"无油立式真空泵气缸盖(上）（WLW100-02-S）",name:"无油立式真空泵气缸盖(上）",code:"WLW100-02-S",type:"WLW-100"}
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
      orderDec:function(arr){
        console.log(arr);
        var data = arr[1];
        this.paramsSplit.id = data.id;
        this.working = {Number:data.workingNumber,productionProcessesName:data.productionProcessesName,materialName:data.materialName,materialCode:data.materialCode,specifications:data.specifications,planQuantity:data.planQuantity};
        this.dialogVisible = true;
        this.operation = true;
      },
      dispatch:function(arr){
        let _this = this;
        console.log(arr);
        var data = arr[1];
        _this.paramsSend.id = data.id;
        _this.working = {Number:data.workingNumber,productionProcessesName:data.productionProcessesName,materialName:data.materialName,materialCode:data.materialCode,specifications:data.specifications,planQuantity:data.planQuantity};
        _this.dialogVisible = true;
        _this.operation = false;
        _this.dev_options = [];
        _this.per_options = [];
        //获取生产设备
        $.ajax({
          type:'GET',
          url:'/xaj/production/findMachine',
          data:{
            productionProcessesName:_this.working.productionProcessesName
          },
          success:function(data){
            console.log(data);
            data.forEach(function(value,index){
              _this.dev_options.push({label:value.machine,value:value.machine,index:index});
            })
          }
        })
        //获取人员
        $.ajax({
          type:'GET',
          url:'/xaj/production/findeEmployee',
          data:{
            groupId:parseInt(localStorage.getItem('groupId'))
          },
          success:function(data){
            data.forEach(function(value,index){
              _this.per_options.push({label:value.name,index:index,value:value.mobile});
            })
          }
        })
      },
      reDispatch:function(arr){
        this.dialogVisibleB = true;
        this.action = true;
        console.log(arr);
        var data = arr[1];
        this.paramsResend = {
          id:data.id,
          machine:data.machine,
          missionNumber:data.missionNumber
        }
      },
      reportRecord:function(arr){
        this.dialogVisibleB = true;
        this.action = false;
        console.log(arr);
        var data = arr[1];
        this.paramsCheck.id = data.id;
        var table = [];
        var countProject = '';
        var countReport = '';
        $.ajax({
          type:'GET',
          url:'/xaj/production/checkJobDetail',
          data: this.paramsCheck,
          success:function(data){
            console.log(data);
            var arr = data.data;
            arr.forEach(function(value,index){
              table.push({
                machine:value.machine,
                name:value.name,
                jobBookingQuantity:value.jobBookingQuantity,
                updateTime:value.updateTime
              })
              countProject = value.countProject;
              countReport = value.countReport;
            })
          }
        })
        this.tableData = table;
        this.countProject = countProject;
        this.countReport = countReport;
      },
      decNumChange(val){
        if(val>5){
          val = 5;
          this.dataForm.decNum = 5;
          this.maxNum = 5;
        }else{
          if(val>this.working.planQuantity){
            val = this.working.planQuantity;
            this.dataForm.decNum = this.working.planQuantity;
            this.maxNum = this.working.planQuantity;
          }
        }
        if(val<1){
          val = 1;
          this.dataForm.decNum = 1;
        }
        console.log(val,this.working.planQuantity);
        var total = this.working.planQuantity;
        var arr = [];
        var rem = 0;
        var integer = 0;
        var newArray = [];
        for(var i=0;i<val;i++){
          if(total%val!=0){
            arr.push({value:parseInt(total/val)});
          }else{
            arr.push({value:total/val});
          }
        }
        if(total%val!=0){
          rem = total%val;
          integer = parseInt(total/val);
          arr[val-1]={value:integer+rem};
        }
        this.inputs = arr;
        console.log(this.inputs);
        this.inputs.forEach(function(value,index){
          newArray.push(value.value);
        })
        var newStr = newArray.toString();
        console.log(newStr);
        this.paramsSplit.data = newStr;
        this.show = false;
      },
      dev_change:function(value){
        // console.log(value);
        this.paramsSend.machine = value;
      },
      per_change:function(value){
        console.log(value);
        // this.refForm.per_value = value.name;
        // console.log(this.refForm.per_value);
        // this.paramsSend.name = value.name;
        // this.paramsSend.icCardNum = value.icCardNum;
        this.paramsSend.mobile = value;
      },
      indexExtend(index){
        return (index+1)+ this.paramsCheck.pageSize * (this.paramsCheck.currPage - 1);
      },
      splitBlur(){
        let _this = this;
        var arr = [];
        var str = "";
        var total = 0;
        var order_length = $("#splitOrder .el-input").length;
        for(var i=0;i<order_length;i++){
          arr.push($("#splitOrder .el-input").eq(i).find("input").val())
          total+=parseInt($("#splitOrder .el-input").eq(i).find("input").val());
        }
        str = arr.join(",");
        _this.paramsSplit.data = str;
        console.log(str);
        console.log(total);
        if(total!=_this.working.planQuantity){
          _this.show = true;
          _this.tips_procedure = "各工单计划生产量总量跟计划生产量不符";
        }else{
          _this.show = false;
        }
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
    // console.log(_this.filterColumns);
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
    // console.log(localStorage.getItem('groupId'),localStorage.getItem('icCardNum'));
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
.tip_color{
  color: #E51C23;
}
.tip_size{
  font-size: 14px;
}
.downloadModal{
  color: #009688;
  font-size: 16px;
  font-family: 'SourceHanSansSC-regular';
}
.productionDialog .inputLength .el-input{
  width: 31%;
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
.average-production .el-input--medium{
  width: 19%;
  margin-right: 1%;
}
.sub-title{
  font-size: 18px;
  color: #000;
  font-family: 'SourceHanSansSC-regular';
  margin-bottom:10px;
}
.el-form-item__label{
  color: #101010;
}
.table-title{
  font-size: 16px;
  color: #424242;
  font-family: 'Roboto';
}
.table-title p{
  float: left;
  margin-right: 25px;
}
.table-title b{
  color: #131313;
  font-size: 14px;
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
.auto-select{
  width: auto !important;
}
.el-date-editor--daterange.el-input__inner{
  width: 100%;
}
.tips_procedure{
  color:#E51C23;
  font-size: 14px;
  margin-left: 18px;
  font-family: 'SourceHanSansSC-regular';
  position: absolute;
  line-height: 24px;
}
.slide-fade-enter-active,.slide-fade-leave-active{
  transition: all .3s ease;
}
.slide-fade-enter,.slide-fade-leave-to{
  transform: translateY(10px);
  opacity: 0;
}
</style>