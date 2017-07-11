(function (window) {
	window.ScoreManager = Class.extend({
		init: function () {
			this.score = 0;
		},
		addPoint: function () {
			this.score++;
		},
		render: function () {
			var amount = this.score.toString().length;
			// 根据分数的位数，分别绘制数字。
			for (var i = 0; i < amount; i++) {
				numberRender(this.score.toString().charAt(i), i * 40 + (game.canvas.width - amount * 40) / 2, 30);
			}
		}
	});
	// 绘制单位数的数字的方法。
	function numberRender(num, x, y) {
		game.ctx.drawImage(game.images.number, num * 40, 0, 40, 57, x, y, 40, 57);
	}
})(window);