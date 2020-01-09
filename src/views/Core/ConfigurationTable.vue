<template>
  <div>
    <!--表格栏-->
    <el-table :data="data.data" :highlight-current-row="highlightCurrentRow" @selection-change="selectionChange" 
          @current-change="handleCurrentChange" v-loading="loading" :border="border" :stripe="stripe" :max-height="maxHeight" :height="height" :size="size" style="width:100%;" :header-cell-style="{'background-color':'#E8ECEB','color':'#424242'}">
      <!-- <el-table-column type="selection" width="40" v-if="showBatchDelete & showOperation"></el-table-column> -->
      <el-table-column label="序号" width="80" align="center" type="index" :index="indexExtend"></el-table-column>
      <el-table-column v-for="column in columns" header-align="center" align="center"
        :prop="column.prop" :label="column.label" :width="column.width" :min-width="column.minWidth" 
        :fixed="column.fixed" :key="column.prop" :type="column.type">
      </el-table-column>
      <el-table-column label="操作" min-width="150" v-if="showOperation" header-align="center" align="center">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)" :style="{'color':themeColor,'border-color':themeColor}">修改</el-button>
          <el-button size="mini" @click="handleDelete(scope.$index, scope.row)" :style="{'color':themeColor,'border-color':themeColor}">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页栏-->
    <div class="toolbar" style="padding:10px;position:absolute;bottom:20px;right:0">
     <!--  <el-button :perms="permsDelete" size="mini" type="danger" @click="handleBatchDelete()" style="float:left;" v-if="showBatchDelete & showOperation">批量删除</el-button> -->
      <el-pagination layout="total, prev, pager, next, jumper" @current-change="refreshPageRequest" 
        :current-page="pageRequest.currPage" :page-size="pageRequest.pageSize" :total="data.total" style="float:right;">
      </el-pagination>
    </div>
    
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'ConfigurationTable',
  props: {
    columns: Array, // 表格列配置
    data: Object, // 表格分页数据
    permsEdit: String,  // 编辑权限标识
    permsDelete: String,  // 删除权限标识
    rowA:Array,
    rowB:Array,
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
        this.loading = true
        let callback = res => {
          this.loading = false
        }
      this.$emit('findPage', {pageRequest:this.pageRequest, callback:callback})
    },
    // 选择切换
    selectionChange: function (selections) {
      this.selections = selections
      this.$emit('selectionChange', {selections:selections})
    },
    // 选择切换
    handleCurrentChange: function (val) {
      this.$emit('handleCurrentChange', {val:val})
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
    // 删除
		handleDelete: function (index, row) {
			this.delete(row.id)
		},
		// 批量删除
		handleBatchDelete: function () {
			let ids = this.selections.map(item => item.id).toString()
			this.delete(ids)
		},
		// 删除操作
		delete: function (ids) {
			this.$confirm('您确认删除该项内容吗？', '提示', {
				type: 'warning'
			}).then(() => {
				let params = []
				let idArray = (ids+'').split(',')
				for(var i=0; i<idArray.length; i++) {
					params.push({'id':idArray[i]})
        }
        this.loading = true
        let callback = res => {
          this.$message({message: '删除成功', type: 'success'})
          this.findPage()
          this.loading = false
        }
        this.$emit('handleDelete', {params:params, callback:callback})
			}).catch(() => {
			})
		},
    showButtonA: function(index,row){
      for(var j=0;j<row.length;j++){
        if(index === row[j]){
          return true;
        }
      }
    },
    showButtonB: function(index,row){
      for(var j=0;j<row.length;j++){
        if(index === row[j]){
          return true;
        }
      }
    },
    handleFill:function(index,row){
      var arr = [index,row];
      this.$emit('handle-fill',arr);
    },
    indexExtend(index){
      return (index+1)+ this.pageRequest.pageSize * (this.pageRequest.currPage - 1);
    }
  },
  mounted() {
    this.refreshPageRequest(1);
    console.log(this.rowA,this.rowB,this.text);
  }
}
</script>

<style scoped>
  
</style>