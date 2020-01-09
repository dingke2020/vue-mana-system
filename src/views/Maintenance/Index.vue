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
  <!--表格内容栏-->
  <Maintenance-table :height="tableHeight" :data="pageResult" :columns="filterColumns" @findPage="findPage" @handleEdit="handleEdit" @handleDelete="handleDelete" :rowA="rowA" :rowB="rowB" :text="text">
  </Maintenance-table>
  <!--新增编辑界面-->
  <el-dialog :title="operation?'新增':'修改'" width="50%" :visible.sync="dialogVisible" custom-class="planDialog" center>
    <el-form :model="dataForm" label-width="100px" :rules="dataFormRules" ref="dataForm" :size="size"
      label-position="right">
      <el-form-item label="设备类型" prop="type" class="inputLengthA">
        <el-select v-model="dataForm.type" placeholder="请选择设备类型" @change="handleChange">
          <el-option v-for="(item,index) in device" :label="item.label" :value="item.value" :key="index"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="设备编号" prop="type" class="inputLengthA">
        <el-select v-model="dataForm.number" placeholder="请选择设备编号">
          <el-option v-for="(item,index) in deviceNum" :label="item.label" :value="item.value" :key="index"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属类别">
        <el-radio-group v-model="radio">
          <el-radio label="A类"></el-radio>
          <el-radio label="B类"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="保养周期" class="inputLengthA" prop="cycle">
        <el-select v-model="dataForm.cycle" placeholder="请选择保养周期">
          <el-option label="按年" value="byYear"></el-option>
          <el-option label="按月" value="byMonth"></el-option>
          <!-- <el-option label="自定义" value="customize"></el-option> -->
          <!-- <el-option label="按日" value="byDay"></el-option> -->
        </el-select>
      </el-form-item>
      <el-form-item label="保养时间" prop="time" class="inputLengthA">
        <el-date-picker v-model="dataForm.time" type="datetime" placeholder="请选择保养时间" prefix-icon="iconfont icon-ali-bell-ring" :clearable="false"></el-date-picker>
      </el-form-item>
      <el-form :inline="true" label-width="100px" :model="refForm" :rules="refFormRules" ref="refForm">
        <el-form-item label="担当人" class="inputLengthB" prop="assume">
          <!-- <el-select v-model="assume" placeholder="请选择担当人">
            <el-option label="童金富" value="选项1"></el-option>
          </el-select> -->
          <el-input v-model="refForm.assume" placeholder="请填写担当人"></el-input>
        </el-form-item>
        <el-form-item label="责任人" class="inputLengthB" prop="liable">
          <el-select v-model="refForm.liable" placeholder="请选择责任人">
            <el-option v-for="(item,index) in zrList" :label="item.name" :value="item.userId" :key="index"></el-option>
          </el-select>
          <!-- <el-input v-model="dataForm.liable" placeholder="请填写责任人"></el-input> -->
        </el-form-item>
        <el-form-item label="备注" class="inputLengthB" prop="remark">
          <el-input id="remark" v-model="refForm.remark"></el-input>
        </el-form-item>
      </el-form>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="medium" @click.native="dialogVisible = false" class="cancel-button">取消</el-button>
      <el-button size="medium" type="primary" @click.native="submitForm" :loading="editLoading" class="define-button">确定</el-button>
    </div>
  </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import MaintenanceTable from "@/views/Core/MaintenanceTable"
import { format } from "@/utils/datetime"
export default {
  components:{
    MaintenanceTable
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
      device:[
        // {label:'普车',value:'1#'},
        // {label:'数控车床',value:'2#'},
        // {label:'刨床',value:'3#'},
        // {label:'铣床',value:'4#'},
        // {label:'磨床',value:'5#'},
        // {label:'镗床',value:'6#'},
        // {label:'摇臂钻',value:'7#'},
        // {label:'加工中心',value:'8#'},
        // {label:'立车',value:'9#'}
      ],
      deviceNum:[],
      zrList:[],
      radio:'A类',
      form: {
        date1: '',
        date2: ''
      },
      select:'',
      filters: {
        name: ''
      },
      columns: [],
      text:[],
      rowA:[],
      rowB:[],
      filterColumns: [],
      pageRequest: { currPage: 1, pageSize: 10 },
      pageResult: {},
      operation: false, // true:新增, false:编辑
      dialogVisible: false, // 新增编辑界面是否显示
      editLoading: false,
      dataFormRules: {
        name: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择要进行保养的设备！', trigger: 'change' }
        ],
        time: [
          { required: true, message: '设置该类型设备的保养时间，系统自动到时通知相关责任人！', trigger: 'blur' }
        ],
        number: [
          { required: true, message: '请选择设备编号！', trigger: 'change' }
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
        cycle:'',
        number:''
      },
      refFormRules:{
        liable: [
          { required: true, message: '请选择责任人!', trigger: 'change' }
        ]
      },
      refForm: {
        assume:'',
        liable:'',
        remark:''
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
      addParams:{},
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
        _this.pageRequest = data.pageRequest
      }
      //这里是不调接口的
      _this.$api.maintenance.findPage(_this.pageRequest).then((res) => {
        var planArray = res.data.data.plan.data;
        planArray.forEach(function(value,index){
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
        _this.pageResult = res.data.data.plan;
        console.log(_this.pageResult)
        // this.findUserRoles()
      }).then(data!=null?data.callback:'')
      _this.$api.maintenance.findPage(_this.pageRequest).then((res) => {
        var planArray = res.data.data;
        planArray.forEach(function(value,index){
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
        _this.pageResult = res.data;
        console.log(_this.pageResult)
        // this.findUserRoles()
      }).then(data!=null?data.callback:'')
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
        url:'/xaj/maintenance/deleteMaintenancePlan',
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
      this.refForm = Object.assign({})
    },
    // 显示编辑界面
    handleEdit: function (params) {
      let _this = this;
      _this.dialogVisible = true
      _this.operation = false
      // _this.dataForm = Object.assign({}, params.row)
      console.log(params);
      var date1;
      if(params.row.period == '按月'){
        date1 = 'byMonth';
      }else if(params.row.period == '按年'){
        date1 = 'byYear';
      }
      _this.dataForm = {
        type:params.row.machineType,
        number:params.row.machineNumber,
        cycle:date1,
        time:params.row.changeMaintenanceDate
      }
      _this.refForm = {
        assume:params.row.ddPerson,
        liable:params.row.userId,
        remark:params.row.remark
      }
      _this.radio = params.row.type;
      _this.id = params.row.id;
      // let userRoles = []
      // for(let i=0,len=params.row.userRoles.length; i<len; i++) {
      //  userRoles.push(params.row.userRoles[i].roleId)
      // }
      // this.dataForm.userRoles = userRoles
    },
    // 编辑
    submitForm: function () {
      let _this = this;
      if(_this.operation){
        _this.$refs.dataForm.validate((valid) => {
          if (valid) {
            _this.$refs.refForm.validate((validA) => {
              if (validA) {
            // this.$confirm('确认提交吗？', '提示', {}).then(() => {
                _this.editLoading = true
                _this.addParams = {
                  machineType : _this.dataForm.type,
                  machineNumber: _this.dataForm.number,
                  type: _this.radio,
                  period: _this.dataForm.cycle,
                  changeMaintenanceDate: _this.dataForm.time,
                  ddPerson: _this.refForm.assume,
                  userId: _this.refForm.liable,
                  remark: _this.refForm.remark
                }
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
                    url:'/xaj/maintenance/addMaintenancePlan',
                    data:_this.addParams,
                    success:function(data){
                      console.log(data);
                      _this.dialogVisible = false;
                      _this.editLoading = false;
                      _this.findPage(null);
                      _this.$refs['dataForm'].resetFields();
                      _this.$refs['refForm'].resetFields();
                      _this.radio = "A类";
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
            _this.$refs.refForm.validate((validA) => {
              if (validA) {
                _this.editLoading = true
                _this.dataForm.time = new Date(_this.dataForm.time);
                _this.addParams = {
                  machineType : _this.dataForm.type,
                  machineNumber: _this.dataForm.number,
                  type: _this.radio,
                  period: _this.dataForm.cycle,
                  changeMaintenanceDate: _this.dataForm.time,
                  ddPerson: _this.refForm.assume,
                  userId: _this.refForm.liable,
                  remark: _this.refForm.remark,
                  id:_this.id
                }
                $.ajax({
                    type:'GET',
                    url:'/xaj/maintenance/updateMaintenancePlan',
                    data:_this.addParams,
                    success:function(data){
                      console.log(data);
                      _this.dialogVisible = false;
                      _this.editLoading = false;
                      _this.findPage(null);
                      _this.$refs['dataForm'].resetFields();
                      _this.$refs['refForm'].resetFields();
                      _this.radio = "A类";
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
        // {prop:"id", label:"序号", minWidth:50},
        {prop:"machineType", label:"设备类型", minWidth:110},
        {prop:"machineNumber", label:"设备编号", minWidth:160},
        // {prop:"quantity", label:"数量", minWidth:70},
        {prop:"groupName", label:"归口部门", minWidth:100},
        {prop:"type", label:"类别", minWidth:90},
        {prop:"period", label:"保养周期", minWidth:90},
        {prop:"maintenanceDate", label:"保养时间", minWidth:100},
        {prop:"ddPerson", label:"担当人", minWidth:100},
        {prop:"zrPerson", label:"责任人", minWidth:120}, 
        {prop:"remark",label:"备注",minWidth:70},
        {prop:"updateTime", label:"新增时间", minWidth:160}
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
      handleChange(val){
        let _this = this;
        _this.deviceNum = [];
        if(_this.dataForm.number != undefined){
          _this.dataForm.number = undefined;
        }
        $.ajax({
            type:'GET',
            data:{machineType:val},
            url:'/xaj/maintenance/findMachineData',
            success:function(data){
              // console.log(data);
              $.each(data,function(index,value){
                _this.deviceNum.push({label:value.nameNumber,value:value.machineNumber});
              });
            }
        })
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
    _this.initColumns();
    $.ajax({
        type:'GET',
        url:'/xaj/maintenance/findAllMachineType',
        success:function(data){
          // console.log(data);
          $.each(data,function(index,value){
            _this.device.push({value:value});
          });
        }
    })
    $.ajax({
        type:'GET',
        url:'/xaj/user/findUserByRoleId',
        data:{
          roleId:6
        },
        success:function(data){
          // console.log(data);
          $.each(data,function(index,value){
            _this.zrList.push({name:value.name,userId:value.userId});
          });
        }
    })
    console.log(_this.zrList);
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
.planDialog .inputLengthA .el-select{
  width: 34%;
}
.planDialog .inputLengthA .el-date-editor{
  width: 34%;
}
.planDialog .inputLengthB .el-select{
  width: 94%;
}
.planDialog .inputLengthA .el-input--prefix .el-input__inner{
  padding-left:15px;
}
.planDialog .inputLengthA .el-input__prefix{
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
</style>