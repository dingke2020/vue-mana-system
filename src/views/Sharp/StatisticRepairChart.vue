<template>
  <div>
    <!--表格栏-->
    <el-table class="maintenance" :data="data.data" :highlight-current-row="highlightCurrentRow" v-loading="loading" :border="border" :max-height="maxHeight" :height="height" :size="size" style="width:100%;" :header-cell-style="{'background-color':'#E8ECEB','color':'#424242'}" :row-style="{'height':'60px'}">
      <!-- <el-table-column type="selection" width="40" v-if="showBatchDelete & showOperation"></el-table-column> -->
      <!-- <el-table-column label="序号" width="80" align="center" type="index" :index="indexExtend"></el-table-column> -->
      <el-table-column v-for="column in columns" header-align="center" align="center"
        :prop="column.prop" :label="column.label" :width="column.width" :min-width="column.minWidth" 
        :fixed="column.fixed" :key="column.prop" :type="column.type">
      </el-table-column>
      <el-table-column v-for="column in customColumns" header-align="center" align="center"
        :prop="column.prop" :label="column.label" :width="column.width" :min-width="column.minWidth" 
        :fixed="column.fixed" :key="column.prop" :type="column.type">
        <template slot-scope="scope">
          <i v-show="showIconD(scope.$index,scope.row,scope.column)" class="iconfont icon-ali-wrench"></i>
          <span class="number" v-show="showIconNum(scope.$index,scope.row,scope.column)>1">
            <i class="iconfont icon-ali-remove"></i><span v-html="showIconNum(scope.$index,scope.row,scope.column)"></span></span>
        </template>
      </el-table-column>
    </el-table>
    <!--分页栏-->
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'StatisticMaintainChart',
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
				year:'',
        machineType:'',
        nameNumber:''
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
    showIconD(index,row,column){
      switch(column.property) {
        case "january":
            var state,num;
            $.each(row.january,function(index,value){
              if(value.state==3){
                state = value.state;
              }
            })
            if(state == 3){
              return true;
            }
            break;
        case "february":
            var state,num;
            $.each(row.february,function(index,value){
              if(value.state==3){
                state = value.state;
              }
            })
            if(state == 3){
              return true;
            }
            break;
        case "march":
            var state,num;
            $.each(row.march,function(index,value){
              if(value.state==3){
                state = value.state;
              }
            })
            if(state == 3){
              return true;
            }
            break;
        case "april":
            var state,num;
            $.each(row.april,function(index,value){
              if(value.state==3){
                state = value.state;
              }
            })
            if(state == 3){
              return true;
            }
            break;
        case "may":
            var state,num;
            $.each(row.may,function(index,value){
              if(value.state==3){
                state = value.state;
              }
            })
            if(state == 3){
              return true;
            }
            break;
        case "june":
            var state,num;
            $.each(row.june,function(index,value){
              if(value.state==3){
                state = value.state;
              }
            })
            if(state == 3){
              return true;
            }
            break;
        case "july":
            var state,num;
            $.each(row.july,function(index,value){
              if(value.state==3){
                state = value.state;
              }
            })
            if(state == 3){
              return true;
            }
            break;
        case "august":
            var state,num;
            $.each(row.august,function(index,value){
              if(value.state==3){
                state = value.state;
              }
            })
            if(state == 3){
              return true;
            }
            break;
        case "september":
            var state,num;
            $.each(row.september,function(index,value){
              if(value.state==3){
                state = value.state;
              }
            })
            if(state == 3){
              return true;
            }
            break;
        case "october":
            var state,num;
            $.each(row.october,function(index,value){
              if(value.state==3){
                state = value.state;
              }
            })
            if(state == 3){
              return true;
            }
            break;
        case "november":
            var state,num;
            $.each(row.november,function(index,value){
              if(value.state==3){
                state = value.state;
              }
            })
            if(state == 3){
              return true;
            }
            break;
        case "december":
            var state,num;
            $.each(row.december,function(index,value){
              if(value.state==3){
                state = value.state;
              }
            })
            if(state == 3){
              return true;
            }
            break;
      }
    },
    showIconNum(index,row,column){
      switch(column.property) {
        case "january":
            var state,num;
            $.each(row.january,function(index,value){
              if(value.state==3){
                state = value.state;
                num = value.num;
              }
            })
            if(state == 3){
              return num;
            }
            break;
        case "february":
            var state,num;
            $.each(row.february,function(index,value){
              if(value.state==3){
                state = value.state;
                num = value.num;
              }
            })
            if(state == 3){
              return num;
            }
            break;
        case "march":
            var state,num;
            $.each(row.march,function(index,value){
              if(value.state==3){
                state = value.state;
                num = value.num;
              }
            })
            if(state == 3){
              return num;
            }
            break;
        case "april":
            var state,num;
            $.each(row.april,function(index,value){
              if(value.state==3){
                state = value.state;
                num = value.num;
              }
            })
            if(state == 3){
              return num;
            }
            break;
        case "may":
            var state,num;
            $.each(row.may,function(index,value){
              if(value.state==3){
                state = value.state;
                num = value.num;
              }
            })
            if(state == 3){
              return num;
            }
            break;
        case "june":
            var state,num;
            $.each(row.june,function(index,value){
              if(value.state==3){
                state = value.state;
                num = value.num;
              }
            })
            if(state == 3){
              return num;
            }
            break;
        case "july":
            var state,num;
            $.each(row.july,function(index,value){
              if(value.state==3){
                state = value.state;
                num = value.num;
              }
            })
            if(state == 3){
              return num;
            }
            break;
        case "august":
            var state,num;
            $.each(row.august,function(index,value){
              if(value.state==3){
                state = value.state;
                num = value.num;
              }
            })
            if(state == 3){
              return num;
            }
            break;
        case "september":
            var state,num;
            $.each(row.september,function(index,value){
              if(value.state==3){
                state = value.state;
                num = value.num;
              }
            })
            if(state == 3){
              return num;
            }
            break;
        case "october":
            var state,num;
            $.each(row.october,function(index,value){
              if(value.state==3){
                state = value.state;
                num = value.num;
              }
            })
            if(state == 3){
              return num;
            }
            break;
        case "november":
            var state,num;
            $.each(row.november,function(index,value){
              if(value.state==3){
                state = value.state;
                num = value.num;
              }
            })
            if(state == 3){
              return num;
            }
            break;
        case "december":
            var state,num;
            $.each(row.december,function(index,value){
              if(value.state==3){
                state = value.state;
                num = value.num;
              }
            })
            if(state == 3){
              return num;
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
  .number{
    font-size: 20px;
    color: #101010;
    font-family: 'SourceHanSansSC-regular';
  }
  .number i{
    font-size: 16px;
    color: #6A6868;
  }
</style>