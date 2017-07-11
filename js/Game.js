(function (window) {
	window.Game = Class.extend({
		init: function (params) {
			var self = this;
			this.fps = params.fps;
			this.canvas = document.getElementById(params.canvasId);
			this.ctx = this.canvas.getContext('2d');
			this.timer = null;
			this.images = null;
			// 游戏的状态。
			this.end = false;

			// 静态资源管理类，这个类用来加载所有的静态图片或者音乐。
			this.sr = new StaticResourceUtil();
			this.sr.loadImages('./r.json', function (alreadyLoadNum, allNum, imagesObj) {
				// 将加载的信息打印在画布上。
				self.ctx.clearRect(0, 0, self.canvas.width, self.canvas.height);
				self.ctx.fillText(alreadyLoadNum + ' of ' + allNum, 10, 30);
				// 当所需要加载的资源都加载完成后，执行中介者Game的主程序。
				if (alreadyLoadNum == allNum) {
					// 将加载得到的资源全部作为中介者Game的属性。
					self.images = imagesObj;
					self.run();
				}
			});

		},
		// 停止执行主程序。
		stop: function () {
			clearInterval(this.timer);
		},
		// 不断执行主程序。
		run: function (a) {
			var self = this;
			// 帧工具类。
			this.frameUtil = new FrameUtil();

			this.timer = setInterval(function () {
				self.mainLoop();
			}, 1000 / this.fps);

			// 背景类·建筑。
			this.building = new Background({
				image: this.images.building,
				width: 300,
				height: 256,
				x: 0,
				y: this.canvas.height - 48 - 256,
				speed: 1
			});
			// 背景类·树。
			this.tree = new Background({
				image: this.images.tree,
				width: 300,
				height: 216,
				x: 0,
				y: this.canvas.height - 48 - 216,
				speed: 2
			});
			// 背景类·地板。
			this.floor = new Background({
				image: this.images.floor,
				width: 48,
				height: 48,
				x: 0,
				y: this.canvas.height - 48,
				speed: 3
			});

			// 鸟类。
			this.bird = new Bird();

			// 管道集合。
			this.pipeArray = [new Pipe()];

			// 分数类。
			this.scoreManager = new ScoreManager();

		},
		// 主程序。
		mainLoop: function () {

			this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

			// 显示出真实的帧率和帧数。
			this.frameUtil.update();
			this.ctx.fillText('FPS / ' + this.frameUtil.realFps, 10, 20);
			this.ctx.fillText('FNO / ' + this.frameUtil.currentFrame, 10, 40);

			// 更新重绘-背景类·建筑。
			this.building.update();
			this.building.render();

			// 更新重绘-背景类·树。
			this.tree.update();
			this.tree.render();

			// 更新重绘-背景类·地板。
			this.floor.update();
			this.floor.render();

			// 更新重绘-鸟类。
			this.bird.update();
			this.bird.render();

			// 每120帧就生成一个管道，并将管道放到管道集合中。如果游戏状态为失败时，不再生成管道实例。
			if (!this.end && this.frameUtil.currentFrame % 120 == 0) {
				this.pipeArray.push(new Pipe());
			}
			// 更新重绘-管道集合里的管道。
			for (var i = 0; i < this.pipeArray.length; i++) {
				this.pipeArray[i].update();
				if (this.pipeArray[i]) {
					this.pipeArray[i].render();
				}
			}

			// 更新重绘-分数类。
			this.scoreManager.render();

		},
		gameover: function () {
			// 游戏失败时，将所有背景暂停，并且状态更新为游戏失败。
			this.end = true;
			this.tree.pause();
			this.building.pause();
			this.floor.pause();

			for (var i = 0; i < this.pipeArray.length; i++) {
				this.pipeArray[i].pause();
			}
		}
	});
})(window);