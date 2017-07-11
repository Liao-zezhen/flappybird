(function (window) {
	window.Bird = Class.extend({
		init: function () {
			this.width = 85;
			this.height = 60;
			this.x = (game.canvas.width - this.width) / 2;
			this.y = 100;

			// 扇翅膀。
			this.swing = 0;
			// 扇翅膀的频率。
			this.swingSpeed = 5;

			// 小鸟的状态，0是往下掉，1是往上飞。
			this.state = 0;
			// 小鸟旋转的反向。
			this.rotate = 0;

			// 控制小鸟的掉下或者上升的速度。
			this.dY = 0;
			this.deltaY = 0;
			this.startFrame = game.frameUtil.currentFrame;

			// 监听点击事件。
			this.bindClickListener();

			this.dieAnimation = 0;
		},
		update: function () {
			if (game.end) {
				this.dieAnimation++;
				if (this.dieAnimation == 34) {
					// 小鸟死亡动画执行完后，结束游戏。
					game.stop();
				}
				return;
			}
			if (game.frameUtil.currentFrame % this.swingSpeed === 0) {
				this.swing++;
				this.swing %= 3;
			}
			if (this.state == 0) { // 往下掉
				this.swingSpeed = 5;
				// 加入重力的概念，让小鸟越掉越快。
				this.dY = 0.01 * Math.pow(game.frameUtil.currentFrame - this.startFrame, 2);
				this.rotate += 1;
			} else if (this.state == 1) { // 往上飞
				// 加入缓冲的概念，让小鸟越往上越慢。
				this.deltaY++;
				this.dY = -16 + this.deltaY;
				// 达到临界点，就又开始往下掉。
				if (this.dY > 0) {
					this.state = 0;
					// 修正加速度的起始。
					this.startFrame = game.frameUtil.currentFrame;
				}
			}
			this.y += this.dY;

			// 不能超出画布的可视区。
			if (this.y <= 0) {
				this.y = 0;
			} else if (this.y >= game.canvas.height - 48 - this.height) {
				game.gameover();
			}
		},
		render: function () {
			if (game.end) {
				this.die();
				return;
			}
			game.ctx.save();
			// 小鸟旋转
			game.ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
			game.ctx.rotate(this.rotate / 180 * Math.PI);
			game.ctx.translate(-(this.x + this.width / 2), -(this.y + this.height / 2));

			game.ctx.drawImage(game.images.bird, this.swing * this.width, 0, this.width, this.height, this.x, this.y, this.width, this.height);
			game.ctx.restore();
		},
		fly: function () {
			// 改变状态。
			this.state = 1;
			// 修正缓冲的起始。
			this.deltaY = 1;
			this.rotate = -25;
			this.swingSpeed = 2;
		},
		bindClickListener: function () {
			var self = this;
			game.canvas.addEventListener('mousedown', function () {
				self.fly();
			});
			game.canvas.addEventListener('touchstart', function () {
				self.fly();
			});
		},
		die: function () {
			// 小鸟死亡动画。
			var cols = this.dieAnimation % 5;
			var rows = Math.floor(this.dieAnimation / 6);
			game.ctx.drawImage(game.images.blood, cols * 325, rows * 138, 325, 138, this.x - this.width, this.y, 325, 138);
		}
	});
})(window);