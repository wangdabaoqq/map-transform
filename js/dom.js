'use strict'
;(() => {
  class domShow {
    constructor(pos, poly) {
      this.getPos = pos
      this.getPoly = poly
    }
    init() {
      this.getPos.style.display = 'block'
      this.getPoly.style.display = 'none'
    }
    change() {
      this.getPos.style.display = 'none'
      this.getPoly.style.display = 'block'
    }
  }
  var getPos = document.querySelector('#position')
  var getPoly = document.querySelector('#poly')
  // console.log(domShow)
  let result = new domShow(getPos, getPoly)
  result.init()
  layui.use('form', function () {
    var form = layui.form
    form.on('radio(check)', function (data) {
      if (data.value === 'pos') {
        result.init()
      } else {
        getPos.style.display = 'none'
        getPoly.style.display = 'block'
      }
    })
  })
})()
