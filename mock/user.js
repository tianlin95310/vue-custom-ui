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
    id: 20180126665722,
    parentId: 0,
    name: '首页',
    menuCode: '20180126665722',
    link: '/homes',
    index: 999,
    target: 'homes',
    icon: 'documentation',
    menuType: 1,
    children: []
  },
  {
    id: 20180126665724,
    parentId: 0,
    name: '网页设置',
    menuCode: '20180126665724',
    link: '/setting',
    index: 80,
    target: 'setting',
    icon: 'table',
    menuType: 1,
    children: [
      {
        id: 20180126665725,
        parentId: 20180126665724,
        name: '网页列表',
        menuCode: '20180126665724_ 20180126665725',
        link: '/setting/webList',
        index: 190,
        target: 'webList',
        icon: 'table',
        menuType: 2,
        children: []
      },
      {
        id: 20180126665725,
        parentId: 20180126665724,
        name: '新建/编辑',
        menuCode: '20180126665724_ 20180126665725',
        link: '/setting/edit',
        index: 190,
        target: 'edit',
        icon: '',
        menuType: 2,
        hidden: true,
        children: [
          {
            id: 20180126665786,
            parentId: 20180126665725,
            name: '导出按钮',
            menuCode: '20180126665724_ 20180126665725_ 20180126665786',
            link: 'export',
            index: 1,
            target: 'export',
            menuType: 3,
            children: []
          }
        ]
      }
    ]
  },
  {
    id: 20180126665724,
    parentId: 0,
    name: '用户设置',
    menuCode: '20180126665724',
    link: '/userSetting',
    index: 80,
    target: 'userSetting',
    icon: 'tree-table',
    menuType: 1,
    children: [
      {
        id: 20180126665725,
        parentId: 20180126665724,
        name: '设置',
        menuCode: '20180126665724_ 20180126665725',
        link: '/userSetting/setting',
        index: 190,
        target: 'setting',
        icon: 'tree',
        menuType: 2,
        children: []
      }
    ]
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
