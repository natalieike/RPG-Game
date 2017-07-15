$(document).ready(function(){
	var ninjas;  //game object holding all of the characters

	//object constructor for each character
	function character(aP, hP, pic){
		this.healthPoints = hP;
		this.attackPower = aP;
		this.counterAttackPower = aP;
		this.defeated = false;
		this.picture = pic;

		//function to deduct HPs when attacked
		this.getAttacked = function(cP){
			this.healthPoints =- cP;
		};

		//function to determine if character is defeated
		this.isDefeated = function(){
			if (this.healthPoints < 0){
				this.defeated = true;
			}
			return(this.defeated);
		}
	};


	//Initialize the ninjas object with each character and display character choices
	var initializeGame = function(){
		var setup = $("#setup"); //space where images will be displayed

		//set up ninjas object with initialized characters
		ninjas = {
			steve: new character(5, 160, "assets/images/angryNinja.jpeg"),
			tiffany: new character(20, 100, "assets/images/girlNinja2.png"),
			kenny: new character(15, 120, "assets/images/happyNinja2.jpg"),
			bobby: new character(10, 140, "assets/images/doubleSwordNinja.png"),
		};
		//build HTML for showing character options
		setup.html("<p class='center'>Please select your character</p>");
		for (var i in ninjas){
			var newImg = $("<img>");
			newImg.attr("src", ninjas[i].picture);
			newImg.attr("class", "ninjaImage");
			newImg.attr("data-char", i);
			setup.append(newImg);
		};
	};


	var attack = function(attacker, opponent){
		opponent.getAttacked(user.counterAttackPower);
		if (opponent.defeated){
			winMatch();
		}
		else{
			attacker.counterAttackPower += attacker.attackPower;
			$("#message").html("You have attacked with " + user.counterAttackPower + "attack power.  Get ready for the counter attack.")
		}
	};

	var counterAttack = function(user, opponent){
		user.getAttacked(opponent.counterAttackPower);
		if (user.defeated){
			loseGame();
		}
		else{
			$("#message").append("Your opponent has attacked with " + opponent.counterAttackPower + "attack power.  Please attack again when ready.")
		}
	};

	//var winMatch = function(){

	//};

	//var loseGame = function(){

	//};

	//Hide Attack button until ready to attack
	$("#attackBtn").hide();

	$("#startBtn").click(function(){
		initializeGame();
		$("#startBtn").hide();
	});

	

});
