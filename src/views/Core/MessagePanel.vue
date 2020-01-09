<template>
  <div class="message-container">
    <ul class="message-list">
      <router-link class="message-item" v-for="(item,index) in list" :key="index" @click="showMessage(index,item)" :to="item.url" target="_blank">
        {{item.text}}
      </router-link>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'MessagePanel',
  props: {
    data: {
      type: Array,
      default: () => [
        {
          key: "1",
          avatar:'@/assets/user.png',
          content:'你修改了用户密码',
          sender:'诸葛亮',
          time:'5分钟前'
        },
        {
          key: "2",
          avatar:'@/assets/user.png',
          content:'你修改了用户头像',
          sender:'武则天',
          time:'2小时前'
        },
        {
          key: "3",
          avatar:'@/assets/user.png',
          content:'今日25名新成员加入',
          sender:'王语嫣',
          time:'昨天'
        },
        {
          key: "4",
          avatar:'@/assets/user.png',
          content:'您发表了一篇新随笔',
          sender:'苍井空',
          time:'昨天'
        },
        {
          key: "5",
          avatar:'@/assets/user.png',
          content:'您发表了一篇新随笔',
          sender:'上官婉儿',
          time:'前天'
        }]
    }
  },
  data() {
    return {
      list:[{text:'综合信息看板',url:'/board/index'},{text:'生产进度看板',url:'/board/production'},{text:'设备运行监测',url:'/board/equipment'},{text:'注塑机运行监测',url:'/board/machine'}]
    }
  },
  methods: {
    handleClick: function () {
      // 按钮操作处理函数
      this.$emit('click', {})
    },
    showMessage:function(index,item){
      var arr = [index,item];
      this.$emit('show-message',arr);
    }
  },
  mounted() {
  }
}
</script>

<style scoped>
.message-panel {
  font-size: 15px;
  width: 300px;
  margin: -12px;
}
.message-header {
  padding-left: 10px;
  font-size: 14px;
  padding-top: 6px;
  padding-bottom: 6px;
}
.message-content {
  font-size: 15px;
}
.message-avatar {
  padding-left: 10px;
}
.avatar {
  margin-right: 10px;
}
.sender {
  font-size: 16px;
  font-weight:bold;
}
.time {
  font-size: 12px;
  float: right;
  padding-right: 10px;
}
.message-footer {
  font-size: 14px;
  text-align: center;
  padding-top: 10px;
  padding-bottom: 10px;
  border-color: rgba(180, 190, 190, 0.8);
  border-top-width: 1px;
  border-top-style: solid;
}
.message-footer:hover {
  cursor: pointer;
  background: #b1a6a61e;
}
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 90px;
  float: left;
}
.message-container{
  margin:-14px;
}
.message-list{
  margin:0;
  list-style: none;
  padding-left: 0;
  text-align: center;
}
.message-item{
  height:48px;
  line-height: 48px;
  border-bottom:1px solid #DBDADA;
  display: block;
  color:#606266;
  text-decoration: none;
}
.message-item:last-child{
  border-bottom: none;
}
.message-item:hover{
  cursor:pointer;
  background: #fafafa;
}
</style>