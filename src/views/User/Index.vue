<template>
  <div class="page-container">
  <div class="page-left">
    <div class="userpanel-title"><i class="el-icon-s-grid"></i>组织机构</div>
    <div class="userpanel-cntent">
      <el-tree :data="optionData" :props="props" @node-click="handleNodeClick"></el-tree>
    </div>
  </div>
  <div class="page-right">
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
        <el-select v-model="select" size="medium" placeholder="所有状态">
            <el-option label="禁用" value="0"></el-option>
            <el-option label="正常" value="1"></el-option>
          </el-select>
      </el-form-item>
      <el-form-item>
        <!-- <el-input v-model="filters.name" prefix-icon="iconfont icon-ali-search" size="medium" style="color:#101010" placeholder="请输入员工姓名或手机号"></el-input> -->
        <el-autocomplete  prefix-icon="iconfont icon-ali-search" size="medium" style="color:#101010" popper-class="auto-select" v-model="dataForm.user" :fetch-suggestions="querySearch" placeholder="请输入员工姓名或手机号" :trigger-on-focus="false" @select="handleSelect" clearable></el-autocomplete>
      </el-form-item>
      <el-form-item>
        <el-button size="medium" @click="searchPage()" :style="{'background-color':themeColor,'color':'#fff','border-color':themeColor}">查询</el-button>
      </el-form-item>
    </el-form>
  </div>
  <!--表格内容栏-->
  <User-table :height="tableHeight" :data="pageResult" :columns="filterColumns" :rowstatus="tableRowClassName" @findPage="findPage" @handleEdit="handleEdit" @handleDelete="handleDelete" @handle-lock="handleLock" @handle-reset="handleReset" :rowA="rowA" :rowB="rowB" :rowC="rowC" :rowD="rowD" :text="text">
  </User-table>
  <!--新增编辑界面-->
  <el-dialog :title="operation?'新增':'修改'" width="50%" :visible.sync="dialogVisible" custom-class="userDialog" center>
    <el-form :model="dataForm" label-width="120px" :rules="dataFormRules" ref="dataForm" :size="size"
      label-position="right">
      <el-form :inline="true" label-width="120px" :model="refForm" :rules="refFormRules" ref="refForm">
        <el-form-item label="员工姓名" prop="username">
          <el-input id="userName" v-model="refForm.username"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input id="userMobile" v-model="refForm.mobile"></el-input>
        </el-form-item>
        <el-form-item label="所属部门" class="inputLengthB">
          <SelectTree 
            :props="props"
            :options="optionData"
            :value="valueId"
            :clearable="isClearable"
            :accordion="isAccordion"
            @getValue="getValue($event)"/>
            <transition name="zoom-top"><div v-if="show" class="el-form-item__error">请选择部门！</div></transition>
        </el-form-item>
        <el-form-item label="员工IC卡" prop="icCardNum">
          <el-input id="userIcard" v-model="refForm.icCardNum"></el-input>
        </el-form-item>
      </el-form>
      <!-- <el-form-item label="员工照片">
        <el-upload class="avatar-uploader" action="https://jsonplaceholder.typicode.com/posts/" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          <el-button size="small" type="success">上传图片</el-button>
          <div slot="tip" class="el-upload__tip">支持jpeg/png格式，大小不超过1M；</div>
        </el-upload>
      </el-form-item> -->
      <el-form-item label="用户角色" prop="role">
        <el-select v-model="dataForm.role" placeholder="请选择用户角色" @change="selectChange">
          <el-option v-for="(item,index) in role" :label="item.label" v-model="item.value" :key="index"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="medium" @click.native="dialogVisible = false" class="cancel-button">取消</el-button>
      <el-button size="medium" type="primary" @click.native="submitForm" :loading="editLoading" class="define-button">确定</el-button>
    </div>
  </el-dialog>
  <el-dialog title="提示" :width="width" :visible.sync="dialogVisibleB" custom-class="forgetDialog" center>
    <div class="forget-content">
      <i class="el-icon-success"></i>
      密码重置完成！
    </div>
  </el-dialog>
  </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import UserTable from "@/views/Core/UserTable"
import { format } from "@/utils/datetime"
import SelectTree from "@/components/treeSelect.vue";
export default {
  components:{
    UserTable,
    SelectTree
  },
  data() {
    var checkMobile = (rule, value, callback) => {
      if(!value){
        return callback(new Error('请填写手机号！'));
      }
      var params = {
        mobile:value
      }
      if(value == this.initMobile){
        console.log("原手机号："+this.initMobile);
        callback();
      }else{
        $.ajax({
          type:'GET',
          url:'/xaj/user/searchRepeat',
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
      width:'40%',
      tableHeight:null,
      isClearable:true,      // 可清空（可选）
      isAccordion:true,      // 可收起（可选）
      valueId:0,            // 初始ID（可选）
      valueName:'',
      props:{                // 配置项（必选）
        value: 'id',
        label: 'groupName',
        children: 'children',
        // disabled:true
      },
      size: 'small',
      form: {
        date1: '',
        date2: ''
      },
      role:[
        // {label:'超级管理员',value:'1#'},
        // {label:'生产计划员',value:'2#'},
        // {label:'车间管理员',value:'3#'},
        // {label:'车间操作员',value:'4#'}
      ],
      roleId:'',
      roleName:'',
      filters: {
        name: ''
      },
      columns: [],
      text:[],
      rowA:[],
      rowB:[],
      rowC:[],
      rowD:[],
      filterColumns: [],
      pageRequest: { currPage: 1, pageSize: 10 },
      pageParams: {},
      pageResult: {},
      operation: false, // true:新增, false:编辑
      dialogVisible: false, // 新增编辑界面是否显示
      dialogVisibleB: false,
      editLoading: false,
      dataFormRules: {
        name: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择要进行保养的设备！', trigger: 'blur' }
        ],
        role: [
          { required: true, message: '请选择该员工的用户角色，为该员工配置相应的权限！', trigger: 'change' }
        ],
        username: [
          { required: true, message: '请填写员工姓名！', trigger: 'blur' }
        ]
      },
      refFormRules:{
        username: [
          { required: true, message: '请填写员工姓名！', trigger: 'blur' }
        ],
        mobile: [
          { required: true, validator: checkMobile, trigger: 'blur' }
        ],
        valueId: [
          { required: true, message: '请选择部门！', trigger: 'change' }
        ],
        icCardNum: [
          { required: true, message: '请填写员工IC卡！', trigger: 'blur' }
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
        role:'',
        user:''
      },
      refForm:{
        username:'',
        mobile:'',
        valueId:0,
        icCardNum:''
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
      user:{},
      imageUrl:'',
      // 选项列表（必选）
      list:[
        // {id:1,pid:0,groupName:"新安江工业泵"},
        // {id:2,pid:1,groupName:"生产部门"},
        // {id:3,pid:2,groupName:"总装车间"},
        // {id:4,pid:3,groupName:"缠绕班"},
        // {id:5,pid:1,groupName:"质检部门"},
        // {id:6,pid:1,groupName:"研发中心"},
        // {id:7,pid:1,groupName:"技术部"},
        // {id:8,pid:1,groupName:"采购部"},
        // {id:9,pid:1,groupName:"营销部"},
        // {id:10,pid:1,groupName:"办公室"},
        // {id:11,pid:1,groupName:"财务部"},
        // {id:12,pid:3,groupName:"装配班"},
        // {id:13,pid:3,groupName:"金工班"},
        // {id:14,pid:3,groupName:"注塑班"},
        // {id:15,pid:3,groupName:"模压班"},
        // {id:16,pid:2,groupName:"塑焊车间"},
        {
          id: 1,
          groupName: '生产部门',
          children: [{
            id: 4,
            groupName: '总装车间',
            children: [{
              id: 6,
              groupName: '装配班'
            }]
          },{
            id: 5,
            groupName: '塑焊车间',
            children: [{
              id: 7,
              groupName: '金工班'
            }, {
              id: 8,
              groupName: '注塑班'
            }, {
              id: 9,
              groupName: '模压班'
            }, {
              id: 10,
              groupName: '缠绕班'
            }]
          }]
        }, {
          id: 2,
          groupName: '质检部门',
          children: []
        }, {
          id: 3,
          groupName: '研发中心',
          children: []
        }
      ],
      show:'',
      paramsAdd:{},
      userAll:[],
      userForm:{
        nameMobile:''
      },
      initMobile:'',
      id:''
    }
    
  },
  computed:{
      ...mapState({
        themeColor: state=>state.app.themeColor,
        collapse: state=>state.app.collapse
      }),
      /* 转树形数据 */
    optionData(){
      // let cloneData = JSON.parse(JSON.stringify(this.list))      // 对源数据深度克隆
      // return  cloneData.filter(father=>{                      // 循环所有项，并添加children属性
      //     let branchArr = cloneData.filter(child=>father.id == child.pid);       // 返回每一项的子级数组
      //     branchArr.length>0 ? father.children=branchArr : ''   //给父级添加一个children属性，并赋值
      //     return father.pid==0;      //返回第一层
      // });
      return this.list;
    }
  },
  methods: {
    // 获取分页数据
    findPage: function (data) {
      console.log(data);
      let _this = this;
      if(data !== null) {
        data.pageRequest.status = _this.select;
        data.pageRequest.nameMobile = _this.dataForm.user;
        _this.pageRequest = data.pageRequest
      }
      //这里是不调接口的
      _this.$api.user.findPage(_this.pageRequest).then((res) => {
        console.log(res);
        var userArray = res.data.data.user.data;
        userArray.forEach(function(value,index){
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
        _this.pageResult = res.data.data.user;
        console.log(_this.pageResult)
        // this.findUserRoles()
      }).then(data!=null?data.callback:'')
      _this.$api.user.findPage(_this.pageRequest).then((res) => {
        console.log(res);
        var userArray = res.data.data;
        userArray.forEach(function(value,index){
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
      if(_this.dataForm.user==""){
        _this.userForm.nameMobile = "";
      }
      _this.pageParams = {currPage: 1, pageSize: 10,status: _this.select,nameMobile: _this.dataForm.user};
      _this.pageRequest.pageSize = 10;
      _this.pageRequest.currPage = 1;
      _this.$api.user.findPage(_this.pageParams).then((res) => {
        console.log(res);
        var userArray = res.data.data;
        userArray.forEach(function(value,index){
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
      console.log(params);
      $.ajax({
        type:'POST',
        url:'/xaj/user/deleteUser',
        data:params,
        success:function(res){
          console.log(res);
        }
      }).then(data!=null?data.callback:'')
    },
    // 显示新增界面
    handleAdd: function () {
      this.dialogVisible = true
      this.operation = true
      this.dataForm = Object.assign({})
      this.refForm = Object.assign({})
      this.valueId = 0;
      this.valueName = '';
      console.log($("#userName").val());
      console.log($("#inputLengthB .el-input__inner").val());
    },
    // 显示编辑界面
    handleEdit: function (params) {
      this.dialogVisible = true
      this.operation = false
      console.log(params);
      this.initMobile = params.row.mobile;
      this.refForm = {
        username:params.row.name,
        mobile:params.row.mobile,
        icCardNum:params.row.icCardNum
      }
      this.dataForm = {
        role:params.row.roleId
      }
      this.valueName = params.row.groupName
      this.valueId = params.row.groupId
      // this.roleId = params.row.roleId
      this.id = params.row.id;
    },
    // 编辑
    submitForm: function () {
      let _this = this;
      if(_this.operation){
        _this.$refs.refForm.validate((valid) => {
          if (valid) {
            _this.$refs.dataForm.validate((validA) => {
              if (validA) {
                console.log(_this.valueId);
                if(_this.valueId == null || _this.valueId == 0){
                  _this.show = true;
                  $(".inputLengthB").addClass("is-error").removeClass("is-success");
                }else{
                  _this.show = false;
                  $(".inputLengthB").addClass("is-success").removeClass("is-error");
                  _this.editLoading = true;
                  _this.paramsAdd = {
                    name : _this.refForm.username,
                    mobile: _this.refForm.mobile,
                    icCardNum: _this.refForm.icCardNum,
                    groupId : _this.valueId,
                    groupName: _this.valueName,
                    roleId : _this.roleId,
                    // roleName: _this.roleName
                  }
                  console.log(_this.paramsAdd);
                  $.ajax({
                    type:'POST',
                    url:'/xaj/user/addUser',
                    data:_this.paramsAdd,
                    success:function(data){
                      _this.dialogVisible = false;
                      _this.editLoading = false;
                      _this.findPage(null);
                      _this.$refs['dataForm'].resetFields();
                      _this.$refs['refForm'].resetFields();
                      if(data.status==true){
                        _this.$message({message: '新增成功', type: 'success'})
                      }
                    }
                  })
                }  
              }
            })
          }
        })
      }else{
        _this.$refs.refForm.validate((valid) => {
          if (valid) {
            _this.$refs.dataForm.validate((validA) => {
              if (validA) {
                console.log(_this.valueId);
                if(_this.valueId == null || _this.valueId == 0){
                  _this.show = true;
                  $(".inputLengthB").addClass("is-error").removeClass("is-success");
                }else{
                  _this.show = false;
                  $(".inputLengthB").addClass("is-success").removeClass("is-error");
                  _this.editLoading = true;
                  _this.paramsAdd = {
                    name : _this.refForm.username,
                    mobile: _this.refForm.mobile,
                    icCardNum: _this.refForm.icCardNum,
                    groupId : _this.valueId,
                    groupName: _this.valueName,
                    roleId : _this.roleId,
                    id:_this.id
                    // roleName: _this.roleName
                  }
                  console.log(_this.paramsAdd);
                  $.ajax({
                    type:'POST',
                    url:'/xaj/user/updateUser',
                    data:_this.paramsAdd,
                    success:function(data){
                      _this.dialogVisible = false;
                      _this.editLoading = false;
                      _this.findPage(null);
                      _this.$refs['dataForm'].resetFields();
                      _this.$refs['refForm'].resetFields();
                      if(data.status==true){
                        _this.$message({message: '修改成功', type: 'success'})
                      }
                    }
                  })
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
        // {prop:"id",label:"序号",minWidth:80},
        {prop:"name", label:"员工姓名", minWidth:90},
        {prop:"mobile", label:"手机", minWidth:110},
        {prop:"groupName", label:"所属部门", minWidth:90},
        {prop:"icCardNum", label:"员工IC卡", minWidth:110},
        {prop:"userName", label:"用户账户", minWidth:110},
        {prop:"roleName", label:"用户角色", minWidth:110},
        {prop:"creatTime", label:"创建时间", minWidth:120},
        {prop:"status", label:"状态", minWidth:80},
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
      querySearch(queryString,cb){
        var userAll = this.userAll;
        var results = queryString ? userAll.filter(this.createFilter(queryString)) : userAll;
        //调用callback返回建议列表的数据
        cb(results);
        // console.log(results);
      },
      createFilter(queryString){
        return(userAll) => {
          return(userAll.value.toLowerCase().indexOf(queryString.toLowerCase())>-1);
        }
      },
      handleSelect(item){
        console.log(item);
        this.userForm = {nameMobile:item.value};
        console.log(this.userForm);
      },
      handleLock:function(data){
        let _this = this;
        console.log(data.params);
        // console.log(arr);
        // this.lockId = arr[1].id;
        // this.lockStatus = arr[1].isLock;
        // this.dialogVisibleB = true;
        $.ajax({
          type:'POST',
          url:'/xaj/user/isEnable',
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
      handleReset:function(data){
        let _this = this;
        console.log(data.params);
        $.ajax({
          type:'POST',
          url:'/xaj/user/resetPassword',
          data:data.params,
          success:function(res){
            console.log(res);
            _this.dialogVisibleB = true;
          }
        }).then(data!=null?data.callback:'')
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
          if(this.rowD.indexOf(rowIndex)<0){
            this.rowD.push(rowIndex);
          }
          if(this.text.indexOf(rowIndex)<0){
            this.text.push(rowIndex);
          }
        }else if(row.status == "禁用"){
          $(".el-table .el-table__body-wrapper tbody tr:eq("+rowIndex+") td:eq("+(length-1)+")").css({"color":"#E51C23"});
          if(this.rowA.indexOf(rowIndex)<0){
            this.rowA.push(rowIndex);
          }
          if(this.rowD.indexOf(rowIndex)<0){
            this.rowD.push(rowIndex);
          }
          if(this.rowB.indexOf(rowIndex)>-1){
            this.rowB.splice(this.rowB.indexOf(rowIndex),1);
          }
          if(this.rowC.indexOf(rowIndex)>-1){
            this.rowC.splice(this.rowC.indexOf(rowIndex),1);
          }
          if(this.text.indexOf(rowIndex)>-1){
            this.text.splice(this.text.indexOf(rowIndex),1);
          }
        }
    },
    handleNodeClick(data){
      console.log(data);
    },
    // 取值
    getValue(value){
      console.log(value);
      if(value!=null){
        this.valueId = value.id;
        this.valueName = value.name;
      }
      console.log(this.valueId);
      if(value == null ){
        this.valueId = 0;
        this.show = true;
        $(".inputLengthB").addClass("is-error").removeClass("is-success");
      }else{
        this.show = false;
        $(".inputLengthB").addClass("is-success").removeClass("is-error");
      }
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === ('image/jpeg')||('image/png');
      const isLt1M = file.size / 1024 / 1024 < 1;
      console.log(file.size);
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 或 PNG 格式!');
      }
      if (!isLt1M) {
        this.$message.error('上传头像图片大小不能超过 1MB!');
      }
      return isJPG && isLt1M;
    },
    selectChange:function(data){
      let _this = this;
      console.log(data);
      console.log(_this.dataForm.role);
      _this.roleId = data;
      // _this.roleName = data.roleName;
      console.log(_this.roleId);
    }
  },
  mounted() {
    // this.findDeptTree()
    let _this = this;
    function repage(){
      var win_height = $(window).height();
      var nav_heihgt = $(".headbar").height();
      var tab_height = $(".tabs").height();
      var gap = 200;
      _this.tableHeight = win_height - nav_heihgt - tab_height - gap;
    }
    repage();
    $.ajax({
      type:'GET',
      url:'/xaj/user/searchGroup',
      success:function(data){
        console.log(typeof(data));
        _this.list = data;
      }
    })
    $.ajax({
      type:'GET',
      url:'/xaj/user/searchRoleSelection',
      success:function(data){
        data.forEach(function(value,index){
          _this.role.push({label:value.roleName,value:value.id});
        })
      }
    })
    console.log(_this.list);
    _this.initColumns()
    // console.log(_this.filterColumns);
    setTimeout(function(){
      $.ajax({
          type:'GET',
          url:'/xaj/user/searchAllUsers',
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
                  if(nameArr[i].value == newArr[index].name){
                    flag=false;
                  }
                })
              }
              if(flag){
                nameArr.push({value:newArr[index].name});
              }
            })
            var mobileArr = [];
            $.each(newArr,function(index,value){
              var flag = true;
              if(mobileArr.length>0){
                $.each(mobileArr,function(i,a){
                  if(mobileArr[i].value == newArr[index].mobile){
                    flag=false;
                  }
                })
              }
              if(flag){
                mobileArr.push({value:newArr[index].mobile});
              }
            })
            _this.userAll = nameArr.concat(mobileArr);
            console.log(_this.userAll);
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
.userDialog .inputLengthB .el-select{
  width: 207px;
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
.page-left{
  width:200px;
  position:absolute;
  top:0;
  left:0;
  bottom:0;
  border:1px solid #E3E3E3;
}
.page-right{
  padding-left: 218px;
}
.userpanel-title{
  font-size: 18px;
  color: #101010;
  font-family: 'SourceHanSansSC-regular';
  text-align: left;
  padding:10px;
  border-bottom: 1px solid #E3E3E3;
}
.userpanel-title i{
  margin-right: 6px;
}
.userpanel-cntent{
  padding:6px 3px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.avatar-uploader .el-button--success{
  background-color: #009688;
  border-color: #009688;
  position: absolute;
  bottom:25px;
  right:-98px;
}
.avatar-uploader .el-upload__tip{
  font-size: 14px;
  color: #E51C23;
  font-family: 'SourceHanSansSC-regular';
  line-height: 20px;
  position: absolute;
  bottom:0;
  left: 198px;
}
.zoom-top-enter-active,.zoom-top-leave-active{
  transition: all .3s cubic-bezier(.23,1,.32,1);
  transform:scaleY(1);
  opacity: 1;
  transform-origin: center top;
}
.zoom-top-enter,.zoom-top-leave-to{
  opacity: 0;
  transform: scaleY(0);
}
.forgetDialog .el-icon-success{
  font-size:40px;
  margin-right:10px;
  color:#259B24;
  position: relative;
  top: 2px;
}
.forgetDialog .forget-content{
  text-align: center;
  color: #151515;
  font-size: 24px;
  font-family: 'SourceHanSansSC-regular';
}
.forgetDialog .el-dialog__body{
  padding:85px 25px 140px;
}
</style>