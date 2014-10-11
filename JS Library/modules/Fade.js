/* fadeIn() / fadeOut()
 *
 * Fades in / fades out the specified element
 *
 * Parameter:
 * -duration (default: 400ms)
 */
	
	GS.fadeIn = function(duration){
		var results = this.init;
		if (!testParam(duration)){
			duration = 400;
		} else if (typeof duration !== "number"){
			throw new Error("Fade duration parameter must be a number.");
		}
		for (var i = 0; i < results.length; i++){
			var element = results[i];
			if (element.style.display != "block"){
				element.style.display = "block";
				var op = 0.01,
					gap = 25 / duration,
					timer = setInterval(function(){
					if (op >= 0.99){
						op = 1;
						clearInterval(timer);
					}
					element.style.opacity = op;
					op += gap;
				},25);
			}
		};
		return this;
	};
	
	GS.fadeOut = function(duration){
		var results = this.init;
		if (!testParam(duration)){
			duration = 400;
		} else if (typeof duration !== "number"){
			throw new Error("Fade duration parameter must be a number.");
		}
		for (var i = 0; i < results.length; i++){
			var element = results[i];
			if (element.style.display != "none"){
				var op = 1,
					gap = 25 / duration,
					timer = setInterval(function(){
					if (op <= 0.01){
						op = 0;
						clearInterval(timer);
						element.style.display = "none";
					}
					element.style.opacity = op;
					op -= gap;
				},25);
			}
		};
		return this;
	};