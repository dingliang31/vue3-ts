<template>
  <div id="nav">
    <el-container class="container">
      <el-aside class="aside" width="200px">
        <el-menu :router="true" :default-active="defaultActive" @open="onOpen" @select="onSelect">
          <el-submenu index="1">
            <template #title><i class="el-icon-message"></i>示例导航</template>
            <el-menu-item-group>
              <template #title>分组一</template>
              <el-menu-item index="1-1">选项1</el-menu-item>
              <el-menu-item index="1-2">选项2</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="分组2">
              <el-menu-item index="1-3">选项3</el-menu-item>
            </el-menu-item-group>
            <el-submenu index="1-4">
              <template #title>选项4</template>
              <el-menu-item index="1-4-1">选项4-1</el-menu-item>
            </el-submenu>
          </el-submenu>
          <el-submenu index="2">
            <template #title><i class="el-icon-menu"></i>导航</template>
              <!-- <el-menu-item index="/" :route="{
                path: '/'
              }">Home</el-menu-item>
              <el-menu-item index="/map" :route="{
                path: '/map'
              }">地图</el-menu-item>
              <el-menu-item index="/amap" :route="{
                path: '/amap'
              }">AMap</el-menu-item>
              <el-menu-item index="/directive" :route="{
                path: '/directive'
              }">Directive</el-menu-item> -->
              <el-menu-item v-for='(it, i) in menus' :index="it.path" :route="it" :key='`menu-iten-${i}`'>{{it.title || it.name}}</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-container class="content">
        <el-header class="header">
          <el-dropdown>
            <i class="el-icon-setting" style="margin-right: 15px"></i>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>查看</el-dropdown-item>
                <el-dropdown-item>新增</el-dropdown-item>
                <el-dropdown-item>删除</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <span>aladdin</span>
        </el-header>
        <el-main>
          <router-view/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script lang="ts">
  interface Menu {
    [key: string]: any
  }
  interface CurrentInstance extends ComponentInternalInstance {
    ctx: any
  }
  import { reactive, ref, toRefs, onMounted, getCurrentInstance, nextTick } from 'vue';
  import { RouteLocationNormalizedLoaded, useRoute, useRouter } from 'vue-router';
  import { Ref } from '@vue/reactivity'
  import { AppContext, ComponentInternalInstance } from '@vue/runtime-core'
  export default {
    name: 'APP',
    mounted(): void {
      console.log(this)
    },
    setup(props: any, ctx: any) {
      const sideMenu: Menu = reactive({
        menus: [],
        defaultOpeneds: [],
        defaultActive: '/',
        onOpen: (index: string, indexPath: string) => {
          console.log(index, indexPath, 'onOpen')
        },
        onSelect: (index: string, indexPath: string) => {
          console.log(index, indexPath, 'onSelect')
          sideMenu.defaultActive = index
        },
        setMenus: (list = []) => {
          sideMenu.menus = list
        }
      })
      const sideMenuRef = toRefs(sideMenu)
      let currentRoute: string
      onMounted(() => {
        currentRoute = useRoute().path
        // const currentInstance: any = getCurrentInstance()
        console.log(location.pathname, ctx.root)
        if(currentRoute) {
          // todo useRoute(r) 在刷新页面的时候获取不到path值（一直是'/'）location.pathname ||
          sideMenu.defaultActive = currentRoute
        }
        const routes: any[] = useRouter().getRoutes()
        console.log(sideMenuRef.setMenus)
        sideMenu.setMenus(routes)
      })
      return {
        ...sideMenuRef
      }
    }
  }
</script>

<style lang="stylus">
#app
  font-family Avenir, Helvetica, Arial, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  text-align center
  color #2c3e50
  height 100%
  box-sizing border-box
#nav
  height 100%
  width 100%
  .container
    height 100%
    width 100%
    .aside
      background-color rgb(238, 241, 246)
      height 100%
    .content
      height 100%
      .header
        background #b3c0d1
        display flex
        flex-direction row
        justify-content flex-end
        align-items center
</style>
