<template>
  <el-container class="grid-layout" style="height: 100%;">
    <el-aside :width="asideWidth + 'px'" ref="sidebar" @scroll="handleSidebarScrolled">
      <sidebar @current-widget="updateNewPortlet" @widgets-loaded="handleWidgetsLoaded" />
    </el-aside>
    <el-main>
      <div :class="['grid-layout-wrap', {'show-scroll': showScroll}]" :style="{width: gridLayoutWidth}" ref="gridWrap">
        <table ref="gridTable" class="grid-table" :style="{backgroundColor: templateData.bgColor, borderSpacing: gridConfig.margin[0]+'px'}">
          <tbody>
            <tr v-for="row in gridConfig.maxRows" :key="row">
              <td v-for="col in gridConfig.colNum" :key="col"
              :style="{width: gridTableColWidth}"></td>
            </tr>
          </tbody>
        </table>
        <!-- <el-table
          :data="gridTableRows"
          :span-method="gridDefaultLayoutTableSpanMethod"
          :show-header="false"
          size="small"
          border
          class="grid-default-layout-table"
          >
          <el-table-column
            v-for="col in gridConfig.colNum"
            :width="parseInt(gridTableColWidth) + gridConfig.margin[0]"
            :key="col"
            >
          </el-table-column>
        </el-table> -->
        <!-- :max-rows="gridConfig.maxRows" -->
        <grid-layout
          v-if="gridLayoutFlag"
          ref="gridLayout"
          :layout="templateData.elements"
          :col-num="gridConfig.colNum"
          :row-height="rowHeight"
          :is-draggable="true"
          :is-resizable="true"
          :vertical-compact="true"
          :use-css-transforms="true"
          :margin="gridConfig.margin"

          @layout-updated="handleLayoutUpdate"
          >
          <grid-item
            v-for="(item, index) in templateData.elements"
            :key="index"
            :x="item.x"
            :y="item.y"
            :w="item.w"
            :h="item.h"
            :i="item.i"
            :is-resizable="item.i !== 'add'"
            ref="gridItem"
            :drag-allow-from="item.i === 'add' ? '.portlet' : '.vue-draggable-handle'"
            drag-ignore-from=".no-drag"
            @move="showMask = true"
            @moved="showMask = false"
            >
            <div class="portlet portlet-add" v-if="item.i === 'add'" :title="item.name"></div>
            <div class="portlet portlet-empty" v-else-if="item.classify === 'notFound'">
              <div class="vue-draggable-handle">
                <el-button @click="settingsPortlet(item)" type="text"
                  icon="el-icon-setting"></el-button>
                <el-button @click="removePortlet(item.i)" type="text"
                  icon="el-icon-circle-close"></el-button>
              </div>
              <h4>
                组件【ID:{{item.pluginId}}】已被删除
              </h4>
            </div>
            <div class="portlet" v-else>
              <div class="portlet-content no-drag">
                <!-- 智慧工地使用预览 -->
                <iframe v-if="isGss" :src="genPreviewURL(item.url)" frameborder="0"></iframe>
                <h4 v-else>组件：{{ item.name }}</h4>
                <div v-show="showMask" class="mask"></div>
              </div>
              <div class="vue-draggable-handle">
                <el-button @click="settingsPortlet(item)" type="text"
                  icon="el-icon-setting"></el-button>
                <el-button @click="removePortlet(item.i)" type="text"
                  icon="el-icon-circle-close"></el-button>
              </div>
            </div>
          </grid-item>
        </grid-layout>
      </div>
    </el-main>
  </el-container>
</template>

<script lang="ts">

import vue, { defineComponent } from 'vue';
import { reactive, onMounted, toRefs, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import * as pubMtd from '@/utils/publicMethods'

// import { GridLayout, GridItem } from "vue-grid-layout";

export default defineComponent({
  name: '',
  components: {
    // GridLayout, GridItem
  },
  data() {
    return {
      asideWidth: 240,
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  created() {

  },
  computed: {

  },
  methods: {
    updateNewPortlet() {

    },
    handleWidgetsLoaded() {

    }
  }
})
</script>

<style lang="scss">
@import '@/styles/element-variables.scss';

$grid-layout-bg-color:rgba(127, 127, 127, .4);
$portlet-bg: mix($--color-black, $--background-color-base, 15%);

.template-edit-container {
  height: 100%;
  overflow: hidden;
}
.template-edit-header {
  background-color: mix($--color-black, $--background-color-base, 10%);
  .toolbar {
    text-align: right;
    .el-button {
      margin: 10px 20px 0 0;
    }
  }
  .title {
    font-weight: normal;
  }
}

.portlet-container {
  padding: 0;
  overflow: visible;
  background-color: $--background-color-base;
  .grid-layout-wrap {
    position: relative;
    height: 100%;
    margin: 0 auto;
    &.show-scroll {
      overflow: auto;
    }
    // border-left: solid 1px $--border-color-base;
    // border-right: solid 1px $--border-color-base;
    .portlet {
      width: 100%;
      height: 100%;
      border: 1px dashed $--color-text-secondary;
      box-sizing: border-box;
      .portlet-content {
        position: relative;
        background-color: $portlet-bg;
        text-align: center;
        height: 100%;
        .mask {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          z-index: 2;
        }
      }
      h4 {
        line-height: 26px;
        height: 26px;
        width: 100%;
        margin: -13px 0 0;
        position: absolute;
        top: 50%;
      }
      iframe {
        width: 100%;
        height: 100%;
      }
      .vue-draggable-handle {
        display: none;
        position: absolute;
        width: 100%;
        height: 20px;
        top: 0;
        left: 0;
        background-color: rgba(255, 255, 255, 0.7);
        box-sizing: border-box;
        cursor: move;
        text-align: right;
        z-index: 3;
        .el-button {
          padding: 0;
          & + .el-button {
            margin-left: 8px;
          }
          &:last-child {
            margin-right: 5px;
          }
          i {
            font-size: 18px;
            color: $--color-text-primary;
          }
        }
      }
      &:hover .vue-draggable-handle,
      iframe:hover + .vue-draggable-handle {
        display: block;
      }
    }
    .portlet-add {
      background-color: $grid-layout-bg-color;
      width: 100%;
      height: 100%;
    }
    .portlet-empty {
      background-color: $portlet-bg;
      text-align: center;
      > h4 {
        color: $--color-danger;
      }
    }
    .grid-table {
      height: 100%;
      border-collapse: separate;
      border-spacing: 12px;
      background-color: #fff;
      td {
        padding: 0;
        background-color: $grid-layout-bg-color;
      }
    }
    .grid-default-layout-table {
      position: absolute;
      top:5px;
      left:5px;
      bottom:5px;
      right: 5px;
      border-width: 2px;
      border-color: $--color-warning;
      width: auto;
      &::before, &::after {
        display: none;
      }
      .el-table__body-wrapper {
        width: auto;
        height: 100%;
        overflow: hidden;
      }
      .el-table__body {
        height: 100%;
        td {
          border-width: 2px;
          border-color: $--color-warning;
        }
      }
      tr, tr:hover > td, & {
        background-color: transparent;
      }
    }
    .vue-grid-layout {
      position: absolute;
      top: 0;
      width: 100%;
    }
  }
}

.global-style-layout-table {
  border: 0;
  width: 100%;
  height: 100%;
  position: relative;
  &::before, &::after {
    display: none;
  }
  .el-table__body-wrapper {
    height: 100%;
  }
  table.el-table__body {
    width: auto !important;
    height: 100%;
    border-collapse: separate;
    border-spacing: 4px;
    border: 0;
    tr:hover > td, td {
      background-color: rgba(127, 127, 127, .5);
    }
    td {
      padding: 0;
      border: 0;
    }
  }
  &, .el-table__body tr {
    background-color: transparent;
  }
}

// vue-grid-layout
.vue-grid-layout {
  .vue-grid-item {
    &.vue-grid-placeholder {
      background-color: $--color-warning;
    }
    &.resizing {
      opacity: 0.9;
    }
    &.vue-grid-item-add {
      opacity: 0;
      // develop use
      // opacity: 1 !important;
      transition: none;
    }
    .vue-resizable-handle {
      z-index: 5000;
      position: absolute;
      width: 20px;
      height: 20px;
      bottom: 0;
      right: 0;
      background-position: bottom right;
      padding: 0 3px 3px 0;
      background-repeat: no-repeat;
      background-origin: content-box;
      box-sizing: border-box;
      cursor: se-resize;
    }
  }
}
</style>

