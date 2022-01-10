const Mock = require('mockjs')

const data = [
  { key: 'Windows', pv: 1024, forward: 11, collect: 555, share: 3434, thumbs: 7878 },
  { key: 'Mac', pv: 1024, forward: 11, collect: 555, share: 3434, thumbs: 7878 },
  { key: 'Linux', pv: 1024, forward: 11, collect: 555, share: 3434, thumbs: 7878 },
  { key: 'Unix', pv: 1024, forward: 11, collect: 555, share: 3434, thumbs: 7878 },
  { key: 'PC', pv: 1024, forward: 1231, collect: 445, share: 12412, thumbs: 78 },
  { key: 'Mobile', pv: 1024, forward: 4, collect: 55, share: 67, thumbs: 214324 },
  { key: 'Android', pv: 1024, forward: 11, collect: 555, share: 3434, thumbs: 7878 },
  { key: 'Ios', pv: 1024, forward: 23, collect: 123, share: 456, thumbs: 1233 },
  { key: 'Win Phone', pv: 1024, forward: 11, collect: 555, share: 3434, thumbs: 7878 },
  { key: 'Chrome', pv: 1024, forward: 11, collect: 555, share: 3434, thumbs: 7878 }
]

module.exports = [
  {
    url: '/vue-custom-ui/tableData/list',
    type: 'post',
    response: (config) => {
      // let { username } = config.body
      // username = username ?? ''
      data.forEach(item => {
        item.pv = Mock.mock('@integer(300, 5000)')
        item.forward = Mock.mock('@integer(300, 5000)')
        item.collect = Mock.mock('@integer(300, 5000)')
        item.share = Mock.mock('@integer(300, 5000)')
        item.thumbs = Mock.mock('@integer(300, 5000)')
      })
      return {
        code: 20000,
        msg: '请求成功',
        data: data
      }
    }
  },
  {
    url: '/vue-custom-ui/tableData/delete',
    type: 'post',
    response: (config) => {
      let { key } = config.body
      key = key ?? ''
      let di = -1
      data.forEach((item, index) => {
        if (key === item.key) {
          di = index
        }
      })
      if (di !== -1) {
        data.splice(di, 1)
        return {
          code: 20000,
          msg: '删除' + key + '成功',
          data: ''
        }
      } else {
        return {
          code: 20000,
          msg: '删除失败，没有匹配到' + key,
          data: ''
        }
      }
    }
  },
  {
    url: '/vue-custom-ui/business/list',
    type: 'post',
    response: () => {
      return {
        code: 20000,
        msg: '请求成功',
        data: [
          {
            label: '站内视频',
            value: 'inner'
          },
          {
            label: '站外视频',
            value: 'outer'
          }
        ]
      }
    }
  }
]

