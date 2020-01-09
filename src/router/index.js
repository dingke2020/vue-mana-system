import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Login from '@/views/Login'
import Platform from '@/views/Platform'
import Comprehensive from '@/views/Board'
import ProductionProgress from '@/views/Board/Production'
import EquipmentOperation from '@/views/Board/Equipment'
import MachineOperation from '@/views/Board/EquipmentCopy'
import Home from '@/views/Home'
import Task from '@/views/Task/Index'
import Production from '@/views/Production/Index'
import Maintenance from '@/views/Maintenance/Index'
import api from '@/http/api'
import store from '@/store'
import { getIFramePath, getIFrameUrl } from '@/utils/iframe'
// import ConfigurationRoute from '@/views/Configuration/Route'
// import navTree from './navTree'

// function formatNavTreeData(navTree, _routers) {
//   const routers = _routers || [];
//   for(let i=0; i<navTree.length; i++) {
//     navTree[i].url = navTree[i].url.replace(/^\//, '')
//     const route = {
//       path: navTree[i].url,
//       component: null,
//       name: navTree[i].name,
//       meta: {
//         icon: '',
//         index: navTree[i].id
//       },
//     }
//     let hasChildren = false;
//     if(Array.isArray(navTree[i].children)) {
//       const childrenRouters = formatNavTreeData(navTree[i].children, []);
//       if (childrenRouters && childrenRouters.length > 0) {
//         route.children = childrenRouters;
//         hasChildren = true;
//       }
//     }
//     let array = navTree[i].url.split('/')
//     let url = ''
//     for(let i=0; i<array.length; i++) {
//       url += array[i].substring(0,1).toUpperCase() + array[i].substring(1) + '/'
//     }
//     url = url.substring(0, url.length - 1)
//     if (!hasChildren) {
//       route['component'] = resolve => require([`@/views/${url}`], resolve)
//     }
//     routers.push(route);
//   }
//   return routers
// }

// // 保存加载状态
// store.commit('menuRouteLoaded', true)
// // 保存菜单树
// store.commit('setNavTree', navTree)
// const routerFromNavTree = formatNavTreeData(navTree);
// debugger;

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: '首页',
      component: Home,
      
      children: [
        { 
          // alias:'',
          path: '', 
          redirect:'/task/index',
          name: '任务管理', 
          component: Task,
          // meta: {
          //   icon: 'iconfont icon-ali-home',
          //   index: 0
          // }
        },
        // ...routerFromNavTree,
      ]
    },
    {
      path: '/login',
      name: '登录',
      component: Login
    },
    {
      path: '/platform/index',
      name: '查看工单',
      component: Platform
    },
    {
      path: '/board/index',
      name: '综合信息看板',
      component: Comprehensive
    },
    {
      path: '/board/production',
      name: '生产进度看板',
      component: ProductionProgress
    },
    {
      path: '/board/equipment',
      name: '设备运行监测',
      component: EquipmentOperation
    },
    {
      path: '/board/machine',
      name: '注塑机运行监测',
      component: MachineOperation
    }
    // {
    //   path: '/Configuration/Route',
    //   name: '工艺路线',
    //   component: ConfigurationRoute
    // }
  ]
  
})




// export function fetchRoute(userName, to) {
//   // 处理IFrame嵌套页面
//   handleIFrameUrl(to.path)
//   if(store.state.app.menuRouteLoaded) {
//     console.log('动态菜单和路由已经存在.')
//     return
//   }
//   console.log(api);
//   return api.menu.findNavTree()
//   .then(res => {
//     // const router = new Router({
//     //   routes: [
//     //     {
//     //       path: '/',
//     //       name: '首页',
//     //       component: Home,
          
//     //       children: [
//     //         { 
//     //           // alias:'',
//     //           path: '', 
//     //           redirect:'/task/index',
//     //           name: '任务管理', 
//     //           component: Task,
//     //           // meta: {
//     //           //   icon: 'iconfont icon-ali-home',
//     //           //   index: 0
//     //           // }
//     //         }
//     //       ]
//     //     },
//     //     {
//     //       path: '/login',
//     //       name: '登录',
//     //       component: Login
//     //     },
//     //     {
//     //       path: '/platform/index',
//     //       name: '查看工单',
//     //       component: Platform
//     //     },
//     //     // {
//     //     //   path: '/Configuration/Route',
//     //     //   name: '工艺路线',
//     //     //   component: ConfigurationRoute
//     //     // }
//     //   ]
      
//     // })
//     console.log(res)
//     // 添加动态路由
//     let dynamicRoutes = addDynamicRoutes(res.data.data)
//     // 处理静态组件绑定路由
//     handleStaticComponent(router, dynamicRoutes)
//     console.log('~#@$#!$#@$#@$#@', router.options.routes);
//     router.addRoutes(router.options.routes)
//     // 保存加载状态
//     store.commit('menuRouteLoaded', true)
//     // 保存菜单树
//     store.commit('setNavTree', res.data.data)
//     return router;
//   })
// }

// !(function handleMenus(userName, to){
//   // 处理IFrame嵌套页面
//   handleIFrameUrl(to.path)
//   if(store.state.app.menuRouteLoaded) {
//     console.log('动态菜单和路由已经存在.')
//     return
//   }
//   console.log(api);
//   // 添加动态路由
//   let dynamicRoutes = addDynamicRoutes(navTree);
//   // 处理静态组件绑定路由
//   handleStaticComponent(router, dynamicRoutes)
//   console.log('~#@$#!$#@$#@$#@', router.options.routes);
//   router.addRoutes(router.options.routes)
//   // 保存加载状态
//   store.commit('menuRouteLoaded', true)
//   // 保存菜单树
//   store.commit('setNavTree', navTree)
// })('','/');


addDynamicMenuAndRoutes('','/');

/**
* 加载动态菜单和路由
*/
function addDynamicMenuAndRoutes(userName, to) {
  // 处理IFrame嵌套页面
  handleIFrameUrl(to.path)
  console.log(to.path);
  if(store.state.app.menuRouteLoaded) {
    console.log('动态菜单和路由已经存在.')
    return
  }
  console.log(api);
  api.menu.findNavTree()
  .then(res => {
    console.log(res)
    // 添加动态路由
    let dynamicRoutes = addDynamicRoutes(res.data.data)
    // 处理静态组件绑定路由
    handleStaticComponent(router, dynamicRoutes)
    console.log(router)
    // console.log('~#@$#!$#@$#@$#@', router.options.routes);
    router.addRoutes(router.options.routes)
    // 保存加载状态
    store.commit('menuRouteLoaded', true)
    // 保存菜单树
    store.commit('setNavTree', res.data.data)
  }).then(res => {
    // store.commit('setPerms', res.data)
  })
  .catch(function(res) {
  })
}

/**
 * 处理路由到本地直接指定页面组件的情况
 * 比如'代码生成'是要求直接绑定到'Generator'页面组件
 */
function handleStaticComponent(router, dynamicRoutes) {
  for(let j=0;j<dynamicRoutes.length; j++) {
    if(dynamicRoutes[j].name == '代码生成') {
      dynamicRoutes[j].component = Generator
      break
    }
  }
  router.options.routes[0].children = router.options.routes[0].children.concat(dynamicRoutes)
}

/**
 * 处理IFrame嵌套页面
 */
function handleIFrameUrl(path) {
  // 嵌套页面，保存iframeUrl到store，供IFrame组件读取展示
  let url = path
  let length = store.state.iframe.iframeUrls.length
  for(let i=0; i<length; i++) {
    let iframe = store.state.iframe.iframeUrls[i]
    if(path != null && path.endsWith(iframe.path)) {
      url = iframe.url
      store.commit('setIFrameUrl', url)
      break
    }
  }
}

/**
* 添加动态(菜单)路由
* @param {*} menuList 菜单列表
* @param {*} routes 递归创建的动态(菜单)路由
*/
function addDynamicRoutes (menuList = [], routes = []) {
 var temp = []
 for (var i = 0; i < menuList.length; i++) {
   if (menuList[i].children && menuList[i].children.length >= 1) {
     temp = temp.concat(menuList[i].children)
   } else if (menuList[i].url && /\S/.test(menuList[i].url)) {
      menuList[i].url = menuList[i].url.replace(/^\//, '')
      // 创建路由配置
      var route = {
        path: menuList[i].url,
        component: null,
        name: menuList[i].name,
        meta: {
          icon: '',
          index: menuList[i].id
        }
      }
      let path = getIFramePath(menuList[i].url)
      if (path) {
        // 如果是嵌套页面, 通过iframe展示
        route['path'] = path
        route['component'] = resolve => require([`@/views/IFrame/IFrame`], resolve)
        // 存储嵌套页面路由路径和访问URL
        let url = getIFrameUrl(menuList[i].url)
        let iFrameUrl = {'path':path, 'url':url}
        store.commit('addIFrameUrl', iFrameUrl)
      } else {
       try {
         // 根据菜单URL动态加载vue组件，这里要求vue组件须按照url路径存储
         // 如url="sys/user"，则组件路径应是"@/views/Sys/User.vue",否则组件加载不到
         let array = menuList[i].url.split('/')
         let url = ''
         for(let i=0; i<array.length; i++) {
            url += array[i].substring(0,1).toUpperCase() + array[i].substring(1) + '/'
         }
         url = url.substring(0, url.length - 1)
         route['component'] = resolve => require([`@/views/${url}`], resolve)
       } catch (e) {}
     }
     routes.push(route)
   }
 }
 if (temp.length >= 1) {
   addDynamicRoutes(temp, routes)
 } else {
   console.log('动态路由加载...')
   console.log(routes)
   console.log('动态路由加载完成.')
 }
 return routes
}

export default router