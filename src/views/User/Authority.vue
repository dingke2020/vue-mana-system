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
  <User-authority-table :height="tableHeight" :data="pageResult" :columns="filterColumns" @findPage="findPage" @handleEdit="handleEdit" @handleDelete="handleDelete">
  </User-authority-table>
  <!--新增编辑界面-->
  <el-dialog :title="operation?'新增':'修改'" width="50%" :visible.sync="dialogVisible" custom-class="authorityDialog" center>
    <el-form :model="dataForm" label-width="100px" :rules="dataFormRules" ref="dataForm" :size="size"
      label-position="right">
      <el-form-item label="角色名称" class="inputLength" prop="roleName">
        <el-input id="roleName" v-model="dataForm.roleName"></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="content">
        <el-input type="textarea" :rows="3" placeholder="此处输入对该角色拥有权限的描述" v-model="dataForm.content" resize="none"></el-input>
      </el-form-item>
      <!-- <el-form-item label="角色授权">
        <div class="All-table">
          <div class="deliverySetting-table" v-for="item in tables">
            <div class="table-head">
              <div class="selection">
               <el-checkbox :indeterminate="item.indeterminate" v-model="item.ischeckAll" @change="handleCheckAllChange(item.index,item.ischeckAll,item.parentId,item.menuId)"></el-checkbox>
              </div>
              <div class="width185">{{item.title}}</div>
              <div class="width265"></div>
            </div>
            <div class="table-body" v-for="(partition,partitionIndex) in item.distributorsInfo" :key="partitionIndex">
              <div class="selection" v-if="item.distributorsInfo.length>1">
                <p><el-checkbox :indeterminate="partition.indeterminate" v-model="partition.selected" @change="handleCheckedChildrenAllChange(item.index,partitionIndex,partition.partitionId,partition.childrenId,$event)" :key="partitionIndex"></el-checkbox></p>
              </div>
              <div class="width185" v-if="item.distributorsInfo.length>1"><p>{{ partition.partitionName }}</p></div>
              <div class="width265" :style="item.distributorsInfo.length>1?'':'padding-left:14px'">
                <el-checkbox v-for="children in partition.children" v-model="children.selected" @change="handleCheckedChildrenChange(item.index,partitionIndex,children.id,partition.partitionId,partition.childrenId,$event)" :label="children" :key="children.id">{{children.fieldName}}</el-checkbox>
              </div>
            </div>
          </div>
        </div>
      </el-form-item> -->
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
import UserAuthorityTable from "@/views/Core/UserAuthorityTable"
import { format } from "@/utils/datetime"
export default {
  components:{
    UserAuthorityTable
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
        roleName:'',
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
      user:{},
      department:'',
      addParams:{},
      allData:[],
      allDataCopy:[],
      authorityData:[],
      operator:[],
      tables: [
        {
          title: '任务管理',
          index: 0,
          ischeckAll: false,
          indeterminate: false,
          parentId:0,
          menuId:1,
          distributorsInfo:[
            { partitionName:'',selected:false,partitionId:0,childrenId:1,indeterminate:false,
              children:[
              {   id: "1",fieldName: "新增",fieldTableName: "新增",selected: false},
              {   id: "2",fieldName: "修改",fieldTableName: "修改",selected: false},
              {   id: "3",fieldName: "删除",fieldTableName: "删除",selected: false},
              {   id: "4",fieldName: "查看",fieldTableName: "查看",selected: false},
              ]
            }
          ]
        },
        {
          title: '生产管理',
          index: 1,
          ischeckAll: false,
          indeterminate: false,
          parentId:0,
          menuId:2,
          distributorsInfo:[
            { partitionName:'',selected:false,partitionId:0,childrenId:2,indeterminate:false,
              children:[
              {   id: "1",fieldName: "新增",fieldTableName: "新增",selected: false},
              {   id: "2",fieldName: "修改",fieldTableName: "修改",selected: false},
              {   id: "3",fieldName: "删除",fieldTableName: "删除",selected: false},
              {   id: "4",fieldName: "查看",fieldTableName: "查看",selected: false},
              ]
            }
          ]
        },
        {
          title: '维保管理',
          index: 2,
          ischeckAll: false,
          indeterminate: false,
          parentId:0,
          menuId:3,
          distributorsInfo:[
            { partitionName:'保养计划',selected:false,partitionId:3,childrenId:10,indeterminate:false,
              children:[
              {   id: "1",fieldName: "新增",fieldTableName: "新增",selected: false},
              {   id: "2",fieldName: "修改",fieldTableName: "修改",selected: false},
              {   id: "3",fieldName: "删除",fieldTableName: "删除",selected: false},
              {   id: "4",fieldName: "查看",fieldTableName: "查看",selected: false},
              ]
            },
            { partitionName:'保养记录',selected:false,partitionId:3,childrenId:11,indeterminate:false,
              children:[
              {   id: "1",fieldName: "新增",fieldTableName: "新增",selected: false},
              {   id: "2",fieldName: "修改",fieldTableName: "修改",selected: false},
              {   id: "3",fieldName: "删除",fieldTableName: "删除",selected: false},
              {   id: "4",fieldName: "查看",fieldTableName: "查看",selected: false},
              ]
            },
            { partitionName:'维修记录',selected:false,partitionId:3,childrenId:12,indeterminate:false,
              children:[
              {   id: "1",fieldName: "新增",fieldTableName: "新增",selected: false},
              {   id: "2",fieldName: "修改",fieldTableName: "修改",selected: false},
              {   id: "3",fieldName: "删除",fieldTableName: "删除",selected: false},
              {   id: "4",fieldName: "查看",fieldTableName: "查看",selected: false},
              ]
            }
          ]
        },
        {
          title: '配置管理',
          index: 3,
          ischeckAll: false,
          indeterminate: false,
          parentId:0,
          menuId:4,
          distributorsInfo:[
            { partitionName:'工序管理',selected:false,partitionId:4,childrenId:15,indeterminate:false,
              children:[
              {   id: "1",fieldName: "新增",fieldTableName: "新增",selected: false},
              {   id: "2",fieldName: "修改",fieldTableName: "修改",selected: false},
              {   id: "3",fieldName: "删除",fieldTableName: "删除",selected: false},
              {   id: "4",fieldName: "查看",fieldTableName: "查看",selected: false},
              ]
            },
            { partitionName:'设备管理',selected:false,partitionId:4,childrenId:16,indeterminate:false,
              children:[
              {   id: "1",fieldName: "新增",fieldTableName: "新增",selected: false},
              {   id: "2",fieldName: "修改",fieldTableName: "修改",selected: false},
              {   id: "3",fieldName: "删除",fieldTableName: "删除",selected: false},
              {   id: "4",fieldName: "查看",fieldTableName: "查看",selected: false},
              ]
            },
            { partitionName:'物料管理',selected:false,partitionId:4,childrenId:17,indeterminate:false,
              children:[
              {   id: "1",fieldName: "新增",fieldTableName: "新增",selected: false},
              {   id: "2",fieldName: "修改",fieldTableName: "修改",selected: false},
              {   id: "3",fieldName: "删除",fieldTableName: "删除",selected: false},
              {   id: "4",fieldName: "查看",fieldTableName: "查看",selected: false},
              ]
            },
            { partitionName:'工艺路线管理',selected:false,partitionId:4,childrenId:18,indeterminate:false,
              children:[
              {   id: "1",fieldName: "新增",fieldTableName: "新增",selected: false},
              {   id: "2",fieldName: "修改",fieldTableName: "修改",selected: false},
              {   id: "3",fieldName: "删除",fieldTableName: "删除",selected: false},
              {   id: "4",fieldName: "查看",fieldTableName: "查看",selected: false},
              ]
            }
          ]
        },
        {
          title: '用户管理',
          index: 4,
          ischeckAll: false,
          indeterminate: false,
          parentId:0,
          menuId:5,
          distributorsInfo:[
            { partitionName:'员工管理',selected:false,partitionId:5,childrenId:19,indeterminate:false,
              children:[
              {   id: "1",fieldName: "新增",fieldTableName: "新增",selected: false},
              {   id: "2",fieldName: "修改",fieldTableName: "修改",selected: false},
              {   id: "3",fieldName: "删除",fieldTableName: "删除",selected: false},
              {   id: "4",fieldName: "查看",fieldTableName: "查看",selected: false},
              ]
            },
            { partitionName:'权限管理',selected:false,partitionId:5,childrenId:20,indeterminate:false,
              children:[
              {   id: "1",fieldName: "新增",fieldTableName: "新增",selected: false},
              {   id: "2",fieldName: "修改",fieldTableName: "修改",selected: false},
              {   id: "3",fieldName: "删除",fieldTableName: "删除",selected: false},
              {   id: "4",fieldName: "查看",fieldTableName: "查看",selected: false},
              ]
            }
          ]
        },
        {
          title: '我的工单',
          index: 5,
          ischeckAll: false,
          indeterminate: false,
          parentId:0,
          menuId:6,
          distributorsInfo:[
            { partitionName:'',selected:false,partitionId:0,childrenId:6,indeterminate:false,
              children:[
              {   id: "1",fieldName: "新增",fieldTableName: "新增",selected: false},
              {   id: "2",fieldName: "修改",fieldTableName: "修改",selected: false},
              {   id: "3",fieldName: "删除",fieldTableName: "删除",selected: false},
              {   id: "4",fieldName: "查看",fieldTableName: "查看",selected: false},
              ]
            }
          ]
        },
        {
          title: '统计分析',
          index: 6,
          ischeckAll: false,
          indeterminate: false,
          parentId:0,
          menuId:7,
          distributorsInfo:[
            { partitionName:'生产追溯',selected:false,partitionId:7,childrenId:21,indeterminate:false,
              children:[
              {   id: "1",fieldName: "新增",fieldTableName: "新增",selected: false},
              {   id: "2",fieldName: "修改",fieldTableName: "修改",selected: false},
              {   id: "3",fieldName: "删除",fieldTableName: "删除",selected: false},
              {   id: "4",fieldName: "查看",fieldTableName: "查看",selected: false},
              ]
            },
            { partitionName:'人员绩效',selected:false,partitionId:7,childrenId:22,indeterminate:false,
              children:[
              {   id: "1",fieldName: "新增",fieldTableName: "新增",selected: false},
              {   id: "2",fieldName: "修改",fieldTableName: "修改",selected: false},
              {   id: "3",fieldName: "删除",fieldTableName: "删除",selected: false},
              {   id: "4",fieldName: "查看",fieldTableName: "查看",selected: false},
              ]
            },
            { partitionName:'设备绩效',selected:false,partitionId:7,childrenId:23,indeterminate:false,
              children:[
              {   id: "1",fieldName: "新增",fieldTableName: "新增",selected: false},
              {   id: "2",fieldName: "修改",fieldTableName: "修改",selected: false},
              {   id: "3",fieldName: "删除",fieldTableName: "删除",selected: false},
              {   id: "4",fieldName: "查看",fieldTableName: "查看",selected: false},
              ]
            },
            { partitionName:'设备维保',selected:false,partitionId:7,childrenId:24,indeterminate:false,
              children:[
              {   id: "1",fieldName: "新增",fieldTableName: "新增",selected: false},
              {   id: "2",fieldName: "修改",fieldTableName: "修改",selected: false},
              {   id: "3",fieldName: "删除",fieldTableName: "删除",selected: false},
              {   id: "4",fieldName: "查看",fieldTableName: "查看",selected: false},
              ]
            }
          ]
        },
        {
          title: '工艺管理',
          index: 7,
          ischeckAll: false,
          indeterminate: false,
          parentId:0,
          menuId:8,
          distributorsInfo:[
            { partitionName:'NC程序',selected:false,partitionId:8,childrenId:13,indeterminate:false,
              children:[
              {   id: "1",fieldName: "新增",fieldTableName: "新增",selected: false},
              {   id: "2",fieldName: "修改",fieldTableName: "修改",selected: false},
              {   id: "3",fieldName: "删除",fieldTableName: "删除",selected: false},
              {   id: "4",fieldName: "查看",fieldTableName: "查看",selected: false},
              ]
            },
            { partitionName:'工艺参数',selected:false,partitionId:8,childrenId:14,indeterminate:false,
              children:[
              {   id: "1",fieldName: "新增",fieldTableName: "新增",selected: false},
              {   id: "2",fieldName: "修改",fieldTableName: "修改",selected: false},
              {   id: "3",fieldName: "删除",fieldTableName: "删除",selected: false},
              {   id: "4",fieldName: "查看",fieldTableName: "查看",selected: false},
              ]
            }
          ]
        },
        {
          title: '管理平台',
          index: 8,
          ischeckAll: false,
          indeterminate: false,
          parentId:0,
          menuId:9,
          distributorsInfo:[
            { partitionName:'综合信息看板',selected:false,partitionId:9,childrenId:25,indeterminate:false,
              children:[
              {   id: "1",fieldName: "新增",fieldTableName: "新增",selected: false},
              {   id: "2",fieldName: "修改",fieldTableName: "修改",selected: false},
              {   id: "3",fieldName: "删除",fieldTableName: "删除",selected: false},
              {   id: "4",fieldName: "查看",fieldTableName: "查看",selected: false},
              ]
            },
            { partitionName:'生产进度看板',selected:false,partitionId:9,childrenId:26,indeterminate:false,
              children:[
              {   id: "1",fieldName: "新增",fieldTableName: "新增",selected: false},
              {   id: "2",fieldName: "修改",fieldTableName: "修改",selected: false},
              {   id: "3",fieldName: "删除",fieldTableName: "删除",selected: false},
              {   id: "4",fieldName: "查看",fieldTableName: "查看",selected: false},
              ]
            },
            { partitionName:'设备运行监测',selected:false,partitionId:9,childrenId:27,indeterminate:false,
              children:[
              {   id: "1",fieldName: "新增",fieldTableName: "新增",selected: false},
              {   id: "2",fieldName: "修改",fieldTableName: "修改",selected: false},
              {   id: "3",fieldName: "删除",fieldTableName: "删除",selected: false},
              {   id: "4",fieldName: "查看",fieldTableName: "查看",selected: false},
              ]
            }
          ]
        }
      ]
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
      // if(data !== null) {
      //   _this.pageRequest = data.pageRequest
      // }
      //这里是不调接口的
      _this.$api.user.findPageAuthority().then((res) => {
        var authorityArray = res.data.data.authority.data;
        _this.pageResult = res.data.data.authority;
        console.log(_this.pageResult)
        // this.findUserRoles()
      }).then(data!=null?data.callback:'')
      _this.$api.user.findPageAuthority().then((res) => {
        var authorityArray = res.data;
        // authorityArray.forEach(function(value,index){
        //   if(value.id<10){
        //     value.id = '0'+value.id;
        //   }
        // })
        _this.pageResult = res;
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
      $.ajax({
        type:'POST',
        url:'/xaj/user/deleteRole',
        data:params,
        success:function(res){
          console.log(res);
          // _this.dialogVisible = false;
          // _this.editLoading = false;
        }
      }).then(data!=null?data.callback:'')
    },
    // 显示新增界面
    handleAdd: function () {
      this.dialogVisible = true
      this.operation = true
      this.dataForm = Object.assign({})
      this.authorityData = []
    },
    // 显示编辑界面
    handleEdit: function (params) {
      console.log(params);
      this.dialogVisible = true
      this.operation = false
      this.dataForm = {
        roleName:params.row.roleName,
        content:params.row.description
      }
    },
    // 编辑
    submitForm: function () {
      let _this = this;
      if(_this.operation){
        _this.$refs.dataForm.validate((valid) => {
          if (valid) {
              _this.editLoading = true
              _this.addParams = {
                roleName:_this.dataForm.roleName,
                description:_this.dataForm.content,
                data:JSON.stringify(_this.allDataCopy)
              }
              console.log(_this.addParams);
              $.ajax({
                  type:'GET',
                  url:'/xaj/user/addRole',
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
        _this.$refs.dataForm.validate((valid) => {
          if (valid) {
              _this.editLoading = true
              _this.addParams = {
                roleName:_this.dataForm.roleName,
                description:_this.dataForm.content,
                data:JSON.stringify(_this.allDataCopy)
              }
              console.log(_this.addParams);
              $.ajax({
                  type:'GET',
                  url:'/xaj/user/updateRole',
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
        {prop:"roleName", label:"角色名称", minWidth:200},
        {prop:"userList", label:"用户列表", minWidth:300},
        {prop:"description", label:"描述", minWidth:500}
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
      handleCheckAllChange(index,e,pid,mid){//一级change事件
          let _this = this;
          _this.tables[index].ischeckAll = e
          if(e == true){
              _this.tables[index].indeterminate = false
              for(var i=0,len=_this.tables[index].distributorsInfo.length; i<len; i++){ //二级全选反选不确定
                  _this.tables[index].distributorsInfo[i].selected = e
                  for(var j=0,len1=_this.tables[index].distributorsInfo[i].children.length; j<len1; j++){
                      _this.tables[index].distributorsInfo[i].children[j].selected = e
                  }
              }
          }else{
              _this.tables[index].indeterminate = false
              for(var i=0,len=_this.tables[index].distributorsInfo.length; i<len; i++){ //三级全选反选不确定
                  _this.tables[index].distributorsInfo[i].selected = e
                  for(var j=0,len1=_this.tables[index].distributorsInfo[i].children.length; j<len1; j++){
                      _this.tables[index].distributorsInfo[i].children[j].selected = e
                  }
              }
          }
          // console.log(pid,mid);
          // console.log(index);
          _this.getParentSelected(index);
          
      },
      handleCheckedChildrenAllChange(parentIndex,index, topId,botId, e){//二级change事件
          this.tables[parentIndex].distributorsInfo[index].selected = e//二级勾选后，子级全部勾选或者取消
          if(e == false) this.tables[parentIndex].distributorsInfo[index].indeterminate = false //去掉二级不确定状态
          var childrenArray = this.tables[parentIndex].distributorsInfo[index].children
          if(childrenArray)
              for(var i=0,len=childrenArray.length; i<len; i++)
                  childrenArray[i].selected = e

          this.getIsCheckAll(parentIndex)
          // console.log(topId,botId);
          // console.log(parentIndex,index);
          this.getParentSelected(parentIndex);
      },
      handleCheckedChildrenChange(parentIndex,topIndex, sonId, topId,botId, e){//三级change事件
          var childrenArray = this.tables[parentIndex].distributorsInfo[topIndex].children
          var tickCount = 0, unTickCount = 0, len = childrenArray.length
          for(var i = 0; i < len; i++){
              if(sonId == childrenArray[i].id) childrenArray[i].selected = e
              if(childrenArray[i].selected == true) tickCount++
              if(childrenArray[i].selected == false) unTickCount++
          }
          if(tickCount == len) {//三级级全勾选
              this.tables[parentIndex].distributorsInfo[topIndex].selected = true 
              this.tables[parentIndex].distributorsInfo[topIndex].indeterminate = false
          } else if(unTickCount == len) {//三级级全不勾选
              this.tables[parentIndex].distributorsInfo[topIndex].selected = false 
              this.tables[parentIndex].distributorsInfo[topIndex].indeterminate = false
          } else {
              this.tables[parentIndex].distributorsInfo[topIndex].selected = false
              this.tables[parentIndex].distributorsInfo[topIndex].indeterminate = true //添加二级不确定状态
          }

          this.getIsCheckAll(parentIndex)
          // console.log(topId,botId);
          // console.log(parentIndex,topIndex);
          this.getParentSelected(parentIndex);
      },
      getIsCheckAll(index){
          var tickCount = 0, unTickCount = 0, ArrLength = this.tables[index].distributorsInfo.length;
          var tick_low_count=0,unTick_low_count=0,arr_low_length = this.tables[index].distributorsInfo[0].children.length;
          if(ArrLength>1){
            for(var j=0; j<ArrLength; j++){//全选checkbox状态
              if(this.tables[index].distributorsInfo[j].selected == true) tickCount++
              if(this.tables[index].distributorsInfo[j].selected == false) unTickCount++
            }
            if(tickCount == ArrLength) {//二级全勾选
                this.tables[index].ischeckAll = true
                this.tables[index].indeterminate = false
            } else if(unTickCount == ArrLength) {//二级全不勾选
                this.tables[index].ischeckAll = false
                this.tables[index].indeterminate = false
            } else {
                this.tables[index].ischeckAll = false
                this.tables[index].indeterminate = true //添加一级不确定状态
            }
          }else{
            for(var k=0; k<arr_low_length; k++){//全选checkbox状态
              if(this.tables[index].distributorsInfo[0].children[k].selected == true) tick_low_count++
              if(this.tables[index].distributorsInfo[0].children[k].selected == false) unTick_low_count++
            }
            if(tick_low_count == arr_low_length) {//二级全勾选
                this.tables[index].ischeckAll = true
                this.tables[index].indeterminate = false
            } else if(unTick_low_count == arr_low_length) {//二级全不勾选
                this.tables[index].ischeckAll = false
                this.tables[index].indeterminate = false
            } else {
                this.tables[index].ischeckAll = false
                this.tables[index].indeterminate = true //添加一级不确定状态
            }
          }
      },
      getParentSelected(index){
        let _this = this;
        _this.authorityData = [];
        $.each(_this.tables[index].distributorsInfo,function(index,value){
          console.log(value);
          _this.operator = [];
          $.each(value.children,function(i,a){
            console.log(a.selected);
            switch(a.id){
              case "1":
                a.id = 's_add';
                break;
              case "2":
                a.id = 's_update';
                break;
              case "3":
                a.id = 's_delete';
                break;
              case "4":
                a.id = 's_search';
                break;
            }
            if(a.selected == true){
              _this.operator[i] = a.id;
            }else{
              _this.operator[i] = "";
            }
          })
          for(var i=0;i<_this.operator.length;i++){
            if(_this.operator[i]==""){
              _this.operator.splice(i,1);
              i=i-1;
            }
          }
          // console.log(_this.operator);
          if(_this.operator.length == 0){
            _this.authorityData[index] = {}
          }else{
            _this.authorityData[index] = {parentId:value.partitionId,menuId:value.childrenId,operator:_this.operator.join(",")};
          }
          // console.log(_this.authorityData,index);
        })
        _this.allData[index] = _this.authorityData;
        console.log(_this.allData);
        _this.allDataCopy = [];
        _this.allData.map(function(value,index,array){
          _this.allDataCopy = _this.allDataCopy.concat(value);
        })
        console.log(_this.allDataCopy);
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
.authorityDialog .inputLength .el-input{
  width: 34%;
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
.All-table{
    height:230px;
    overflow-x: hidden;
}
.deliverySetting-table{
    font-size: 14px;
    color: #333;  
}
.deliverySetting-table .table-head,.deliverySetting-table .table-body{
    display: flex;
    padding: 5px 0;
}
.selection{
    width: 45px;
    text-align: center;
    line-height: 36px;
}
.width185{
  width: 30%;
}
.width265{
  width: 70%;
}
.deliverySetting-table .table-head{
    height: 26px;
    align-items: center;
    background-color: #F4F3F3;
}
.deliverySetting-table .table-body{
    color: #666;
}
.deliverySetting-table .table-body:hover{
   background-color: #f5f7fa;
}
.deliverySetting-table .table-body .width265{
   display: flex;
   flex-direction: row;
   flex-wrap: wrap;
}
.deliverySetting-table .table-body .width265 label{
   line-height: 36px;
   margin-left: 0;
   color: #666;
}
.deliverySetting-table .table-body p{
   line-height: 36px;
   margin:0 auto;
}
</style>