(function () {

	//sh:slider-height,sw:slider-width
	var sh = 600,sw = 800;
	var main;
	var slider,questions,content,conLeft,conRight,conRightTop,conRightBottom,
		toNextButton,score,scoreStart;
	var anims = ['fromLeft','fromLeft','fromLeft','fromLeft'],aIndex = 0;
	var curQuestion,isAnswer = false,qNumer = 5;
	function init() {

		questions = [

			{
				image:"images/guess/qianbi.png",options:[
				{title:'images/guess/font-fangzi.png'},
				{title:'images/guess/font-tuoxie.png'},
				{title:'images/guess/font-shoutao.png'},
				{title:'images/guess/font-qianbi.png'}],
				answer:3,
				answerPic:"images/guess/che",
				isRight:false
			},
			{
				image:"images/guess/fangzi.png",
				options:[
				{title:'images/guess/font-fangzi.png'},
				{title:'images/guess/font-tuoxie.png'},
				{title:'images/guess/font-shoutao.png'},
				{title:'images/guess/font-qianbi.png'}],
				answer:0,
				answerPic:"images/guess/chao.png",
				isRight:false
			},
			{
				image:"images/guess/shoutao.png",
				options:[
				{title:'images/guess/font-fangzi.png'},
				{title:'images/guess/font-tuoxie.png'},
				{title:'images/guess/font-shoutao.png'},
				{title:'images/guess/font-qianbi.png'}],
				answer:2,
				answerPic:"images/guess/che.jpg",
				isRight:false
			},
			{
				image:"images/guess/tuoxie.png",
				options:[
				{title:'images/guess/font-fangzi.png'},
				{title:'images/guess/font-tuoxie.png'},
				{title:'images/guess/font-shoutao.png'},
				{title:'images/guess/font-qianbi.png'}],
				answer:1,
				answerPic:"images/guess/che.jpg",
				isRight:false
			},
			{
				image:"images/guess/zhishengji.png",
				options:[
				{title:'images/guess/font-zhishengji.png'},
				{title:'images/guess/font-tuoxie.png'},
				{title:'images/guess/font-shoutao.png'},
				{title:'images/guess/font-qianbi.png'}
				],
				answer:0,
				answerPic:"images/guess/che.jpg",
				isRight:false
			}

		];

		main = document.querySelector("#main");
		$(main).empty();

		slider = document.createElement("div");
		content = document.createElement("div");
		conLeft = document.createElement("div");
		conRight = document.createElement("div");
		conRightTop = document.createElement("div");
		conRightBottom = document.createElement("div");
		toNextButton = document.createElement("div");
		score = document.createElement("div");
		wrong = document.createElement("div");
		right = document.createElement("div");

		for (var i = 0;i<qNumer;i++) {
			
			var src = "images/guess/star_"+(i+1)+"s.png";
			scoreStart = document.createElement("img");
			scoreStart.src = src;
			scoreStart.className = "star_"+(i+1);
			score.appendChild(scoreStart);

		};


		table = document.createElement("table");
		tr = document.createElement("tr");
		td = document.createElement("td");

		pic = document.createElement("img");
		toNextButton.addEventListener("click",Events.toNextQuestion,false);

		slider.id = "slider";
		score.className = "score";
		content.className = "content";
		conLeft.className = "con-left";
		conRight.className ="con-right";
		conRightTop.className ="con-right-top";
		conRightBottom.className ="con-right-bottom";
		toNextButton.className  = "toNextButton";
		wrong.className ="wrong";
		right.className  = "right";

		wrong.style.display ="none";
		right.style.display ="none";
		

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


		slider.style.backgroundImage = "url(images/guess/paper.png)";

		main.appendChild(slider);
		
		if(questions.length!=0){
			var initItem = questions[0];
			curQuestion = 0;
			showSlider(initItem);
		}

	}

	function dispose() {
		slider = null;
	}


	function setHover(e,callback1,callback2){
		e.addEventListener("mouseover",callback1,false);
		e.addEventListener("mouseout",callback2,false);
	}

	var Events = {

		selectAnswer:function(){

			Events.toNextQuestion();

		},
		toNextQuestion:function(){
			if(!isAnswer) return;
			if(curQuestion>=questions.length-1){
				game.guessFinished();
				game.loadModule("part1");
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
				// if(confirm("to next question ?")) Events.toNextQuestion();

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

		confirmNextQuestion:function(){

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

	function showSlider(sobj){

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
				
				li.onselectstart = function(){
					return false;
				}
				li.setAttribute("data-index",i);

			}

			ul.appendChild(fragm);
			conRightBottom.innerHTML = "";
			conRightBottom.appendChild(ul);
			$(content).addClass(anims[aIndex%4]);

	}
	

	modules["part3"] = {
		init: init,
		dispose: dispose
	}
})();


