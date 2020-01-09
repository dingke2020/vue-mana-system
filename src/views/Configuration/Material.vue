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
      <el-form-item label="" style="width:150px;">
        <el-select v-model="group" size="medium" placeholder="请选择部门">
          <el-option v-for="(item,index) in departments" :label="item.label" :value="item.value" :key="index"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item style="width:120px;">
        <el-select v-model="select" size="medium" placeholder="所有状态">
            <el-option label="禁用" value="0"></el-option>
            <el-option label="正常" value="1"></el-option>
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
  </div>
  <!--表格内容栏-->
  <Configuration-material-table :height="tableHeight" :data="pageResult" :columns="filterColumns" :rowstatus="tableRowClassName" @findPage="findPage" @handleEdit="handleEdit" @handleDelete="handleDelete" @handle-lock="handleLock" :rowA="rowA" :rowB="rowB" :rowC="rowC" :text="text">
  </Configuration-material-table>
  <!--新增编辑界面-->
  <el-dialog :title="operation?'新增':'修改'" width="50%" :visible.sync="dialogVisible" custom-class="materialDialog" center>
    <el-form label-width="100px" :size="size" label-position="right">
      <el-form :model="dataForm" :rules="dataFormRules" ref="dataForm" :inline="true" label-width="100px" class="demo-form-inline">
        <el-form-item label="物料名称" prop="name">
          <el-input id="materialName" v-model="dataForm.name"></el-input>
        </el-form-item>
        <el-form-item label="物料编码" prop="code">
          <el-input id="materialCode" v-model="dataForm.code"></el-input>
        </el-form-item>
        <el-form-item label="规格型号" prop="type">
          <el-input id="materialType" v-model="dataForm.type"></el-input>
        </el-form-item>
        <el-form-item label="基本单位" class="inputLengthB" prop="unit">
          <el-select v-model="dataForm.unit" placeholder="请选择单位">
            <el-option v-for="(item,index) in unitArr" :label="item.label" :value="item.value" :key="index"></el-option>
            <!-- <el-option label="只" value="1"></el-option>
            <el-option label="块" value="2"></el-option>
            <el-option label="根" value="3"></el-option>
            <el-option label="片" value="4"></el-option> -->
          </el-select>
        </el-form-item>
        <el-form-item label="所属部门" class="inputLengthB" prop="group">
          <el-select v-model="dataForm.group" size="medium" placeholder="请选择部门">
            <el-option v-for="(item,index) in departments" :label="item.label" :value="item.value" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="所属车间" class="inputLengthB" prop="department">
          <el-select v-model="dataForm.department" placeholder="请选择车间">
            <el-option v-for="(item,index) in department" :label="item.label" :value="item.value" :key="index"></el-option>
          </el-select>
        </el-form-item> -->
      </el-form>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="medium" @click.native="dialogVisible = false" class="cancel-button">取消</el-button>
      <el-button size="medium" type="primary" @click.native="submitForm" :loading="editLoading" class="define-button">确定</el-button>
    </div>
  </el-dialog>
  <!--导入界面-->
  <el-dialog title="导入" width="50%" :visible.sync="dialogVisibleB" custom-class="dialogConfiguration" center>
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
import ConfigurationMaterialTable from "@/views/Core/ConfigurationMaterialTable"
import { format } from "@/utils/datetime"
import axios from 'axios'
export default {
  components:{
    ConfigurationMaterialTable
  },
  data() {
    var checkMissionNumber = (rule, value, callback) => {
      if(!value){
        return callback(new Error('请输入物料编码'));
      }
      var params = {
        materialCode:value,
      }
      if(value == this.initCode){
        console.log("原编码："+this.initCode);
        callback();
      }else{
        $.ajax({
          type:'GET',
          url:'/xaj/configuration/sameMaterial',
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
      isRole:false,
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
      text:[],
      filterColumns: [],
      pageRequest: { currPage: 1, pageSize: 10 },
      pageParams: {},
      pageResult: {},
      operation: false, // true:新增, false:编辑
      dialogVisible: false, // 新增编辑界面是否显示
      dialogVisibleB: false, // 导入界面是否显示
      editLoading: false,
      dataFormRules: {
        name: [
          { required:true,message:'请输入物料名称', trigger:'blur' }
        ],
        code: [
          { required:true,validator:checkMissionNumber, trigger:'blur' }
        ],
        type: [
          { required:true,message:'请输入规格型号', trigger:'blur' }
        ],
        unit: [
          { required:true,message:'请选择单位', trigger:'change' }
        ],
        group: [
          { required:true,message:'请选择部门', trigger:'change' }
        ],
        department: [
          { required: true,message: '请选择所属车间', trigger:'change'}
        ]
      },
      // 新增编辑界面数据
      dataForm: {
        id: 0,
        password: '123456',
        deptId: 1,
        deptName: '',
        email: 'test@qq.com',
        mobile: '13889700023',
        status: 1,
        // userRoles: [],
        file:'',
        time:'',
        planProduction:'',
        material:'',
        name: '',
        code: '',
        type:'',
        unit:'',
        group:'',
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
      select:'',
      material:{},
      materialAll:[],
      materialForm:{
        nameCode:''
      },
      addParams:{},
      unitArr:[
        {label:"只",value:"只"},
        {label:"块",value:"块"},
        {label:"根",value:"根"},
        {label:"片",value:"片"},
      ],
      department:[
        {value:'14',label:'塑焊车间'},
        {value:'16',label:'装配车间'},
        {value:'17',label:'金工车间'},
        {value:'18',label:'注塑车间'},
        {value:'20',label:'缠绕车间'}
      ],
      id:'',
      group:'',
      group2:'',
      departments:[
        {value:17,label:'金工车间'},
        {value:18,label:'注塑车间'},
        {value:20,label:'缠绕车间'}
      ],
      initCode:'',
      downloadUrl:'',
      fileUrl:''
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
        data.pageRequest.groupId = _this.group;
        _this.pageRequest = data.pageRequest
      }
      //这里是不调接口的
      _this.$api.configuration.findPageMaterial(_this.pageRequest).then((res) => {
        console.log(res);
        var materialArray = res.data.data.material.data;
        materialArray.forEach(function(value,index){
          switch(value.status){
            case 0:
              value.status = '禁用';
              break;
            case 1:
              value.status = '正常';
          }
          if(value.id<10){
            value.id = '0'+value.id;
          }
        })
        _this.pageResult = res.data.data.material;
        console.log(_this.pageResult)
        // this.findUserRoles()
      }).then(data!=null?data.callback:'')
      _this.$api.configuration.findPageMaterial(_this.pageRequest).then((res) => {
        console.log(res);
        var materialArray = res.data.data;
        materialArray.forEach(function(value,index){
          switch(value.status){
            case 0:
              value.status = '禁用';
              break;
            case 1:
              value.status = '正常';
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
    // 查询分页数据
    searchPage: function () {
      let _this = this;
      if(_this.dataForm.material==""){
        _this.materialForm.nameCode = "";
      }
      _this.pageParams = {currPage: 1, pageSize: 10,status: _this.select,nameCode: _this.dataForm.material,groupId:_this.group};
      _this.pageRequest.pageSize = 10;
      _this.pageRequest.currPage = 1;
      _this.$api.configuration.findPageMaterial(_this.pageParams).then((res) => {
        console.log(res);
        var materialArray = res.data.data;
        materialArray.forEach(function(value,index){
          switch(value.status){
            case 0:
              value.status = '禁用';
              break;
            case 1:
              value.status = '正常';
          }
          if(value.id<10){
            value.id = '0'+value.id;
          }
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
      console.log(data);
      let _this = this;
      var params = {id:data.params[0].id};
      // this.$api.task.batchDelete(data.params).then(data!=null?data.callback:'')
      $.ajax({
        type:'POST',
        url:'/xaj/configuration/deleteMaterial',
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
      console.log(params);
      _this.dialogVisible = true
      _this.operation = false
      _this.initCode = params.row.materialCode;
      _this.dataForm = {
        name:params.row.materialName,
        code:params.row.materialCode,
        type:params.row.specifications,
        unit:params.row.type,
        group:params.row.productionDepartment
      }
      _this.id = params.row.id;
      // let userRoles = []
      // for(let i=0,len=params.row.userRoles.length; i<len; i++) {
      //  userRoles.push(params.row.userRoles[i].roleId)
      // }
      // this.dataForm.userRoles = userRoles
    },
    // 显示导入界面
    handleImport: function () {
      let _this = this;
      // var baseUrl = 'http://192.168.101.252:8080';
      var baseUrl = axios.defaults.baseURL;
      console.log(baseUrl);
      var groupId = parseInt(localStorage.getItem('groupId'));
      var userName = localStorage.getItem('name');
      _this.dialogVisibleB = true;
      _this.downloadUrl = baseUrl+'/xaj/configuration/downloadMaterialTp';
      _this.fileUrl = baseUrl+'/xaj/configuration/importMaterial?groupId='+groupId+'&userName='+userName;
      // this.dataForm = Object.assign({}, params.row)
      // let userRoles = []
      // for(let i=0,len=params.row.userRoles.length; i<len; i++) {
      //  userRoles.push(params.row.userRoles[i].roleId)
      // }
      // this.dataForm.userRoles = userRoles
    },
    handleLock:function(data){
        let _this = this;
        // console.log(arr);
        // this.lockId = arr[1].id;
        // this.lockStatus = arr[1].isLock;
        // this.dialogVisibleB = true;
        $.ajax({
        type:'POST',
        url:'/xaj/configuration/updateMaterialStatus',
        data:data.params,
        success:function(res){
          console.log(res);
          // this.$message({ message: '操作成功', type: 'success' })
          // _this.dialogVisibleB = false;
          _this.editLoading = false;
          // _this.$refs['dataForm'].resetFields()
        }
      }).then(data!=null?data.callback:'')
    },
    // 编辑
    submitForm: function () {
      let _this = this;
      if(_this.operation){
        //这里是新增
        _this.$refs.dataForm.validate((valid) => {
          if (valid) {
              _this.editLoading = true;
              _this.addParams = {
                materialName:_this.dataForm.name,
                materialCode:_this.dataForm.code,
                specifications:_this.dataForm.type,
                type:_this.dataForm.unit,
                groupId:_this.dataForm.group
              }
              console.log(_this.addParams);
              $.ajax({
                  type:'GET',
                  url:'/xaj/configuration/addMaterial',
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
              _this.editLoading = true;
              _this.addParams = {
                materialName:_this.dataForm.name,
                materialCode:_this.dataForm.code,
                specifications:_this.dataForm.type,
                type:_this.dataForm.unit,
                groupId:_this.dataForm.group,
                id:_this.id
              }
              console.log(_this.addParams);
              $.ajax({
                  type:'GET',
                  url:'/xaj/configuration/updateMaterial',
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
        {prop:"productionDepartment", label:"部门", minWidth:120},
        {prop:"materialName", label:"物料名称", minWidth:200},
        {prop:"materialCode", label:"物料编码", minWidth:150},
        {prop:"specifications", label:"规格型号", minWidth:150},
        {prop:"type", label:"基本单位", minWidth:120},
        {prop:"updateTime", label:"新增时间", minWidth:150},
        {prop:"status", label:"状态", minWidth:100},
      ]
      this.filterColumns = JSON.parse(JSON.stringify(this.columns));
        },
      handleSuccess(response,file,fileList){
        let _this = this;
        console.log(response);
        setTimeout(function(){
        _this.dialogVisibleB = false;
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
        //   {value:"无油立式真空泵气缸体（WLW100-01）",name:"无油立式真空泵气缸体",code:"WLW100-01",type:"WLW-100"},
        //   {value:"无油立式真空泵气缸体（WLW150-01）",name:"无油立式真空泵气缸体",code:"WLW150-01",type:"WLW-150"},
        //   {value:"无油立式真空泵连杆（WLW150-6601）",name:"无油立式真空泵连杆",code:"WLW150-6601",type:"WLW-150"},
        //   {value:"无油立式真空泵气缸盖(上）（WLW100-02-S）",name:"无油立式真空泵气缸盖(上）",code:"WLW100-02-S",type:"WLW-100"}
        // ]
      },
      handleSelect(item){
        console.log(item);
        this.materialForm = {nameCode:item.value};
        console.log(this.materialForm);
        // $("#materialName").val(item.name);
        // $("#materialCode").val(item.code);
        // $("#materialType").val(item.type);
      },
      tableRowClassName({row, rowIndex}){
        var length = $(".el-table .el-table__body-wrapper tbody tr:eq(0) td").length - 1;
        if(row.status == "正常"){
          $(".el-table .el-table__body-wrapper tbody tr:eq("+rowIndex+") td:eq("+(length-1)+")").css({"color":"#3F51B5"});
          if(this.rowA.indexOf(rowIndex)<0){
            this.rowA.push(rowIndex);
          }
          if(this.rowB.indexOf(rowIndex)<0){
            this.rowB.push(rowIndex);
          }
          if(this.rowC.indexOf(rowIndex)<0){
            this.rowC.push(rowIndex);
          }
          if(this.text.indexOf(rowIndex)<0){
            this.text.push(rowIndex);
          }
        }else if(row.status == "禁用"){
          $(".el-table .el-table__body-wrapper tbody tr:eq("+rowIndex+") td:eq("+(length-1)+")").css({"color":"#E51C23"});
          if(this.rowA.indexOf(rowIndex)<0){
            this.rowA.push(rowIndex);
          }
          if(this.text.indexOf(rowIndex)>-1){
            this.text.splice(this.text.indexOf(rowIndex),1);
          }
          if(this.rowB.indexOf(rowIndex)>-1){
            this.rowB.splice(this.rowB.indexOf(rowIndex),1);
          }
          if(this.rowC.indexOf(rowIndex)>-1){
            this.rowC.splice(this.rowC.indexOf(rowIndex),1);
          }
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
    // if(parseInt(localStorage.getItem('roleId'))==1||parseInt(localStorage.getItem('roleId'))==2){
    //   _this.isRole = true;
    // }else{
    //   _this.isRole = false;
    // }
    _this.initColumns();
    console.log(_this.filterColumns);
    setTimeout(function(){
      $.ajax({
          type:'GET',
          url:'/xaj/configuration/searchAllMaterial',
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
                  if(nameArr[i].value == newArr[index].materialName){
                    flag=false;
                  }
                })
              }
              if(flag){
                nameArr.push({value:newArr[index].materialName});
              }
            })
            var codeArr = [];
            $.each(newArr,function(index,value){
              var flag = true;
              if(codeArr.length>0){
                $.each(codeArr,function(i,a){
                  if(codeArr[i].value == newArr[index].materialCode){
                    flag=false;
                  }
                })
              }
              if(flag){
                codeArr.push({value:newArr[index].materialCode});
              }
            })
            _this.materialAll = nameArr.concat(codeArr);
            console.log(_this.materialAll);
          }
        })
    },500)
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
.materialDialog .inputLengthB .el-select{
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
.dialogConfiguration .el-upload-list{
  position: absolute;
  top:0;
  padding:0px 5px 5px;
  border:1px solid #bbb;
  width: 100%;
  height: 50px;
  box-sizing: border-box;
}
.el-upload__tip{
  font-size: 14px;
}
.dialogConfiguration .el-upload{
  width: 100%;
}
.dialogConfiguration .el-upload .el-button{
  background: #009688;
  border-color: #fff;
  font-size: 28px;
  font-family: 'Microsoft Yahei';
  color: #fff;
  width: 100%;
  height: 80px;
}
</style>