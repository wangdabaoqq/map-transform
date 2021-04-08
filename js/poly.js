;(() => {
  layui.use('form', function () {
    var form = layui.form
    form.on('submit(submitPoly)', function (data) {
      try {
        var polyVal = data.form[0].value
        let newKeys = JSON.parse(polyVal)
        let newVal = Object.values(newKeys)
        if (+window.mapOption.mapId === 0) {
          let posText = ''
          let newGao = new GaoDe(window.mapOption)
          newGao.savePath(newVal)
          newGao.analyzePos(result => {
            posText += `${result},`
            data.form['get'].value = posText.substring(0, posText.length - 1)
          })
          data.form['string'].value = newGao.SerializePos()
        } else {
          let newBai = new BaiDu(window.mapOption)
          newBai.savePath(newVal)
        }
      } catch (e) {
        layer.msg(e, {
          offset: 't',
          anim: 6
        })
      }
      return false
      // form.render();
    })
    form.on('submit(clearMap)', function (data) {
      if (+window.mapOption.mapId === 0) {
        let newGao = new GaoDe(window.mapOption)
        newGao.clearMap()
      } else {
        let newBai = new BaiDu(window.mapOption)
        newBai.clearMap()
      }
      return false
    })
  })
})()
