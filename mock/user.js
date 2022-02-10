const tokens = {
  admin: {
    token: 'admin-token'
  },
  editor: {
    token: 'editor-token'
  }
}
/*eslint-disable*/
const menus = [
  {
    name: '首页',
    link: '/homes',
    target: '/homes',
    icon: 'documentation',
    menuType: 1,
    children: []
  },
  {
    name: '网页设置',
    link: '/setting',
    target: '/setting',
    icon: 'table',
    menuType: 1,
    children: [
      {
        name: '网页列表',
        link: '/setting/webList',
        target: '/setting/webList',
        icon: 'table',
        menuType: 2,
        children: []
      },
      {
        name: '新建/编辑',
        link: '/setting/edit',
        target: '/setting/edit',
        icon: '',
        menuType: 2,
        hidden: true,
        children: [
          {
            name: '导出按钮',
            link: 'export',
            target: 'export',
            menuType: 3,
            children: []
          }
        ]
      }
    ]
  },
  {
    name: '用户设置',
    link: '/userSetting',
    target: '/userSetting',
    icon: 'tree-table',
    menuType: 1,
    children: [
      {
        name: '设置',
        link: '/userSetting/setting',
        target: '/userSetting/setting',
        icon: 'tree',
        menuType: 2,
        children: []
      },
      {
        name: '二级目录',
        link: '/userSetting/second',
        target: '/userSetting/second',
        icon: 'tree',
        menuType: 1,
        children: [
          {
            name: '设置1',
            link: '/userSetting/second/setting1',
            target: '/secondD/setting1',
            menuType: 2,
            keepAliveName: 'Setting1',
            children: []
          },
          {
            name: '设置2',
            link: '/userSetting/second/setting2',
            target: '/secondD/setting2',
            menuType: 2,
            keepAliveName: 'Setting2',
            children: []
          }
        ]
      }
    ]
  },
  {
    name: '预览',
    link: '/setting/overview',
    target: '/setting/overview',
    icon: 'table',
    menuType: 1,
    hidden: true,
    container: 'custom',
    children: []
  }
]
const users = {
  'admin-token': {
    roles: ['admin'],
    introduction: 'I am a super administrator',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Super Admin',
    menus: menus
  },
  'editor-token': {
    roles: ['editor'],
    introduction: 'I am an editor',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Normal Editor',
    menus: []
  }
}

module.exports = [
  // user login
  {
    url: '/vue-element-admin/user/login',
    type: 'post',
    response: config => {
      const { username } = config.body
      const token = tokens[username]

      // mock error
      if (!token) {
        return {
          code: 60204,
          message: 'Account and password are incorrect.'
        }
      }

      return {
        code: 20000,
        data: token
      }
    }
  },

  // get user info
  {
    url: '/vue-element-admin/user/info\.*',
    type: 'get',
    response: config => {
      const { token } = config.query
      const info = users[token]

      // mock error
      if (!info) {
        return {
          code: 50008,
          message: 'Login failed, unable to get user details.'
        }
      }

      return {
        code: 20000,
        data: info
      }
    }
  },

  // user logout
  {
    url: '/vue-element-admin/user/logout',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]
