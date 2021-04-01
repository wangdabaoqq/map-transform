
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