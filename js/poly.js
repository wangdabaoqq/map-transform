(() => {
  layui.use('form', function () {
    var form = layui.form;
    // var typeMap = '0'
    // console.log(this)
    var polyline
    const transform = (typeMap = '0', data) => {
      // console.log(data)
      switch (typeMap) {
        case '0':
          // console.log
          return coordtransform.bd09togcj02(data[0], data[1]);
        // console.log(numArrs)
        // break;
        case '1':
          return coordtransform.gcj02tobd09(data[0], data[1])
        // break
        case '2':
          return coordtransform.wgs84togcj02(data[0], data[1]);
        // break;
        case '3':
          return coordtransform.gcj02towgs84(data[0], data[1]);
        default:
          break;
      }
    }
    // form.on('select(aihao)', (data) => {
    //   // console.log(data)con
    //   console.log()
    //   window.typeMap = data.value
    // })
    form.on('submit(submitPoly)', function (data) {
      try {
        // console.log(d)
        // console.log(allkey)
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
        // allkey.forEach(el => {
        //   d[el].forEach(ele => {
        //     datas.push(transform(typeMap, [ele.longitude, ele.latitude]))
        //   })
        // })
        let newData = getData()
        // allkey.forEach(el => {
        //   d[el].forEach(ele => {
        //     datas.push(transform(typeMap, [ele.longitude, ele.latitude]))
        //   })
        // })
        // data.form[1].value = JSON.stringify(datas)
        polyline = new AMap.Polyline({
          // path: datas,
          isOutline: true,
          outlineColor: '#ffeeff',
          borderWeight: 3,
          strokeColor: "#3366FF",
          strokeOpacity: 1,
          strokeWeight: 6,
          // 折线样式还支持 'dashed'
          strokeStyle: "solid",
          // strokeStyle是dashed时有效
          // strokeDasharray: [10, 5],
          lineJoin: 'round',
          lineCap: 'round',
          zIndex: 50,
        })
        let aa = Object.values(newData)
        let getPoly = () => {
          return aa.map((element) => {
            console.log(element)
            let polyline = new AMap.Polyline({
              path: element,
              isOutline: true,
              outlineColor: '#ffeeff',
              borderWeight: 3,
              strokeColor: "#3366FF",
              strokeOpacity: 1,
              strokeWeight: 6,
              // 折线样式还支持 'dashed'
              strokeStyle: "solid",
              // strokeStyle是dashed时有效
              // strokeDasharray: [10, 5],
              lineJoin: 'round',
              lineCap: 'round',
              zIndex: 50,
            })
            // console.log(init)
            return polyline
            // init.push(polyline)
            // return init
          })
        }
        let polyData = getPoly()
        var getOverlay = new AMap.OverlayGroup(polyData)
        window.map.add(getOverlay)
        window.map.setFitView(polyData)
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
      console.log(data)
      if (polyline) {
        window.map.clearMap()
      }
      return false
    })
  })
})()