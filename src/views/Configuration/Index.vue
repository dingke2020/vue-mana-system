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
  <Configuration-table :height="tableHeight" :data="pageResult" :columns="filterColumns" @findPage="findPage" @handleEdit="handleEdit" @handleDelete="handleDelete">
  </Configuration-table>
  <!--新增编辑界面-->
  <el-dialog :title="operation?'新增':'修改'" width="50%" :visible.sync="dialogVisible" custom-class="processDialog" center>
    <el-form label-width="100px" :size="size" label-position="right">
      <el-form :model="dataForm" :rules="dataFormRules" ref="dataForm" :inline="true" label-width="100px" class="demo-form-inline">
        <el-form-item label="工序名称" prop="name">
          <el-input id="processName" v-model="dataForm.name"></el-input>
        </el-form-item>
        <el-form-item label="工序编码" prop="code">
          <el-input id="processCode" v-model="dataForm.code"></el-input>
        </el-form-item>
        <el-form-item label="所属部门" class="inputLengthB" prop="department">
          <el-select v-model="dataForm.department" placeholder="请选择部门">
            <!-- <el-option label="金工班" value="1"></el-option>
            <el-option label="注塑班" value="2"></el-option>
            <el-option label="模压班" value="3"></el-option> -->
            <el-option v-for="(item,index) in departments" :label="item.value" :value="item.value" :key="index"></el-option>
          </el-select>
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
import ConfigurationTable from "@/views/Core/ConfigurationTable"
import { format } from "@/utils/datetime"
export default {
  components:{
    ConfigurationTable
  },
  data() {
    var checkMissionNumber = (rule, value, callback) => {
      if(!value){
        return callback(new Error('请输入工序编码'));
      }
      var params = {
        productionProcessesCode:value
      }
      if(value == this.initCode){
        console.log("原编码："+this.initCode);
        callback();
      }else{
        $.ajax({
          type:'GET',
          url:'/xaj/configuration/sameProductionProcesses',
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
      tableHeight:null,
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
      pageResult: {},
      operation: false, // true:新增, false:编辑
      dialogVisible: false, // 新增编辑界面是否显示
      editLoading: false,
      dataFormRules: {
        name: [
          { required: true, message: '请输入工序名称', trigger: 'blur' }
        ],
        code: [
          { required: true, validator:checkMissionNumber, trigger: 'blur' }
        ],
        department: [
          { required: true, message: '请选择部门', trigger: 'change' }
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
        code:'',
        department:''
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
      procedure:{},
      department:'',
      departments:[
        {value:'塑焊车间',label:'塑焊车间'},
        {value:'装配车间',label:'装配车间'},
        {value:'金工车间',label:'金工车间'},
        {value:'注塑车间',label:'注塑车间'},
        {value:'缠绕车间',label:'缠绕车间'}
      ],
      addParams:{},
      initCode:'',
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
      if(data !== null) {
        _this.pageRequest = data.pageRequest
      }
      //这里是不调接口的
      _this.$api.configuration.findPageProcess(_this.pageRequest).then((res) => {
        console.log(res);
        var processArray = res.data.data.production_processes.data;
        processArray.forEach(function(value,index){
          if(value.id<10){
            value.id = '0'+value.id;
          }
        })
        _this.pageResult = res.data.data.production_processes;
        console.log(_this.pageResult)
        // this.findUserRoles()
      }).then(data!=null?data.callback:'')
      _this.$api.configuration.findPageProcess(_this.pageRequest).then((res) => {
        console.log(res);
        var processArray = res.data.data;
        processArray.forEach(function(value,index){
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
        url:'/xaj/configuration/deleteProductionProcesses',
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
    },
    // 显示编辑界面
    handleEdit: function (params) {
      let _this = this;
      _this.dialogVisible = true
      _this.operation = false
      console.log(params);
      _this.initCode = params.row.productionProcessesCode;
      _this.dataForm = {
        name:params.row.productionProcessesName,
        code:params.row.productionProcessesCode,
        department:params.row.deptment
      }
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
        //这里是新增
        _this.$refs.dataForm.validate((valid) => {
          if (valid) {
              _this.editLoading = true
              _this.addParams = {
                productionProcessesName:_this.dataForm.name,
                productionProcessesCode:_this.dataForm.code,
                deptment:_this.dataForm.department
              }
              console.log(_this.addParams);
              $.ajax({
                  type:'GET',
                  url:'/xaj/configuration/addProductionProcesses',
                  data:_this.addParams,
                  success:function(data){
                    console.log(data);
                    _this.dialogVisible = false;
                    _this.editLoading = false;
                    _this.findPage(null);
                    _this.$refs['dataForm'].resetFields();
                    if(data.status==true){
                      _this.$message({message: '新增成功', type: 'success'})
                    }
                  }
              })
          }
        })
      }else{
        //这里是修改
        _this.$refs.dataForm.validate((valid) => {
          if (valid) {
              _this.editLoading = true
              _this.addParams = {
                productionProcessesName:_this.dataForm.name,
                productionProcessesCode:_this.dataForm.code,
                deptment:_this.dataForm.department,
                id:_this.id
              }
              console.log(_this.addParams);
              $.ajax({
                  type:'GET',
                  url:'/xaj/configuration/updateProductionProcesses',
                  data:_this.addParams,
                  success:function(data){
                    console.log(data);
                    _this.dialogVisible = false;
                    _this.editLoading = false;
                    _this.findPage(null);
                    _this.$refs['dataForm'].resetFields();
                    if(data.status==true){
                      _this.$message({message: '修改成功', type: 'success'})
                    }
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
        // {prop:"id",label:"序号",minWidth:100},
        {prop:"productionProcessesName", label:"工序名称", minWidth:200},
        {prop:"productionProcessesCode", label:"工序编码", minWidth:200},
        {prop:"deptment", label:"所属部门", minWidth:200},
        {prop:"updateTime", label:"新增时间", minWidth:200}
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
    console.log(_this.filterColumns);
    // $.ajax({
    //     type:'GET',
    //     url:'/xaj/maintenance/findAllGroup',
    //     success:function(data){
    //       // console.log(data);
    //       $.each(data,function(index,value){
    //         _this.departments.push({value:value});
    //       });
    //     }
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
.processDialog .inputLengthB .el-select{
  width: 94%;
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
  height:400px;
  overflow: auto;
}
</style>