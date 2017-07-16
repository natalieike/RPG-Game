$(document).ready(function(){
	var ninjas;  //game object holding all of the characters
	var startBtn = $("#startBtn");
	var attackBtn = $("#attackBtn");

	//object constructor for each character
	function character(aP, hP, pic){
		this.healthPoints = hP;
		this.attackPower = aP;
		this.counterAttackPower = aP;
		this.defeated = false;
		this.picture = pic;

		//function to deduct HPs when attacked
		this.getAttacked = function(cP){
			this.healthPoints = this.healthPoints - cP;
			if(this.healthPoints <= 0){
				this.defeated = true;
			}
		};
	};


	//Initialize the ninjas object with each character and display character choices
	var initializeGame = function(){
		var setup = $("#setup"); //space where images will be displayed
		//set up ninjas object with initialized characters
		ninjas = {
			steve: new character(18, 100, "assets/images/angryNinja.jpeg"),
			tiffany: new character(40, 60, "assets/images/girlNinja2.png"),
			kenny: new character(32, 80, "assets/images/happyNinja2.jpg"),
			bobby: new character(26, 90, "assets/images/doubleSwordNinja.png"),
			userChar: "",
			opponent: ""
		};
		//build HTML for showing character options
		setup.html("<p class='center'>Please select your character</p>");
		for (var i in ninjas){
			if(jQuery.type(ninjas[i]) === "object"){
				var newImg = buildNinjaImg(ninjas[i].picture, i);
				setup.append(newImg);
			};
		};
	};

	//Returns an individual Ninja image HTML
	var buildNinjaImg = function(imageFilename, idName){
		var newImg = $("<img>");
		newImg.attr("src", imageFilename);
		newImg.attr("class", "ninjaImage");
		newImg.attr("data-char", idName);
		return(newImg);
	};

	//Attack Sequence:  throw star, call getAttacked method, increase CP, and call counter attack if not a winner
	var attack = function(){
		var attacker = ninjas.userChar;
		var opposition = ninjas.opponent;
		var throwingStar = "<img src='assets/images/throwingStar.png' class='weaponImage' id='star'>";
		var setupArea = $("#setup");
		setupArea.html(throwingStar);
		$("#star").animate({ left: "+=500px" }, "slow", function(){
			ninjas[opposition].getAttacked(ninjas[attacker].counterAttackPower);
			if (ninjas[opposition].defeated){
				$("#message").html("You won the match.  You have attacked with " + ninjas[attacker].counterAttackPower + " attack power.")
				winMatch();
			}
			else{
				$("#message").html("You have attacked with " + ninjas[attacker].counterAttackPower + " attack power.");
				counterAttack();
			}
			ninjas[attacker].counterAttackPower += ninjas[attacker].attackPower;
		});
	};

	//Counter Attack sequence:  throw bomb, call getAttacked method
	var counterAttack = function(){
		var attacker = ninjas.userChar;
		var opposition = ninjas.opponent;
		var bomb = "<img src='assets/images/bomb4.png' class='weaponImage' id='bomb'>";
		var setupArea = $("#setup");
		setupArea.append(bomb);
		$("#bomb").offset({ left: 850 });
		$("#bomb").animate({ left: "-=450px" }, "slow", function(){
			ninjas[attacker].getAttacked(ninjas[opposition].counterAttackPower);
			if (ninjas[attacker].defeated){
				$("#message").html("You lost!")
				loseGame();
			}
			else{
				$("#message").append(" Your opponent has attacked with " + ninjas[opposition].counterAttackPower + " attack power. Your Health Points are " + ninjas[attacker].healthPoints + ". Please attack again when ready.")
			}
			$(".weaponImage").remove();
		});
	};

	//Moves user's selected character to the fight section and sets up selection of opponents
	var moveUserChar = function(userSelect){
		var fightArea = $("#fight");
		var waitingArea = $("#waiting");
		var newImg = buildNinjaImg(ninjas[userSelect].picture, userSelect);
		fightArea.append(newImg);
		$("#setup").html("<p>Please select an opponent</p>");
		rebuildWaitingArea();
	};

	//Re-builds the waiting area after an opponent is selected
	var rebuildWaitingArea = function(){
		var waitingArea = $("#waiting");
		waitingArea.empty();
		for (var i in ninjas){
			if((jQuery.type(ninjas[i]) === "object") 
			   && (i != ninjas.userChar) 
			   && (i != ninjas.opponent)
			   && (ninjas[i].defeated == false)){
					var newImg = buildNinjaImg(ninjas[i].picture, i);
					waitingArea.append(newImg);
			};
		};
	};

	//Move the opponent to the fight area
	var moveOpponentChar = function(userSelect){
		var fightArea = $("#fight");
		var messageArea = $("#message");
		var newImg = buildNinjaImg(ninjas[userSelect].picture, userSelect);
		newImg.attr("class", "opponentImage");
		fightArea.append(newImg);
		rebuildWaitingArea();
		messageArea.html("");
	};

	var moveLoser = function(loser){
		var fightArea = $("#fight");
		var defeatedArea = $("#defeated");
		var messageArea = $("#message");
		var waitingArea = $("#waiting");
		var newImg = buildNinjaImg(ninjas[loser].picture, loser);
		newImg.attr("class", "ninjaImage");
		defeatedArea.append(newImg);
		$(".opponentImage").remove();
		$(".weaponImage").remove();
		rebuildWaitingArea();
		if(waitingArea.html() == ""){
			messageArea.html("You Won!");
			startBtn.show();
			$(".ninjaImage").remove();
		}
		else {
			messageArea.html("Please choose your next opponent");
		}
	};

	//Win Match sequence:  hid attack button, get new oponent or win the game
	var winMatch = function(){
		attackBtn.hide();
		moveLoser(ninjas.opponent);
		ninjas.opponent = "";
	};

	var loseGame = function(){
		attackBtn.hide();
		startBtn.show();	
		$(".ninjaImage").remove();
		$(".opponentImage").remove();
		$(".weaponImage").remove();
	};

	//Hide Attack button until ready to attack
	attackBtn.hide();

	//Click Start Button to initialize game.  Hide button once character options are exposed.
	startBtn.click(function(){
		initializeGame();
		$("#message").html("");
		startBtn.hide();
	});

	//Click image to get user or to get opponent
	$("body").on("click", ".ninjaImage", function(){
		var selection = $(this).attr("data-char");
		var fightArea = $("#fight");
		if (ninjas.userChar === ""){
			ninjas.userChar = selection;
			moveUserChar(selection);
		}
		else if (ninjas.opponent === ""){
			ninjas.opponent = selection;
			moveOpponentChar(selection);
			attackBtn.show();
		}
		else{
			return;
		}
	});
	
	$(attackBtn).click(function(){
		attack();			
	});



});
