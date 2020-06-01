/**
 * 
 * 
 */
class BaseMap {
  getPosition () {
    return new Error('不要调用父级类')
  }
}
class Baidu extends BaseMap {
  constructor () {
    super()
  }
  getPosition (lnglat, fn) {
    // console.log(lnglat)
    // let point = BMap.Point(lnglat)
    // let point = new BMap.Point(lnglat[0], lnglat[1])

    let geoc = new BMap.Geocoder()
    geoc.getLocation(lnglat, (rs) => {
      // if (rs)
      console.log(rs)
      let addComp = rs.address
      fn(addComp)
		}, { poiRadius: 20 })
  }
}
class Gaode extends BaseMap {
  constructor () {
    super()
  }
  // getInstance () {
  //   if (!instance) {
  //     instance = new Gaode()
  //   }
  //   return instance
  // }
  getPosition (lnglat, fn) {
    lnglat = Array.isArray(lnglat) ? lnglat : [lnglat]
    AMap.plugin('AMap.Geocoder', function() {
			let geocoder = new AMap.Geocoder({
				// city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
				city: '010'
      })
			geocoder.getAddress(lnglat, (status, result) => {
				if (status === 'complete'&&result.regeocode) {
					var address = result.regeocode.formattedAddress;
					// console.log(address)
          // data.form[6].value = address
          fn(address)
					// document.getElementById('address').value = address;
				}else{
					throw new Error('根据经纬度查询地址失败')
				}
			})
		})
  }
}