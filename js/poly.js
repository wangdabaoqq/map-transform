(() => {
  layui.use('form', function () {
    var form = layui.form;
    var typeMap = '0'
    var polyline
    const transform = (typeMap = '0', data) => {
      console.log(data)
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
    form.on('select(aihao)', (data) => {
			typeMap = data.value
		})
    form.on('submit(submitPoly)', function (data) {
      try {
      var polyVal = data.form[0].value
      let datas = []
      polyVal.split(';').forEach(el => {
        if (el !== '') {
          datas.push(transform(typeMap, el.split(',')))
        }
      })
      data.form[1].value = JSON.stringify(datas)
      polyline = new AMap.Polyline({
      path: datas,
      isOutline: true,
      outlineColor: '#ffeeff',
      borderWeight: 3,
      strokeColor: "#3366FF", 
      strokeOpacity: 1,
      strokeWeight: 6,
      // 折线样式还支持 'dashed'
      strokeStyle: "solid",
      // strokeStyle是dashed时有效
      strokeDasharray: [10, 5],
      lineJoin: 'round',
      lineCap: 'round',
      zIndex: 50,
      })
      // console.log
      polyline.setMap(window.map)
      map.setFitView([ polyline ])
      // // console.log(r)
      // console.log(result)
      // console.log(result.ssplit(','))
    } catch(e) {
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