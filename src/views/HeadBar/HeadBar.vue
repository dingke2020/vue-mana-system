<template> 
  <div class="headbar" :class="$store.state.app.collapse?'position-collapse-left':'position-left'">
    <!-- 导航收缩 -->
    <span class="hamburg">
      <el-menu class="el-menu-demo" mode="horizontal">
        <el-menu-item @click="onCollapse"><hamburger :isActive="collapse"></hamburger></el-menu-item>
      </el-menu>
    </span>
    <!-- 导航菜单 -->
    <span class="navbar">
      <el-menu class="el-menu-demo" mode="horizontal">
        <el-menu-item @click.native="tabsRefreshCurrentHandle"><i class="iconfont icon-ali-refresh" style="color:#000"></i></el-menu-item>
      </el-menu>
    </span>
    <!-- 工具栏 -->
    <span class="toolbar">
      <el-menu class="el-menu-demo" mode="horizontal">
        <el-menu-item v-popover:popover-message>
            <li style="color:#000;" class="iconfont icon-ali-icon_airplay">
            </li>
            <el-popover ref="popover-message" placement="bottom-end" trigger="click" :visible-arrow="false">
              <message-panel :user="user" @show-message="showMessage"></message-panel>
            </el-popover>
        </el-menu-item>
        <el-menu-item v-popover:popover-notice>
          <!-- 系统通知 -->
          <el-badge :value="count" :max="99" class="badge" type="danger">
            <li style="color:#000;" class="iconfont icon-ali-bell"></li>
          </el-badge>
          <el-popover ref="popover-notice" placement="bottom-end" trigger="click">
            <notice-panel :data="notices" @show-notice="showNotice"></notice-panel>
          </el-popover>
        </el-menu-item>
        <el-menu-item v-popover:popover-personal>
          <!-- 用户信息 -->
          <span class="user-info"><img :src="user.avatar"/>{{user.name}}</span>
          <el-popover ref="popover-personal" placement="bottom-end" trigger="click" :visible-arrow="false">
            <personal-panel :user="user" @show-personal="showPersonal"></personal-panel>
          </el-popover>
        </el-menu-item>
      </el-menu>
    </span>
    <el-dialog title="通知" width="50%" :visible.sync="dialogVisible" center :before-close="handleClose">
      <el-form label-width="100px" size="small">
        <div class="notice-title">通知：设备“{{maintenance.type}}”待保养，请及时保养并填报保养记录！</div>
        <el-form :inline="true" label-width="100px" class="demo-form-inline">
          <el-form-item label="设备类型">
            <el-input id="maintenanceType" v-model="maintenance.type" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="所属类别">
            <el-input id="maintenanceCategory" v-model="maintenance.category" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="保养周期">
            <el-input id="maintenanceCycle" v-model="maintenance.cycle" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="保养时间">
            <el-input id="maintenanceTime" v-model="maintenance.time" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="担当人">
            <el-input id="maintenanceAssume" v-model="maintenance.assume" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="责任人">
            <el-input id="maintenanceLiable" v-model="maintenance.liable" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="备注">
            <el-input id="maintenanceRemark" v-model="maintenance.remark" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="数量">
            <el-input id="maintenanceNumber" v-model="maintenance.number" :disabled="true"></el-input>
          </el-form-item>
        </el-form>
      </el-form>
    </el-dialog>
    <el-dialog :title="operation?'个人信息':'修改密码'" width="50%" :visible.sync="dialogVisibleB" custom-class="personalDialog" center :before-close="handleClose">
      <el-form label-width="120px" :size="size" label-position="right" :model="refForm" ref="refForm" v-if="operation">
        <el-form :inline="true" label-width="120px">
          <el-form-item label="员工姓名" prop="username">
            <el-input id="userName" v-model="refForm.username" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input id="userMobile" v-model="refForm.mobile" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="所属部门" prop="department">
            <el-input id="userDepartment" v-model="refForm.department" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="员工IC卡" prop="ic_card_num">
            <el-input id="userIcard" v-model="refForm.ic_card_num" :disabled="true"></el-input>
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
      </el-form>
      <el-form :model="dataForm" status-icon :rules="dataFormRules" ref="dataForm" :size="size" v-if="!operation" style="padding-left:45px;">
        <div class="sub-title">请输入新密码：</div>
        <el-form-item prop="pass" class="inputLengthA">
          <el-input type="password" v-model="dataForm.pass"></el-input>
        </el-form-item>
        <div class="sub-title">请再次输入：</div>
        <el-form-item prop="checkPass" class="inputLengthA">
          <el-input type="password" v-model="dataForm.checkPass"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" v-if="!operation">
        <el-button size="medium" @click.native="dialogVisibleB = false" class="cancel-button">取消</el-button>
        <el-button size="medium" type="primary" @click.native="submitForm" :loading="editLoading" class="define-button">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
// import mock from "@/mock/index"
import Hamburger from "@/components/Hamburger"
// import ThemePicker from "@/components/ThemePicker"
// import LangSelector from "@/components/LangSelector"
// import Action from "@/components/Toolbar/Action"
import NoticePanel from "@/views/Core/NoticePanel"
import MessagePanel from "@/views/Core/MessagePanel"
import PersonalPanel from "@/views/Core/PersonalPanel"
export default {
  components:{
        Hamburger,
        // ThemePicker,
        // LangSelector,
        // Action,
        NoticePanel,
        MessagePanel,
        PersonalPanel
  },
  data() {
    var validatePass = (rule, value, callback) => {
      var patt = /^[0-9]{6,18}$/;
      if (value === '') {
        callback(new Error('请输入密码'));
      } else if(value.match(patt)==null) {
        callback(new Error('纯数字长度不小于6位'));
      } else {
        if (this.dataForm.checkPass !== '') {
          this.$refs.dataForm.validateField('checkPass');
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.dataForm.pass) {
        callback(new Error('两次输入密码不一致，请重新输入！'));
      } else {
        callback();
      }
    };
    return {
      operation:false,
      size:'small',
      user: {
        avatar: require("@/assets/user.png"),
      },
      dialogVisible:false,
      dialogVisibleB:false,
      editLoading:false,
      notices:[
        // {content:'【保养提醒】设备“数控车床”待保养！ 2019-09-10  09:00',type:'普车',category:'A类',cycle:'按年',time:'09-10 09:00',assume:'童金富',liable:'陈育广',remark:'委外',number:8},
        // {content:'【保养提醒】设备“数控车床”待保养！ 2019-09-10  09:00',type:'普车',category:'B类',cycle:'按年',time:'09-10 09:00',assume:'童金富',liable:'陈育广',remark:'委外',number:8}
      ],
      maintenance:{},
      // 新增编辑界面数据
      dataForm: {
        pass:'',
        checkPass:''
      },
      dataFormRules: {
        pass: [
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { validator: validatePass2, trigger: 'blur' }
        ]
      },
      refForm:{username:"",mobile:"",department:"",ic_card_num:""},
      imageUrl:'',
      addParams:{},
      count:''
    }
  },
  methods: {
    // openWindow(url) {
    //   window.open(url)
    // },
    // selectNavBar(key, keyPath) {
    //   console.log(key, keyPath)
    // },
    // 折叠导航栏
    onCollapse: function() {
      this.$store.commit('onCollapse')
    },
    showNotice:function(arr){
      let _this = this;
      console.log(arr);
      $(".headbar").css({"position":"absolute","z-index":"auto"});
      var data = arr[1];
      $.ajax({
        type:'GET',
        url:'/xaj/user/findUserMessageDetail',
        data:{
          id: data.id
        },
        success:function(data){
          console.log(data);
          switch(data.period){
            case "byYear":
              data.period = "按年";
              break;
            case "byMonth":
              data.period = "按月";
              break;
            case "byDay":
              data.period = "按日";
              break;
          }
          _this.maintenance = {type:data.machineType,category:data.type,cycle:data.period,time:data.maintenanceDate,assume:data.ddPerson,liable:data.zrPerson,remark:data.remark,number:data.quantity};
        }
      })
      _this.dialogVisible = true;
    },
    handleClose(done){
      $(".headbar").css({"position":"fixed","z-index":"1030"});
      done();
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
    showPersonal:function(arr){
      $(".headbar").css({"position":"absolute","z-index":"auto"});
      var data = arr[0];
      if(data==0){
        this.operation = true;
        this.dialogVisibleB = true;
        this.refForm = {
          username: localStorage.getItem('name'),
          mobile: localStorage.getItem('mobile'),
          department: localStorage.getItem('groupName'),
          ic_card_num: localStorage.getItem('icCardNum')
        }
      }else if(data==1){
        this.operation = false;
        this.dialogVisibleB = true;
      }else if(data==2){
        localStorage.clear();
        this.$router.push({path:'/login'});
      }
    },
    showMessage:function(arr){
      console.log(arr);
      $(".headbar").css({"position":"absolute","z-index":"auto"});
      var data = arr[0];
      if(data==0){
        
      }else if(data==1){
        
      }else if(data==2){
        
      }
    },
    submitForm: function () {
      let _this = this;
      if(_this.operation){
        //这里是个人信息
        _this.$refs.dataForm.validate((valid) => {
          if (valid) {
              _this.editLoading = true
              _this.addParams = {
                
              }
              console.log(_this.addParams);
              $.ajax({
                  type:'GET',
                  url:'/xaj/maintenance/addRepairRecord',
                  data:_this.addParams,
                  success:function(data){
                    console.log(data);
                    _this.dialogVisibleB = false;
                    _this.editLoading = false;
                    _this.$message({message: '修改成功', type: 'success'})
                  }
              })
          }
        })
      }else{
        //这里是修改密码
        _this.$refs.dataForm.validate((valid) => {
          if (valid) {
              _this.editLoading = true
              _this.addParams = {
                mobile:localStorage.getItem('mobile'),
                password:_this.dataForm.pass
              }
              console.log(_this.addParams);
              $.ajax({
                  type:'GET',
                  url:'/xaj/user/updatePassword',
                  data:_this.addParams,
                  success:function(data){
                    console.log(data);
                    _this.dialogVisibleB = false;
                    _this.editLoading = false;
                    _this.$refs['dataForm'].resetFields();
                    _this.$message({message: '修改成功', type: 'success'})
                  }
              })
          }
        })
      }
    },
    removeTabHandle (tabName) {
      this.mainTabs = this.mainTabs.filter(item => item.name !== tabName)
      if (this.mainTabs.length >= 1) {
        // 当前选中tab被删除
        if (tabName === this.mainTabsActiveName) {
          this.$router.push({ name: this.mainTabs[this.mainTabs.length - 1].name }, () => {
            this.mainTabsActiveName = this.$route.name
          })
        }
      } else {
        this.$router.push("/")
      }
    },
    tabsRefreshCurrentHandle () {
      var tempTabName = this.mainTabsActiveName
      this.removeTabHandle(tempTabName)
      this.$nextTick(() => {
        this.$router.push({ name: tempTabName })
      })
    }
    // 切换主题
    // onThemeChange: function(themeColor) {
    //   this.$store.commit('setThemeColor', themeColor)
    // },
    // 语言切换
    // changeLanguage(lang) {
    //   lang === '' ? 'zh_cn' : lang
    //   this.$i18n.locale = lang
    //   this.langVisible = false
    // }
  },
  mounted() {
    let _this = this;
    _this.sysName = "Kitty Platform"
    var user = sessionStorage.getItem("user")
    if (user) {
      _this.user.name = user
      _this.user.avatar = require("@/assets/user.png")
    }
    console.log(localStorage.getItem('groupName'));
    $.ajax({
      type:'GET',
      url:'/xaj/user/findUserMessageList',
      data:{
        userId: localStorage.getItem('userId')
      },
      success:function(res){
        console.log(res);
        _this.count = res.total;
        $.each(res.data,function(index,value){
          if(value.isRead == 0){
            _this.notices.push({'content':value.msg,'id':value.id});
          }
        })
      }
    })
    function mywebsocketpush(){
      var url = window.location.hostname;
      // var wsServer = 'ws://192.168.101.252:8080/websocket';
      var wsServer = 'ws://'+url+':8081'+'/websocket';
      var websocket = new WebSocket(wsServer);
      websocket.onopen = function(evt){
        onOpen(evt);
      }
      websocket.onmessage = function(evt){
        onMessage(evt);
      }
      websocket.onerror = function(evt){
        onError(evt);
      }
      websocket.onclose = function(evt){
        onClose(evt);
      }
      function onOpen(evt){
        console.log("正在连接中...");
      }
      function onMessage(evt){
        var data = JSON.parse(evt.data);
        // console.log(data);
        $.each(data,function(index,value){
          if(value.userId = parseInt(localStorage.getItem('userId'))){
            _this.count = value.count;
          }
        })
      }
      function onError(evt){
        console.log("连接失败");
      }
      function onClose(evt){
        console.log("连接中断");
      }
    }
    mywebsocketpush();
  },
  computed:{
    ...mapState({
      themeColor: state=>state.app.themeColor,
      collapse: state=>state.app.collapse
    }),
    mainTabs: {
      get () { return this.$store.state.tab.mainTabs },
      set (val) { this.$store.commit('updateMainTabs', val) }
    },
    mainTabsActiveName: {
      get () { return this.$store.state.tab.mainTabsActiveName },
      set (val) { this.$store.commit('updateMainTabsActiveName', val) }
    }
  }
}
</script>

<style>
.headbar {
  position: fixed;
  top: 0;
  right: 0;
  height: 58px;
  line-height: 58px;
  border:1px solid #e6e6e6;
  background-color:#fff;
  z-index: 1030;
}
.hamburg, .navbar {
  float: left;
}
.toolbar {
  float: right;
}
.lang-item {
  font-size: 16px;
  padding-left: 8px;
  padding-top: 8px;
  padding-bottom: 8px;
  cursor: pointer;
}
.lang-item:hover {
  font-size: 18px;
  background: #b0d6ce4d;
}
.user-info {
  font-size: 20px;
  color: #fff;
  cursor: pointer;
}
.user-info img {
  width: 28px;
  height: 28px;
  border-radius: 10px;
  margin: 0px 10px 10px 10px;
}
.badge {
  line-height: 18px;
}
.position-left {
  left: 230px;
}
.position-collapse-left {
  left: 80px;
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
.el-menu--horizontal>.el-menu-item{
  height:58px;
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
.el-form-item__label{
  color: #101010;
}
.notice-title{
  color: #E51C23;
  font-size: 24px;
  font-family: 'SourceHanSansSC-regular';
  margin-bottom: 25px;
}
.headbar .el-form--inline .el-form-item{
  line-height: initial;
}
.personalDialog .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
}
.personalDialog .avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.personalDialog .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.personalDialog .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.personalDialog .avatar-uploader .el-button--success{
  background-color: #009688;
  border-color: #009688;
  position: absolute;
  bottom:25px;
  right:-98px;
}
.personalDialog .avatar-uploader .el-upload__tip{
  font-size: 14px;
  color: #E51C23;
  font-family: 'SourceHanSansSC-regular';
  line-height: 20px;
  position: absolute;
  bottom:0;
  left: 198px;
}
.personalDialog .inputLengthA .el-input{
  width: 50%;
}
.sub-title{
  font-size: 18px;
  color: #000;
  font-family: 'SourceHanSansSC-regular';
  margin-bottom:10px;
}
</style>