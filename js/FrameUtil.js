(function (window) {
	window.FrameUtil = Class.extend({
		init: function () {
			this.currentFrame = 0;
			this.sTime = new Date();
			this.sFrame = 0;
			this.realFps = 0;
		},
		update: function () {
			var t = new Date();
			this.currentFrame++;
			if (t - this.sTime >= 1000) {
				// 每当时间做过一秒后，就将当前的帧数减去上一次的帧数，可以得到真实的帧率。
				this.realFps = this.currentFrame - this.sFrame;

				// 调增上一次时间和帧数为当前的时间和帧数。
				this.sTime = t;
				this.sFrame = this.currentFrame;
			}
		}
	});
})(window);