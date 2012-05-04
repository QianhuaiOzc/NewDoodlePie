Core.registerModule("kaleidoscope", function(sb) {


			var magicType = null;

			var isDrawing = false,currentPath = [],
			
			currentColor = "AACD34",currentSize = "5",
			pathes = [],paintL = 0,paintT = 0,radius = 0,circleFactor = 6;
			
			var panelW = 600,panelH = 600,factor = 4,
			paintelemW = panelW/factor,paintelemH = panelH/factor;


			var magic = null,
			container = null,
			mainPage = null,
			showMagic = null,
			showMagic2 = null,
			frontCanvas = null,
			backCanvas = null,
			showCtx = null,
			show2Ctx = null,
			frontCtx = null,
			textureImage = null,
			shapeModel = null;

			var fn = {

				css:function(e,sts){
					try{
						for(var a in sts){
							e.style[a] = sts[a];
						}
					}catch(ex){
						throw new Error("Error in set style");
					}
				},
				attr:function(e,attrs){

					for (var a in attrs) {
						e.setAttribute(a,attrs[a]);
					}
				},
				create:function(name){
					return document.createElement(name);
				}
			};

			var paintBackIncr = function() {
				var ctx = backCtx;
				if(currentPath) {

					if(magicType=="triangle"){
						paintTriangleMagic(Math.PI/2,paintelemW,0,ctx,currentPath);
						paintTriangleMagic(-Math.PI/2,0,paintelemH,ctx,currentPath);
						paintTriangleMagic(Math.PI,paintelemW,paintelemH,ctx,currentPath);

					}else if(magicType=="rectangle"){

					}else if(magicType=="circle"){

							for (var i = 1;i<circleFactor;i++) {
								paintCircle((Math.PI*2/circleFactor)*i,radius+1,radius+1,radius,ctx,currentPath);
							};
					}
					sb.drawAPath(ctx, currentPath);
				}
			};

			var repaintFront = function() {
				var ctx = frontCtx;
		        ctx.clearRect(0, 0, frontCanvas.width, frontCanvas.height);
		        if(!currentPath) {
		           	return ;
		        }
		        
	        	if(magicType=="triangle"){

					paintTriangleMagic(Math.PI/2,paintelemW,0,ctx,currentPath);
					paintTriangleMagic(-Math.PI/2,0,paintelemH,ctx,currentPath);
					paintTriangleMagic(Math.PI,paintelemW,paintelemH,ctx,currentPath);

				}else if(magicType=="rectangle"){
				}else if(magicType=="circle"){
						for (var i = 1;i<circleFactor;i++) {
							paintCircle((Math.PI*2/circleFactor)*i,radius+1,radius+1,radius,ctx,currentPath);
						};
				}
		        sb.drawAPath(ctx, currentPath);
		        repaintMagic();
		        

			};

			var repaintBack = function() {

				var ctx = backCtx, localPathes = pathes;

				ctx.clearRect(0, 0, backCanvas.width, backCanvas.height);

				for(var i = 0; i < pathes.length; i++) {
					var path = localPathes[i];
					if(path) {

						if(magicType=="triangle"){

							paintTriangleMagic(Math.PI/2,paintelemW,0,ctx,path);
							paintTriangleMagic(-Math.PI/2,0,paintelemW,ctx,path);
							paintTriangleMagic(Math.PI,paintelemW,paintelemH,ctx,path);

						}else if(magicType=="rectangle"){


						}else if(magicType=="circle"){

							for (var i = 1;i<circleFactor;i++) {
								
								paintCircle((Math.PI*2/circleFactor)*i,radius+1,radius+1,radius,ctx,path);
							};
						}
			            sb.drawAPath(ctx, path);
		            }
				}
			};

			var repaintMagic = function(){

	        	
				function putImage(x,y){

					var data1 = backCtx.getImageData(paintL,paintT,paintelemW,paintelemH);
					var data2 = frontCtx.getImageData(paintL,paintT,paintelemW,paintelemH);
					showCtx.putImageData(data1,x,y);
					show2Ctx.putImageData(data2,x,y);
				}
				if(magicType=="triangle"||magicType=="rectangle"){
					for (var i  = 0;i<factor;i++) {
						for (var j = 0;j<factor;j++) {
							// if(i==0&&j==0) continue;
							putImage(paintelemW*i,paintelemH*j);
						};
					};
				}

				// showCtx.drawImage(textureImage, 0, 0, textureImage.width, textureImage.height);
	        	// show2Ctx.drawImage(textureImage, 0, 0, textureImage.width, textureImage.height);

			};
			var paintTriangleMagic = function(angle,tx,ty,ctx,path){

				ctx.save();
	        	ctx.translate(tx,ty);
	        	ctx.rotate(angle);
				sb.drawAPath(ctx, path);
				ctx.restore();	

			};


			var paintCircle = function(angle,cx,cy,raidus,ctx,path){

				ctx.save();
	        	ctx.translate(cx,cy);
	        	ctx.rotate(angle);
	        	ctx.translate(-cx,-cy);
				sb.drawAPath(ctx, path);

				// ctx.moveTo(cx,cy);
				// ctx.lineTo(cx-Math.sqrt(3)*radius/2,cy-radius/2);
				// ctx.stroke();
				ctx.restore();	
			};


	return {
		
		init: function() {

			magic = sb.container;
			container = magic;
			showMagic = fn.create("canvas");
			showMagic2 = fn.create("canvas");
			frontCanvas = fn.create("canvas");
			backCanvas = fn.create("canvas");
			shapeModel = fn.create("canvas");
			mainPage = fn.create("div");
			showCtx = showMagic.getContext("2d");
			show2Ctx = showMagic2.getContext("2d");
			frontCtx = frontCanvas.getContext("2d");
			backCtx = backCanvas.getContext("2d");
			smCtx = shapeModel.getContext("2d");
			showMagic.className = "showMagic";
			showMagic2.className = "showMagic";
			frontCanvas.id  = "frontCanvas";
			backCanvas.id = "backCanvas";
			mainPage.className = "mainPage";
			textureImage = new Image();
			textureImage.src = "images/crayon-texture.png";


			sb.show(container);

			fn.css(magic,{

				position: "absolute",
				left: "247px",
				top: "118px",
				zIndex: 2,
				height:panelH+"px",
				width:panelW+"px"

			});

			fn.css(mainPage,{

				position: "absolute",
				backgroundImage:"url(images/magic/magic-show.png)",
				backgroundRepeat:"no-repeat",
				backgroundPosition:"center",
				backgroundColor:"white",
				display:"block",
				height:"100%",
				width:"100%"

			});

			fn.attr(showMagic,{

				height:panelH+"px",
				width:panelW+"px"

			});

			fn.attr(showMagic2,{

				height:panelH+"px",
				width:panelW+"px"

			});


			fn.css(showMagic,{

				position:"absolute",
				left:"0px",
				top:"0px"
				// border:"1px solid #CCC"

			});

			fn.css(showMagic2,{

				position:"absolute",
				left:"0px",
				top:"0px",
				border:"1px dashed #CCC"

			});

			fn.css(backCanvas,{
				position: "absolute",
				cursor: "pointer"
			});

			fn.css(shapeModel,{
				position: "absolute",
			});

			fn.css(frontCanvas,{
				position: "absolute",
				cursor: "pointer"
			});

			magic.appendChild(showMagic);
			magic.appendChild(showMagic2);
			magic.appendChild(backCanvas);
			magic.appendChild(shapeModel);
			magic.appendChild(frontCanvas);
			magic.appendChild(mainPage);

			sb.listen({

				"drawStart":this.drawStart,

				"drawStop":this.drawStop,

				"drawing":this.drawing,

				"changeDrawMagicType":this.changeDrawMagicType,

				"reset": this.reset,

				"undo":this.undo,

				"colorChange": this.colorChange,

				"brushSizeChange": this.brushSizeChange,

				"check":this.check

			});

			frontCanvas.onmousedown = this.drawStart;
			frontCanvas.onmouseup = this.drawStop;
			frontCanvas.onmouseout = this.drawStop;
			frontCanvas.onmousemove = this.drawing;

			if(sb.touchable()) {
				frontCanvas.addEventListener("touchstart", this.drawStart);
				frontCanvas.addEventListener("touchmove", this.drawing);
				frontCanvas.addEventListener("touchend", this.drawStop);
			}


			sb.notify({

				type:"changeDrawMagicType",

				data:"triangle"

			});

		},
		changeDrawMagicType:function(type){
				
			// if(magicType==type) return;
			
			if(magicType!=null&&mainPage.style.display=="block") {

				container.removeChild(mainPage);
			}
			pathes.length = 0;	
			showCtx.clearRect(0,0,panelW,panelH);
			show2Ctx.clearRect(0,0,panelW,panelH);

			if(type=="triangle"){
				paintelemH = panelH/factor;
				paintelemW = panelW/factor;
				paintT = 0;
				paintL = 0;
			}else if(type=="rectangle"){

				paintelemH = panelH/factor;
				paintelemW = panelW/factor;
				paintT = 0;
				paintL = 0;

			}else if(type=="circle"){

				paintelemW = panelW*0.618;
				paintelemH = paintelemW;
				paintT = (panelH-paintelemH)/2;
				paintL = (panelW-paintelemW)/2;

			}

			fn.attr(backCanvas,{
				height:paintelemH+"px",
				width:paintelemW+"px"
			});
			fn.attr(frontCanvas,{
				height:paintelemH+"px",
				width:paintelemW+"px"
			});
			fn.attr(shapeModel,{
				height:paintelemH+"px",
				width:paintelemW+"px"
			});
			fn.css(backCanvas,{
				top:paintT+"px",
				left:paintL+"px"
			});
			fn.css(shapeModel,{
				top:paintT+"px",
				left:paintL+"px"
			});
			fn.css(frontCanvas,{
				top:paintT+"px",
				left:paintL+"px"
			});
			smCtx.clearRect(0,0,paintelemW,paintelemH);
			frontCtx.clearRect(0,0,paintelemW,paintelemH);
			backCtx.clearRect(0,0,paintelemW,paintelemH);
			var ctx = smCtx;
			ctx.save();
			ctx.strokeStyle = "#CCC";
			if(type=="triangle"){

				ctx.beginPath();
				ctx.moveTo(0,0);
				ctx.lineTo(paintelemW,paintelemH);
				ctx.lineTo(paintelemW,0);
				ctx.lineTo(0,paintelemH);
				ctx.lineTo(0,0);
				ctx.lineTo(paintelemW,0);
				ctx.lineTo(paintelemW,paintelemH);
				ctx.lineTo(0,paintelemH);
				ctx.closePath();
				ctx.stroke();

			}else if(type=="rectangle"){

				
				ctx.beginPath();
				ctx.moveTo(0,0);
				ctx.lineTo(0,paintelemH);
				ctx.lineTo(paintelemW,paintelemH);
				ctx.lineTo(paintelemW,0);
				ctx.lineTo(0,0);
				ctx.closePath();
				ctx.stroke();


			}else if(type=="circle"){

				radius = paintelemW/2-1;

				var distance = Math.sqrt(3)*radius/2;
				var point1 = {x:radius-distance,y:radius+radius/2},
					point2 = {x:radius-distance,y:radius-radius/2},
					point3 = {x:radius+distance,y:radius+radius/2},
					point4 = {x:radius+distance,y:radius-radius/2};
				ctx.save();
				ctx.beginPath();
				ctx.arc(radius+1,radius+1,radius,0,Math.PI*2,true);
				ctx.moveTo(radius,radius);
				ctx.lineTo(point1.x,point1.y);
				ctx.moveTo(radius,radius);
				ctx.lineTo(point2.x,point2.y);
				ctx.moveTo(radius,radius);
				ctx.lineTo(point3.x,point3.y);
				ctx.moveTo(radius,radius);
				ctx.lineTo(point4.x,point4.y);
				ctx.moveTo(paintelemW/2,0);
				ctx.lineTo(paintelemW/2,paintelemH);
				ctx.closePath();
				ctx.stroke();
				ctx.restore();
			}
			else{
				return;
			}

			ctx.restore();
			magicType = type;
		},
		paintTriangleMagic:function(angle,tx,ty,ctx,path){

			ctx.save();
        	ctx.translate(tx,ty);
        	ctx.rotate(angle);
			sb.drawAPath(ctx, path);
			ctx.restore();	

		},


		paintCircle:function(angle,cx,cy,raidus,ctx,path){

			ctx.save();
        	ctx.translate(cx,cy);
        	ctx.rotate(angle);
        	ctx.translate(-cx,-cy);
			sb.drawAPath(ctx, path);
			ctx.restore();	
		},

		outOfBound:function(){
			drawing = false;
		},

		drawStart:function(evt){
			
			isDrawing = true;
			if(magicType=="rectangle"||magicType=="triangle"){

				// fn.css(backCanvas,{
				// 	opacity:"0"
				// });

				// fn.css(frontCanvas,{
				// 	opacity:"0"
				// });
				}
			currentPath = {
				color: currentColor,
				size: currentSize,
				points: [ {
					X: evt.changedTouches ? evt.changedTouches[0].pageX - frontCanvas.offsetLeft : evt.offsetX,
					Y: evt.changedTouches ? evt.changedTouches[0].pageY - frontCanvas.offsetTop : evt.offsetY
				} ],
			};
		},

		drawStop:function(evt) {
			if(isDrawing == true) {
				isDrawing = false;
				pathes.push(currentPath);
			}
			paintBackIncr();
			currentPath = null;
		},

		drawing:function(evt) {
			
			if(evt.preventDefault) {
				evt.preventDefault();
			}
			if(isDrawing == true) {
				var x = evt.changedTouches ? evt.changedTouches[0].pageX - frontCanvas.offsetLeft : evt.offsetX;
				var y = evt.changedTouches ? evt.changedTouches[0].pageY - frontCanvas.offsetTop : evt.offsetY;
				if(magicType=="triangle"){

					// if(x<paintelemW*y/paintelemH||(x/paintelemW+y/paintelemH)>1){
					// 	sb.notify({
					// 		type:"drawStop",
					// 		data:null
					// 	});
					// 	return;
					// };
				}else if(magicType=="circle"){

					var cx = radius+1,cy = radius+1;
					if(((x-cx)*(x-cx)+(y-cy)*(y-cy))>radius*radius){

						sb.notify({
							type:"drawStop",
							data:null
						});
						return;
					};

				}
				currentPath.points.push( {
					X: evt.changedTouches ? evt.changedTouches[0].pageX - frontCanvas.offsetLeft : evt.offsetX,
					Y: evt.changedTouches ? evt.changedTouches[0].pageY - frontCanvas.offsetTop : evt.offsetY
				} );
				repaintFront();
			}
		},

		colorChange: function(color) {
			currentColor = color;
		},

		brushSizeChange: function(size) {
			currentSize = size;
		},

		stampChange: function(stamp) {
			currentStamp = stamp;
		},

		undo: function() {

			
			pathes.pop();
			repaintFront();
			repaintBack();
			repaintMagic();
		},

		check: function() {
			if(hasCheck === false) {
				sandBox.notify({"type": "finishOnePic"});
				hasCheck = true;
			}
		},

		reset: function() {
			pathes.length = 0;
			repaintFront();
			repaintBack();
			repaintMagic();
		},
		destroy: function() {
			sb.hide(container);
			container.removeChild(frontCanvas);
			container.removeChild(backCanvas);
			container.removeChild(showMagic);
			container.removeChild(showMagic2);
			sb.ignore("save");
		}
	};
});