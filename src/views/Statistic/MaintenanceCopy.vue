<template>
  <div class="page-container">
  <!--工具栏-->
  <div class="toolbar" style="margin:0 auto;padding-top:10px;padding-right:15px;float:initial;">
    <el-form :inline="true" :size="size">
      <el-form-item style="width:120px;">
        <!-- <el-input prefix-icon="iconfont icon-ali-calendar-range" size="medium" style="color:#101010" value="年度"></el-input> -->
        <el-date-picker v-model="year" type="year" placeholder="选择年份" size="medium" value-format="yyyy"></el-date-picker>
        <!-- <el-select v-model="select" size="medium" placeholder="保养周期">
            <el-option label="年度" value="1"></el-option>
            <el-option label="月度" value="2"></el-option>
          </el-select> -->
      </el-form-item>
      <el-form-item style="width:120px;">
        <el-select v-model="machine" size="medium" placeholder="设备类型">
            <el-option v-for="(item,index) in machineType" :label="item.value" :value="item.value" :key="index"></el-option>
          </el-select>
      </el-form-item>
      <!-- <el-form-item style="width:120px;">
        <el-select v-model="maintenance" size="medium" placeholder="维保类型" @change="handleMaintenance">
            <el-option label="设备保养" value="1"></el-option>
            <el-option label="设备维修" value="2"></el-option>
          </el-select>
      </el-form-item> -->
      <!-- <el-form-item style="width:300px;">
        <el-col :span="11">
            <el-date-picker type="date" placeholder="起始时间" v-model="form.date1" style="width: 100%;" size="medium" :picker-options="pickerOptions0" :clearable="false"></el-date-picker>
          </el-col>
          <el-col class="line" :span="2" style="color:#BBBBBB">—</el-col>
          <el-col :span="11">
            <el-date-picker type="date" placeholder="结束时间" v-model="form.date2" style="width: 100%;" size="medium" :picker-options="pickerOptions1" :clearable="false"></el-date-picker>
          </el-col>
      </el-form-item> -->
      <el-form-item>
        <el-autocomplete  prefix-icon="iconfont icon-ali-search" size="medium" style="color:#101010" popper-class="auto-select" v-model="dataForm.device" :fetch-suggestions="querySearch" placeholder="请输入设备名称或设备编号" :trigger-on-focus="false" @select="handleSelect" clearable></el-autocomplete>
      </el-form-item>
      <el-form-item>
        <el-button size="medium" @click="searchPage()" :style="{'background-color':themeColor,'color':'#fff','border-color':themeColor}">查询</el-button>
      </el-form-item>
    </el-form>
  </div>
  <div class="section-three">
    <div class="titlebar">
      <ul>
        <li><i class="iconfont icon-ali-wrench"></i>维修</li>
      </ul>
      <span>设备年度维修情况</span>
      <el-radio-group size="mini" v-model="radio2" @change="chooseRadioB">
        <el-radio-button label="图形"></el-radio-button>
        <el-radio-button label="表格"></el-radio-button>
      </el-radio-group>
    </div>
    <!--表格内容栏-->
    <div v-show="isRepairChart"><Statistic-repair-chart :height="tableHeight" :data="chartResultB" :columns="filterColumnsCopy" :customColumns="filterCustomColumns" @findPage="findChartB"></Statistic-repair-chart></div>
    <div v-show="!isRepairChart"><Statistic-repair-table :height="tableHeight" :data="pageResultB" :columns="filterColumnsB" @findPage="findPageB" :rowstatus="tableRowClassNameB"></Statistic-repair-table></div>
  </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import StatisticMaintenanceTable from "@/views/Core/StatisticMaintenanceTable"
import StatisticMaintainChart from "@/views/Sharp/StatisticMaintainChart"
import StatisticMaintainTable from "@/views/Sharp/StatisticMaintainTable"
import StatisticRepairChart from "@/views/Sharp/StatisticRepairChart"
import StatisticRepairTable from "@/views/Sharp/StatisticRepairTable"
import { format } from "@/utils/datetime"
export default {
  components:{
    StatisticMaintenanceTable,
    StatisticMaintainChart,
    StatisticMaintainTable,
    StatisticRepairChart,
    StatisticRepairTable
  },
  data() {
    return {
      inputs:[{}],
      size: 'small',
      tableHeight:null,
      form: {
        date1: '',
        date2: ''
      },
      year:'',
      machine:'',
      maintenance:'',
      filters: {
        name: ''
      },
      columns: [],
      columnsA: [],
      columnsB: [],
      columnsCopy: [],
      custom_columns: [],
      rowA:[],
      rowB:[],
      rowC:[],
      rowD:[],
      rowE:[],
      filterColumns: [],
      filterColumnsA: [],
      filterColumnsB: [],
      filterColumnsCopy: [],
      filterCustomColumns: [],
      pageRequest: { },
      pageParams: { },
      chartResultB: {},
      pageResultB: {},
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
        device:''
      },
      refForm:{
        dev_value:'',
        per_value:''
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
      machineType:[
        // {label:"普车",value:"1"},
        // {label:"数控车床",value:"2"},
        // {label:"刨床",value:"3"},
        // {label:"铣床",value:"4"},
        // {label:"磨床",value:"5"},
        // {label:"镗床",value:"6"}
      ],
      isTableAll:true,
      isTableA:false,
      isTableB:false,
      isMaintainChart:true,
      isRepairChart:true,
      radio1:'图形',
      radio2:'图形',
      deviceForm:{
        nameNumber:''
      }
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
    findPageB: function (data) {
      console.log(data);
      let _this = this;
      if(data !== null) {
        data.pageRequest.year = _this.year;
        data.pageRequest.machineType = _this.machine;
        data.pageRequest.nameNumber = _this.dataForm.device;
        _this.pageRequest = data.pageRequest
      }
      //这里是不调接口的
      _this.$api.statistic.findPageBMaintenance(_this.pageRequest).then((res) => {
        console.log(res);
        var newArray = res.data.data.maintenance_b_list.data;
        newArray.forEach(function(value,index){
          switch(value.status){
            case 0:
              value.status = '待检修';
              break;
            case 1:
              value.status = '已完成';
              break;
          }
        })
        _this.pageResultB = res.data.data.maintenance_b_list;
        console.log(_this.pageResultB)
        // this.findUserRoles()
      }).then(data!=null?data.callback:'')
      _this.$api.statistic.findPageBMaintenance(_this.pageRequest).then((res) => {
        console.log(res);
        var newArray = res.data.data;
        newArray.forEach(function(value,index){
          switch(value.status){
            case 0:
              value.status = '待检修';
              break;
            case 1:
              value.status = '已完成';
              break;
          }
        })
        _this.pageResultB = res.data;
        console.log(_this.pageResultB)
        // this.findUserRoles()
      }).then(data!=null?data.callback:'')
    },
    findChartB: function (data) {
      console.log(data);
      let _this = this;
      if(data !== null) {
        data.pageRequest.year = _this.year;
        data.pageRequest.machineType = _this.machine;
        data.pageRequest.nameNumber = _this.dataForm.device;
        _this.pageRequest = data.pageRequest
      }
      //这里是不调接口的
      _this.$api.statistic.findChartBMaintenance(_this.pageRequest).then((res) => {
        console.log(res);
        var newArray = res.data.data.maintenance_b_chart.data;
        newArray.forEach(function(value,index){
          if(value.january!=null){
            value.january = [{"state":3,"num":value.january}];
          }
          if(value.february!=null){
            value.february = [{"state":3,"num":value.february}];
          }
          if(value.march!=null){
            value.march = [{"state":3,"num":value.march}];
          }
          if(value.april!=null){
            value.april = [{"state":3,"num":value.april}];
          }
          if(value.may!=null){
            value.may = [{"state":3,"num":value.may}];
          }
          if(value.june!=null){
            value.june = [{"state":3,"num":value.june}];
          }
          if(value.july!=null){
            value.july = [{"state":3,"num":value.july}];
          }
          if(value.august!=null){
            value.august = [{"state":3,"num":value.august}];
          }
          if(value.september!=null){
            value.september = [{"state":3,"num":value.september}];
          }
          if(value.october!=null){
            value.october = [{"state":3,"num":value.october}];
          }
          if(value.november!=null){
            value.november = [{"state":3,"num":value.november}];
          }
          if(value.december!=null){
            value.december = [{"state":3,"num":value.december}];
          }
        })
        _this.chartResultB = res.data.data.maintenance_b_chart;
        console.log(_this.chartResultB)
        // this.findUserRoles()
      }).then(data!=null?data.callback:'')
      _this.$api.statistic.findChartBMaintenance(_this.pageRequest).then((res) => {
        console.log(res);
        var newArray = res.data;
        newArray.forEach(function(value,index){
          if(value.january!=null){
            value.january = [{"state":3,"num":value.january}];
          }
          if(value.february!=null){
            value.february = [{"state":3,"num":value.february}];
          }
          if(value.march!=null){
            value.march = [{"state":3,"num":value.march}];
          }
          if(value.april!=null){
            value.april = [{"state":3,"num":value.april}];
          }
          if(value.may!=null){
            value.may = [{"state":3,"num":value.may}];
          }
          if(value.june!=null){
            value.june = [{"state":3,"num":value.june}];
          }
          if(value.july!=null){
            value.july = [{"state":3,"num":value.july}];
          }
          if(value.august!=null){
            value.august = [{"state":3,"num":value.august}];
          }
          if(value.september!=null){
            value.september = [{"state":3,"num":value.september}];
          }
          if(value.october!=null){
            value.october = [{"state":3,"num":value.october}];
          }
          if(value.november!=null){
            value.november = [{"state":3,"num":value.november}];
          }
          if(value.december!=null){
            value.december = [{"state":3,"num":value.december}];
          }
        })
        _this.chartResultB = res;
        console.log(_this.chartResultB)
        // this.findUserRoles()
      }).then(data!=null?data.callback:'')
    },
    // 查询分页数据
    searchPage: function () {
      let _this = this;
      if(_this.year == null){
        _this.year = [];
      }
      if(_this.dataForm.device==""){
        _this.deviceForm.nameNumber = "";
      }
      if(_this.isRepairChart){
        _this.pageParams = {year:_this.year,machineType:_this.machine,nameCode: _this.dataForm.device};
        _this.$api.statistic.findChartBMaintenance(_this.pageParams).then((res) => {
          console.log(res);
          var newArray = res.data;
          newArray.forEach(function(value,index){
            if(value.january!=null){
              value.january = [{"state":3,"num":value.january}];
            }
            if(value.february!=null){
              value.february = [{"state":3,"num":value.february}];
            }
            if(value.march!=null){
              value.march = [{"state":3,"num":value.march}];
            }
            if(value.april!=null){
              value.april = [{"state":3,"num":value.april}];
            }
            if(value.may!=null){
              value.may = [{"state":3,"num":value.may}];
            }
            if(value.june!=null){
              value.june = [{"state":3,"num":value.june}];
            }
            if(value.july!=null){
              value.july = [{"state":3,"num":value.july}];
            }
            if(value.august!=null){
              value.august = [{"state":3,"num":value.august}];
            }
            if(value.september!=null){
              value.september = [{"state":3,"num":value.september}];
            }
            if(value.october!=null){
              value.october = [{"state":3,"num":value.october}];
            }
            if(value.november!=null){
              value.november = [{"state":3,"num":value.november}];
            }
            if(value.december!=null){
              value.december = [{"state":3,"num":value.december}];
            }
          })
          _this.chartResultB = res;
          console.log(_this.chartResultB)
          // this.findUserRoles()
        }).then()
      }else{
        _this.pageParams = {currPage: 1, pageSize: 10,year:_this.year,machineType:_this.machine,nameCode: _this.dataForm.device};
        _this.pageRequest.pageSize = 10;
        _this.pageRequest.currPage = 1;
        _this.$api.statistic.findPageBMaintenance(_this.pageParams).then((res) => {
          console.log(res);
          var newArray = res.data.data;
          newArray.forEach(function(value,index){
            switch(value.status){
              case 0:
                value.status = '待检修';
                break;
              case 1:
                value.status = '已完成';
                break;
            }
          })
          _this.pageResultB = res.data;
          console.log(_this.pageResultB)
          // this.findUserRoles()
        }).then()
      }
    },
    // 编辑
    submitForm: function () {
      let _this = this;
      _this.$refs.dataForm.validate((valid) => {
        if (valid) {
          _this.$confirm('确认提交吗？', '提示', {}).then(() => {
            _this.editLoading = true
            if(!_this.operation){
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
            }else{
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
          })
        }
      })
    },
    // 处理表格列过滤显示
    initColumnsB: function () {
      this.columnsB = [
        // {prop:"id", label:"序号", minWidth:50},
        {prop:"machineNumber", label:"设备编号", minWidth:100},
        {prop:"machine", label:"设备名称", minWidth:100},
        {prop:"modelNumber", label:"设备型号", minWidth:100},
        {prop:"reason", label:"故障原因", minWidth:100},
        {prop:"breakDate", label:"故障时间", minWidth:110},
        {prop:"completeDate", label:"完成时间", minWidth:110},
        {prop:"repairPerson", label:"维修人", minWidth:90},
        {prop:"checkPerson", label:"验收人", minWidth:90},
        {prop:"status", label:"维修状态", minWidth:100}
      ]
      this.filterColumnsB = JSON.parse(JSON.stringify(this.columnsB));
    },
    initCustomColumns: function() {
      this.custom_columns = [
        {prop:"january", label:"1月", minWidth:110},
        {prop:"february", label:"2月", minWidth:110},
        {prop:"march", label:"3月", minWidth:110},
        {prop:"april", label:"4月", minWidth:110},
        {prop:"may", label:"5月", minWidth:110},
        {prop:"june", label:"6月", minWidth:110},
        {prop:"july", label:"7月", minWidth:110},
        {prop:"august", label:"8月", minWidth:110},
        {prop:"september", label:"9月", minWidth:110},
        {prop:"october", label:"10月", minWidth:110},
        {prop:"november", label:"11月", minWidth:110},
        {prop:"december", label:"12月", minWidth:110},
      ]
      this.filterCustomColumns = JSON.parse(JSON.stringify(this.custom_columns));
    },
    initColumnsCopy: function () {
      this.columnsCopy = [
        // {prop:"id", label:"序号", minWidth:50},
        {prop:"machine", label:"设备名称", minWidth:90},
        {prop:"machineNumber", label:"设备编号", minWidth:90},
        // {prop:"maintenanceCycle", label:"保养周期", minWidth:90}
      ]
      this.filterColumnsCopy = JSON.parse(JSON.stringify(this.columnsCopy));
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
      handleSelect(item){
        console.log(item);
        this.deviceForm = {nameNumber:item.value};
        console.log(this.deviceForm);
        // $("#materialName").val(item.name);
        // $("#materialCode").val(item.code);
        // $("#materialType").val(item.type);
      },
    tableRowClassNameB({row, rowIndex}){
      var length = $(".repair .el-table__body-wrapper tbody tr:eq(0) td").length - 1;
      if(row.status == "待检修"){
        $(".repair .el-table__body-wrapper tbody tr:eq("+rowIndex+") td:eq("+(length)+")").css({"color":"#FF9800"});
      }else if(row.status == "已完成"){
        $(".repair .el-table__body-wrapper tbody tr:eq("+rowIndex+") td:eq("+(length)+")").css({"color":"#3F51B5"});
      }
    },
    handleMaintenance: function(data) {
      console.log(data);
      if(data==1){
        this.isTableAll = false;
        this.isTableA = true;
        this.isTableB = false;
      }else if(data==2){
        this.isTableAll = false;
        this.isTableA = false;
        this.isTableB = true;
      }
    },
    chooseRadioA: function(data) {
      let _this = this;
      if(data=="图形"){
        _this.isMaintainChart = true;
      }else{
        _this.isMaintainChart = false;
      }
    },
    chooseRadioB: function(data) {
      let _this = this;
      if(data=="图形"){
        _this.isRepairChart = true;
      }else{
        _this.isRepairChart = false;
      }
    }
  },
  mounted() {
    let _this = this;
    function repage(){
      var win_height = $(window).height();
      var nav_heihgt = $(".headbar").height();
      var tab_height = $(".tabs").height();
      var gap = 270;
      _this.tableHeight = win_height - nav_heihgt - tab_height - gap;
    }
    repage();
    // this.findDeptTree()
    _this.initColumnsB();
    _this.initCustomColumns();
    _this.initColumnsCopy();
    console.log(_this.filterColumns,_this.filterCustomColumns);
    console.log(localStorage.getItem('groupId'),localStorage.getItem('icCardNum'));
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
ul{
  list-style: none;
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
  font-size: 26px;
  color: #101010;
  font-family: 'SourceHanSansSC-regular';
  text-align: center;
}
.titlebar{
  color: #101010;
  font-size: 24px;
  font-family: 'SourceHanSansSC-regular';
  line-height: 36px;
  margin-top: 18px;
  margin-bottom: 18px;
  position: relative;
}
.titlebar .el-radio-group{
  position: absolute;
  right: 30px;
  top: 5px;
}
.titlebar .el-radio-button__orig-radio:checked+.el-radio-button__inner{
  background-color: #757474;
  border-color: #bbb;
}
.titlebar ul{
  position: absolute;
  left:30px;
  margin:0;
  padding: 0;
}
.titlebar ul li{
  float: left;
  font-size: 14px;
  color: #101010;
  font-family: 'SourceHanSansSC-regular';
  margin-right:20px;
}
.titlebar ul li i{
  font-size: 24px;
  margin-right:10px;
  position: relative;
  top: 3px;
}
.titlebar ul li i.icon-ali-success{
  color: #259B24;
}
.titlebar ul li i.icon-ali-error{
  color: #E51C23;
}
.titlebar ul li i.icon-ali-stop{
  color: #8B8B8C;
}
.titlebar ul li i.icon-ali-wrench{
  color: #3F51B5;
}
.chart-title{
  color: #101010;
  font-size:14px;
  font-family: 'SourceHanSansSC-regular';
  width: 20px;
  height: 100%;
  display: flex;
  align-items: center;
}
.chart-title-left{
  position: absolute;
  left: 10px;
}
.chart-title-right{
  position: absolute;
  right: 10px;
}
.maintenance .icon-ali-success{
  font-size:32px;
  color: #259B24;
}
.maintenance .icon-ali-error{
  font-size:32px;
  color: #E51C23;
}
.maintenance .icon-ali-stop{
  font-size:32px;
  color: #8B8B8C;
}
.maintenance .icon-ali-wrench{
  font-size:32px;
  color: #3F51B5;
}
.maintenance td{
  padding:6px !important;
}
.maintenance .cell{
  height: 40px;
  line-height: 40px;
}
.el-date-editor.el-input{
  width: 100%;
}
</style>