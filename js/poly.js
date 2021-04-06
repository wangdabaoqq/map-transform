
(() => {
  // class GetPloy {
  //   constructor () {
      
  //   }
  //   get
  // }
  layui.use('form', function () {
    var form = layui.form;
    var mapGao, mapBai
    const map = () => {
      let getPoly = (data) => {
        data.forEach((element) => {
          window.mapVal === '0' ? getMapGao(element)
             : getMapBai(element)
        })
      }
      let getMapGao = (path) => {
        let polyGao = new AMap.Polyline({
          path
        })
        // console.log(polyGao)
        mapGao = new AMap.OverlayGroup(polyGao)
        window.map.add(mapGao)
        window.map.setFitView()
      }
      let getMapBai = (path) => {
        // console.log(path)
        const getPath = path.reduce((init, element) => {
          let newPoint = new BMap.Point(element[0], element[1])
          init.push(newPoint)
          return init
        }, [])
        mapBai = new BMap.Polyline(getPath)
        window.map.centerAndZoom(getPath[0], 16)
        window.map.addOverlay(mapBai)
      }
      return {
        getPoly
      }
    }
    form.on('submit(submitPoly)', function (data) {
      try {
        var polyVal = data.form[0].value
        let newKeys = JSON.parse(polyVal)
        // console.log(JSON.parse(polyVal))
        let newVal = Object.values(newKeys)
        var flatData = newVal
        // let datas = []
        // console.log(newVal.flat())
        // polyVal.split(';').forEach(el => {
        //   if (el !== '') {
        //     datas.push(transform(typeMap, el.split(',')))
        //   }
        // })
        // flatData.reduce(el => {
        //   conso
        //   datas.push(transform(typeMap, [el.longitude, el.latitude]))
        // }, [])
        const getData = () => {
          return flatData.reduce((init, ele, index) => {
            // console.log(init, ele)
            let ddd = ele.map(el => transform(window.typeMap, [el.longitude, el.latitude]))
            // init.push(transform(typeMap, [ele.longitude, ele.latitude]))
              // init[index].push((transform(typeMap, [ele.longitude, ele.latitude]))
            init[index] = ddd
            return init
            // return init
          }, {})
        }
        let newData = getData()
        let aa = Object.values(newData)
        let getMap = map()
        // console.log(getMap)
        getMap.getPoly(aa)
        // let polyData = getPoly()
        // var getOverlay = window.typeMap === '0' ? new AMap.OverlayGroup(polyData) : new Panorama.addOverlay()
        // window.map.add(getOverlay)
        // window.map.setFitView(polyData)
      } catch (e) {
        layer.msg(e, {
          offset: 't',
          anim: 6
        });
      }
      return false;
      // form.render();
    });
    form.on('submit(clearMap)', function (data) {
      if (mapGao) {
        window.map.clearMap()
      }
      console.log(mapBai)
      if (mapBai) {
        console.log(1111)
        window.map.clearOverlays()
      }
      return false
    })
  })
})()