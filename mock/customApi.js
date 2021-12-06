module.exports = [
  {
    url: '/vue-custom-ui/tableData/list',
    type: 'post',
    response: () => {
      return {
        code: 20000,
        msg: '请求成功',
        data: [
          { key: 'PC', pv: 1024, forward: 1231, collect: 445, share: 12412, thumbs: 78 },
          { key: 'mobile', pv: 1024, forward: 4, collect: 55, share: 67, thumbs: 214324 },
          { key: 'ios', pv: 1024, forward: 23, collect: 123, share: 456, thumbs: 1233 },
          { key: 'android', pv: 1024, forward: 11, collect: 555, share: 3434, thumbs: 7878 }
        ]
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

