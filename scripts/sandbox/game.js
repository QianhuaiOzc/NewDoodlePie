Core.registerModule("game", function(sandBox) {
	var container = null;
	var slider,questions,content,conLeft,conRight,conRightTop,conRightBottom,
		toNextButton,score,scoreStart;
	var anims = ['fromLeft','fromLeft','fromLeft','fromLeft'],aIndex = 0;
	var curQuestion,isAnswer = false,qNumer = 5;
	var sh = 600,sw = 800;
	var questions = [
		{image:"images/guess/qianbi.png",options:[
		{title:'images/guess/font-fangzi.png'},
		{title:'images/guess/font-tuoxie.png'},
		{title:'images/guess/font-shoutao.png'},
		{title:'images/guess/font-qianbi.png'}],
		answer:3,answerPic:"images/guess/che",isRight:false},
		{image:"images/guess/fangzi.png",options:[
		{title:'images/guess/font-fangzi.png'},
		{title:'images/guess/font-tuoxie.png'},
		{title:'images/guess/font-shoutao.png'},
		{title:'images/guess/font-qianbi.png'}],
		answer:0,answerPic:"images/guess/chao.png",isRight:false},
		{image:"images/guess/shoutao.png",options:[
		{title:'images/guess/font-fangzi.png'},
		{title:'images/guess/font-tuoxie.png'},
		{title:'images/guess/font-shoutao.png'},
		{title:'images/guess/font-qianbi.png'}],
		answer:2,answerPic:"images/guess/che.jpg",isRight:false},
		{image:"images/guess/tuoxie.png",options:[
		{title:'images/guess/font-fangzi.png'},
		{title:'images/guess/font-tuoxie.png'},
		{title:'images/guess/font-shoutao.png'},
		{title:'images/guess/font-qianbi.png'}],
		answer:1,answerPic:"images/guess/che.jpg",isRight:false},
		{image:"images/guess/zhishengji.png",options:[
		{title:'images/guess/font-zhishengji.png'},
		{title:'images/guess/font-tuoxie.png'},
		{title:'images/guess/font-shoutao.png'},
		{title:'images/guess/font-qianbi.png'}],
		answer:0,answerPic:"images/guess/che.jpg",isRight:false}];
		
		var Events = {
			selectAnswer:function(){
				Events.toNextQuestion();
			},

			toNextQuestion:function(){
				if(!isAnswer) return;
				if(curQuestion>=questions.length-1){
					// game.guessFinished();
					// game.loadModule("part1");
					sandBox.notify({
						"type": "gameFinish"
					});
					return;
				}
				isAnswer = false;
				Events.showMessge();
				$(content).removeClass(anims[(aIndex++)%anims.length]);
				window.setTimeout(function(){
					$(content).addClass(anims[aIndex%anims.length]);
				});
				showSlider(questions[++curQuestion]);
			},

			reload:function(){
			},

			hadChoose:function(e){
				e = e.target.parentNode;
				if(!isAnswer){
					if(!Events.checkAnswer(e.getAttribute("data-index"),questions[curQuestion].answer)){
						Events.showMessge("wrong");
						questions[curQuestion].isRight = false;
					}else{
						Events.showMessge("right");
						questions[curQuestion].isRight = true;
						Events.changeScore();
					}
					Events.showAnswer(e,questions[curQuestion].isRight);
					isAnswer = true;
				}
				
			},

			checkAnswer:function(index,answer){
				return index== questions[curQuestion].answer;
			},

			showAnswer:function(e,isRight){
				if(isRight){
					e.style.backgroundImage  ="url(images/right.png)";
				}else{
					var sel  = slider.querySelector(".option"+(questions[curQuestion].answer+1));
					sel.style.backgroundImage  ="url(images/right.png)";
					sel.style.backgroundRepeat = "no-repeat";
					e.style.backgroundImage  ="url(images/quan.png)";
				}
				e.style.backgroundRepeat = "no-repeat";
			},

			confirmNextQuestion:function() {
			},

			changeScore:function(){
				var star = score.querySelector(".star_"+(curQuestion+1));
				star.src = star.src.replace("s.png",".png");
			},

			setSelected:function(e){
				e.style.backgroundColor = "blue";
			},

			showMessge:function(messge){
				if(messge=="right"){
					right.style.display  = "block";
					wrong.style.display  = "none";
				}else if(messge=="wrong"){
					right.style.display  = "none";
					wrong.style.display  = "block";
				}else{
					right.style.display  = "none";
					wrong.style.display  = "none";
				}
			},
		};

	var showSlider = function(sobj){

		var title = document.createElement("div");
		var ul = document.createElement("ul");
		var fragm = document.createDocumentFragment();
		var li,img;
		pic.src  = sobj.image;
		var option ;
		for (var i =0,len =  sobj.options.length ; i <len ; i++) {
			options = sobj.options[i];
			li = document.createElement("li");
			img = document.createElement("img");
			li.className = "part3-option option"+(i+1);
			img.src = options.title;
			li.appendChild(img);
			setHover(img,function(e){
				e.target.src = e.target.src.replace(".png","2.png");
			},
			function(e){
				e.target.src = e.target.src.replace("2.png",".png");
			});
			fragm.appendChild(li);
			li.addEventListener("click",Events.hadChoose,false);
			li.addEventListener("touchstart", Events.hadChoose, false);
		
			li.onselectstart = function(){
				return false;
			}
			li.setAttribute("data-index",i);
		}

		ul.appendChild(fragm);
		conRightBottom.innerHTML = "";
		conRightBottom.appendChild(ul);
		$(content).addClass(anims[aIndex%4]);
	};

	var setHover = function(e,callback1,callback2){
		e.addEventListener("mouseover",callback1,false);
		e.addEventListener("mouseout",callback2,false);
	};

	return {
		init: function() {
			container = sandBox.container;

			slider = sandBox.createElement("div");
			content = sandBox.createElement("div");
			conLeft = sandBox.createElement("div");
			conRight = sandBox.createElement("div");
			conRightTop = sandBox.createElement("div");
			conRightBottom = sandBox.createElement("div");
			toNextButton = sandBox.createElement("div");
			score = sandBox.createElement("div");
			wrong = sandBox.createElement("div");
			right = sandBox.createElement("div");

			for (var i = 0;i<qNumer;i++) {
				var src = "images/guess/star_"+(i+1)+"s.png";
				scoreStart = sandBox.createElement("img");
				scoreStart.src = src;
				sandBox.addClass(scoreStart, "star_"+(i+1));
				score.appendChild(scoreStart);
			}

			table = sandBox.createElement("table");
			tr = sandBox.createElement("tr");
			td = sandBox.createElement("td");

			pic = sandBox.createElement("img");
			toNextButton.addEventListener("click",Events.toNextQuestion,false);
			toNextButton.addEventListener("touchstart", Events.toNextQuestion, false);

			slider.id = "slider";
			sandBox.addClass(score, "score");
			sandBox.addClass(content, "content");
			sandBox.addClass(conLeft, "con-left");
			sandBox.addClass(conRight, "con-right");
			sandBox.addClass(conRightTop, "con-right-top");
			sandBox.addClass(conRightBottom, "con-right-bottom");
			sandBox.addClass(toNextButton, "toNextButton");
			sandBox.addClass(wrong, "wrong");
			sandBox.addClass(right, "right");

			sandBox.css(wrong, "display", "none");
			sandBox.css(right, "display", "none");

			td.appendChild(pic);
			tr.appendChild(td)
			table.appendChild(tr);
			conRight.appendChild(conRightBottom);
			conLeft.appendChild(table);
			conLeft.appendChild(toNextButton);
			conLeft.appendChild(score);
			content.appendChild(conLeft);
			content.appendChild(conRight);
			slider.appendChild(content);
			slider.appendChild(wrong);
			slider.appendChild(right);

			sandBox.css(slider, "background-image", "url(images/guess/paper.png)");

			container.appendChild(slider);
			
			if(questions.length!=0){
				var initItem = questions[0];
				curQuestion = 0;
				showSlider(initItem);
			}

			sandBox.show(container);
		},

		destroy: function() {
			sandBox.hide(container);
			var children = container.childNodes;
			for(var i = 0; i < children.length; i++) {
				container.removeChild(children[i]);
			}
		}
	};
});