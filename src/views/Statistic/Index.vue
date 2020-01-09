<template>
  <div class="page-container">
  <!--工具栏-->
  <div class="toolbar" style="margin:0 auto;padding-top:10px;padding-right:15px;float:initial;">
    <el-form :inline="true" :size="size">
      <el-form-item style="width:120px;">
        <el-select v-model="select" size="medium" placeholder="请选择">
            <el-option label="按日" value="byDay"></el-option>
            <el-option label="按月" value="byMonth"></el-option>
            <el-option label="按年" value="byYear"></el-option>
          </el-select>
      </el-form-item>
      <el-form-item style="width:300px;">
        <!-- <el-col :span="11">
            <el-date-picker type="date" placeholder="起始时间" v-model="form.date1" style="width: 100%;" size="medium" :picker-options="pickerOptions0" :clearable="false"></el-date-picker>
          </el-col>
          <el-col class="line" :span="2" style="color:#BBBBBB">—</el-col>
          <el-col :span="11">
            <el-date-picker type="date" placeholder="结束时间" v-model="form.date2" style="width: 100%;" size="medium" :picker-options="pickerOptions1" :clearable="false"></el-date-picker>
          </el-col> -->
          <el-date-picker v-show="select=='byDay'" size="medium" v-model="dateArr" type="daterange" range-separator="—" start-placeholder="起始时间" end-placeholder="结束时间"></el-date-picker>
          <el-date-picker v-show="select=='byMonth'" size="medium" v-model="dateArr" type="monthrange" range-separator="—" start-placeholder="起始时间" end-placeholder="结束时间"></el-date-picker>
          <!-- <el-date-picker v-show="select=='byYear'" size="medium" v-model="dateArr" type="year" range-separator="—" start-placeholder="起始时间" end-placeholder="结束时间"></el-date-picker> -->
          <el-col v-show="select=='byYear'" :span="11">
            <el-date-picker type="year" placeholder="起始时间" v-model="form.date1" style="width: 100%;" size="medium" :picker-options="pickerOptions0" :clearable="false"></el-date-picker>
          </el-col>
          <el-col v-show="select=='byYear'" class="line" :span="2" style="color:#303133">—</el-col>
          <el-col v-show="select=='byYear'" :span="11">
            <el-date-picker type="year" placeholder="结束时间" v-model="form.date2" style="width: 100%;" size="medium" :picker-options="pickerOptions1" :clearable="false"></el-date-picker>
          </el-col>
      </el-form-item>
      <el-form-item>
        <!-- <el-input v-model="filters.name" prefix-icon="iconfont icon-ali-search" size="medium" style="color:#101010" placeholder="请输入员工姓名或手机号码"></el-input> -->
       <el-autocomplete  prefix-icon="iconfont icon-ali-search" size="medium" style="color:#101010" popper-class="auto-select" v-model="dataForm.user" :fetch-suggestions="querySearch" placeholder="请输入员工姓名或手机号码" :trigger-on-focus="false" @select="handleSelect" clearable></el-autocomplete>
      </el-form-item>
      <el-form-item>
        <el-button size="medium" @click="searchPage()" :style="{'background-color':themeColor,'color':'#fff','border-color':themeColor}">查询</el-button>
      </el-form-item>
    </el-form>
  </div>
  <div class="titlebar">
    <span>员工工作绩效</span>
    <el-radio-group size="mini" v-model="radio1" @change="chooseRadio">
      <el-radio-button label="图形"></el-radio-button>
      <el-radio-button label="表格"></el-radio-button>
    </el-radio-group>
  </div>
  <!--图表内容栏-->
  <div v-if="!isTable" :style="{height:tableHeight+'px'}" style="position:relative;">
    <div class="chart-title chart-title-left">生产件数</div>
     <div class="chart-title chart-title-right">工作时长</div>
    <div id="job" style="width:100%;height:100%"></div>
  </div>
  <!--表格内容栏-->
  <div v-if="isTable"><Statistic-table :height="tableHeight" :data="pageResult" :columns="filterColumns" @findPage="findPage"></Statistic-table></div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import StatisticTable from "@/views/Core/StatisticTable"
import { format } from "@/utils/datetime"
export default {
  components:{
    StatisticTable
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
      select:'byDay',
      dateArr:[],
      filters: {
        name: ''
      },
      columns: [],
      rowA:[],
      rowB:[],
      rowC:[],
      rowD:[],
      rowE:[],
      filterColumns: [],
      pageRequest: { currPage: 1, pageSize: 10 },
      pageParams: { currPage: 1, pageSize: 10 },
      chartRequest:{ },
      pageResult: {},
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
        user:''
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
      isTable:false,
      radio1:'图形',
      mychartOne:'',
      xAxisDate:['6/10','6/11','6/12','6/13','6/14','6/15','6/16','6/17','6/18','6/19','6/20','6/21','6/22','6/23','6/24','6/25','6/26','6/27'],
      quantity:[420,320,340,280,180,160,100,280,450,520,320,430,190,290,100,195,310,420],
      productionTime:[5.8,4.8,5.2,3.5,2.5,1.8,1.2,3.7,7.2,7.8,4.2,7.1,3.1,3.9,1.1,2.9,4.5,5.8],
      packageNum:'',
      durationNum:'',
      userForm:{
        nameMobile:''
      },
      chart_fontSize_10:10,
      chart_fontSize_14:14,
      chart_fontSize_16:16
    } 
  },
  computed:{
      ...mapState({
        themeColor: state=>state.app.themeColor,
        collapse: state=>state.app.collapse
      })
  },
  watch:{
    '$store.state.app.collapse':function(val){
      this.mychartOne.resize();
    }
  },
  methods: {
    // 获取分页数据
    findPage: function (data) {
      console.log(data);
      let _this = this;
      if(data !== null) {
        data.pageRequest.period = _this.select;
        data.pageRequest.nameMobile = _this.dataForm.user;
        if(_this.select == 'byYear'){
          data.pageRequest.startTime = _this.form.date1;
          data.pageRequest.endTime = _this.form.date2;
        }else{
          data.pageRequest.startTime = _this.dateArr[0];
          data.pageRequest.endTime = _this.dateArr[1];
        }
        _this.pageRequest = data.pageRequest
      }
      //这里是不调接口的
      _this.$api.statistic.findPage(_this.pageRequest).then((res) => {
        console.log(res);
        var newArray = res.data.data.person_list.data;
        newArray.forEach(function(value,index){
          
        })
        _this.pageResult = res.data.data.person_list;
        console.log(_this.pageResult)
        // this.findUserRoles()
      }).then(data!=null?data.callback:'')
      $.get('/xaj/statistic/searchEmployeePerformanceList',_this.pageRequest).then((res) => {
        console.log(res);
        var newArray = res.data;
        newArray.forEach(function(value,index){
          
        })
        _this.pageResult = res;
        console.log(_this.pageResult)
        // this.findUserRoles()
      }).then(data!=null?data.callback:'')
    },
    // 查询分页数据
    searchPage: function () {
      let _this = this;
      var start,end;
      // console.log(_this.dateArr[0]);
      if(_this.dateArr == null){
        _this.dateArr = [];
      }
      if(_this.form.date1 == "" || _this.form.date1 == null){
        _this.form.date1 = undefined;
      }
      if(_this.form.date2 == "" || _this.form.date2 == null){
        _this.form.date2 = undefined;
      }
      if(_this.dataForm.user==""){
        _this.userForm.nameMobile = "";
      }
      if(_this.select == 'byYear'){
        start = _this.form.date1;
        end = _this.form.date2;
      }else{
        start = _this.dateArr[0];
        end = _this.dateArr[1];
      }
      console.log(start);
      _this.pageParams = {currPage: 1, pageSize: 10,startTime: start,endTime: end,period: _this.select,nameMobile: _this.dataForm.user};
      // _this.pageParams = {currPage: 1, pageSize: 10,startTime: _this.form.date1,endTime: _this.form.date2,period: _this.select,nameMobile: _this.userForm.nameMobile};
      console.log(_this.pageParams);
      // _this.chartRequest = {startTime: _this.dateArr[0],endTime: _this.dateArr[1],period: _this.select,nameMobile: _this.userForm.nameMobile};
      // console.log(_this.chartRequest);
      _this.pageRequest.pageSize = 10;
      _this.pageRequest.currPage = 1;
      // $.ajax({
      //   type:'GET',
      //   url:'/xaj/statistic/searchEmployeePerformanceList',
      //   data:_this.pageParams,
      //   success:function(data){
      //     console.log(data);
      //   }
      // })
      $.get('/xaj/statistic/searchEmployeePerformanceList',_this.pageParams).then((res) => {
        console.log(res);
        var newArray = res.data;
        newArray.forEach(function(value,index){
          
        })
        _this.pageResult = res;
        console.log(_this.pageResult)
        // this.findUserRoles()
      }).then()
      _this.findChart();
       
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
    initColumns: function () {
      this.columns = [
        // {prop:"id", label:"序号", minWidth:50},
        {prop:"name", label:"员工姓名", minWidth:100},
        {prop:"groupName", label:"所属部门", minWidth:100},
        {prop:"materialName", label:"物料名称", minWidth:150},
        {prop:"materialCode", label:"物料编码", minWidth:100},
        {prop:"specifications", label:"规格型号", minWidth:90},
        {prop:"productionProcessesName", label:"生产工序", minWidth:90},
        {prop:"machine", label:"生产设备", minWidth:90},
        {prop:"nowQuantity", label:"生产数量", minWidth:90},
        {prop:"productionStartTime", label:"开始时间", minWidth:100},
        {prop:"updateTime", label:"完成时间", minWidth:100},
        {prop:"productionTime",label:"生产用时",minWidth:100}
      ]
      this.filterColumns = JSON.parse(JSON.stringify(this.columns));
    },
    chooseRadio: function(data) {
      let _this = this;
      if(data=="图形"){
        _this.isTable = false;
        _this.findChart();
      }else{
        _this.isTable = true;
      }
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
      findChart: function(){
        let _this = this;
        var start,end;
        if(_this.select == 'byYear'){
          start = _this.form.date1;
          end = _this.form.date2;
        }else{
          start = _this.dateArr[0];
          end = _this.dateArr[1];
        }
        _this.chartRequest = {
          period: _this.select,
          startTime: start,
          endTime: end,
          nameMobile: _this.dataForm.user
        }
        _this.xAxisDate = [];
        _this.quantity = [];
        _this.productionTime = [];
        console.log(_this.chartRequest);
        //这里是不调接口的
        _this.$api.statistic.findChart(_this.chartRequest).then((res) => {
          console.log(res);
          var data = res.data.data.person_chart.data;
          $.each(data,function(index,value){
            if(_this.select == 'byYear'){
              var dateArr = value.nowDate+"年";
            }else{
              var dateArr = value.nowDate.split("-");
              if(dateArr.length<3){
                dateArr.splice(0,1);
                dateArr = dateArr+"月";
              }else{
                dateArr.splice(0,1);
                dateArr = dateArr.join("/");
              }
            }
            console.log(dateArr);
            _this.xAxisDate.push(dateArr);
            _this.quantity.push(value.quantity);
            _this.productionTime.push(value.productionTime);
            console.log(_this.xAxisDate,_this.quantity,_this.productionTime);
          })
          _this.chart_fontSize_10 = document.documentElement.clientWidth*10/1920*1;
          _this.chart_fontSize_14 = document.documentElement.clientWidth*10/1920*1.4;
          _this.chart_fontSize_16 = document.documentElement.clientWidth*10/1920*1.6;
          _this.mychartOne = _this.$echarts.init(document.getElementById("job"));
          setTimeout(function(){
            _this.mychartOne.setOption({
              grid:{
                top:8*_this.chart_fontSize_10,
                left:8*_this.chart_fontSize_10,
                right:7*_this.chart_fontSize_10
              },
              legend:{
                left:'center',
                top:'top',
                textStyle:{
                  color:'#101010',
                  fontSize:_this.chart_fontSize_14,
                  fontFamily:'SourceHanSansSC-regular'
                },
                data:[{name:'生产数量(件)',icon:'circle'},{name:'工作时长(hour)',icon:'triangle'}]
              },
              xAxis:{
                axisLine:{
                  lineStyle:{
                    color:'#848080'
                  }
                },
                axisTick:{
                  inside:true,
                  length:2*_this.chart_fontSize_10,
                  lineStyle:{
                    color:'#848080'
                  }
                },
                axisLabel:{
                  color:'#101010',
                  fontSize:_this.chart_fontSize_14,
                  fontFamily:'SourceHanSansSC-regular'
                },
                data:_this.xAxisDate
              },
              yAxis:[
                {
                  name:'单位：件',
                  nameTextStyle:{
                    color:'#101010',
                    fontSize:_this.chart_fontSize_14,
                    fontFamily:'SourceHanSansSC-regular'
                  },
                  min:0,
                  // max:1000,
                  splitNumber:5,
                  axisLine:{
                    show:false
                  },
                  axisTick:{
                    show:false
                  },
                  axisLabel:{
                    color:'#101010',
                    fontSize:_this.chart_fontSize_14,
                    fontFamily:'SourceHanSansSC-regular'
                  },
                  splitLine:{
                    show:true,
                    lineStyle:{
                      color:'#C1C0C0'
                    }
                  }
                },
                {
                  name:'单位：hour',
                  nameTextStyle:{
                    color:'#101010',
                    fontSize:_this.chart_fontSize_14,
                    fontFamily:'SourceHanSansSC-regular'
                  },
                  min:0,
                  // max:10,
                  splitNumber:5,
                  axisLine:{
                    show:false
                  },
                  axisTick:{
                    show:false
                  },
                  axisLabel:{
                    color:'#101010',
                    fontSize:_this.chart_fontSize_14,
                    fontFamily:'SourceHanSansSC-regular'
                  },
                  splitLine:{
                    show:false
                  }
                }
              ],
              series:[{
                type:'line',
                name:'生产数量(件)',
                yAxisIndex:0,
                symbol:'circle',
                symbolSize:16,
                emphasis:{
                  label:{
                    show:true,
                    color:'#101010',
                    fontSize:_this.chart_fontSize_14,
                    fontFamily:'SourceHanSansSC-regular'
                  }
                },
                itemStyle:{
                  color:'#8BC34A',
                  borderColor:'#8BC34A'
                },
                lineStyle:{
                  color:'#8BC34A',
                  width:1
                },
                data:_this.quantity
              },{
                type:'line',
                name:'工作时长(hour)',
                yAxisIndex:1,
                symbol:'triangle',
                symbolSize:_this.chart_fontSize_16,
                emphasis:{
                  label:{
                    show:true,
                    color:'#101010',
                    fontSize:_this.chart_fontSize_14,
                    fontFamily:'SourceHanSansSC-regular'
                  }
                },
                itemStyle:{
                  color:'#485ABF',
                  borderColor:'#485ABF'
                },
                lineStyle:{
                  color:'#485ABF',
                  width:1
                },
                data:_this.productionTime
              }]
            })
          },500);
        }).then()
        $.get('/xaj/statistic/searchEmployeePerformanceChart',_this.chartRequest).then((res) => {
          console.log(res);
          var data = res;
          $.each(data,function(index,value){
            if(_this.select == 'byYear'){
              var dateArr = value.nowDate+"年";
            }else{
              var dateArr = value.nowDate.split("-");
              if(dateArr.length<3){
                dateArr.splice(0,1);
                dateArr = dateArr+"月";
              }else{
                dateArr.splice(0,1);
                dateArr = dateArr.join("/");
              }
            }
            console.log(dateArr);
            _this.xAxisDate.push(dateArr);
            _this.quantity.push(value.quantity);
            _this.productionTime.push(value.productionTime);
            console.log(_this.xAxisDate,_this.quantity,_this.productionTime);
          })
          _this.chart_fontSize_10 = document.documentElement.clientWidth*10/1920*1;
          _this.chart_fontSize_14 = document.documentElement.clientWidth*10/1920*1.4;
          _this.chart_fontSize_16 = document.documentElement.clientWidth*10/1920*1.6;
          _this.mychartOne = _this.$echarts.init(document.getElementById("job"));
          setTimeout(function(){
            _this.mychartOne.setOption({
              grid:{
                top:8*_this.chart_fontSize_10,
                left:8*_this.chart_fontSize_10,
                right:7*_this.chart_fontSize_10
              },
              legend:{
                left:'center',
                top:'top',
                textStyle:{
                  color:'#101010',
                  fontSize:_this.chart_fontSize_14,
                  fontFamily:'SourceHanSansSC-regular'
                },
                data:[{name:'生产数量(件)',icon:'circle'},{name:'工作时长(hour)',icon:'triangle'}]
              },
              xAxis:{
                axisLine:{
                  lineStyle:{
                    color:'#848080'
                  }
                },
                axisTick:{
                  inside:true,
                  length:2*_this.chart_fontSize_10,
                  lineStyle:{
                    color:'#848080'
                  }
                },
                axisLabel:{
                  color:'#101010',
                  fontSize:_this.chart_fontSize_14,
                  fontFamily:'SourceHanSansSC-regular'
                },
                data:_this.xAxisDate
              },
              yAxis:[
                {
                  name:'单位：件',
                  nameTextStyle:{
                    color:'#101010',
                    fontSize:_this.chart_fontSize_14,
                    fontFamily:'SourceHanSansSC-regular'
                  },
                  min:0,
                  // max:1000,
                  splitNumber:5,
                  axisLine:{
                    show:false
                  },
                  axisTick:{
                    show:false
                  },
                  axisLabel:{
                    color:'#101010',
                    fontSize:_this.chart_fontSize_14,
                    fontFamily:'SourceHanSansSC-regular'
                  },
                  splitLine:{
                    show:true,
                    lineStyle:{
                      color:'#C1C0C0'
                    }
                  }
                },
                {
                  name:'单位：hour',
                  nameTextStyle:{
                    color:'#101010',
                    fontSize:_this.chart_fontSize_14,
                    fontFamily:'SourceHanSansSC-regular'
                  },
                  min:0,
                  // max:10,
                  splitNumber:5,
                  axisLine:{
                    show:false
                  },
                  axisTick:{
                    show:false
                  },
                  axisLabel:{
                    color:'#101010',
                    fontSize:_this.chart_fontSize_14,
                    fontFamily:'SourceHanSansSC-regular'
                  },
                  splitLine:{
                    show:false
                  }
                }
              ],
              series:[{
                type:'line',
                name:'生产数量(件)',
                yAxisIndex:0,
                symbol:'circle',
                symbolSize:16,
                emphasis:{
                  label:{
                    show:true,
                    color:'#101010',
                    fontSize:_this.chart_fontSize_14,
                    fontFamily:'SourceHanSansSC-regular'
                  }
                },
                itemStyle:{
                  color:'#8BC34A',
                  borderColor:'#8BC34A'
                },
                lineStyle:{
                  color:'#8BC34A',
                  width:1
                },
                data:_this.quantity
              },{
                type:'line',
                name:'工作时长(hour)',
                yAxisIndex:1,
                symbol:'triangle',
                symbolSize:_this.chart_fontSize_16,
                emphasis:{
                  label:{
                    show:true,
                    color:'#101010',
                    fontSize:_this.chart_fontSize_14,
                    fontFamily:'SourceHanSansSC-regular'
                  }
                },
                itemStyle:{
                  color:'#485ABF',
                  borderColor:'#485ABF'
                },
                lineStyle:{
                  color:'#485ABF',
                  width:1
                },
                data:_this.productionTime
              }]
            })
          },500);
        }).then()
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
    _this.initColumns();
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
    },500);
    console.log(_this.filterColumns);
    _this.findChart();
    console.log(_this.xAxisDate,_this.quantity,_this.productionTime);
    console.log(localStorage.getItem('groupId'),localStorage.getItem('icCardNum'));
    
    window.onresize = function(){
      _this.mychartOne.resize();
    }
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
.el-date-editor--daterange.el-input__inner{
  width: 100%;
}
</style>