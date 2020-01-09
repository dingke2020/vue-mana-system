<template>
  <div class="notice-panel">
    <div class="notice-content">
      <div v-for="(item,index) in data" :key="index" class="notice-item" @click="showNotice(index,item)">{{ item.content }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NoticePanel',
  props: {
    data: {
      type: Array,
      default: () => [
        {content:'【保养提醒】设备“数控车床”待保养！ 2019-09-10  09:00'}
        ]
    }
  },
  data() {
    return {
    }
  },
  methods: {
    handleClick: function () {
      // 按钮操作处理函数
      this.$emit('click', {})
    },
    showNotice:function(index,item){
      var arr = [index,item];
      this.$emit('show-notice',arr);
    }
  },
  mounted() {
  }
}
</script>

<style scoped>
.notice-panel {
  font-size: 15px;
  width: 350px;
}
.header {
  padding-left: 10px;
  font-size: 14px;
  padding-top: 6px;
  padding-bottom: 6px;
}
.notice-content {
  font-size: 12px;
}
.notice-item {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 25px;
  line-height: 25px;
}
.notice-item:hover {
  cursor: pointer;
  background: #fafafa;
}
.notice-icon {
  padding-left: 10px;
  padding-right: 5px;
}
.notice-footer {
  font-size: 14px;
  text-align: center;
  padding-top: 10px;
  padding-bottom: 10px;
  border-color: rgba(180, 190, 190, 0.8);
  border-top-width: 1px;
  border-top-style: solid;
}
.notice-footer:hover {
  cursor: pointer;
  background: #fafafa
}
</style>