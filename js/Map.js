function getStringPos(data) {
  const newString = data.join(',')
  return newString
}
function getType () {
  return this.mapOption.event === 'pos' ? this._getSerializePos(this.markerPos) : this._getSerializePos(this.getNewPathData)
}
function analyzePos (fn) {
  if (this.mapOption.event === 'pos') {
    this.markerPos.forEach(el => {
      this.getPosition(el, fn)
    })
  } else {
    this.getNewPathData.flat().forEach(ele => {
      this.getPosition(ele, fn)
    })
  }
}class GetMap {
  constructor (option) {
    this.mapOption = Object.assign({}, option)
  }
  transform (data) {
    switch (this.mapOption.transMap) {
      case '0':
        return coordtransform.bd09togcj02(data[0], data[1]);
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
  static setOptions (options) {
    this.mapOption = Object.assign({}, options)
  }
  getPosSplit (position) {
    if (typeof position === 'string') {
      const datas = () => {
        let pos = position.split(',')
        let transData = []
        for (let index = 0; index < pos.length - 1; index += 2) {
          transData.push(this.transform(pos.slice(index, index + 2)))
        }
        return transData
      }
      return datas()
    }
  }
  _getSerializePos (data) {
    return getStringPos.call(this, data)
  }
  _SerializePos () {
    return getType.call(this)
  }
  _analyzePos(fn) {
    analyzePos.call(this, fn)
  }
  forMatePoly (data) {
    return data.reduce((init, ele, index) => {
      let newData = ele.map(el => {
        const longitude = el.longitude ? el.longitude : el.lng
        const latitude = el.latitude ? el.latitude : el.lat
        return this.transform([longitude, latitude])
      })
      init[index] = newData
      return init
    }, {})
  }
}

class GaoDe extends GetMap {
  constructor (props) {
    super(props)
    this.markerPos = null
    this.getNewPathData = null
  }
  createMarker (position) {
    position = this.getPosSplit(position)
    position.forEach(el => {
      console.log(el)
      let newPloy = new AMap.Marker({
        position: el,
        offset: new AMap.Pixel(0, -40)
      })
      this.mapOption.map.add(newPloy)
      this.mapOption.map.setFitView()
    })
    this.markerPos = position
  }
  getPosition(lnglat, fn) {
    AMap.plugin('AMap.Geocoder', function () {
      let geocoder = new AMap.Geocoder({
        // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
        city: '010'
      })
      geocoder.getAddress(lnglat, (status, result) => {
        if (status === 'complete' && result.regeocode) {
          var address = result.regeocode.formattedAddress
          fn(address)
        } else {
          throw new Error('根据经纬度查询地址失败')
        }
      })
    })
  }
  analyzePos (fn) {
    this._analyzePos(fn)
  }
  SerializePos () {
    return this._SerializePos()
  }
  clearMap () {
    this.mapOption.map.clearMap()
  }
  savePath (path) {
    this.getNewPathData = Object.values(this.forMatePoly(path))
    this.getNewPathData.forEach(path => {
      let polyGao = new AMap.Polyline({
        path
      })
      let mapGao = new AMap.OverlayGroup(polyGao)
      this.mapOption.map.add(mapGao)
      this.mapOption.map.setFitView()
    })
  }
  static getMap (option) {
    if (!GetMap.instance) {
      GetMap.instance = new GaoDe(option)
      return GetMap.instance
    }
    return GetMap.instance
  }
}

class BaiDu extends GetMap {
  constructor (props) {
    super(props)
    this.markerPos = null
    this.getNewPathData = null
  }
  createMarker (position) {
    position = this.getPosSplit(position)
    let point = new BMap.Point(position[0], position[1])
    this.markerPos = position
    let newMarker = new BMap.Marker(point)
    this.mapOption.map.centerAndZoom(point, 20)
    this.mapOption.map.addOverlay(newMarker)
  }
  savePath (path) {
    this.getNewPathData = Object.values(this.forMatePoly(path))
    const newPath = this.getNewPathData.map(element => {
      return element.map(ele => new BMap.Point(ele[0], ele[1]))
    })
    newPath.forEach(path => {
      let newPoly = new BMap.Polyline(path)
      this.mapOption.map.centerAndZoom(path[0], 16)
      this.mapOption.map.addOverlay(newPoly)
    })
  }
  clearMap () {
    this.mapOption.map.clearOverlays()
  }
  getPosition(lnglat, fn) {
    let gcj = new BMap.Geocoder()
    lnglat = Array.isArray(lnglat) ? lnglat : [lnglat]
    let point = new BMap.Point(lnglat[0], lnglat[1])
    gcj.getLocation(point, (result) => {
      if (result) fn(result.address)
    }, { poiRadius: 20 })
  }
  SerializePos () {
    return this._SerializePos()  
  } 
  analyzePos (fn) {
    this._analyzePos(fn)
  }
  static getMap (option) {
    if (!GetMap.instance) {
      GetMap.instance = new BaiDu(option)
      return GetMap.instance
    }
    return GetMap.instance
  }
}
