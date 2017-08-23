var endTimeMinutes;
var endTimeSeconds;
var timer;
var endAlert = "C'est parti !";
var step = 0;
var steps = 0;
var isRunning = false;
var notifySound = new Audio('assets/sounds/job-done.wav');
var week = ['dim','lun','mar','mer','jeu','ven','sam'];
var year = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
var taskList = ['Mettre en place un bouton "Activer les sons" et rendre le Pomodoro muet de base', 'Mettre en place le formulaire pour la liste de tâches'];

$(function () {
	
	function notifyMe() {
		Push.create("Pomodoro Timer", {
			body: endAlert,
			icon: 'assets/img/timericon.png',
			timeout: 4000,
			onClick: function() {
				window.focus();
				this.close();
			}
		});
	}
	
	$('body').bind('keypress', function(e) {
		if (e.which == 32){
			pauseTime();
		}
	});
	
	$('#wiki').hover(function() {
		$(this).html('<span class="fa fa-wikipedia-w"></span> Pour aller plus loin');
	},
		function () {
			$(this).html($('<span class="fa fa-wikipedia-w"></span>'));
	});
	
	setInterval(function clock() {
		var d = new Date();
		var wD = week[d.getDay()];
		var nD = d.getDate();
		var mo = year[d.getMonth()];
		$('#day').html(wD);
		$('#daynum').html(nD);
		$('#month').html(mo);
		var h = d.getHours();
		var m = d.getMinutes();
		var s = d.getSeconds();
		var hourDeg = h * 30 + (m / 2) - 180;
		var hourRun = "rotate(" + hourDeg + "deg)";
		$("#hours").css({ "transform": hourRun});
		var minDeg = m * 6 - 180;
		var minRun = "rotate(" + minDeg + "deg)";
		$("#min").css({ "transform" : minRun });
		var secDeg = s * 6 - 179;
		var secRun = "rotate(" + secDeg + "deg)";
		$("#sec").css({ "transform": secRun });
	}, 1000);
 	
 	function workTimer () {
 		isRunning = true;
 		if (endTimeSeconds < 10) {
 			var endTime = "Temps restant <br/><br/> " + endTimeMinutes + ' m 0' + endTimeSeconds + ' s';
 		} else {
 			var endTime = "Temps restant <br/><br/> " + endTimeMinutes + ' m ' + endTimeSeconds + ' s';
 		}
 		endTimeSeconds--;
 		if (endTimeSeconds < 0) {
 			endTimeMinutes--;
 			endTimeSeconds += 60;
 		}
 		$('#timer').html(endTime);
		$('title').html(endTimeMinutes + ' m ' + endTimeSeconds + ' s');
 		if (endTimeMinutes < 0) {
 			end();
 		}
 	};
 	
 	function stopIt() {
		clearInterval(timer);
	}
	
	function end() {
		notifySound.play();
		stopIt();
		if (steps == 4) {
			endAlert = "On respire !";
			longBreakIt();
			steps = 0;
		} else {
			if (step == 1) {
				endAlert = "C'est la pause !";
				shortBreakIt();
			}
			else if (step == 2) {
				endAlert = "On reprend !";
				workIt();
			}
		}
	}
	
	function animate() {
 		$('.load, .unload').css({"animation-duration": (endTimeMinutes*60 + endTimeSeconds) + 's' });
	}
	
	function workIt() {
		notifyMe();
		steps++;
		step = 1;
		stopIt();
		endTimeMinutes = 25;
		endTimeSeconds = 0;
		$('#timer').css({"color": "green"});
		$('.images').css({'background-image': 'url("assets/img/working.jpg")'});
		$('#progressbar').removeClass('load').addClass('unload');
		animate();
		timer = setInterval(function () { workTimer() }, 1000);
	}
	
	function shortBreakIt() {
		notifyMe();
		step = 2;
		stopIt();
		endTimeMinutes = 5;
		endTimeSeconds = 0;
		$('#timer').css({"color": "green"});
		$('.images').css({'background-image': 'url("assets/img/shortbreak.jpg")'});
		$('#progressbar').removeClass('unload').addClass('load');
		animate();
		timer = setInterval(function () { workTimer() }, 1000);
	}
	
	function longBreakIt() {
		notifyMe();
		step = 2;
		stopIt();
		endTimeMinutes = 15;
		endTimeSeconds = 0;
		$('#timer').css({"color": "green"});
		$('#progressbar').removeClass('unload').addClass('load');
		$('.images').css({'background-image': 'url("assets/img/longbreak.jpg")'});
		animate();
		timer = setInterval(function () { workTimer() }, 1000);
	}
	
	function pauseTime() {
		if ((endTimeSeconds >= 1) || (endTimeMinutes >= 1)) {
			if (isRunning == true) {
				stopIt();
				isRunning = false;
				$('#stop').text('Reprendre (espace)');
				$('#timer').css({"color": "black"});
			} else {
				timer = setInterval(function () { workTimer() }, 1000);
				$('#stop').text('Pause (espace)');
				$('#timer').css({"color": "green"});
			}
		}
	}

	function newTask() {
		/* Créer ici le formulaire d'ajout de tâche et son entrée dans taskList[] */
	}
	
	function reset() {		
		stopIt();
		endTimeMinutes = 0;
		endTimeSeconds = 0;
		step = 0;
		steps = 0;
		isRunning = false;
		$('#stop').text('Pause (espace)');
		$('#timer').empty();
		endTime =  "Temps restant <br/><br/> " + endTimeMinutes + ' m 0' + endTimeSeconds + ' s';
 		$('#timer').html(endTime);
		$('title').html("Pomodoro timer");
		$('#timer').css({"color": "black"});
		$('.images').css({'background-image': 'url("assets/img/tomatime.jpg")'});
	}
	
	$('#stop').click(pauseTime);
	$('#work, .images').click(workIt);
	$('#shortbreak').click(shortBreakIt);	
	$('#longbreak').click(longBreakIt); 	
	$('#reset').click(reset);
	$('.close').click(function() {
		$('.explain').toggle(500, function() {
			$('.tasks').toggle(500);
			$('.tasklist ul').html('<li>' + taskList.join('</li> <li>') + '</li>' );
			if (taskList.length > 0) {
				$('.tasklist').toggle(500);
			}
		});
	});
	$('#newtask').click(newTask);
	
 });
