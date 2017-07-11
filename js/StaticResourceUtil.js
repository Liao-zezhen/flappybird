(function (window) {
	window.StaticResourceUtil = Class.extend({
		init: function () {
			this.images = new Object;
		},
		loadImages: function (jsonURL, callback) {
			var self = this,
				xml = new XMLHttpRequest();
			xml.onreadystatechange = function () {
				var alreadyLoadNumber,
					jsonObj = null,
					image = null,
					i;
				if (this.readyState == 4) {
					if (this.status >= 200 && this.status < 300 || this.status == 304) {
						alreadyLoadNumber = 0;
						// 得到资源。
						jsonObj = JSON.parse(this.responseText);

						for (i = 0; i < jsonObj.images.length; i++) {
							// 遍历所得到的资源，分别生成图片对象。
							image = new Image();
							image.src = jsonObj.images[i].src;
							image.index = i;

							image.onload = function () {
								// 总计当前已加载了多少资源。
								alreadyLoadNumber++;
								// 将加载完成的图片资源存储起来并且执行回调函数。
								self.images[jsonObj.images[this.index].name] = this;
								callback(alreadyLoadNumber, jsonObj.images.length, self.images);
							};

						}
					}
				}
			};
			// 异步发送一个请求。
			xml.open('get', jsonURL, true);
			xml.send(null);
		}
	});
})(window);