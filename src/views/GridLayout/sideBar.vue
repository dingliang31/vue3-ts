<template>
<div :class="['widget-container', {'top-level': isTopLevel}]" ref="widgetContainer" v-loading="loading">
  <el-input
    v-model="searchText"
    ref="searchInput"
    class="no-border border-bottom"
    placeholder="搜索组件"
    clearable></el-input>
  <el-scrollbar
    v-show="treeData.length"
    style="height: calc(100% - 40px);"
    ref="scrollbar">
    <el-tree
      class="widget-tree"
      ref="widgetTree"
      node-key="id"
      default-expand-all
      highlight-current
      :data="treeData"
      :props="defaultProps"
      @node-expand="handleCollapseChange"
      @node-collapse="handleCollapseChange">
      <!-- 左侧宽度 sidebar 宽度为 260 -->
      <span style="width: 180px" slot-scope="{ node, data }">
        <widget
          :data="data"
          :disabled="(node.childNodes && node.childNodes.length > 0) || data._pid == null"
          :default-top="searchInputHeight"
          :scroll-top="sidebarScrollTop"
          @mouse-enter="handleMouseenter(data)"
          @drag-ready="passCurrentWidget(data)"></widget>
      </span>
    </el-tree>
  </el-scrollbar>
</div>

</template>

<script>
import Widget from './widget'

export default {
  name: 'Sidebar',
  data () {
    return {
      searchText: '',
      handleSearch() {},
      searchInputHeight: 0,
      activeCollapseName: '1',
      sidebarScrollTop: 0,
      loading: false,
      isTopLevel: false,
      defaultGroupMap: {
        custom: '默认组件',
        fineBI: '自定义组件'
      },
      data: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  computed: {
    widgetContainer () {
      return this.$refs.widgetContainer
    },
    sidebarWrap () {
      return this.$refs.scrollbar.wrap
    },
    treeData () {
      const { records } = this.listSearch.resData
      let list = [], temp = {}
      records.forEach((item, index) => {
        const { gbiGroupId, gbiGroupName, classify } = item
        const id = gbiGroupId ? `${gbiGroupId}_${classify}` : 'noGroup'
        const name = gbiGroupId ? gbiGroupName : '未分组'
        // 组件分组节点
        if (!temp[id]) {
          list.push({
            id,
            _pid: classify,
            name
          })
          temp[id] = 1
        }

        item._pid = id
        list.push(item)
      })
      // 组件分类 根节点
      Object.keys(this.defaultGroupMap).forEach(key => {
        const name = this.defaultGroupMap[key]
        list.push({
          id: key,
          name,
          _pid: null
        })
      })

      return getTree(list, {
        parent: '_pid',
        rootId: null
      })
    }
  },
  watch: {
    'list.success': 'handleWidgetsSuccess',
    'listSearch.success' (success) {
      if (success) this.loading = false
    },
    'listSearch.resData.records' (val) {
      if (!val.length) this.resetPortletAddPositon()
    },
    searchText() {
      this.handleSearch()
    }
  },
  methods: {
    // ...mapActions('widgets', ['getWidgetList', 'searchWidgetList']),
    // ...mapActions('templateEdit', ['updatePortletItemAddStyle']),
    handleWidgetsSuccess (success) {
      if (success) {
        this.loading = false
        this.$emit('widgets-loaded')
      }
    },
    handleMouseenter(data) {
      if (data.children && data.children.length > 0) this.resetPortletAddPositon()
      this.$refs.widgetTree.setCurrentKey(data.id)
    },
    passCurrentWidget (currWidget) {
      this.isTopLevel = false
      this.$emit('current-widget', currWidget)
    },
    handleCollapseChange () {
      // 折叠时把 portlet add 隐去
      this.resetPortletAddPositon()
      setTimeout(() => {
        // bug fix: 折叠过程中鼠标划过会再次出现
        this.resetPortletAddPositon()
      }, 400)
    },
    resetPortletAddPositon () {
      this.updatePortletItemAddStyle({
        x: -220,
        y: -60,
        opacity: 0
      })
    },
    handleScroll(e) {
      this.sidebarScrollTop = this.sidebarWrap.scrollTop
    },
    handleMouseWheel(e) {
      this.isTopLevel = true
    }
  },
  created () {
    this.loading = true
    const classify = null // 同时加载两种组件：自定义，帆软
    const query = ''
    const pageSize = 100 // todo: 后期组件较多时，分页展示组件
    const currentPage = 1
    const objectNodeId = this.$route.params.id
    const common = {
      classify,
      pageSize,
      currentPage,
      objectNodeId,
      // 只显示已发布组件
      status: 1
    }
    this.getWidgetList({
      ...common,
      query
    })
    // this.handleSearch = debounce(200, () => {
    //   this.loading = true
    //   this.searchWidgetList({
    //     ...common,
    //     query: this.searchText,
    //   })
    // })
    // this.handleSearch()
  },
  components: {
    Widget
  },
  mounted () {
    this.searchInputHeight = this.$refs.searchInput.$el.clientHeight

    this.sidebarWrap.addEventListener('scroll', this.handleScroll)
    document.addEventListener('mousewheel', this.handleMouseWheel)
  },
  beforeDestroy () {
    this.sidebarWrap.removeEventListener('scroll', this.handleScroll)
    document.removeEventListener('mousewheel', this.handleMouseWheel)
  }
}
</script>

<style lang="scss" scoped>
.widget-container {
  position: relative;
  height: 100%;
  &.top-level {
    z-index: 10;
  }
  .collapse-container {
    border-top: 0;
    border-bottom: 0;
  }
}
</style>
