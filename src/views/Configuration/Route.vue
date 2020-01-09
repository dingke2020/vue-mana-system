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
      <el-form-item style="width:120px;">
        <el-select v-model="select" size="medium" placeholder="所有状态">
            <el-option label="禁用" value="0"></el-option>
            <el-option label="正常" value="1"></el-option>
          </el-select>
      </el-form-item>
      <el-form-item>
        <!-- <el-input v-model="filters.name" prefix-icon="iconfont icon-ali-search" size="medium" style="color:#101010" placeholder="请输入工艺路线名称或编码"></el-input> -->
        <el-autocomplete  prefix-icon="iconfont icon-ali-search" size="medium" style="color:#101010" popper-class="auto-select" v-model="dataForm.route" :fetch-suggestions="querySearch2" placeholder="请输入工艺路线名称或编码" :trigger-on-focus="false" @select="handleSelect2" clearable></el-autocomplete>
      </el-form-item>
      <el-form-item>
        <el-button size="medium" @click="searchPage()" :style="{'background-color':themeColor,'color':'#fff','border-color':themeColor}">查询</el-button>
      </el-form-item>
    </el-form>
  </div>
  <!--表格内容栏-->
  <Configuration-route-table :height="tableHeight" :data="pageResult" :columns="filterColumns" :rowstatus="tableRowClassName" @findPage="findPage" @handleEdit="handleEdit" @handleDelete="handleDelete" :rowB="rowB" :rowC="rowC">
  </Configuration-route-table>
  <!--新增编辑界面-->
  <el-dialog :title="operation?'新增':'修改'" width="50%" :visible.sync="dialogVisible" custom-class="routeDialog" center>
    <el-form label-width="130px" :size="size" label-position="right">
      <el-form :model="dataForm" :rules="dataFormRules" ref="dataForm" :inline="true" label-width="130px">
        <el-form-item label="工艺路线名称" prop="name">
          <el-input id="routeName" v-model="dataForm.name"></el-input>
        </el-form-item>
        <el-form-item label="工艺路线编码" prop="code">
          <el-input id="routeCode" v-model="dataForm.code"></el-input>
        </el-form-item>
        <el-form-item label="物料编码" prop="number">
          <el-input id="materialCode" v-model="dataForm.number"></el-input>
        </el-form-item>
        <el-form-item label="关联物料" prop="material">
          <el-autocomplete popper-class="auto-select" v-model="dataForm.material" :fetch-suggestions="querySearch" placeholder="请输入内容" :trigger-on-focus="false" @select="handleSelect" clearable></el-autocomplete>
        </el-form-item>
        <el-form :inline="true" label-width="130px" class="demo-form-inline" :model="materialForm" ref="materialForm">
            <el-form-item label="物料名称" prop="name">
              <el-input id="materialName" v-model="materialForm.name" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="规格型号" prop="type">
              <el-input id="materialType" v-model="materialForm.type" :disabled="true"></el-input>
            </el-form-item>
        </el-form>
        <div class="sub-title">关联工序
            <transition name="slide-fade"><span v-if="show" class="tips_procedure">请选择该设备生产相关的工序</span></transition>
        </div>
        <el-form-item label-width="0" class="procedure-form-inline">
            <el-checkbox-group v-model="equipment.procedure" @change="handleWelfareTreatmentChange">
              <el-checkbox name="fulicheckbox" v-for="(item,index) in procedures" :label="item.label" :value="item.value" :key="index" :data-value="item.value"></el-checkbox>
            </el-checkbox-group>
        </el-form-item>
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
import ConfigurationRouteTable from "@/views/Core/ConfigurationRouteTable"
import { format } from "@/utils/datetime"
import axios from 'axios'
export default {
  components:{
    ConfigurationRouteTable
  },
  data() {
    var checkMissionNumber = (rule, value, callback) => {
      if(!value){
        return callback(new Error('请输入物料编码'));
      }
      var params = {
        materialCode:value,
      }
      if(value == this.initMaterialCode){
        console.log("原编码："+this.initMaterialCode);
        callback();
      }else{
        $.ajax({
          type:'GET',
          url:'/xaj/configuration/sameRoutingMaterial',
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
    var checkMissionNumber2 = (rule, value, callback) => {
      if(!value){
        return callback(new Error('请输入工艺路线编码'));
      }
      var params = {
        routingCode:value,
      }
      if(value == this.initRouteCode){
        console.log("原编码："+this.initRouteCode);
        callback();
      }else{
        $.ajax({
          type:'GET',
          url:'/xaj/configuration/sameRouting',
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
      rowC:[],
      text:[],
      filterColumns: [],
      pageRequest: { groupId:'',currPage: 1, pageSize: 10 },
      pageParams: {},
      pageResult: {},
      operation: false, // true:新增, false:编辑
      dialogVisible: false, // 新增编辑界面是否显示
      dialogVisibleB: false, // 导入界面是否显示
      editLoading: false,
      dataFormRules: {
        name: [
          { required: true, message: '请输入工艺路线名称', trigger: 'blur' }
        ],
        code: [
          { required: true, validator:checkMissionNumber2, trigger: 'blur' }
        ],
        number: [
          { required: true, validator:checkMissionNumber, trigger: 'blur' }
        ],
        material: [
          { required: true, message: '请输入关联物料', trigger: 'blur' }
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
        type:'',
        time:'',
        planProduction:'',
        name:'',
        code:'',
        number:'',
        material:''
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
      materialAll:[],
      material:{},
      materialForm:{
        name:'',
        code:'',
        type:''
      },
      routeAll:[],
      routeForm:{
        nameCode:''
      },
      equipment:{procedure:[]},
      show:true,
      addParams:{},
      procedures:[],
      welfareOptions:[],
      initMaterialCode:'',
      initRouteCode:'',
      id:'',
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
        data.pageRequest.nameCode = _this.dataForm.route;
        _this.pageRequest = data.pageRequest
      }
      //这里是不调接口的
      _this.$api.configuration.findPageRoute(_this.pageRequest).then((res) => {
        console.log(res);
        var routingArray = res.data.data.routing.data;
        routingArray.forEach(function(value,index){
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
        _this.pageResult = res.data.data.routing;
        console.log(_this.pageResult)
        // this.findUserRoles()
      }).then(data!=null?data.callback:'')
      _this.$api.configuration.findPageRoute(_this.pageRequest).then((res) => {
        console.log(res);
        var routingArray = res.data.data;
        routingArray.forEach(function(value,index){
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
      if(_this.dataForm.route==""){
        _this.routeForm.nameCode = "";
      }
      _this.pageParams = {currPage: 1, pageSize: 10,groupId: parseInt(localStorage.getItem('groupId')),status: _this.select,nameCode: _this.dataForm.route};
      _this.pageRequest.pageSize = 10;
      _this.pageRequest.currPage = 1;
      _this.$api.configuration.findPageRoute(_this.pageParams).then((res) => {
        console.log(res);
        var routingArray = res.data.data;
        routingArray.forEach(function(value,index){
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
        url:'/xaj/configuration/deleteRouting',
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
      this.materialForm = Object.assign({})
      this.welfareOptions = [];
      this.equipment.procedure = [];
      this.show = true;
    },
    // 显示编辑界面
    handleEdit: function (params) {
      let _this = this;
      console.log(params);
      _this.dialogVisible = true
      _this.operation = false
      _this.initMaterialCode = params.row.materialCode;
      _this.initRouteCode = params.row.routingCode;
      _this.dataForm = {
        name:params.row.routingName,
        code:params.row.routingCode,
        number:params.row.materialCode,
        material:params.row.materialName+params.row.materialCode
      }
      _this.materialForm = {
        name:params.row.materialName
      }
      _this.welfareOptions = [];
      _this.equipment.procedure = [];
      _this.show = true;
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
      _this.downloadUrl = baseUrl+'/xaj/configuration/downloadRoutingTp';
      _this.fileUrl = baseUrl+'/xaj/configuration/importRouting?groupId='+groupId+'&userName='+userName;
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
            if(!_this.show){
              _this.editLoading = true;
              // console.log(_this.welfareOptions[_this.welfareOptions.length-1]);
              _this.addParams = {
                routingCode:_this.dataForm.code,
                routingName:_this.dataForm.name,
                materialCode:_this.dataForm.number,
                materialName:_this.materialForm.name,
                groupId:parseInt(localStorage.getItem('groupId')),
                data:JSON.stringify(_this.welfareOptions[_this.welfareOptions.length-1])
              }
              console.log(_this.addParams);
              $.ajax({
                  type:'POST',
                  url:'/xaj/configuration/addRouting',
                  data:_this.addParams,
                  success:function(data){
                    console.log(data);
                    _this.dialogVisible = false;
                    _this.editLoading = false;
                    _this.findPage(null);
                    _this.$refs['dataForm'].resetFields();
                    _this.$refs['materialForm'].resetFields();
                    _this.welfareOptions = [];
                    _this.equipment.procedure = [];
                    if(data.status==true){
                      _this.$message({message: '新增成功', type: 'success'})
                    }
                  }
              })
            }
          }
        })
      }else{
        _this.$refs.dataForm.validate((valid) => {
          if (valid) {
            if(!_this.show){
              _this.editLoading = true;
              // console.log(_this.welfareOptions[_this.welfareOptions.length-1]);
              _this.addParams = {
                routingCode:_this.dataForm.code,
                routingName:_this.dataForm.name,
                materialCode:_this.dataForm.number,
                materialName:_this.materialForm.name,
                groupId:parseInt(localStorage.getItem('groupId')),
                data:JSON.stringify(_this.welfareOptions[_this.welfareOptions.length-1]),
                id:_this.id
              }
              console.log(_this.addParams);
              $.ajax({
                  type:'POST',
                  url:'/xaj/configuration/updateRouting',
                  data:_this.addParams,
                  success:function(data){
                    console.log(data);
                    _this.dialogVisible = false;
                    _this.editLoading = false;
                    _this.findPage(null);
                    _this.$refs['dataForm'].resetFields();
                    _this.$refs['materialForm'].resetFields();
                    _this.welfareOptions = [];
                    _this.equipment.procedure = [];
                    if(data.status==true){
                      _this.$message({message: '修改成功', type: 'success'})
                    }
                  }
              })
            }
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
        {prop:"routingName", label:"工艺路线名称", minWidth:160},
        {prop:"routingCode", label:"工艺路线编码", minWidth:120},
        {prop:"materialName", label:"物料名称", minWidth:160},
        {prop:"materialCode", label:"物料编码", minWidth:100},
        {prop:"processesNameAll", label:"关联工作中心", minWidth:240},
        {prop:"status", label:"状态", minWidth:80}
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
      },
      querySearch2(queryString,cb){
        var routeAll = this.routeAll;
        var results = queryString ? routeAll.filter(this.createFilter2(queryString)) : routeAll;
        //调用callback返回建议列表的数据
        cb(results);
      },
      createFilter2(queryString){
        return(routeAll) => {
          return(routeAll.value.toLowerCase().indexOf(queryString.toLowerCase())>-1);
        }
      },
      handleSelect2(item){
        console.log(item);
        this.routeForm = {nameCode:item.value};
      },
      tableRowClassName({row, rowIndex}){
          var length = $(".el-table .el-table__body-wrapper tbody tr:eq(0) td").length - 1;
          if(row.status == "正常"){
            $(".el-table .el-table__body-wrapper tbody tr:eq("+rowIndex+") td:eq("+(length-1)+")").css({"color":"#3F51B5"});
            // if(this.rowA.indexOf(rowIndex)<0){
            //   this.rowA.push(rowIndex);
            // }
            if(this.rowB.indexOf(rowIndex)<0){
              this.rowB.push(rowIndex);
            }
            if(this.rowC.indexOf(rowIndex)<0){
              this.rowC.push(rowIndex);
            }
            // if(this.rowD.indexOf(rowIndex)>-1){
            //   this.rowD.splice(this.rowD.indexOf(rowIndex),1);
            // }
          }else if(row.status == "禁用"){
            $(".el-table .el-table__body-wrapper tbody tr:eq("+rowIndex+") td:eq("+(length-1)+")").css({"color":"#E51C23"});
            // if(this.rowD.indexOf(rowIndex)<0){
            //   this.rowD.push(rowIndex);
            // }
            // if(this.rowA.indexOf(rowIndex)>-1){
            //   this.rowA.splice(this.rowA.indexOf(rowIndex),1);
            // }
            if(this.rowB.indexOf(rowIndex)>-1){
              this.rowB.splice(this.rowB.indexOf(rowIndex),1);
            }
            if(this.rowC.indexOf(rowIndex)>-1){
              this.rowC.splice(this.rowC.indexOf(rowIndex),1);
            }
          }
      },
      handleWelfareTreatmentChange(value,form,welfareOptions) { 
        let checkedCount = value.length;
        this.equipment.procedure = value; // 赋值 （axios传参用）
        console.log(value);
        if(this.equipment.procedure.length==0){
          this.show = true;
        }else{
          this.show = false;
        }
        // 选中之后，获取value数字
        var text = $("input:checkbox[name='fulicheckbox']:checked").map(function(index,elem) {
          return JSON.parse($(elem).parents(".el-checkbox").attr("data-value"));
        }).get();
        console.log(text);
        this.welfareOptions.push(text) // 记录所有被选中项的下标
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
    console.log(_this.filterColumns);
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
            var val = {code:value.productionProcessesCode,name:value.productionProcessesName};
            val = JSON.stringify(val);
            _this.procedures.push({label:value.productionProcessesName,value:val});
          });
        }
    })
    setTimeout(function(){
      $.ajax({
        type:'GET',
        url:'/xaj/configuration/searchAllMaterial',
        data:{
          groupId:parseInt(localStorage.getItem('groupId'))
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
          console.log(_this.materialAll);
        }
      })
      $.ajax({
          type:'GET',
          url:'/xaj/configuration/searchAllRouting',
          data:{
            groupId:parseInt(localStorage.getItem('groupId'))
          },
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
                  if(nameArr[i].value == newArr[index].routingName){
                    flag=false;
                  }
                })
              }
              if(flag){
                nameArr.push({value:newArr[index].routingName});
              }
              
            })
            var codeArr = [];
            $.each(newArr,function(index,value){
              var flag = true;
              if(codeArr.length>0){
                $.each(codeArr,function(i,a){
                  if(codeArr[i].value == newArr[index].routingCode){
                    flag=false;
                  }
                })
              }
              if(flag){
                codeArr.push({value:newArr[index].routingCode});
              }
              
            })
            _this.routeAll = nameArr.concat(codeArr);
            console.log(_this.routeAll);
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