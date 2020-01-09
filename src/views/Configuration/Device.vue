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
      <el-form-item>
        <!-- <el-input v-model="filters.name" prefix-icon="iconfont icon-ali-search" size="medium" style="color:#101010" placeholder="请输入设备名称或设备编号"></el-input> -->
        <el-autocomplete  prefix-icon="iconfont icon-ali-search" size="medium" style="color:#101010" popper-class="auto-select" v-model="dataForm.device" :fetch-suggestions="querySearch" placeholder="请输入设备名称或设备编号" :trigger-on-focus="false" @select="handleSelect" clearable></el-autocomplete>
      </el-form-item>
      <el-form-item>
        <el-button size="medium" @click="searchPage()" :style="{'background-color':themeColor,'color':'#fff','border-color':themeColor}">查询</el-button>
      </el-form-item>
    </el-form>
  </div>
  <!--表格内容栏-->
  <Configuration-device-table :height="tableHeight" :data="pageResult" :columns="filterColumns" :rowstatus="tableRowClassName" @findPage="findPage" @handleEdit="handleEdit" @handleDelete="handleDelete" @handle-lock="handleLock" :rowA="rowA" :rowB="rowB" :rowC="rowC" :text="text">
  </Configuration-device-table>
  <!--新增编辑界面-->
  <el-dialog :title="operation?'新增':'修改'" width="50%" :visible.sync="dialogVisible" custom-class="deviceDialog" center>
    <el-form label-width="100px" label-position="right" :size="size">
      <el-form :model="dataForm" :rules="dataFormRules" ref="dataForm" :inline="true" label-width="100px">
        <el-form-item label="设备名称" prop="name">
          <el-input id="equipmentName" v-model="dataForm.name"></el-input>
        </el-form-item>
        <el-form-item label="设备编号" prop="code">
          <el-input id="equipmentCode" v-model="dataForm.code"></el-input>
        </el-form-item>
        <el-form-item label="设备类型" class="inputLengthB" prop="type">
          <el-select v-model="dataForm.type" placeholder="请选择类型">
            <el-option v-for="(item,index) in machineType" :label="item.value" :value="item.value" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备型号" prop="category">
          <el-input id="equipmentCategory" v-model="dataForm.category"></el-input>
        </el-form-item>
        <el-form-item label="所属车间" class="inputLengthB" prop="department">
          <el-select v-model="dataForm.department" placeholder="请选择车间">
            <el-option v-for="(item,index) in department" :label="item.label" :value="item.value" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <div class="sub-title">关联工序
          <transition name="slide-fade"><span v-if="show" class="tips_procedure">请选择该设备生产相关的工序</span></transition>
        </div>
        <el-form-item label-width="0" class="procedure-form-inline">
          <el-checkbox-group v-model="equipment.procedure" @change="handleWelfareTreatmentChange">
            <el-checkbox name="fulicheckbox" v-for="(item,index) in procedures" :label="item.label" :value="item.value" :key="index" :data-value="item.value"></el-checkbox>
            <!-- <el-checkbox label="精车" value="{code:'WC000001',name:'精车'}"></el-checkbox>
            <el-checkbox label="数控刨"></el-checkbox>
            <el-checkbox label="加工中心"></el-checkbox>
            <el-checkbox label="内膜圆"></el-checkbox>
            <el-checkbox label="平面磨"></el-checkbox> -->
          </el-checkbox-group>
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
import ConfigurationDeviceTable from "@/views/Core/ConfigurationDeviceTable"
import { format } from "@/utils/datetime"
export default {
  components:{
    ConfigurationDeviceTable
  },
  data() {
    var checkMissionNumber = (rule, value, callback) => {
      if(!value){
        return callback(new Error('请输入设备编号'));
      }
      var params = {
        machineNumber:value,
      }
      if(value == this.initCode){
        console.log("原编码："+this.initCode);
        callback();
      }else{
        $.ajax({
          type:'GET',
          url:'/xaj/configuration/sameMachine',
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
      editLoading: false,
      dataFormRules: {
        name: [
          { required: true, message: '请输入设备名称', trigger: 'blur' }
        ],
        code: [
          { required: true,validator:checkMissionNumber, trigger:'blur'}
        ],
        type: [
          { required: true,message: '请选择设备类型', trigger:'change'}
        ],
        category: [
          { required: true,message: '请输入设备型号', trigger:'blur'}
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
        type:'',
        time:'',
        planProduction:'',
        device:'',
        name: '',
        code: '',
        type: '',
        category: '',
        department: '',
        // procedure:['粗车','精车']
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
      deviceAll:[],
      deviceForm:{
        nameCode:''
      },
      equipment:{procedure:[]},
      show:true,
      addParams:{},
      machineType:[],
      department:[
        {value:'14',label:'塑焊车间'},
        {value:'16',label:'装配车间'},
        {value:'17',label:'金工车间'},
        {value:'18',label:'注塑车间'},
        {value:'20',label:'缠绕车间'}
      ],
      procedures:[],
      welfareOptions:[],
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
        data.pageRequest.nameCode = _this.dataForm.device;
        _this.pageRequest = data.pageRequest
      }
      //这里是不调接口的
      _this.$api.configuration.findPageDevice(_this.pageRequest).then((res) => {
        console.log(res);
        var machineArray = res.data.data.machine.data;
        machineArray.forEach(function(value,index){
          switch(value.status){
            case 0:
              value.status = '报废';
              break;
            case 1:
              value.status = '正常';
          }
          if(value.id<10){
            value.id = '0'+value.id;
          }
        })
        _this.pageResult = res.data.data.machine;
        console.log(_this.pageResult)
        // this.findUserRoles()
      }).then(data!=null?data.callback:'')
      _this.$api.configuration.findPageDevice(_this.pageRequest).then((res) => {
        console.log(res);
        var machineArray = res.data.data;
        machineArray.forEach(function(value,index){
          switch(value.status){
            case 0:
              value.status = '报废';
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
      if(_this.dataForm.device==""){
        _this.deviceForm.nameCode = "";
      }
      _this.pageParams = {currPage: 1, pageSize: 10,groupId: parseInt(localStorage.getItem('groupId')),nameCode: _this.dataForm.device};
      _this.pageRequest.pageSize = 10;
      _this.pageRequest.currPage = 1;
      _this.$api.configuration.findPageDevice(_this.pageParams).then((res) => {
        console.log(res);
        var machineArray = res.data.data;
        machineArray.forEach(function(value,index){
          switch(value.status){
            case 0:
              value.status = '报废';
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
        url:'/xaj/configuration/deleteMachine',
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
      this.welfareOptions = [];
      this.equipment.procedure = [];
      this.show = true;
    },
    // 显示编辑界面
    handleEdit: function (params) {
      let _this = this;
      _this.dialogVisible = true
      _this.operation = false
      console.log(params);
      _this.initCode = params.row.machineNumber;
      _this.dataForm = {
        name:params.row.machine,
        code:params.row.machineNumber,
        type:params.row.machineType,
        category:params.row.modelNumber,
        department:params.row.groupId
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
    handleLock:function(data){
        let _this = this;
        // console.log(arr);
        // this.lockId = arr[1].id;
        // this.lockStatus = arr[1].isLock;
        // this.dialogVisibleB = true;
        $.ajax({
        type:'POST',
        url:'/xaj/configuration/updateMachineStatus',
        data:data.params,
        success:function(res){
          console.log(res);
          // this.$message({ message: '操作成功', type: 'success' })
          // _this.dialogVisibleB = false;
          _this.editLoading = false;
          // _this.$refs['dataForm'].resetFields()
          // _this.findPage(null);
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
                machine:_this.dataForm.name,
                machineNumber: _this.dataForm.code,
                machineType:_this.dataForm.type,
                modelNumber:_this.dataForm.category,
                groupId:_this.dataForm.department,
                data:JSON.stringify(_this.welfareOptions[_this.welfareOptions.length-1])
              }
              console.log(_this.addParams);
              $.ajax({
                  type:'POST',
                  url:'/xaj/configuration/addMachine',
                  data:_this.addParams,
                  success:function(data){
                    console.log(data);
                    _this.dialogVisible = false;
                    _this.editLoading = false;
                    _this.findPage(null);
                    _this.$refs['dataForm'].resetFields();
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
        //这里是修改
        _this.$refs.dataForm.validate((valid) => {
          if (valid) {
            if(!_this.show){
              _this.editLoading = true;
              _this.addParams = {
                machine:_this.dataForm.name,
                machineNumber: _this.dataForm.code,
                machineType:_this.dataForm.type,
                modelNumber:_this.dataForm.category,
                groupId:_this.dataForm.department,
                data:JSON.stringify(_this.welfareOptions[_this.welfareOptions.length-1]),
                id:_this.id
              }
              console.log(_this.addParams);
              $.ajax({
                  type:'GET',
                  url:'/xaj/configuration/updateMachine',
                  data:_this.addParams,
                  success:function(data){
                    console.log(data);
                    _this.dialogVisible = false;
                    _this.editLoading = false;
                    _this.findPage(null);
                    _this.$refs['dataForm'].resetFields();
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
        {prop:"machine", label:"设备名称", minWidth:100},
        {prop:"machineNumber", label:"设备编号", minWidth:110},
        {prop:"machineType", label:"设备类型", minWidth:100},
        {prop:"modelNumber", label:"型号", minWidth:80},
        {prop:"workShop", label:"所属车间", minWidth:100},
        {prop:"productionProcessesName", label:"关联工序", minWidth:120},
        {prop:"updateTime", label:"新增时间", minWidth:150},
        {prop:"status", label:"状态", minWidth:100}
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
        var deviceAll = this.deviceAll;
        var results = queryString ? deviceAll.filter(this.createFilter(queryString)) : deviceAll;
        //调用callback返回建议列表的数据
        cb(results);
        // console.log(results);
      },
      createFilter(queryString){
        return(deviceAll) => {
          return(deviceAll.value.toLowerCase().indexOf(queryString.toLowerCase())>-1);
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
        this.deviceForm = {nameCode:item.value};
        console.log(this.deviceForm);
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
          }else if(row.status == "报废"){
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
      },
      // procedureBind(arr){
      //   console.log(arr.length);
      //   if(arr.length==0){
      //     this.show = true;
      //   }else{
      //     this.show = false;
      //   }
      // }
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
          var newArr = [];
          $.each(data,function(index,value){
            if(value!==null){
              newArr.push(value);
            }
          })
          $.each(newArr,function(index,value){
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
            var val = {code:value.productionProcessesCode,name:value.productionProcessesName};
            val = JSON.stringify(val);
            _this.procedures.push({label:value.productionProcessesName,value:val});
          });
        }
    })
    console.log(_this.procedures);
    // console.log(_this.filterColumns);
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
                  if(nameArr[i].value == newArr[index].machineName){
                    flag=false;
                  }
                })
              }
              if(flag){
                nameArr.push({value:newArr[index].machineName});
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
                numberArr.push({value:newArr[index].machineNumber});
              }
            })
          _this.deviceAll = nameArr.concat(numberArr);
          console.log(_this.deviceAll);
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
.deviceDialog .inputLengthB .el-form-item__content{
  width: 207px;
}
.deviceDialog .procedure-form-inline{
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
.deviceDialog .sub-title{
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
</style>