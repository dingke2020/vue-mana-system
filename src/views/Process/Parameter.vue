<template>
  <div class="page-container">
  <!--工具栏-->
  <div class="toolbar" style="float:right;padding-top:10px;padding-right:15px;">
    <el-form :inline="true" :size="size">
      <el-form-item style="width:120px;">
        <el-select v-model="selectMachineNumber" size="medium" placeholder="设备编号">
            <el-option v-for="(item,index) in machineNumber" :label="item.value" :value="item.value" :key="index"></el-option>
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
  <Process-parameter-table :height="tableHeight" :data="pageResult" :columns="filterColumns" @findPage="findPage" @handleCheck="handleCheck" @handleEdit="handleEdit" @handleDelete="handleDelete">
  </Process-parameter-table>
  <!--新增编辑界面-->
  <el-dialog :title="operation?'新增':'修改'" width="50%" :visible.sync="dialogVisible" custom-class="processDialog" center>
    <el-form :model="dataForm" label-width="120px" :rules="dataFormRules" ref="dataForm" :size="size"
      label-position="right" v-if="operation">
      <el-form :inline="true" label-width="120px" class="demo-form-inline">
          <el-form-item label="物料名称" prop="materialName">
            <el-input id="materialName" v-model="dataForm.materialName"></el-input>
          </el-form-item>
          <el-form-item label="物料编码" prop="materialCode">
            <el-input id="materialCode" v-model="dataForm.materialCode"></el-input>
          </el-form-item>
          <el-form-item label="加工工序" prop="procedure">
            <el-input id="procedure" v-model="dataForm.procedure"></el-input>
          </el-form-item>
          <el-form-item label="设备类型" class="inputLengthA" prop="type">
            <el-select v-model="dataForm.type" size="medium" placeholder="设备类型">
                <el-option v-for="(item,index) in machineType" :label="item.label" :value="item.val" :key="index"></el-option>
              </el-select>
          </el-form-item>
      </el-form>
      <el-form-item label="程序号" class="inputLength" prop="programNumber">
        <el-input id="programNumber" v-model="dataForm.programNumber"></el-input>
      </el-form-item>
      <el-form-item label="程序文件">
        <el-upload class="" action="https://jsonplaceholder.typicode.com/posts/" drag>
          <i class="iconfont icon-ali-folder"></i>
          <div class="el-upload__text text-click">点击或将程序文件拖拽到这里上传</div>
          <div class="el-upload__text text-fileType">支持扩展名：.rar .zip .doc .docx .pdf .jpg...</div>
        </el-upload>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer" v-if="operation">
      <el-button size="medium" @click.native="dialogVisible = false" class="cancel-button">取消</el-button>
      <el-button size="medium" type="primary" @click.native="submitForm" :loading="editLoading" class="define-button">确定</el-button>
    </div>
  </el-dialog>
  <el-dialog title="查看工艺" width="50%" :visible.sync="dialogVisibleB" custom-class="processDialog" center>
      <el-form>
        <div class="header clearfix">
          <p>物料名称：<span>{{materialName}}</span></p>
          <p>规格型号：<span>{{materialCode}}</span></p>
          <p>生产工序：<span>{{productionProcessesName}}</span></p>
          <p>设备名称：<span>{{machine}}</span></p>
          <p>设备编号：<span>{{machineCode}}</span></p>
        </div>
        <div class="tech-body clearfix">
          <div class="table-mode">
            <ul class="head clearfix">
              <li>运行模式</li>
              <li>油温</li>
              <li>冷却时间</li>
              <li>环境温度</li>
            </ul>
            <ul class="body clearfix">
              <li>{{process_sheet.mode}}</li>
              <li>{{process_sheet.oil}}</li>
              <li>{{process_sheet.cool}}</li>
              <li>{{process_sheet.environment}}</li>
            </ul>
          </div>
          <!-- <div class="table-temperature">
            <div class="table-temperature-head">
              <div><img :src="process_sheet.temperature.img"></div>
              <div>{{process_sheet.temperature.name}}</div>
            </div>
            <div class="table-temperature-body">
              <ul class="head clearfix">
                <li v-for="item in process_sheet.temperature.text">{{item}}</li>
              </ul>
              <ul class="body clearfix">
                <li v-for="item in process_sheet.temperature.value">{{item}}</li>
              </ul>
            </div>
          </div> -->
          <div class="table-group clearfix">
            <div v-for="item in process_sheet.group" class="table-example">
              <div class="table-example-head">
                <div><img :src="item.img"></div>
                <div v-for="point in item.name">{{point}}</div>
              </div>
              <div class="table-example-body">
                <ul class="head clearfix">
                  <li v-for="piece in item.text">{{piece}}</li>
                </ul>
                <ul v-for="block in item.list" class="body clearfix">
                  <li v-for="grain in block.value">{{grain}}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ProcessParameterTable from "@/views/Core/ProcessParameterTable"
import { format } from "@/utils/datetime"
export default {
  components:{
    ProcessParameterTable
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
        // programNumber:{ required: true, message: '请输入程序号', trigger: 'blur' }
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
      selectMachineNumber:'',
      selectProcessName:'',
      machineNumber:[
        // {label:"01#",val:"1#"},
        // {label:"02#",val:"2#"},
        // {label:"03#",val:"3#"},
        // {label:"04#",val:"4#"},
        // {label:"05#",val:"5#"},
        // {label:"06#",val:"6#"}
      ],
      processName:[
        // {label:"内磨圆",val:"1#"},
        // {label:"加工中心",val:"2#"}
      ],
      materialName:'',
      materialCode:'',
      productionProcessesName:'',
      machine:'',
      machineCode:'',
      process_sheet:{
        mode:'全自动',
        oil:56.5,
        cool:20,
        environment:35.8,
        temperature:{
          img:require('@/assets/images/temperature.png'),
          name:'设定值',
          text:['一段','二段','三段','四段','五段','六段','七段','八段'],
          value:[30.9,33.6,33.9,32.5,28.6,25.6,28.8,32.5]
        },
        group:[
          {
            img:require('@/assets/images/1.png'),
            name:['压力','速度','位置'],
            text:['一段','二段','三段','低压','高压'],
            list:[
              {value:[30.9,33.6,33.9,32.5,28.6]},
              {value:[30.9,33.6,33.9,32.5,28.6]},
              {value:[33.6,33.9,32.5,28.6]}
            ]
          },
          {
            img:require('@/assets/images/2.png'),
            name:[],
            text:['五段','四段','三段','二段','一段'],
            list:[
              {value:[30.9,33.6,33.9,32.5,28.6]},
              {value:[30.9,33.6,33.9,32.5,28.6]},
              {value:[30.9,33.6,33.9,32.5,28.6]}
            ]
          },
          {
            img:require('@/assets/images/3.png'),
            name:['压力','速度','位置'],
            text:['六段','五段','四段','三段','二段','一段'],
            list:[
              {value:[30.9,33.6,33.9,32.5,28.6,28.6]},
              {value:[30.9,33.6,33.9,32.5,28.6,28.6]},
              {value:[33.6,33.9,32.5,28.6,28.6]}
            ]
          },
          {
            img:require('@/assets/images/4.png'),
            name:['压力','速度','位置'],
            text:['进一','进二'],
            list:[
              {value:[30.9,33.6]},
              {value:[30.9,33.6]},
              {value:[30.9,33.6]}
            ]
          },
          {
            img:require('@/assets/images/7.png'),
            name:['压力','速度','时间'],
            text:['五段','四段','三段','二段','一段'],
            list:[
              {value:[33.6,33.9,32.5,28.6,28.6]},
              {value:[33.6,33.9,32.5,28.6,28.6]},
              {value:[33.6,33.9,32.5,28.6,28.6]}
            ]
          },
          {
            img:require('@/assets/images/6.png'),
            name:['压力','速度','位置'],
            text:['退一','退二'],
            list:[
              {value:[30.9,33.6]},
              {value:[30.9,33.6]},
              {value:[30.9,33.6]}
            ]
          },
          {
            img:require('@/assets/images/5.png'),
            name:['压力','速度','位置'],
            text:['一段','二段','三段','四段','五段'],
            list:[
              {value:[33.6,33.9,32.5,28.6,28.6]},
              {value:[33.6,33.9,32.5,28.6,28.6]},
              {value:[33.6,33.9,32.5,28.6,28.6]}
            ]
          },
          {
            img:require('@/assets/images/8.png'),
            name:['压力','速度','位置'],
            text:[],
            list:[
              {value:[30.9]},
              {value:[30.9]},
              {value:[30.9]}
            ]
          }
        ]
      },
      machineType:[],
      materialAll:[],
      material:{},
      materialForm:{
        name:'',
        code:'',
        type:''
      },
      route:{procedure:['粗车','精车']},
      show:false
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
        data.pageRequest.machineNumber = _this.selectMachineNumber;
        data.pageRequest.productionProcessesName = _this.selectProcessName;
        data.pageRequest.nameCode = _this.dataForm.material;
        _this.pageRequest = data.pageRequest
      }
      //这里是不调接口的
      _this.$api.process.findPageParameter(_this.pageRequest).then((res) => {
        console.log(res);
        var parameterArray = res.data.data.parameter.data;
        parameterArray.forEach(function(value,index){
          
        })
        _this.pageResult = res.data.data.parameter;
        console.log(_this.pageResult)
        // this.findUserRoles()
      }).then(data!=null?data.callback:'')
      _this.$api.process.findPageParameter(_this.pageRequest).then((res) => {
        console.log(res);
        var parameterArray = res.data.data;
        parameterArray.forEach(function(value,index){
          
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
      _this.pageParams = {currPage: 1, pageSize: 10,machineNumber:_this.selectMachineNumber,productionProcessesName:_this.selectProcessName,nameCode: _this.dataForm.material};
      _this.pageRequest.pageSize = 10;
      _this.pageRequest.currPage = 1;
      _this.$api.process.findPageParameter(_this.pageParams).then((res) => {
        console.log(res);
        var parameterArray = res.data.data;
        parameterArray.forEach(function(value,index){
          
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
      this.dialogVisible = true
      this.operation = true
      this.dataForm = {
        
      }
    },
    // 显示查看页面
    handleCheck: function(params) {
      let _this = this;
      _this.dialogVisibleB = true
      console.log(params);
      _this.material = Object.assign({}, params.row);
      console.log(_this.material);
      _this.materialName = params.row.materialName;
      _this.materialCode = params.row.materialCode;
      _this.productionProcessesName = params.row.productionProcessesName;
      _this.machine = params.row.machine;
      _this.machineCode = params.row.machineNumber;
      $.ajax({
        type:'GET',
        url:'/xaj/process/findProcessParametersDetail',
        data:{id:params.row.id},
        success:function(res){
          console.log(res);
          $.each(res,function(tab,item){
            if(item.fieldName=="运行状态"){
              switch(item.data){
                case 0:
                  item.data = "手动";
                  break;
                case 3:
                  item.data = "半自动";
                  break;
                case 5:
                  item.data = "电眼全自动";
                  break;
                case 9:
                  item.data = "时间全自动";
                  break;
                case 16:
                  item.data = "调模使用";
                  break;
              }
              _this.process_sheet.mode = item.data
            }
            if(item.fieldName=="油温"){
              _this.process_sheet.oil = item.data
            }
            if(item.fieldName=="冷却时间"){
              _this.process_sheet.cool = item.data
            }
            if(item.fieldName=="环境温度"){
              _this.process_sheet.environment = item.data
            }
            if(item.fieldName=="关模一段压力"){
              _this.process_sheet.group[0].list[0].value[0] = item.data
            }
            if(item.fieldName=="关模二段压力"){
              _this.process_sheet.group[0].list[0].value[1] = item.data
            }
            if(item.fieldName=="关模三段压力"){
              _this.process_sheet.group[0].list[0].value[2] = item.data
            }
            if(item.fieldName=="关模低段压力"){
              _this.process_sheet.group[0].list[0].value[3] = item.data
            }
            if(item.fieldName=="关模高段压力"){
              _this.process_sheet.group[0].list[0].value[4] = item.data
            }
            if(item.fieldName=="关模一段速度"){
              _this.process_sheet.group[0].list[1].value[0] = item.data
            }
            if(item.fieldName=="关模二段速度"){
              _this.process_sheet.group[0].list[1].value[1] = item.data
            }
            if(item.fieldName=="关模三段速度"){
              _this.process_sheet.group[0].list[1].value[2] = item.data
            }
            if(item.fieldName=="关模低段速度"){
              _this.process_sheet.group[0].list[1].value[3] = item.data
            }
            if(item.fieldName=="关模高段速度"){
              _this.process_sheet.group[0].list[1].value[4] = item.data
            }
            if(item.fieldName=="关模一段位置"){
              _this.process_sheet.group[0].list[2].value[0] = item.data
            }
            if(item.fieldName=="关模二段位置"){
              _this.process_sheet.group[0].list[2].value[1] = item.data
            }
            if(item.fieldName=="关模三段位置"){
              _this.process_sheet.group[0].list[2].value[2] = item.data
            }
            if(item.fieldName=="关模低段位置"){
              _this.process_sheet.group[0].list[2].value[3] = item.data
            }
            if(item.fieldName=="开模五段压力"){
              _this.process_sheet.group[1].list[0].value[0] = item.data
            }
            if(item.fieldName=="开模四段压力"){
              _this.process_sheet.group[1].list[0].value[1] = item.data
            }
            if(item.fieldName=="开模三段压力"){
              _this.process_sheet.group[1].list[0].value[2] = item.data
            }
            if(item.fieldName=="开模二段压力"){
              _this.process_sheet.group[1].list[0].value[3] = item.data
            }
            if(item.fieldName=="开模一段压力"){
              _this.process_sheet.group[1].list[0].value[4] = item.data
            }
            if(item.fieldName=="开模五段速度"){
              _this.process_sheet.group[1].list[1].value[0] = item.data
            }
            if(item.fieldName=="开模四段速度"){
              _this.process_sheet.group[1].list[1].value[1] = item.data
            }
            if(item.fieldName=="开模三段速度"){
              _this.process_sheet.group[1].list[1].value[2] = item.data
            }
            if(item.fieldName=="开模二段速度"){
              _this.process_sheet.group[1].list[1].value[3] = item.data
            }
            if(item.fieldName=="开模一段速度"){
              _this.process_sheet.group[1].list[1].value[4] = item.data
            }
            if(item.fieldName=="开模五段位置"){
              _this.process_sheet.group[1].list[2].value[0] = item.data
            }
            if(item.fieldName=="开模四段位置"){
              _this.process_sheet.group[1].list[2].value[1] = item.data
            }
            if(item.fieldName=="开模三段位置"){
              _this.process_sheet.group[1].list[2].value[2] = item.data
            }
            if(item.fieldName=="开模二段位置"){
              _this.process_sheet.group[1].list[2].value[3] = item.data
            }
            if(item.fieldName=="开模一段位置"){
              _this.process_sheet.group[1].list[2].value[4] = item.data
            }
            if(item.fieldName=="射胶六段压力"){
              _this.process_sheet.group[2].list[0].value[0] = item.data
            }
            if(item.fieldName=="射胶五段压力"){
              _this.process_sheet.group[2].list[0].value[1] = item.data
            }
            if(item.fieldName=="射胶四段压力"){
              _this.process_sheet.group[2].list[0].value[2] = item.data
            }
            if(item.fieldName=="射胶三段压力"){
              _this.process_sheet.group[2].list[0].value[3] = item.data
            }
            if(item.fieldName=="射胶二段压力"){
              _this.process_sheet.group[2].list[0].value[4] = item.data
            }
            if(item.fieldName=="射胶一段压力"){
              _this.process_sheet.group[2].list[0].value[5] = item.data
            }
            if(item.fieldName=="射胶六段速度"){
              _this.process_sheet.group[2].list[1].value[0] = item.data
            }
            if(item.fieldName=="射胶五段速度"){
              _this.process_sheet.group[2].list[1].value[1] = item.data
            }
            if(item.fieldName=="射胶四段速度"){
              _this.process_sheet.group[2].list[1].value[2] = item.data
            }
            if(item.fieldName=="射胶三段速度"){
              _this.process_sheet.group[2].list[1].value[3] = item.data
            }
            if(item.fieldName=="射胶二段速度"){
              _this.process_sheet.group[2].list[1].value[4] = item.data
            }
            if(item.fieldName=="射胶一段速度"){
              _this.process_sheet.group[2].list[1].value[5] = item.data
            }
            if(item.fieldName=="射胶六段位置"){
              _this.process_sheet.group[2].list[2].value[0] = item.data
            }
            if(item.fieldName=="射胶五段位置"){
              _this.process_sheet.group[2].list[2].value[1] = item.data
            }
            if(item.fieldName=="射胶四段位置"){
              _this.process_sheet.group[2].list[2].value[2] = item.data
            }
            if(item.fieldName=="射胶三段位置"){
              _this.process_sheet.group[2].list[2].value[3] = item.data
            }
            if(item.fieldName=="射胶二段位置"){
              _this.process_sheet.group[2].list[2].value[4] = item.data
            }
            if(item.fieldName=="托模进一压力"){
              _this.process_sheet.group[3].list[0].value[0] = item.data
            }
            if(item.fieldName=="托模进二压力"){
              _this.process_sheet.group[3].list[0].value[1] = item.data
            }
            if(item.fieldName=="托模进一速度"){
              _this.process_sheet.group[3].list[1].value[0] = item.data
            }
            if(item.fieldName=="托模进二速度"){
              _this.process_sheet.group[3].list[1].value[1] = item.data
            }
            if(item.fieldName=="托模进一位置"){
              _this.process_sheet.group[3].list[2].value[0] = item.data
            }
            if(item.fieldName=="托模进二位置"){
              _this.process_sheet.group[3].list[2].value[1] = item.data
            }
            if(item.fieldName=="保压五段压力"){
              _this.process_sheet.group[4].list[0].value[0] = item.data
            }
            if(item.fieldName=="保压四段压力"){
              _this.process_sheet.group[4].list[0].value[1] = item.data
            }
            if(item.fieldName=="保压三段压力"){
              _this.process_sheet.group[4].list[0].value[2] = item.data
            }
            if(item.fieldName=="保压二段压力"){
              _this.process_sheet.group[4].list[0].value[3] = item.data
            }
            if(item.fieldName=="保压一段压力"){
              _this.process_sheet.group[4].list[0].value[4] = item.data
            }
            if(item.fieldName=="保压五段速度"){
              _this.process_sheet.group[4].list[1].value[0] = item.data
            }
            if(item.fieldName=="保压四段速度"){
              _this.process_sheet.group[4].list[1].value[1] = item.data
            }
            if(item.fieldName=="保压三段速度"){
              _this.process_sheet.group[4].list[1].value[2] = item.data
            }
            if(item.fieldName=="保压二段速度"){
              _this.process_sheet.group[4].list[1].value[3] = item.data
            }
            if(item.fieldName=="保压一段速度"){
              _this.process_sheet.group[4].list[1].value[4] = item.data
            }
            if(item.fieldName=="保压五段时间"){
              _this.process_sheet.group[4].list[2].value[0] = item.data
            }
            if(item.fieldName=="保压四段时间"){
              _this.process_sheet.group[4].list[2].value[1] = item.data
            }
            if(item.fieldName=="保压三段时间"){
              _this.process_sheet.group[4].list[2].value[2] = item.data
            }
            if(item.fieldName=="保压二段时间"){
              _this.process_sheet.group[4].list[2].value[3] = item.data
            }
            if(item.fieldName=="保压一段时间"){
              _this.process_sheet.group[4].list[2].value[4] = item.data
            }
            if(item.fieldName=="托模退一压力"){
              _this.process_sheet.group[5].list[0].value[0] = item.data
            }
            if(item.fieldName=="托模退二压力"){
              _this.process_sheet.group[5].list[0].value[1] = item.data
            }
            if(item.fieldName=="托模退一速度"){
              _this.process_sheet.group[5].list[1].value[0] = item.data
            }
            if(item.fieldName=="托模退二速度"){
              _this.process_sheet.group[5].list[1].value[1] = item.data
            }
            if(item.fieldName=="托模退一位置"){
              _this.process_sheet.group[5].list[2].value[0] = item.data
            }
            if(item.fieldName=="托模退二位置"){
              _this.process_sheet.group[5].list[2].value[1] = item.data
            }
            if(item.fieldName=="储料一段压力"){
              _this.process_sheet.group[6].list[0].value[0] = item.data
            }
            if(item.fieldName=="储料二段压力"){
              _this.process_sheet.group[6].list[0].value[1] = item.data
            }
            if(item.fieldName=="储料三段压力"){
              _this.process_sheet.group[6].list[0].value[2] = item.data
            }
            if(item.fieldName=="储料四段压力"){
              _this.process_sheet.group[6].list[0].value[3] = item.data
            }
            if(item.fieldName=="储料五段压力"){
              _this.process_sheet.group[6].list[0].value[4] = item.data
            }
            if(item.fieldName=="储料一段速度"){
              _this.process_sheet.group[6].list[1].value[0] = item.data
            }
            if(item.fieldName=="储料二段速度"){
              _this.process_sheet.group[6].list[1].value[1] = item.data
            }
            if(item.fieldName=="储料三段速度"){
              _this.process_sheet.group[6].list[1].value[2] = item.data
            }
            if(item.fieldName=="储料四段速度"){
              _this.process_sheet.group[6].list[1].value[3] = item.data
            }
            if(item.fieldName=="储料五段速度"){
              _this.process_sheet.group[6].list[1].value[4] = item.data
            }
            if(item.fieldName=="储料一段位置"){
              _this.process_sheet.group[6].list[2].value[0] = item.data
            }
            if(item.fieldName=="储料二段位置"){
              _this.process_sheet.group[6].list[2].value[1] = item.data
            }
            if(item.fieldName=="储料三段位置"){
              _this.process_sheet.group[6].list[2].value[2] = item.data
            }
            if(item.fieldName=="储料四段位置"){
              _this.process_sheet.group[6].list[2].value[3] = item.data
            }
            if(item.fieldName=="储料五段位置"){
              _this.process_sheet.group[6].list[2].value[4] = item.data
            }
            if(item.fieldName=="射退压力"){
              _this.process_sheet.group[7].list[0].value[0] = item.data
            }
            if(item.fieldName=="射退速度"){
              _this.process_sheet.group[7].list[1].value[0] = item.data
            }
            if(item.fieldName=="射退位置"){
              _this.process_sheet.group[7].list[2].value[0] = item.data
            }
          })
        }
      })
    },
    // 显示编辑界面
    handleEdit: function (params) {
      this.dialogVisible = true
      this.operation = false
      this.dataForm = Object.assign({}, params.row)
      // let userRoles = []
      // for(let i=0,len=params.row.userRoles.length; i<len; i++) {
      //  userRoles.push(params.row.userRoles[i].roleId)
      // }
      // this.dataForm.userRoles = userRoles
    },
    // 编辑
    submitForm: function () {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.editLoading = true
            let params = Object.assign({}, this.dataForm)
            // let userRoles = []
            // for(let i=0,len=params.userRoles.length; i<len; i++) {
            //  let userRole = {
            //    userId: params.id,
            //    roleId: params.userRoles[i]
            //  }
            //  userRoles.push(userRole)
            // }
            // params.userRoles = userRoles
            this.$api.configuration.save(params).then((res) => {
              this.editLoading = false
              if(res.code == 200) {
                this.$message({ message: '操作成功', type: 'success' })
                this.dialogVisible = false
                this.$refs['dataForm'].resetFields()
              } else {
                this.$message({message: '操作失败, ' + res.msg, type: 'error'})
              }
              this.findPage(null)
            })
          })
        }
      })
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
          {prop:"materialName", label:"物料名称", minWidth:160},
          {prop:"materialCode", label:"物料编码", minWidth:100},
          {prop:"productionProcessesName", label:"加工工序", minWidth:100},
          {prop:"machine", label:"设备名称", minWidth:100},
          {prop:"machineNumber", label:"设备编号", minWidth:80},
          {prop:"processParameters", label:"工艺参数", minWidth:350},
          {prop:"updateTime", label:"采集时间", minWidth:160}
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
        url:'/xaj/configuration/searchAllMachineNumber',
        success:function(data){
          // console.log(data);
          var newArr = [];
          $.each(data,function(index,value){
            if(value!==null){
              newArr.push(value);
            }
          })
          $.each(newArr,function(index,value){
            _this.machineNumber.push({value:value})
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
            $.each(data,function(index,value){
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
ul,p,h1,h2,h3,h4{
  margin:0;
  padding:0;
}
li{
  list-style: none;
  margin:0;
}
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
.processDialog .header p{
    float: left;
    margin-right: 32px;
    font-size: 16px;
    color: #424242;
    font-family: 'Roboto';
  }
  .processDialog .header p:last-child{
    margin-right: 0;
  }
  .processDialog .header p span{
    font-size: 14px;
    color: #000;
    font-weight: bold;
  }
  .processDialog .tech-body{
    border:1px solid #BBB;
    margin-top:10px;
    padding:5px 17px 13px;
    height: 400px;
    overflow-x: hidden;
  }
  .processDialog .table-mode{
    float: left;
    margin-bottom:12px;
    width: 100%;
  }
  .processDialog .table-mode .head li{
    float: left;
    min-width: 66px;
    line-height: 24px;
    font-size: 16px;
    color: #101010;
    font-family: 'SourceHanSansSC-regular';
    text-align: left;
    margin-right: 10px;
  }
  .processDialog .table-mode .head li:last-child{
    margin-right: 0;
  }
  .processDialog .table-mode ul.body{
    display: flex;
    justify-content: flex-start;
  }
  .processDialog .table-mode .body li{
    float: left;
    min-width: 66px;
    line-height: 32px;
    font-size: 18px;
    color: #080808;
    font-family: 'Roboto';
    text-align: center;
    background-color: #C1CAF9;
    margin-right: 10px;
  }
  .processDialog .table-mode .body li:last-child{
    margin-right: 0;
  }
  .processDialog .table-temperature{
    float: left;
    margin-bottom:20px;
    width: 100%;
  }
  .processDialog .table-temperature .table-temperature-head{
    float: left;
  }
  .processDialog .table-temperature .table-temperature-head div{
    min-width: 56px;
    line-height: 32px;
    font-size: 18px;
    color: #080808;
    font-family: 'Roboto';
    text-align: center;
    margin-right: 3px;
    margin-bottom: 3px;
  }
  .processDialog .table-temperature .table-temperature-head div img{
    width: 15px;
    height: 30px;
    display: block;
    margin:0 auto;
  }
  .processDialog .table-temperature .table-temperature-head div:first-child{
    line-height: 30px;
    height: 30px;
    margin-bottom: 0;
  }
  .processDialog .table-temperature .table-temperature-head div:last-child{
    margin-bottom: 0;
  }
  .processDialog .table-temperature .table-temperature-body{
    float: left;
  }
  .processDialog .table-temperature ul.head{
    display: flex;
    align-items: flex-end;
    height: 30px;
  }
  .processDialog .table-temperature .head li{
    display: flex;
    align-items: flex-end;
    float: left;
    min-width: 66px;
    height: 30px;
    line-height: 24px;
    font-size: 16px;
    color: #101010;
    font-family: 'SourceHanSansSC-regular';
    text-align: left;
    margin-right: 5px;
  }
  .processDialog .table-temperature .head li img{
    width: 15px;
    height: 30px;
    display: block;
    margin:0 auto;
  }
  .processDialog .table-temperature .head li:last-child{
    margin-right: 0;
  }
  .processDialog .table-temperature ul.body{
    display: flex;
    justify-content: center;
  }
  .processDialog .table-temperature .body li{
    float: left;
    min-width: 66px;
    line-height: 32px;
    font-size: 18px;
    color: #080808;
    font-family: 'Roboto';
    text-align: center;
    background-color: #FBC1C3;
    margin-right: 5px;
  }
  .processDialog .table-temperature .body li:last-child{
    margin-right: 0;
  }
  .processDialog .table-group .table-example{
    float: left;
    margin-bottom: 18px;
    margin-right: 8px;
  }
  .processDialog .table-group .table-example .table-example-head{
    float: left;
  }
  .processDialog .table-group .table-example .table-example-head div{
    min-width: 46px;
    line-height: 32px;
    font-size: 18px;
    color: #080808;
    font-family: 'Roboto';
    text-align: center;
    margin-right: 3px;
    margin-bottom: 3px;
  }
  .processDialog .table-group .table-example .table-example-head div img{
    width: 25px;
    height: 25px;
    display: block;
    margin:0 auto;
  }
  .processDialog .table-group .table-example .table-example-head div:first-child{
    line-height: 30px;
    height: 30px;
    margin-bottom: 0;
  }
  .processDialog .table-group .table-example .table-example-head div:last-child{
    margin-bottom: 0;
  }
  .processDialog .table-group .table-example .table-example-body{
    float: left;
  }
  .processDialog .table-group .table-example ul.head{
    display: flex;
    align-items: flex-end;
    height: 30px;
  }
  .processDialog .table-group .table-example .head li{
    display: flex;
    align-items: flex-end;
    float: left;
    min-width: 66px;
    height: 30px;
    line-height: 24px;
    font-size: 16px;
    color: #101010;
    font-family: 'SourceHanSansSC-regular';
    text-align: left;
    margin-right: 3px;
  }
  .processDialog .table-group .table-example .head li img{
    width: 30px;
    height: 30px;
    display: block;
    margin:0 auto;
  }
  .processDialog .table-group .table-example .head li:last-child{
    margin-right: 0;
  }
  .processDialog .table-group .table-example ul.body{
    display: flex;
    justify-content: center;
    margin-bottom: 3px;
  }
  .processDialog .table-group .table-example ul.body:last-child{
    margin-bottom: 0;
  }
  .processDialog .table-group .table-example .body li{
    float: left;
    min-width: 66px;
    line-height: 32px;
    font-size: 18px;
    color: #080808;
    font-family: 'Roboto';
    text-align: center;
    background-color: #F7DCB5;
    margin-right: 3px;
  }
  .processDialog .table-group .table-example .body li:last-child{
    margin-right: 0;
  }
  .parameter .cell{
    height: 40px;
    line-height: 40px;
    white-space: nowrap;
  }
</style>