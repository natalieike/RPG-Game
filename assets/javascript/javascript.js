$(document).ready(function(){
	var ninjas;  //game object holding all of the characters
	var startBtn = $("#startBtn");
	var attackBtn = $("#attackBtn");

	//object constructor for each character
	function character(aP, hP, cP, pic){
		this.healthPoints = hP;
		this.attackPower = aP;
		this.counterAttackPower = cP;
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
			steve: new character(6, 175, 15, "assets/images/angryNinja.jpeg"),
			tiffany: new character(12, 100, 24, "assets/images/girlNinja2.png"),
			kenny: new character(9, 120, 20, "assets/images/happyNinja2.jpg"),
			bobby: new character(9, 130, 18, "assets/images/doubleSwordNinja.png"),
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

	//Returns an individual Ninja image wrapped in a Div
	var buildNinjaImg = function(imageFilename, idName){
		var newImg = $("<img>");
		var newDiv = $("<div>");
		newDiv.addClass("ninjaDiv pull-left");
		newImg.attr("src", imageFilename);
		newImg.attr("class", "ninjaImage");
		newImg.attr("data-char", idName);
		newDiv.html(newImg);
		return(newDiv);
	};

	//Attack Sequence:  throw star, call getAttacked method, increase CP, and call counter attack if not a winner
	var attack = function(){
		var attacker = ninjas.userChar;
		var opposition = ninjas.opponent;
		var throwingStar = "<img src='assets/images/throwingStar.png' class='weaponImage' id='star'>";
		var setupArea = $("#setup");
		//Throw star
		setupArea.html(throwingStar);
		$("#star").animate({ left: "+=500px" }, "slow", function(){
			//Attack opponent
			ninjas[opposition].getAttacked(ninjas[attacker].counterAttackPower);
			updateStats();
			//Win match or counter attack
			if (ninjas[opposition].defeated){
				$("#message").html("You won the match.  You have attacked with " + ninjas[attacker].counterAttackPower + " attack power.")
				winMatch();
			}
			else{
				$("#message").html("You have attacked with " + ninjas[attacker].counterAttackPower + " attack power.");
				counterAttack();
			}
			//Iterate User Attack Power
			ninjas[attacker].counterAttackPower += ninjas[attacker].attackPower;
		});
	};

	//Counter Attack sequence:  throw bomb, call getAttacked method
	var counterAttack = function(){
		var attacker = ninjas.userChar;
		var opposition = ninjas.opponent;
		var bomb = "<img src='assets/images/bomb4.png' class='weaponImage' id='bomb'>";
		var setupArea = $("#setup");
		//Throw bomb
		setupArea.append(bomb);
		$("#bomb").offset({ left: 850 });
		$("#bomb").animate({ left: "-=450px" }, "slow", function(){
			//Attack
			ninjas[attacker].getAttacked(ninjas[opposition].counterAttackPower);
			updateStats();
			//Lose Game or Prepare to attack again
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
		newImg.addClass("user");
		newImg.append("<p class='text-align stats'>HP: " + ninjas[userSelect].healthPoints + '</p>');
		fightArea.append(newImg);
		ninjas[userSelect].counterAttackPower = ninjas[userSelect].attackPower;
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
		newImg.addClass("opponentDiv");
		newImg.append("<p class='text-align stats'>HP: " + ninjas[userSelect].healthPoints + '</p>');
		fightArea.append(newImg);
		rebuildWaitingArea();
		messageArea.html("");
	};

	//Moves losing opponent to loser area and decides if game is won or next opponent should be chosen
	var moveLoser = function(loser){
		var fightArea = $("#fight");
		var defeatedArea = $("#defeated");
		var messageArea = $("#message");
		var waitingArea = $("#waiting");
		var newImg = buildNinjaImg(ninjas[loser].picture, loser);
		newImg.attr("class", "ninjaImage");
		defeatedArea.append(newImg);
		$(".opponentDiv").remove();
		$(".weaponImage").remove();
		rebuildWaitingArea();
		//Win Game or Choose next opponent
		if(waitingArea.html() == ""){
			messageArea.html("You Won!");
			startBtn.show();
			$(".ninjaImage").remove();
			$(".user").remove();
		}
		else {
			messageArea.html("Please choose your next opponent");
		}
	};

	//Win Match sequence
	var winMatch = function(){
		attackBtn.hide();
		moveLoser(ninjas.opponent);
		ninjas.opponent = "";
	};

	//Lose Game sequence
	var loseGame = function(){
		attackBtn.hide();
		startBtn.show();	
		$(".ninjaImage").remove();
		$(".opponentDiv").remove();
		$(".user").remove();
		$(".weaponImage").remove();
	};

	//Updates the HP stats in UI for two fighting characters
	var updateStats = function(){
		var userDiv = $(".user");
		var opponentDiv = $(".opponentDiv");
		var userChar = ninjas.userChar;
		var opponentChar = ninjas.opponent;
		$(".stats").remove();
		userDiv.append("<p class='text-align stats'>HP: " + ninjas[userChar].healthPoints + '</p>');
		opponentDiv.append("<p class='text-align stats'>HP: " + ninjas[opponentChar].healthPoints + '</p>');
	}

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
			if(selection == ninjas.userChar){
				$("#message").html("You can't play yourself. Please choose again.");
			}
			else{
				ninjas.opponent = selection;
				moveOpponentChar(selection);
				attackBtn.show();	
				$("#message").empty();			
			}
		}
		else{
			return;
		}
	});
	
	//Click attack button
	$(attackBtn).click(function(){
		attack();			
	});

});
