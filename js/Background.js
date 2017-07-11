(function (window) {
	window.Background = Class.extend({
		init: function (params) {
			this.image = params.image;
			this.width = params.width;
			this.height = params.height;
			this.x = params.x;
			this.y = params.y;
			this.speed = params.speed;

			// 满足平铺的个数。
			this.amount = Math.ceil(game.canvas.width / this.width);
		},
		update: function () {
			this.x -= this.speed;
			// 到达第一次平铺的临界点后，将x值归零，实现无缝滚动。
			if (this.x <= -this.amount * this.width) {
				this.x = 0;
			}
		},
		render: function () {
			// 为了实现无缝滚动的背景，平铺两次。
			for (var i = 0; i < this.amount * 2; i++) {
				game.ctx.drawImage(this.image, 0, 0, this.width, this.height, this.x + this.width * i, this.y, this.width, this.height);
			}
		},
		pause: function () {
			this.speed = 0;
		}
	});
})(window);