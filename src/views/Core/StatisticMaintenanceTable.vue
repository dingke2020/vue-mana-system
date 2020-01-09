<template>
  <div>
    <!--表格栏-->
    <el-table class="maintenance" :data="data.maintenance" :highlight-current-row="highlightCurrentRow" v-loading="loading" :border="border" :max-height="maxHeight" :height="height" :size="size" style="width:100%;" :header-cell-style="{'background-color':'#E8ECEB','color':'#424242'}" :row-style="{'height':'60px'}">
      <!-- <el-table-column type="selection" width="40" v-if="showBatchDelete & showOperation"></el-table-column> -->
     <!--  <el-table-column label="序号" min-width="50" align="center" type="index" :index="indexExtend"></el-table-column> -->
      <el-table-column v-for="column in columns" header-align="center" align="center"
        :prop="column.prop" :label="column.label" :width="column.width" :min-width="column.minWidth" 
        :fixed="column.fixed" :key="column.prop" :type="column.type">
      </el-table-column>
      <el-table-column v-for="column in customColumns" header-align="center" align="center"
        :prop="column.prop" :label="column.label" :width="column.width" :min-width="column.minWidth" 
        :fixed="column.fixed" :key="column.prop" :type="column.type">
        <template slot-scope="scope">
          <i v-show="showIconA(scope.$index,scope.row,scope.column)" class="iconfont icon-ali-success"></i>
          <i v-show="showIconB(scope.$index,scope.row,scope.column)" class="iconfont icon-ali-error"></i>
          <i v-show="showIconC(scope.$index,scope.row,scope.column)" class="iconfont icon-ali-stop"></i>
          <i v-show="showIconD(scope.$index,scope.row,scope.column)" class="iconfont icon-ali-wrench"></i>
        </template>
      </el-table-column>
    </el-table>
    <!--分页栏-->
    <div class="toolbar" style="padding:10px;position:absolute;bottom:20px;right:0">
     <!--  <el-button :perms="permsDelete" size="mini" type="danger" @click="handleBatchDelete()" style="float:left;" v-if="showBatchDelete & showOperation">批量删除</el-button> -->
      <el-pagination layout="total, prev, pager, next, jumper" @current-change="refreshPageRequest" 
        :current-page="pageRequest.currPage" :page-size="pageRequest.pageSize" :total="1" style="float:right;">
      </el-pagination>
    </div>
    
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'StatisticMaintenanceTable',
  props: {
    columns: Array, // 表格列配置
    customColumns: Array,
    data: Object, // 表格分页数据
    permsEdit: String,  // 编辑权限标识
    permsDelete: String,  // 删除权限标识
    rowstatus: Function,
    rowA:Array,
    rowB:Array,
    rowC:Array,
    rowD:Array,
    rowE:Array,
    size: { // 尺寸样式
      type: String,
      default: 'medium'
    },
    align: {  // 文本对齐方式
      type: String,
      default: 'left'
    },
    maxHeight: {  // 表格最大高度
      type: Number,
      default: 1000
    },
    height: {  // 表格最大高度
      type: Number,
      default: 250
    },
    showOperation: {  // 是否显示操作组件
      type: Boolean,
      default: true
    },
    border: {  // 是否显示边框
      type: Boolean,
      default: true
    },
    stripe: {  // 是否显示斑马线
      type: Boolean,
      default: true
    },
    highlightCurrentRow: {  // // 是否高亮当前行
      type: Boolean,
      default: true
    },
    showOverflowTooltip: {  // 是否单行显示
      type: Boolean,
      default: true
    },
    showBatchDelete: {  // 是否显示操作组件
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      // 分页信息
			pageRequest: {
				groupId:'',
        currPage: 1, 
        pageSize: 10 
      },
      loading: false,  // 加载标识
      selections: [],  // 列表选中列
      btnstatus: true,
      dialogVisible: false,
      editLoading: false
    }
  },
  computed:{
      ...mapState({
        themeColor: state=>state.app.themeColor,
        collapse: state=>state.app.collapse
      })
  },
  methods: {
    // 分页查询
    findPage: function () {
      this.pageRequest.groupId = parseInt(localStorage.getItem('groupId'));
        this.loading = true
        let callback = res => {
          this.loading = false
        }
      this.$emit('findPage', {pageRequest:this.pageRequest, callback:callback})
    },
    // 换页刷新
		refreshPageRequest: function (pageNum) {
      this.pageRequest.currPage = pageNum
      this.findPage()
    },
    // 编辑
		handleEdit: function (index, row) {
      this.$emit('handleEdit', {index:index, row:row})
		},
    indexExtend(index){
      return (index+1)+ this.pageRequest.pageSize * (this.pageRequest.currPage - 1);
    },
    showIconA(index,row,column){
      console.log(column.property);
      switch(column.property) {
        case "Jan":
            var state,num;
            $.each(row.Jan,function(index,value){
              if(value.state==0){
                state = value.state;
              }
            })
            if(state == 0){
              return true;
            }
            break;
        case "Feb":
            var state,num;
            $.each(row.Feb,function(index,value){
              if(value.state==0){
                state = value.state;
              }
            })
            if(state == 0){
              return true;
            }
            break;
        case "Mar":
            var state,num;
            $.each(row.Mar,function(index,value){
              if(value.state==0){
                state = value.state;
              }
            })
            if(state == 0){
              return true;
            }
            break;
        case "Apr":
            var state,num;
            $.each(row.Apr,function(index,value){
              if(value.state==0){
                state = value.state;
              }
            })
            if(state == 0){
              return true;
            }
            break;
        case "May":
            var state,num;
            $.each(row.May,function(index,value){
              if(value.state==0){
                state = value.state;
              }
            })
            if(state == 0){
              return true;
            }
            break;
        case "Jun":
            var state,num;
            $.each(row.Jun,function(index,value){
              if(value.state==0){
                state = value.state;
              }
            })
            if(state == 0){
              return true;
            }
            break;
        case "Jul":
            var state,num;
            $.each(row.Jul,function(index,value){
              if(value.state==0){
                state = value.state;
              }
            })
            if(state == 0){
              return true;
            }
            break;
        case "Aug":
            var state,num;
            $.each(row.Aug,function(index,value){
              if(value.state==0){
                state = value.state;
              }
            })
            if(state == 0){
              return true;
            }
            break;
        case "Sep":
            var state,num;
            $.each(row.Sep,function(index,value){
              if(value.state==0){
                state = value.state;
              }
            })
            if(state == 0){
              return true;
            }
            break;
        case "Oct":
            var state,num;
            $.each(row.Oct,function(index,value){
              if(value.state==0){
                state = value.state;
              }
            })
            if(state == 0){
              return true;
            }
            break;
        case "Nov":
            var state,num;
            $.each(row.Nov,function(index,value){
              if(value.state==0){
                state = value.state;
              }
            })
            if(state == 0){
              return true;
            }
            break;
        case "Dec":
            var state,num;
            $.each(row.Dec,function(index,value){
              if(value.state==0){
                state = value.state;
              }
            })
            if(state == 0){
              return true;
            }
            break;
      }
    },
    showIconB(index,row,column){
      switch(column.property) {
        case "Jan":
            var state,num;
            $.each(row.Jan,function(index,value){
              if(value.state==1){
                state = value.state;
              }
            })
            if(state == 1){
              return true;
            }
            break;
        case "Feb":
            var state,num;
            $.each(row.Feb,function(index,value){
              if(value.state==1){
                state = value.state;
              }
            })
            if(state == 1){
              return true;
            }
            break;
        case "Mar":
            var state,num;
            $.each(row.Mar,function(index,value){
              if(value.state==1){
                state = value.state;
              }
            })
            if(state == 1){
              return true;
            }
            break;
        case "Apr":
            var state,num;
            $.each(row.Apr,function(index,value){
              if(value.state==1){
                state = value.state;
              }
            })
            if(state == 1){
              return true;
            }
            break;
        case "May":
            var state,num;
            $.each(row.May,function(index,value){
              if(value.state==1){
                state = value.state;
              }
            })
            if(state == 1){
              return true;
            }
            break;
        case "Jun":
            var state,num;
            $.each(row.Jun,function(index,value){
              if(value.state==1){
                state = value.state;
              }
            })
            if(state == 1){
              return true;
            }
            break;
        case "Jul":
            var state,num;
            $.each(row.Jul,function(index,value){
              if(value.state==1){
                state = value.state;
              }
            })
            if(state == 1){
              return true;
            }
            break;
        case "Aug":
            var state,num;
            $.each(row.Aug,function(index,value){
              if(value.state==1){
                state = value.state;
              }
            })
            if(state == 1){
              return true;
            }
            break;
        case "Sep":
            var state,num;
            $.each(row.Sep,function(index,value){
              if(value.state==1){
                state = value.state;
              }
            })
            if(state == 1){
              return true;
            }
            break;
        case "Oct":
            var state,num;
            $.each(row.Oct,function(index,value){
              if(value.state==1){
                state = value.state;
              }
            })
            if(state == 1){
              return true;
            }
            break;
        case "Nov":
            var state,num;
            $.each(row.Nov,function(index,value){
              if(value.state==1){
                state = value.state;
              }
            })
            if(state == 1){
              return true;
            }
            break;
        case "Dec":
            var state,num;
            $.each(row.Dec,function(index,value){
              if(value.state==1){
                state = value.state;
              }
            })
            if(state == 1){
              return true;
            }
            break;
      }
    },
    showIconC(index,row,column){
      switch(column.property) {
        case "Jan":
            var state,num;
            $.each(row.Jan,function(index,value){
              if(value.state==2){
                state = value.state;
              }
            })
            if(state == 2){
              return true;
            }
            break;
        case "Feb":
            var state,num;
            $.each(row.Feb,function(index,value){
              if(value.state==2){
                state = value.state;
              }
            })
            if(state == 2){
              return true;
            }
            break;
        case "Mar":
            var state,num;
            $.each(row.Mar,function(index,value){
              if(value.state==2){
                state = value.state;
              }
            })
            if(state == 2){
              return true;
            }
            break;
        case "Apr":
            var state,num;
            $.each(row.Apr,function(index,value){
              if(value.state==2){
                state = value.state;
              }
            })
            if(state == 2){
              return true;
            }
            break;
        case "May":
            var state,num;
            $.each(row.May,function(index,value){
              if(value.state==2){
                state = value.state;
              }
            })
            if(state == 2){
              return true;
            }
            break;
        case "Jun":
            var state,num;
            $.each(row.Jun,function(index,value){
              if(value.state==2){
                state = value.state;
              }
            })
            if(state == 2){
              return true;
            }
            break;
        case "Jul":
            var state,num;
            $.each(row.Jul,function(index,value){
              if(value.state==2){
                state = value.state;
              }
            })
            if(state == 2){
              return true;
            }
            break;
        case "Aug":
            var state,num;
            $.each(row.Aug,function(index,value){
              if(value.state==2){
                state = value.state;
              }
            })
            if(state == 2){
              return true;
            }
            break;
        case "Sep":
            var state,num;
            $.each(row.Sep,function(index,value){
              if(value.state==2){
                state = value.state;
              }
            })
            if(state == 2){
              return true;
            }
            break;
        case "Oct":
            var state,num;
            $.each(row.Oct,function(index,value){
              if(value.state==2){
                state = value.state;
              }
            })
            if(state == 2){
              return true;
            }
            break;
        case "Nov":
            var state,num;
            $.each(row.Nov,function(index,value){
              if(value.state==2){
                state = value.state;
              }
            })
            if(state == 2){
              return true;
            }
            break;
        case "Dec":
            var state,num;
            $.each(row.Dec,function(index,value){
              if(value.state==2){
                state = value.state;
              }
            })
            if(state == 2){
              return true;
            }
            break;
      }
    },
    showIconD(index,row,column){
      switch(column.property) {
        case "Jan":
            var state,num;
            $.each(row.Jan,function(index,value){
              if(value.state==3){
                state = value.state;
              }
            })
            if(state == 3){
              return true;
            }
            break;
        case "Feb":
            var state,num;
            $.each(row.Feb,function(index,value){
              if(value.state==3){
                state = value.state;
              }
            })
            if(state == 3){
              return true;
            }
            break;
        case "Mar":
            var state,num;
            $.each(row.Mar,function(index,value){
              if(value.state==3){
                state = value.state;
              }
            })
            if(state == 3){
              return true;
            }
            break;
        case "Apr":
            var state,num;
            $.each(row.Apr,function(index,value){
              if(value.state==3){
                state = value.state;
              }
            })
            if(state == 3){
              return true;
            }
            break;
        case "May":
            var state,num;
            $.each(row.May,function(index,value){
              if(value.state==3){
                state = value.state;
              }
            })
            if(state == 3){
              return true;
            }
            break;
        case "Jun":
            var state,num;
            $.each(row.Jun,function(index,value){
              if(value.state==3){
                state = value.state;
              }
            })
            if(state == 3){
              return true;
            }
            break;
        case "Jul":
            var state,num;
            $.each(row.Jul,function(index,value){
              if(value.state==3){
                state = value.state;
              }
            })
            if(state == 3){
              return true;
            }
            break;
        case "Aug":
            var state,num;
            $.each(row.Aug,function(index,value){
              if(value.state==3){
                state = value.state;
              }
            })
            if(state == 3){
              return true;
            }
            break;
        case "Sep":
            var state,num;
            $.each(row.Sep,function(index,value){
              if(value.state==3){
                state = value.state;
              }
            })
            if(state == 3){
              return true;
            }
            break;
        case "Oct":
            var state,num;
            $.each(row.Oct,function(index,value){
              if(value.state==3){
                state = value.state;
              }
            })
            if(state == 3){
              return true;
            }
            break;
        case "Nov":
            var state,num;
            $.each(row.Nov,function(index,value){
              if(value.state==3){
                state = value.state;
              }
            })
            if(state == 3){
              return true;
            }
            break;
        case "Dec":
            var state,num;
            $.each(row.Dec,function(index,value){
              if(value.state==3){
                state = value.state;
              }
            })
            if(state == 3){
              return true;
            }
            break;
      }
    }
  },
  mounted() {
    this.refreshPageRequest(1);
    console.log(this.rowA);
  }
}
</script>

<style scoped>
  .lockTip{
    font-size: 26px;
    color: #101010;
    font-family: 'SourceHanSansSC-regular';
  }
</style>