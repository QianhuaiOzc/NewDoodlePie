Core.registerModule("info", function(sandBox) {
	var container = null;

	var stateBtn = null, checkBtn = null, shadowDiv = null, stateCloBtn = null, checkCloBtn = null;
	var stateDiv = null, checkDiv = null;
	var taskUL = null, sina = null, tencent = null;
	var tencentScript = sandBox.createElement("script"), sinaScript = sandBox.createElement("script");

	var mask = function(content) {
		container.appendChild(shadowDiv);
		sandBox.addClass(shadowDiv, "sd");
	}

	var showState = function() {
		mask();
		var state = JSON.parse(localStorage.getItem("state"));
		var level = state.level;	

		var levelDiv = sandBox.find("#level", stateDiv);
		if (level != 4) {
			levelDiv.innerText = "Level " + level + " Challenge"	
		} else {
			levelDiv.innerText = "Congratulation! You have finished All!"
		}
		

		var tasks = createTaskDivList(state);
		var i = 0, length = tasks.length;
		for(; i < length; i++) {
			taskUL.appendChild(tasks[i]);
		}

		stateDiv.style.display = "block";
	};
	var showCheck = function() {
		mask();
		sandBox.notify({"type": "check"});
	};
	var disappear = function() {
		sandBox.removeClass(shadowDiv, "sd");
		stateDiv.style.display = "none";

		var children = taskUL.childNodes, i = children.length - 1;
		for(; i > 0; i--) {
			taskUL.removeChild(children[i]);
		}
		sinaLi.innerHTML = "";
		document.body.removeChild(tencentScript);
		container.removeChild(container.lastChild);
		checkDiv.style.display = "none";
	};

	var hideCheckBtn = function() {
		sandBox.hide(checkBtn);
	};

	var showCheckBtn = function() {
		sandBox.show(checkBtn);
	};

	var createTaskDivList = function(state) {
		var taskList = [];
		var drawShape = sandBox.createElement("li");
		var drawPict = sandBox.createElement("li");
		switch (state.level) {
			case 1: 
				drawShape.innerText = "You have finished " + (state.drawFinished > 2 ? 2 : state.drawFinished) + " of 2 shapes!";
				drawPict.innerText = "You have finished " + state.picFinished + " of 3 pictures!";
				var guess = sandBox.createElement("li");
				if(state.guessFinished === true) {
					guess.innerText = "You have finished the guess!";
				} else {
					guess.innerText = "You have not finish the guess!";
				}
				taskList.push(drawShape);
				taskList.push(drawPict);
				taskList.push(guess);
				break;
			case 2: 
				drawShape.innerText = "You have finished " + (state.drawFinished > 3 ? 3 : state.drawFinished) + " of 3 shapes!";
				drawPict.innerText = "You have finished " + state.picFinished + " of 5 pictures!";
				var fill = sandBox.createElement("li");
				if(state.fillFinished === true) {
					fill.innerText = "You have finished the fill!";
				} else {
					fill.innerText = "You have not finished the fill!";
				}
				taskList.push(drawShape);
				taskList.push(drawPict);
				taskList.push(fill);
				break;
			case 3: 
				drawShape.innerText = "You have finished " + (state.drawFinished > 4 ? 4 : state.drawFinished) + " of 4 shapes!";
				drawPict.innerText = "You have finished " + state.picFinished + " of 7 pictures!";
				var blackboard = sandBox.createElement("li");
				if(state.bboardFinished === true) {
					blackboard.innerText = "You have finished the blackboard!";
				} else {
					blackboard.innerText = "You have not finished the blackboard!";
				}
				taskList.push(drawShape);
				taskList.push(drawPict);
				taskList.push(blackboard);
				break;
			default :
		}
		return taskList;
	}

	return {
		init: function() {
			container = sandBox.container;
			sandBox.show(container);
			stateBtn = sandBox.find("#help");
			checkBtn = sandBox.find("#finish");
			shadowDiv = sandBox.createElement("div");

			stateDiv = sandBox.find("#state");
			stateDiv.style.display = "none";
			checkDiv = sandBox.find("#check");
			checkDiv.style.display = "none";

			sina = sandBox.find("#sinaLi");
			tencent = sandBox.find("#qqwb_share__");

			stateCloBtn = sandBox.find(".closeBtn", stateDiv);
			stateCloBtn.onclick = disappear;

			checkCloBtn = sandBox.find(".closeBtn", checkDiv);
			checkCloBtn.onclick = disappear;

			taskUL = sandBox.find("#tasks", stateDiv);

			stateBtn.onclick = showState;
			stateBtn.addEventListener("touchstart", showState);

			checkBtn.onclick = showCheck;
			checkBtn.addEventListener("touchstart", showCheck);

			shadowDiv.onclick = disappear;
			shadowDiv.addEventListener("touchstart", disappear);

			sandBox.listen({"hideCheckBtn": hideCheckBtn, "showCheckBtn": showCheckBtn});

			sandBox.listen({"imageSave": function(imageUrl) {
				tencent.setAttribute("data-pic", imageUrl);
				tencent.setAttribute("data-content", "#DoodlePie#");
				tencentScript.setAttribute("src", "http://mat1.gtimg.com/app/openjs/openjs.js#autoboot=no&debug=no");
				document.body.appendChild(tencentScript);
(function(){
  var _w = 32 , _h = 32;
  var param = {
    url:location.href,
    type:'1',
    count:'', /**是否显示分享数，1显示(可选)*/
    appkey:'1758500971', /**您申请的应用appkey,显示分享来源(可选)*/
    title:'#Doodle Pie#', /**分享的文字内容(可选，默认为所在页面的title)*/
    pic: imageUrl, /**分享图片的路径(可选)*/
    ralateUid:'', /**关联用户的UID，分享微博会@该用户(可选)*/
	language:'zh_cn', /**设置语言，zh_cn|zh_tw(可选)*/
    rnd:new Date().valueOf()
  }
  var temp = [];
  for( var p in param ){
    temp.push(p + '=' + encodeURIComponent( param[p] || '' ) )
  }
  sina.innerHTML = '<iframe id="sina" allowTransparency="true" frameborder="0" scrolling="no" src="http://hits.sinajs.cn/A1/weiboshare.html?' + temp.join('&') + '" width="'+ _w+'" height="'+_h+'"></iframe>';
})()
				checkDiv.style.display = "block";
			}});
		},

		destroy: function() {
			sandBox.hide(container);
			stateBtn.removeEventListener("touchstart", showState);
			checkBtn.removeEventListener("touchstart", showCheck);
			shadowDiv.removeEventListener("touchstart", disappear);
		}
	};
});
