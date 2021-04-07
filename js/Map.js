function getStringPos() {
  // return this.snaf = baz;
  const newString = this.markerPos.join(',')
  return newString
}

class GetMap {
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
    // console.log(this.mapOption)
  }
  getPosSplit (position) {
    if (typeof position === 'string') {
      let pos = position.split(',')
      position = this.transform(pos)
    }
    return position
  }
  _getSerializePos () {
    return getStringPos.call(this)
  }
  forMatePoly (data) {
    return data.reduce((init, ele, index) => {
      let newData = ele.map(el => { 
        const longitude = el.longitude ? ele.longitude : ele.lng
        const latitude = el.latitude ? ele.latitude : ele.lat
        return this.transform([longitude, latitude])
      })
      init[index] = newData
      return init
      // return init
    }, {})
  }
}

class GaoDe extends GetMap {
  constructor (props) {
    super(props)
    this.polyGao = null
    this.markerGao = null
    this.markerPos = null
  }
  createMarker (position) {
    position = this.getPosSplit(position)
    this.markerGao = new AMap.Marker({
      position,
      offset: new AMap.Pixel(0, -40)
    })
    this.markerPos = position
    this.mapOption.map.add(this.markerGao)
    this.mapOption.map.setFitView()
  }
  getPosition(lnglat, fn) {
    lnglat = Array.isArray(lnglat) ? lnglat : [lnglat]
    AMap.plugin('AMap.Geocoder', function () {
      let geocoder = new AMap.Geocoder({
        // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
        city: '010'
      })
      geocoder.getAddress(lnglat, (status, result) => {
        if (status === 'complete' && result.regeocode) {
          var address = result.regeocode.formattedAddress;
          // console.log(address)
          // data.form[6].value = address
          fn(address)
          // document.getElementById('address').value = address;
        } else {
          throw new Error('根据经纬度查询地址失败')
        }
      })
    })
  }
  analyzePos (fn) {
    this.getPosition(this.markerPos, fn)
  }
  SerializePos () {
    return this._getSerializePos()
  } 
  // savePath (path) {
  //   let polyGao = new AMap.Polyline({
  //     path
  //   })
  //   this.polyGao = new AMap.OverlayGroup(polyGao)
  //   this.mapOption.map.add(this.polyGao)
  //   this.mapOption.map.setFitView()
  // }
  clearMap () {
    this.mapOption.map.clearMap()
  }
  savePath (path) {
    let getData = Object.values(this.forMatePoly(path))
    getData.forEach(path => {
      let polyGao = new AMap.Polyline({
        path
      })
      // console.log(polyGao)
      let mapGao = new AMap.OverlayGroup(polyGao)
      this.mapOption.map.add(mapGao)
      this.mapOption.map.setFitView()
    })
  }
  static getMap (option) {
    // console.log(option)
    if (!GetMap.instance) {
      GetMap.instance = new GaoDe(option)
      return GetMap.instance
    }
    console.log(GetMap.instance)
    return GetMap.instance
  }
}

class BaiDu extends GetMap {
  constructor (props) {
    super(props)
    this.polyBai = null
    this.markerBai = null
    this.markerPos = null
  }
  createMarker (position) {
    position = this.getPosSplit(position)
    let point = new BMap.Point(position[0], position[1])
    this.markerPos = position
    this.markerBai = new BMap.Marker(point)
    this.mapOption.map.centerAndZoom(point, 20)
    this.mapOption.map.addOverlay(this.markerBai)
  }
  savePath (path) {
    // console.log(this.forMatePoly(path))
    let getData = Object.values(this.forMatePoly(path))
    const newPath = getData.map(element => {
      return element.map(ele => new BMap.Point(ele[0], ele[1]))
    })
    newPath.forEach(path => {
      this.polyBai = new BMap.Polyline(path)
      this.mapOption.map.centerAndZoom(path[0], 16)
      this.mapOption.map.addOverlay(this.polyBai)
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
    return this._getSerializePos()
  } 
  analyzePos (fn) {
    this.getPosition(this.markerPos, fn)
  }
  static getMap (option) {
    if (!GetMap.instance) {
      GetMap.instance = new BaiDu(option)
      return GetMap.instance
    }
    return GetMap.instance
  }
}
