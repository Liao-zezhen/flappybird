(function (window) {
	window.Pipe = Class.extend({
		init: function () {
			// 随机方位
			this.state = _.random(0, 1);
			this.width = 148;
			// 随机高度
			this.height = _.random(100, game.canvas.height / 2);

			this.x = game.canvas.width;
			this.y = this.state ? 0 : game.canvas.height - this.height - 48;
			this.sliceY = this.state ? 1664 - this.height : 0;
			this.speed = 3;
		},
		update: function () {
			if (game.end) {
				// 如果游戏失败时，不再重绘管道。
				return;
			}
			this.x -= this.speed;
			// 当管道从画布中离开时，将画布从数组中删除。
			if (this.x <= -this.width) {
				game.pipeArray = _.without(game.pipeArray, this);
			}

			// 判断鸟类是否进入当前管道范围。
			if (game.bird.x >= this.x - game.bird.width && game.bird.x <= this.x + this.width) {
				if (this.state == 0) { // 判断是否碰撞到下面的管道。
					if (game.bird.y >= this.y - game.bird.height + 5) {
						game.gameover();
						return;
					}
				} else if (this.state == 1) { // 判断是否碰撞到上面的管道。
					if (game.bird.y <= this.height - 5) {
						game.gameover();
						return;
					}
				}
			}

			// 当管道被顺利通过时，分数累加。
			if (!this.done && this.x <= (game.canvas.width - this.width) / 2) {
				this.done = true;
				game.scoreManager.addPoint();
			}

		},
		render: function () {
			game.ctx.drawImage(game.images['pipe' + this.state], 0, this.sliceY, this.width, this.height, this.x, this.y, this.width, this.height);
		},
		pause: function () {
			this.speed = 0;
		}
	});
})(window);