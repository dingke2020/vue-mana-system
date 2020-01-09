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
      <el-form-item style="width:120px;">
        <el-select v-model="selectMachineType" size="medium" placeholder="设备类型">
            <el-option v-for="(item,index) in machineType" :label="item.value" :value="item.value" :key="index"></el-option>
          </el-select>
      </el-form-item>
      <el-form-item style="width:120px;">
        <el-select v-model="selectProcessName" size="medium" placeholder="工序名称">
            <el-option v-for="(item,index) in processName" :label="item.value" :value="item.value" :key="index"></el-option>
          </el-select>
      </el-form-item>
      <el-form-item>
        <!-- <el-input v-model="filters.name" prefix-icon="iconfont icon-ali-search" size="medium" style="color:#101010" placeholder="请输入物料名称或物料编码"></el-input> -->
        <el-autocomplete  prefix-icon="iconfont icon-ali-search" size="medium" style="color:#101010" popper-class="auto-select" v-model="dataForm.material" :fetch-suggestions="querySearch" placeholder="请输入物料名称或物料编码" :trigger-on-focus="false" @select="handleSelect" clearable></el-autocomplete>
      </el-form-item>
      <el-form-item>
        <el-button size="medium" @click="searchPage()" :style="{'background-color':themeColor,'color':'#fff','border-color':themeColor}">查询</el-button>
      </el-form-item>
    </el-form>
  </div>
  <!--表格内容栏-->
  <Process-table :height="tableHeight" :data="pageResult" :columns="filterColumns" @findPage="findPage" @handleCheck="handleCheck" @handleEdit="handleEdit" @handleDelete="handleDelete">
  </Process-table>
  <!--新增编辑界面-->
  <el-dialog :title="operation?'新增':'修改'" width="50%" :visible.sync="dialogVisible" custom-class="processDialog" center>
    <el-form :model="dataForm" label-width="120px" :rules="dataFormRules" ref="dataForm" :size="size"
      label-position="right" id="form">
      <el-form :inline="true" label-width="120px" class="demo-form-inline" :model="matForm" :rules="matFormRules" ref="matForm">
          <el-form-item label="物料名称" prop="materialName">
            <el-input id="materialName" v-model="matForm.materialName"></el-input>
          </el-form-item>
          <el-form-item label="物料编码" prop="materialCode">
            <el-input id="materialCode" v-model="matForm.materialCode"></el-input>
          </el-form-item>
          <el-form-item label="加工工序" prop="procedure">
            <el-input id="procedure" v-model="matForm.procedure"></el-input>
          </el-form-item>
          <el-form-item label="设备类型" class="inputLengthA" prop="type">
            <el-select v-model="matForm.type" size="medium" placeholder="设备类型">
                <el-option v-for="(item,index) in machineType" :label="item.value" :value="item.value" :key="index"></el-option>
              </el-select>
          </el-form-item>
      </el-form>
      <el-form-item label="程序号" class="inputLength" prop="programNumber">
        <el-input id="programNumber" v-model="dataForm.programNumber"></el-input>
      </el-form-item>
      <el-form-item label="程序文件">
        <!-- <input id="avatar" type="file" name="avatar" accept="image/png,image/jpeg"> -->
        <el-upload id="file" class="" :action="fileUrl" :file-list="fileList" :before-upload="beforeUpload" drag>
          <i class="iconfont icon-ali-folder"></i>
          <div class="el-upload__text text-click">点击或将程序文件拖拽到这里上传</div>
          <div class="el-upload__text text-fileType">支持扩展名：.rar .zip .doc .docx .pdf .jpg...</div>
        </el-upload>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="medium" @click.native="dialogVisible = false" class="cancel-button">取消</el-button>
      <el-button size="medium" type="primary" @click.native="submitForm" :loading="editLoading" class="define-button">确定</el-button>
    </div>
  </el-dialog>
  <el-dialog title="查看" width="50%" :visible.sync="dialogVisibleB" custom-class="processDialog" center>
    <el-form :model="refForm" label-width="120px" :rules="refFormRules" ref="refForm" :size="size"
      label-position="right">
      <el-form :inline="true" label-width="120px" class="demo-form-inline">
          <el-form-item label="物料名称">
            <el-input id="materialName" v-model="material.materialName" disabled></el-input>
          </el-form-item>
          <el-form-item label="物料编码">
            <el-input id="materialCode" v-model="material.materialCode" disabled></el-input>
          </el-form-item>
          <el-form-item label="加工工序">
            <el-input id="procedure" v-model="material.procedure" disabled></el-input>
          </el-form-item>
          <el-form-item label="设备类型" class="inputLengthA">
            <el-select v-model="material.type" size="medium" placeholder="设备类型" disabled>
                <el-option v-for="(item,index) in machineType" :label="item.value" :value="item.value" :key="index"></el-option>
              </el-select>
          </el-form-item>
      </el-form>
      <!-- <el-form-item label="程序号" class="inputLength">
        <el-input id="programNumber" v-model="material.programNumber" disabled></el-input>
      </el-form-item>
      <el-form-item label="程序文件">
        <el-input type="textarea" :rows="10" resize="none" v-model="material.file" disabled></el-input>
      </el-form-item> -->
    </el-form>
  </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ProcessTable from "@/views/Core/ProcessTable"
import axios from 'axios'
import { format } from "@/utils/datetime"
export default {
  components:{
    ProcessTable
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
      form: {
        date1: '',
        date2: ''
      },
      filters: {
        name: ''
      },
      columns: [],
      filterColumns: [],
      pageRequest: { currPage: 1, pageSize: 10 },
      pageParams: { currPage: 1, pageSize: 10 },
      pageResult: {},
      operation: false, // true:新增, false:编辑
      dialogVisible: false, // 新增编辑界面是否显示
      dialogVisibleB: false,
      editLoading: false,
      dataFormRules: {
        programNumber:[
          { required: true, message: '请输入程序号', trigger: 'blur' }
        ]
      },
      refFormRules: {

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
        materialName:'',
        materialCode:'',
        procedure:'',
        type:'',
        programNumber:'',
        material:''
      },
      refForm: {
      },
      matFormRules:{
        materialName:[
          { required: true, message: '请输入物料名称', trigger: 'blur' }
        ],
        materialCode:[
          { required: true, message: '请输入物料编码', trigger: 'blur' }
        ],
        procedure:[
          { required: true, message: '请输入加工工序', trigger: 'blur' }
        ],
        type:[
          { required: true, message: '请选择设备类型', trigger: 'change' }
        ]
      },
      matForm:{
        materialName:'',
        materialCode:'',
        procedure:'',
        type:''
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
      fileList:[
        // {
        //   name:'food.jpeg',
        //   url:'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
        // }
      ],
      isSuccess:true,
      tips:'',
      planTime:{
        date1:'',
        date2:''
      },
      selectMachineType:'',
      selectProcessName:'',
      machineType:[
        // {label:"车床",val:"1#"},
        // {label:"钻床",val:"2#"},
        // {label:"铣床",val:"3#"},
        // {label:"磨床",val:"4#"},
        // {label:"刨床",val:"5#"},
        // {label:"加工中心",val:"6#"}
      ],
      processName:[
        // {label:"内磨圆",val:"1#"},
        // {label:"加工中心",val:"2#"}
      ],
      materialAll:[],
      material:{},
      materialForm:{
        name:'',
        code:'',
        type:''
      },
      show:false,
      fileUrl:'',
      file:'',
      param:'',
      id:'',
      fileName:''
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
        // data.pageRequest.procedureNum = _this.selectMachineType;
        data.pageRequest.productionProcessesName = _this.selectProcessName;
        data.pageRequest.nameCode = _this.dataForm.material;
        _this.pageRequest = data.pageRequest
      }
      _this.$api.process.findPage(_this.pageRequest).then((res) => {
        console.log(res);
        var processArray = res.data.data;
        processArray.forEach(function(value,index){
          
        })
        _this.pageResult = res.data;
        console.log(_this.pageResult)
        // this.findUserRoles()
      }).then(data!=null?data.callback:'')
    },
    // 查询分页数据
    searchPage: function () {
      let _this = this;
      if(_this.dataForm.material==""){
        _this.materialForm.code = "";
      }
      _this.pageParams = {currPage: 1, pageSize: 10,productionProcessesName:_this.selectProcessName,nameCode: _this.dataForm.material};
      _this.pageRequest.pageSize = 10;
      _this.pageRequest.currPage = 1;
      _this.$api.process.findPage(_this.pageParams).then((res) => {
        console.log(res);
        var processArray = res.data.data;
        processArray.forEach(function(value,index){
          
        })
        _this.pageResult = res.data;
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
      this.$api.configuration.batchDelete(data.params).then(data!=null?data.callback:'')
    },
    // 显示新增界面
    handleAdd: function () {
      let _this = this;
      // var baseUrl = 'http://192.168.101.252:8080';
      var baseUrl = axios.defaults.baseURL;
      _this.dialogVisible = true
      _this.operation = true
      _this.dataForm = Object.assign({})
      _this.matForm = Object.assign({})
      _this.fileUrl = baseUrl+'/xaj/process/fileUpload';
      _this.fileList = []
    },
    // 显示查看页面
    handleCheck: function(params) {
      this.dialogVisibleB = true
      console.log(params);
      this.material = Object.assign({}, params.row);
      console.log(this.material);
    },
    // 显示编辑界面
    handleEdit: function (params) {
      let _this = this;
      // var baseUrl = 'http://192.168.101.252:8080';
      var baseUrl = axios.defaults.baseURL;
      _this.dialogVisible = true
      _this.operation = false
      // _this.dataForm = Object.assign({}, params.row)
      _this.fileUrl = baseUrl+'/xaj/process/fileUpload';
      console.log(params);
      _this.dataForm = {
        programNumber:params.row.procedureNum
      }
      _this.matForm = {
        materialName:params.row.materialName,
        materialCode:params.row.materialCode,
        procedure:params.row.productionProcessesName
      }
      _this.fileList = []
      _this.id = params.row.id;
      _this.fileName = params.row.fileName;
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
        _this.$refs.matForm.validate((valid) => {
          if (valid) {
            _this.$refs.dataForm.validate((validA) => {
              if (validA) {
              _this.editLoading = true;
              _this.param.append("materialName",_this.matForm.materialName);
              _this.param.append("materialCode",_this.matForm.materialCode);
              _this.param.append("procedureNum",_this.dataForm.programNumber);
              _this.param.append("productionProcessesName",_this.matForm.procedure);
              // _this.param.append("machineType",_this.matForm.type);
              let config = {
                  headers: {
                      'Content-Type': 'multipart/form-data'
                  }
              };
              axios.post("/xaj/process/addProcedure", _this.param, config).then(function(data) {
                    console.log(data);
                    _this.dialogVisible = false;
                    _this.editLoading = false;
                    _this.findPage(null);
                    _this.$refs['dataForm'].resetFields();
                    _this.$refs['matForm'].resetFields();
                    if(data.status==true){
                      _this.$message({message: '新增成功', type: 'success'})
                    }
                })
              }
            })
          }
        })
      }else{
        _this.$refs.matForm.validate((valid) => {
          if (valid) {
            _this.$refs.dataForm.validate((validA) => {
            if (validA) {
              _this.editLoading = true;
              _this.param.append("materialName",_this.matForm.materialName);
              _this.param.append("materialCode",_this.matForm.materialCode);
              _this.param.append("procedureNum",_this.dataForm.programNumber);
              _this.param.append("productionProcessesName",_this.matForm.procedure);
              // _this.param.append("machineType",_this.matForm.type);
              _this.param.append("id",_this.id);
              _this.param.append("fileName",_this.fileName);
              let config = {
                  headers: {
                      'Content-Type': 'multipart/form-data'
                  }
              };
              axios.post("/xaj/process/updateProcedure", _this.param, config).then(function(data) {
                    console.log(data);
                    _this.dialogVisible = false;
                    _this.editLoading = false;
                    _this.findPage(null);
                    _this.$refs['dataForm'].resetFields();
                    _this.$refs['matForm'].resetFields();
                    if(data.status==true){
                      _this.$message({message: '修改成功', type: 'success'})
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
          // {prop:"id",label:"序号",minWidth:80},
          {prop:"procedureNum", label:"程序号", minWidth:80},
          {prop:"materialName", label:"物料名称", minWidth:160},
          {prop:"materialCode", label:"物料编码", minWidth:100},
          {prop:"productionProcessesName", label:"加工工序", minWidth:100},
          {prop:"machineType", label:"设备类型", minWidth:100},
          {prop:"fileName", label:"程序文件", minWidth:160},
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
        
      },
      handleChange(file,fileList){
        let _this = this;
        // _this.file = URL.createObjectURL(file.raw);
        _this.file = file;
        // _this.file = $("#file").children().eq(0).children().eq(1)[0];
        console.log(_this.file);
      },
      beforeUpload(file) {
          console.log(file);
          //创建临时的路径来展示图片
          // var windowURL = window.URL || window.webkitURL;
          
          // this.src=windowURL.createObjectURL(file);
          //重新写一个表单上传的方法
          this.param = new FormData();
          this.param.append('files', file, file.name);
          // return false;
      },
      querySearch(queryString,cb){
        var materialAll = this.materialAll;
        var results = queryString ? materialAll.filter(this.createFilter(queryString)) : materialAll;
        //调用callback返回建议列表的数据
        cb(results);
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
        //   {value:"无油立式真空泵气缸盖(上）（WLW100-02-S）",name:"无油立式真空泵气缸盖(上）",code:"WLW100-02-S",type:"WLW-100"},
        //   {value:"无油立式真空泵气缸盖(上）（WLW100-02-S）",name:"无油立式真空泵气缸盖(上）",code:"WLW100-02-S",type:"WLW-100"}
        // ]
      },
      handleSelect(item){
        console.log(item);
        this.materialForm = {name:item.name,code:item.code,type:item.type};
        console.log(this.materialForm);
      },
      procedureBind(arr){
        if(arr.length==0){
          this.show = true;
        }else{
          this.show = false;
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
    _this.initColumns();
    // console.log(_this.filterColumns);
    $.ajax({
        type:'GET',
        url:'/xaj/maintenance/findAllMachineType',
        success:function(data){
          // console.log(data);
          $.each(data,function(index,value){
            _this.machineType.push({value:value});
          });
        }
    })
    $.ajax({
        type:'GET',
        url:'/xaj/configuration/findAllProductionProcesses',
        success:function(data){
          // console.log(data);
          var newArr = [];
          $.each(data,function(index,value){
            if(value!==null){
              newArr.push(value);
            }
          })
          $.each(newArr,function(index,value){
            _this.processName.push({value:value.productionProcessesName})
          });
        }
    })
    setTimeout(function(){
      $.ajax({
          type:'GET',
          url:'/xaj/mission/searchMaterial',
          data:{materialName:''},
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
  }
}
</script>

<style>
.auto-select {
  width: auto !important;
}
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
.routeDialog .procedure-form-inline{
  padding:12px 30px;
  border:1px solid #bbb;
  margin-bottom:18px;
}
.tips_procedure{
  color:#E51C23;
  font-size: 14px;
  margin-left: 18px;
  font-family: 'SourceHanSansSC-regular';
  position: absolute;
  line-height: 24px;
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
.routeDialog .sub-title{
  font-size: 18px;
  color: #000;
  font-family: 'SourceHanSansSC-regular';
  margin-bottom:10px;
  padding-left: 30px;
}
.slide-fade-enter-active,.slide-fade-leave-active{
  transition: all .3s ease;
}
.slide-fade-enter,.slide-fade-leave-to{
  transform: translateY(10px);
  opacity: 0;
}
.processDialog .inputLength .el-input{
  width: 35%;
}
.processDialog .inputLengthA .el-select{
  width: 94%;
}
.processDialog .icon-ali-folder{
  font-size: 48px;
  color: #1890FF;
  margin-top: 36px;
  margin-bottom: 21px;
  display: block;
}
.processDialog .text-click{
  color: #000;
  font-size: 16px;
  font-family: 'PingFangSC-regular';
}
.processDialog .text-fileType{
  color:rgba(0,0,0,0.43);
  font-size: 14px;
  font-family: 'PingFangSC-regular';
}
</style>