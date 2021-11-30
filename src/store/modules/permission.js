import {
  constantRoutes
} from '@/router'
import Layout from '@/layout'

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
        icon: menu.icon
      },
      name: menu.name,
      hidden: menu.hidden
    }
    if (menu.children && menu.children[0]) {
      router.children = getRouterByRemote(menu.children)
    }
    if (menu.menuType === 1) {
      const Arouter = {
        path: menu.link,
        component: Layout,
        name: menu.name,
        meta: {
          title: menu.name
        }
      }
      if (menu.children.length === 0) {
        // 表明是一个单个的页面
        router.path = 'index'
        Arouter.redirect = menu.link + '/index'
        let component = null
        try {
          component = () => Promise.resolve(require('@/custom-ui/pages' + menu.link).default)
        } catch (error) {
          console.log('---getRouterByRemote---', error)
        }
        router.component = component
        Arouter.alwaysShow = false
        Arouter.meta = {}
        Arouter.name = undefined
        Arouter.children = []
        Arouter.children.push(router)
      } else if (menu.children.length === 1) {
        // 目录，只有一个页面
        if (!Arouter.alwaysShow) {
          Arouter.alwaysShow = false
        }
        Arouter.children = router.children
      } else {
        if (!Arouter.alwaysShow) {
          Arouter.alwaysShow = true
        }
        Arouter.children = router.children
      }
      routers.push(Arouter)
    } else if (menu.menuType === 2) {
      // 这个是纯界面
      let component = null
      try {
        component = () => Promise.resolve(require('@/custom-ui/pages' + menu.link).default)
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
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
