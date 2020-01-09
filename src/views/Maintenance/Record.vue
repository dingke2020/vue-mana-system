<template>
  <div class="page-container">
  <!--工具栏-->
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
      <!-- <el-form-item style="width:110px;">
        <el-select v-model="cycle" size="medium" placeholder="保养周期">
            <el-option label="按年" value="1"></el-option>
            <el-option label="按月" value="2"></el-option>
            <el-option label="按日" value="3"></el-option>
          </el-select>
      </el-form-item> -->
      <el-form-item style="width:110px;">
        <el-select v-model="status" size="medium" placeholder="所有状态">
            <el-option label="未保养" value="0"></el-option>
            <el-option label="已保养" value="1"></el-option>
          </el-select>
      </el-form-item>
      <el-form-item>
        <el-button size="medium" @click="searchPage()" :style="{'background-color':themeColor,'color':'#fff','border-color':themeColor}">查询</el-button>
      </el-form-item>
    </el-form>
  </div>
  <!--表格内容栏-->
  <Maintenance-record-table :height="tableHeight" :data="pageResult" :columns="filterColumns" :rowstatus="tableRowClassName" @findPage="findPage" @handleEdit="handleEdit" @handleDelete="handleDelete" :rowA="rowA" :rowB="rowB" @handle-fill="handleFill" @handle-check="handleCheck">
  </Maintenance-record-table>
  <!--新增编辑界面-->
  <el-dialog :title="operation?'填报':'查看'" width="50%" :visible.sync="dialogVisible" custom-class="dialogHeight" center>
    <el-form :model="dataForm" label-width="100px" :rules="dataFormRules" ref="dataForm" :size="size"
      label-position="right">
      <div class="sub-title">保养设备信息：</div>
      <el-form :inline="true" label-width="100px" class="demo-form-inline">
        <el-form-item label="设备名称" prop="name">
          <el-input id="maintenanceName" v-model="dataForm.name" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="设备类型" prop="type">
          <el-input id="maintenanceType" v-model="dataForm.type" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="设备编号" prop="number">
          <el-input id="maintenanceNumber" v-model="dataForm.number" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="保养时间" prop="date">
          <el-input id="maintenanceMonth" v-model="dataForm.date" :disabled="true"></el-input>
        </el-form-item>
      </el-form>
      <div class="sub-title">保养内容：</div>
      <el-form-item label-width="0" prop="content">
        <el-input type="textarea" :rows="3" placeholder="请填写具体保养的内容！" v-model="dataForm.content" resize="none"></el-input>
      </el-form-item>
      <!-- <el-upload action="https://jsonplaceholder.typicode.com/posts/" list-type="picture-card" :on-remove="handleRemove" :limit="6">
        <i class="el-icon-plus"></i>
        <div slot="tip" class="el-upload__tip">1.最多支持6张图片；</div>
        <div slot="tip" class="el-upload__tip">2.支持jpeg、png格式，大小不超过1M。</div>
      </el-upload> -->
    </el-form>
    <div slot="footer" class="dialog-footer" v-if="operation">
      <el-button size="medium" @click.native="dialogVisible = false" class="cancel-button">取消</el-button>
      <el-button size="medium" type="primary" @click.native="submitForm" :loading="editLoading" class="define-button">确定</el-button>
    </div>
  </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import MaintenanceRecordTable from "@/views/Core/MaintenanceRecordTable"
import { format } from "@/utils/datetime"
export default {
  components:{
    MaintenanceRecordTable
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
      cycle:'',
      status:'',
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
      filterColumns: [],
      pageRequest: { currPage: 1, pageSize: 10 },
      pageParams: { currPage: 1, pageSize: 10 },
      pageResult: {},
      operation: false, // true:新增, false:编辑
      dialogVisible: false, // 新增编辑界面是否显示
      editLoading: false,
      dataFormRules: {
        name: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择要进行保养的设备！', trigger: 'blur' }
        ],
        time: [
          { required: true, message: '设置该类型设备的保养时间，系统自动到时通知相关责任人！', trigger: 'blur' }
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
        type:'',
        time:'',
        planProduction:'',
        name:'',
        type:'',
        number:'',
        date:'',
        content:''
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
      maintenance:{},
      maintenanceContent:'',
      fillParams:{}
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
        data.pageRequest.startTime = _this.dateArr[0];
        data.pageRequest.endTime = _this.dateArr[1];
        _this.pageRequest = data.pageRequest
      }
      //这里是不调接口的
      _this.$api.maintenance.findRecordPage(_this.pageRequest).then((res) => {
        var recordArray = res.data.data.record.data;
        recordArray.forEach(function(value,index){
          switch(value.status){
            case 0:
              value.status = '未保养';
              break;
            case 1:
              value.status = '已保养';
          }
          switch(value.period){
            case 'byYear':
              value.period = '按年';
              break;
            case 'byMonth':
              value.period = '按月';
              break;
            case 'byDay':
              value.period = '按日';
          }
          if(value.id<10){
            value.id = '0'+value.id;
          }
        })
        _this.pageResult = res.data.data.record;
        console.log(_this.pageResult)
        // this.findUserRoles()
      }).then(data!=null?data.callback:'')
      $.get('/xaj/maintenance/searchMaintenanceRecordList',_this.pageRequest).then((res) => {
        var recordArray = res.data;
        recordArray.forEach(function(value,index){
          switch(value.status){
            case 0:
              value.status = '未保养';
              break;
            case 1:
              value.status = '已保养';
          }
          switch(value.period){
            case 'byYear':
              value.period = '按年';
              break;
            case 'byMonth':
              value.period = '按月';
              break;
            case 'byDay':
              value.period = '按日';
          }
          if(value.id<10){
            value.id = '0'+value.id;
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
      if(_this.dateArr == null){
        _this.dateArr = [];
      }
      _this.pageParams = {currPage: 1, pageSize: 10 ,startTime: _this.dateArr[0],endTime: _this.dateArr[1],status: _this.status};
      _this.pageRequest.pageSize = 10;
      _this.pageRequest.currPage = 1;
      $.get('/xaj/maintenance/searchMaintenanceRecordList',_this.pageParams).then((res) => {
        var recordArray = res.data;
        recordArray.forEach(function(value,index){
          switch(value.status){
            case 0:
              value.status = '未保养';
              break;
            case 1:
              value.status = '已保养';
          }
          switch(value.period){
            case 'byYear':
              value.period = '按年';
              break;
            case 'byMonth':
              value.period = '按月';
              break;
            case 'byDay':
              value.period = '按日';
          }
          if(value.id<10){
            value.id = '0'+value.id;
          }
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
      this.$api.maintenance.batchDelete(data.params).then(data!=null?data.callback:'')
    },
    // 显示新增界面
    handleAdd: function () {
      this.dialogVisible = true
      this.operation = true
      this.dataForm = {
        id: 0,
        name: '',
        password: '',
        deptId: 1,
        deptName: '',
        email: 'test@qq.com',
        mobile: '13889700023',
        status: 1,
        type:'',
        time:''
        // userRoles: []
      }
    },
    // 显示编辑界面
    handleEdit: function (params) {
      this.dialogVisible = true
      this.operation = false
      this.dataForm = Object.assign({}, params.row)
      // let userRoles = []
      // for(let i=0,len=params.row.userRoles.length; i<len; i++) {
      //  userRoles.push(params.row.userRoles[i].roleId)
      // }
      // this.dataForm.userRoles = userRoles
    },
    // 编辑
    submitForm: function () {
      let _this = this;
      _this.$refs.dataForm.validate((valid) => {
        if (valid) {
          // this.$confirm('确认提交吗？', '提示', {}).then(() => {
            _this.editLoading = true;
            _this.fillParams = {
              id: _this.dataForm.id,
              remark: _this.dataForm.content,
              machineNumber: _this.dataForm.number
            }
            console.log(_this.fillParams);
            // let params = Object.assign({}, this.dataForm)
            // let userRoles = []
            // for(let i=0,len=params.userRoles.length; i<len; i++) {
            //  let userRole = {
            //    userId: params.id,
            //    roleId: params.userRoles[i]
            //  }
            //  userRoles.push(userRole)
            // }
            // params.userRoles = userRoles
          //   this.$api.maintenance.save(params).then((res) => {
          //     this.editLoading = false
          //     if(res.code == 200) {
          //       this.$message({ message: '操作成功', type: 'success' })
          //       this.dialogVisible = false
          //       this.$refs['dataForm'].resetFields()
          //     } else {
          //       this.$message({message: '操作失败, ' + res.msg, type: 'error'})
          //     }
          //     this.findPage(null)
          //   })
            $.ajax({
                type:'GET',
                url:'/xaj/maintenance/reportMaintenanceRecord',
                data:_this.fillParams,
                success:function(data){
                  console.log(data);
                  _this.dialogVisible = false;
                  _this.editLoading = false;
                  _this.findPage(null);
                  _this.$refs['dataForm'].resetFields();
                  if(data.status==true){
                    _this.$message({message: '填报成功', type: 'success'})
                  }
                }
            })
          // })
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
        {prop:"machineNumber", label:"设备编号", minWidth:100},
        {prop:"machine", label:"设备名称", minWidth:120},
        {prop:"machineType", label:"设备类型", minWidth:120},
        {prop:"period", label:"保养周期", minWidth:100},
        {prop:"maintenanceDate", label:"保养时间", minWidth:120},
        {prop:"ddPerson", label:"担当人", minWidth:100},
        {prop:"zrPerson", label:"责任人", minWidth:100}, 
        {prop:"remark",label:"备注",minWidth:70},
        {prop:"updateTime", label:"新增时间", minWidth:160},
        {prop:"status",label:"状态",minWidth:100}
      ]
      this.filterColumns = JSON.parse(JSON.stringify(this.columns));
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
      tableRowClassName({row, rowIndex}){
      var length = $(".el-table .el-table__body-wrapper tbody tr:eq(0) td").length - 1;
          if(row.status == "未保养"){
            $(".el-table .el-table__body-wrapper tbody tr:eq("+rowIndex+") td:eq("+(length-1)+")").css({"color":"#E51C23"});
            if(this.rowA.indexOf(rowIndex)<0){
              this.rowA.push(rowIndex);
            }
            if(this.rowB.indexOf(rowIndex)>-1){
              this.rowB.splice(this.rowB.indexOf(rowIndex),1);
            }
          }else if(row.status == "已保养"){
            $(".el-table .el-table__body-wrapper tbody tr:eq("+rowIndex+") td:eq("+(length-1)+")").css({"color":"#3F51B5"});
            if(this.rowB.indexOf(rowIndex)<0){
              this.rowB.push(rowIndex);
            }
            if(this.rowA.indexOf(rowIndex)>-1){
              this.rowA.splice(this.rowA.indexOf(rowIndex),1);
            }
          }
      },
      handleFill(arr){
        let _this = this;
        console.log(arr);
        var data = arr[1];
        _this.dataForm.id = data.id;
        _this.dataForm.name = data.machine;
        _this.dataForm.type = data.machineType;
        _this.dataForm.number = data.machineNumber;
        _this.dataForm.date = data.maintenanceDate;
        _this.dataForm.content = data.remark;
        // this.maintenance = {name:data.equipmentName,type:data.equipmentType,number:data.equipmentNumber,month:data.yearAndMonth};
        this.dialogVisible = true;
        this.operation = true;
      },
      handleCheck(arr){
        let _this = this;
        console.log(arr);
        var data = arr[1];
        _this.dataForm.id = data.id;
        _this.dataForm.name = data.machine;
        _this.dataForm.type = data.machineType;
        _this.dataForm.number = data.machineNumber;
        _this.dataForm.date = data.maintenanceDate;
        _this.dataForm.content = data.remark;
        this.dialogVisible = true;
        this.operation = false;
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      }
  },
  mounted() {
    let _this = this;
    // this.findDeptTree()
    _this.initColumns()
    function repage(){
      var win_height = $(window).height();
      var nav_heihgt = $(".headbar").height();
      var tab_height = $(".tabs").height();
      var gap = 200;
      _this.tableHeight = win_height - nav_heihgt - tab_height - gap;
    }
    repage();
    console.log(_this.filterColumns);
    console.log(_this.rowA,_this.rowB,_this.text);
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
.dialogHeight .el-dialog__body{
  height:330px;
  overflow: auto;
}
.el-date-editor--daterange.el-input__inner{
  width: 100%;
}
</style>