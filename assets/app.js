$(document).ready(function () {

    var game = {
        $player_stats: $("#player-stats"),
        player_stats: "",
        $opponent_stats: $("#opponent-stats"),
        opponent_stats: "",
        $attack_results: $("#attack-results"),

        newGame: false,

        playableCharacters: [],
        attackableCharacters: [],
        activePlayer: 0,
        activeOpponent: 0,

        characterObj: function (hp, atk, ref) {
            return {
                health: hp,
                baseAttack: atk,
                attackPower: atk,
                counterPower: atk * 2,
                attackMult: 1,
                $ref: ref,
                dead: false,
                attack: function (opponent) {
                    opponent.health -= this.attackPower;
                    this.attackPower += this.baseAttack * this.attackMult;
                    this.attackMult++;
                    if (opponent.health <= 0) {
                        opponent.dead = true;
                    }
                },
                counter: function (opponent) {
                    opponent.health -= this.counterPower;
                    if (opponent.health <= 0) {
                        opponent.dead = true;
                    }
                },
                hide: function () {
                    // console.log("hidden " + ref)
                    $(this.$ref).addClass("hidden");
                },
                show: function () {
                    // console.log("shown " + ref)
                    $(this.$ref).removeClass("hidden");
                }
            };
        },

        playTurn: function () {

            if (this.activeOpponent === 0 || this.activePlayer === 0) {
                return;
            }

            var result = $("<p>").text("You dealt " + this.activePlayer.attackPower
                + " damage, and received " + this.activeOpponent.attackPower + " damage.");
            this.$attack_results.prepend(result);

            this.activePlayer.attack(this.activeOpponent);
            this.activeOpponent.counter(this.activePlayer);

            if (this.activePlayer.dead) {
                this.resetCharacters();
                this.resetCharacterDisplays();
                this.resetTextDisplays();

                if (this.activeOpponent.dead) {
                    var tie = $("<p>").text("You and your opponent both fainted! Select new characters to try again.");
                    this.$attack_results.prepend(tie);
                } else {
                    var loss = $("<p>").text("You lost! Select new characters to try again.");
                    this.$attack_results.prepend(loss);
                }

            } else if (this.activeOpponent.dead) {
                this.activeOpponent.hide();
                this.activeOpponent = 0;
                this.$opponent_stats.text("");

                var stillPlaying = false;
                for (let i = 0; i < this.attackableCharacters.length; i++) {
                    if (!this.attackableCharacters[i].dead) {
                        this.attackableCharacters[i].show();
                        stillPlaying = true;
                    }
                }

                if (stillPlaying) {
                    var win = $("<p>").text("You won! Select a new opponent to continue.");
                    this.$attack_results.prepend(win);
                } else {
                    var gameOver = $("<p>").text("You defeated all opponents! Game over!");
                    this.$attack_results.prepend(gameOver);
                    $("#attack").text("New game?");
                    this.newGame = true;
                }
            }

            this.updateTextDisplays();
        },

        playerSelect: function (id) {
            if (this.activePlayer === 0) {
                for (let i = 0; i < this.playableCharacters.length; i++) {
                    if (id === this.playableCharacters[i].$ref) {
                        this.activePlayer = this.playableCharacters[i];
                        this.updateTextDisplays();
                    } else {
                        this.playableCharacters[i].hide();
                    }
                }
            }
        },

        opponentSelect: function (id) {
            if (this.activeOpponent === 0) {
                for (let i = 0; i < this.attackableCharacters.length; i++) {
                    if (id === this.attackableCharacters[i].$ref) {
                        this.activeOpponent = this.attackableCharacters[i];
                        this.updateTextDisplays();
                    } else {
                        this.attackableCharacters[i].hide();
                    }
                }
            }
        },

        updateTextDisplays: function () {
            if (this.activeOpponent !== 0) {
                this.opponent_stats = "HP: " + this.activeOpponent.health + ", ATK: " + this.activeOpponent.attackPower;
                this.$opponent_stats.text(this.opponent_stats);
            }
            if (this.activePlayer !== 0) {
                this.player_stats = "HP: " + this.activePlayer.health + ", ATK: " + this.activePlayer.attackPower;
                this.$player_stats.text(this.player_stats);
            }
        },

        resetCharacters: function () {
            let player1 = this.characterObj(140, 5, "#player-1");
            let player2 = this.characterObj(100, 15, "#player-2");
            let player3 = this.characterObj(120, 10, "#player-3");
            this.playableCharacters = [player1, player2, player3];

            let attack1 = this.characterObj(140, 5, "#attack-1");
            let attack2 = this.characterObj(100, 15, "#attack-2");
            let attack3 = this.characterObj(120, 10, "#attack-3");
            this.attackableCharacters = [attack1, attack2, attack3];

            this.activeOpponent = 0;
            this.activePlayer = 0;
        },

        resetCharacterDisplays: function () {
            this.playableCharacters.forEach(function (item) {
                item.show();
            });

            this.attackableCharacters.forEach(function (item) {
                item.show();
            });
        },

        resetTextDisplays: function () {
            $(".text-display").text("");
        },

        init: function () {
            this.resetCharacters();
            this.resetCharacterDisplays();
            this.resetTextDisplays();
            this.$attack_results.text("");
            $("#attack").text("Attack");
            this.activeOpponent = 0;
            this.activePlayer = 0;
            this.newGame = false;
        }

    };

    function createListeners() {
        $(".player-char").on("click", function () {
            let ref = "#" + this.id;
            game.playerSelect(ref);
        });

        $(".opponent-char").on("click", function () {
            let ref = "#" + this.id;
            game.opponentSelect(ref);
        });

        $("#attack").on("click", function () {
            if (game.newGame) {
                game.init();
            } else {
                game.playTurn();
            }
        });
    }

    createListeners();
    game.init();
});