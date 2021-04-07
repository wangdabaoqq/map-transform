'use strict'
;(() => {
  // 创建点坐标
  var map, jsapi
  window.mapOption = {
    transMap: '0',
    map: null,
    mapId: '0'
  }
  // 创建marker
  const createMarker = (position, data) => {
    if (+window.mapOption.mapId === 0) {
      // console.log(this, window)
      let newGao = new GaoDe(mapOption)
      newGao.createMarker(position)
      newGao.analyzePos((result) => {
        data.form[2].value = result
      })
      data.form[1].value = newGao.SerializePos()
    } else {
      let newBai = new BaiDu(mapOption)
      newBai.createMarker(position)
      newBai.analyzePos((result) => {
        data.form[2].value = result
      })
      data.form[1].value = newBai.SerializePos()
    }
  }
  // 清除覆盖物
  const clearMap = () => {
    if (+window.mapOption.mapId === 0) {
      console.log(111)
      let newGao = new GaoDe(window.mapOption)
      newGao.clearMap()
    } else {
      let newBai = BaiDu.getMap()
      newBai.clearMap()
    }
  }
  layui.use('form', function () {
    var form = layui.form
    form.on('select(map)', (data) => {
      removeMap()
      window.mapOption.mapId = data.value
      if (+data.value === 0) {
        initLoad('gaode')
      } else {
        initLoad('baidu')
      }
    })
    form.on('select(coord)', (data) => {
      window.mapOption.transMap = data.value
    })
    form.on('submit(demo1)', function (data) {
      try {
        let arrSlit = data.form[0].value
        if (arrSlit) {
          createMarker(arrSlit, data)
          return false
        }
      } catch (e) {
        layer.msg(e, {
          offset: 't',
          anim: 6
        })
        return false
      }
    })
    // 清除覆盖物
    form.on('submit(clearMap)', function (data) {
      try {
        clearMap()
      } catch (e) {
        layer.msg(e, {
          offset: 't',
          anim: 6
        })
        return false
      }
    })
    form.render()
  })

  initLoad('gaode')
  window.onLoad = function () {
    let map = new AMap.Map('container')
    window.mapOption.map = map
    jsapi.id = 'Gaode'
  }
  window.init = function () {
    let map = new BMap.Map('container')
    var point = new BMap.Point(116.404, 39.915) // 创建点坐标
    map.centerAndZoom(point, 15)
    map.enableScrollWheelZoom()
    window.mapOption.map = map
    jsapi.id = 'Baidu'
  }
  function initLoad(name) {
    var url
    if (name === 'gaode') {
      url =
        'https://webapi.amap.com/maps?v=1.4.15&key=9183c1c87d64f7f8454c8ce7b9199410&callback=onLoad'
    } else {
      // url = 'http://api.map.baidu.com/api?v=3.0&ak=zDYX28cey9auH2Yx0HO04MGUAZs34Pws'
      url =
        'https://api.map.baidu.com/api?v=2.0&ak=zDYX28cey9auH2Yx0HO04MGUAZs34Pws&callback=init'
    }
    jsapi = document.createElement('script')
    // jsapi.charset = 'utf-8';
    jsapi.src = url
    document.head.appendChild(jsapi)
  }
  var removeMap = () => {
    let baidu = document.getElementById('Baidu')
    let gaode = document.getElementById('Gaode')
    // console.log(gaode.parentNode)
    if (gaode) gaode.parentNode.removeChild(gaode)
    if (baidu) baidu.parentNode.removeChild(baidu)
  }
})()
