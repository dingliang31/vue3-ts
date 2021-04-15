import {
  createRouter,
  createWebHistory,
  RouteRecordRaw,
  Router,
  RouteLocationNormalized,
  NavigationGuardNext
} from 'vue-router';
import Home from '../views/Home.vue'
declare type Routes = RouteRecordRaw & {
  title?: string
}
const routes: Array<Routes> = [
  {
    path: '/',
    name: 'Home',
    title: 'Home',
    component: Home
  }, {
    path: '/map',
    name: 'Map',
    title: 'Map',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Map/Map.vue')
  }, {
    path: '/amap',
    name: 'MapChart',
    title: 'AMap',
    component: () => import(/* webpackChunkName: "about" */ '../views/Map/MapChart.vue')
  }, {
    path: '/directive',
    name: 'Directive',
    title: 'Directive',
    component: () => import(/* webpackChunkName: "about" */ '../views/Directive/index.vue')
  }, {
    path: '/customComponent',
    name: 'CustomComponent',
    title: 'CustomComponent',
    component: () => import(/* webpackChunkName: "about" */ '../views/CustomComponent/index.vue')
  }
]

const router: Router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})
// @ts-ignore
router.beforeEach((this: T, to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext): void => {
  console.log(this, to, from, next)
  next()
})

export default router
