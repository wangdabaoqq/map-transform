'use strict';
(() => {
	// 创建点坐标
	var marker
	var typeMap = '0'
	var mapVal = '0'
	let createMarker = (position) => {
		if (marker && +mapVal === 0) {
			map.remove(marker)
		}
		if (marker && +mapVal === 1) {
			map.removeOverlay(marker)
		}
		if (+mapVal === 0) {
			marker = new AMap.Marker({
				position
			});
			map.add(marker);
			map.setFitView()
		} else {
			var point = new BMap.Point(position[0], position[1]);
			marker = new BMap.Marker(point)
			map.centerAndZoom(point, 20);
			map.addOverlay(marker)
		}
	}
	let position = async (lnglat, data) => {
		console.log(mapVal)
		if (+mapVal === 0) {
			var GaoMap = new Gaode()
		await GaoMap.getPosition(lnglat, (result) => {
				data.form[2].value = result
			})
		}
		if (+mapVal === 1) {
			var BaiMap = new Baidu()
			let point = new BMap.Point(lnglat[0], lnglat[1])
			// map.centerAndZoom(point, 22)
			await BaiMap.getPosition(point, (result) => {
				data.form[2].value = result
			})
		}
	}
	layui.use('form', function () {
		// console.log(layui.form)
		var form = layui.form; //只有执行了这一步，部分表单元素才会自动修饰成功
		form.on('select(map)', (data) => {
			removeMap()
			mapVal = data.value
			if (+data.value === 0) {
				initLoad('gaode')
			} else {
				initLoad('baidu')
			}
		});
		form.on('select(aihao)', (data) => {
			typeMap = data.value
		})
		form.on('submit(demo1)', function (data) {
			try {
			let arrSlit = data.form[0].value
			// console.log(arrSlit)
			let result = ''
			if (arrSlit) {
				arrSlit = arrSlit.split(',')
				// console.log(arrSlit)
				var numArr = []
				switch (typeMap) {
					case '0':
						// console.log
						numArr = coordtransform.bd09togcj02(arrSlit[0], arrSlit[1]);
						// console.log(numArrs)
						break;
					case '1':
						numArr = coordtransform.gcj02tobd09(arrSlit[0], arrSlit[1])
						break
					case '2':
						numArr = coordtransform.wgs84togcj02(arrSlit[0], arrSlit[1]);
						break;
					case '3':
						numArr = coordtransform.gcj02towgs84(arrSlit[0], arrSlit[1]);
					default:
						break;
				}
				numArr.forEach(element => {
					result += element + ','
					// console.log(element)
				});
				result = result.substring(0, result.length - 1)
				console.log(result)
				data.form[1].value = result
				position(numArr, data)
				createMarker(numArr)
			}
		}catch (e) {
			layer.msg(e, {
        offset: 't',
        anim: 6
      });
		}
			return false
		});
		form.render();
	});

	var map, jsapi
	initLoad('gaode')
	window.onLoad = function () {
		// if (name === 'gaode') {
		window.map = new AMap.Map('container');
		jsapi.id = "Gaode"
	}
	window.init = function () {
		map = new BMap.Map("container")
		var point = new BMap.Point(116.404, 39.915); // 创建点坐标
		map.centerAndZoom(point, 15);
		map.enableScrollWheelZoom();
		jsapi.id = "Baidu"
	}
	function initLoad(name) {
		var url
		if (name === 'gaode') {
			url = 'https://webapi.amap.com/maps?v=1.4.15&key=9183c1c87d64f7f8454c8ce7b9199410&callback=onLoad';
		} else {
			// url = 'http://api.map.baidu.com/api?v=3.0&ak=zDYX28cey9auH2Yx0HO04MGUAZs34Pws'
			url = 'https://api.map.baidu.com/api?v=2.0&ak=zDYX28cey9auH2Yx0HO04MGUAZs34Pws&callback=init'
		}
		// var url = 'https://webapi.amap.com/maps?v=1.4.15&key=9183c1c87d64f7f8454c8ce7b9199410&callback=onLoad';
		jsapi = document.createElement('script');
		jsapi.charset = 'utf-8';
		jsapi.src = url;
		document.head.appendChild(jsapi);
	}
	var removeMap = () => {
		let baidu = document.getElementById('Baidu')
		let gaode = document.getElementById('Gaode')
		// console.log(gaode.parentNode)
		if (gaode) gaode.parentNode.removeChild(gaode)
		if (baidu) baidu.parentNode.removeChild(baidu)
	}
})()
