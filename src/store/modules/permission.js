import {
  constantRoutes
} from '@/router'
import Layout from '@/layout'
import LayoutCustom from '@/custom-ui/layout'
/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return false
  }
}

/**
 * menuType = 1，是目录或者单个的页面
 * menuType = 2，这是一个页面
 * @param menus
 * @returns {*[]}
 */
function getRouterByRemote(menus) {
  const routers = []
  menus.forEach(menu => {
    const router = {
      path: menu.link,
      meta: {
        title: menu.name,
        icon: menu.icon,
        noCache: menu.noCache !== false,
        id: menu.id,
        pid: menu.pid
      },
      name: menu.name,
      hidden: menu.hidden,
      redirect: menu.redirect,
      container: menu.container
    }
    if (menu.children && menu.children[0]) {
      router.children = getRouterByRemote(menu.children)
    }
    if (menu.menuType === 1) {
      if (menu.children.length === 0) {
        // 表明是一个单个的页面
        let component = null
        try {
          component = () => Promise.resolve(require('@/custom-ui/pages' + menu.target).default)
        } catch (error) {
          console.log('---getRouterByRemote---', error)
        }
        router.component = component
      } else {
        router.alwaysShow = true
      }
      routers.push(router)
    } else if (menu.menuType === 2) {
      // 这个是纯界面
      let component = null
      try {
        component = () => Promise.resolve(require('@/custom-ui/pages' + menu.target).default)
      } catch (error) {
        console.log('---getRouterByRemote---', error)
      }
      router.component = component
      if (router.children) {
        router.buttonPers = router.children.map(item => {
          return { permission: item.buttonPer, title: item.name }
        })
        router.children = undefined
      }
      routers.push(router)
    } else if (menu.menuType === 3) {
      // 这个是纯按钮
      router.buttonPer = menu.link
      routers.push(router)
    }
  })
  return routers
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = {
      ...route
    }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}
function get2DRouters(menus) {
  const routers = makeMenusTo2D(menus)
  return routers.map(item => {
    return {
      component: item.container ? LayoutCustom : Layout,
      path: item.path,
      redirect: item.redirect,
      children: [
        item
      ]
    }
  })
}
function makeMenusTo2D(routers) {
  let ROUTERS = []
  routers.forEach(item => {
    if (item.children) {
      ROUTERS.push({
        component: item.component,
        path: item.path,
        redirect: item.redirect
      })
      ROUTERS = ROUTERS.concat(makeMenusTo2D(item.children))
    } else {
      ROUTERS.push(item)
    }
  })
  return ROUTERS
}
const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({
    commit
  }, menus) {
    return new Promise(resolve => {
      // accessedRoutes = filterAsyncRoutes(asyncRoutes, menus)
      const accessedRoutes = getRouterByRemote(menus)
      console.log('---accessedRoutes---路由', accessedRoutes)
      // 路由无法匹配走404
      accessedRoutes.push({ path: '*', redirect: '/404', hidden: true })
      // 多维路由二维处理
      const tdRouters = get2DRouters(accessedRoutes)
      console.log('---accessedRoutes---路由', accessedRoutes, tdRouters)
      commit('SET_ROUTES', accessedRoutes)
      resolve(tdRouters)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
