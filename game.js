// define variables
let game;
let player;
let platforms;
let badges;
let items;
let cursors;
let jumpButton;
let text;
let winningMessage;
let won = false;
let currentScore = 0;
let winningScore = 100;

// add collectable items to the game
function addItems() {
  items = game.add.physicsGroup();
  createItem(375, 300, 'coin');
  createItem(275, 300, 'coin');
  createItem(175, 300, 'coin');
  createItem(370, 200, 'coin');
  createItem(375, 300, 'coin');
  createItem(375, 100, 'coin');
  createItem(300, 300, 'coin');
  createItem(305, 100, 'coin');
  createItem(700, 400, 'star');
  createItem(600, 200, 'poison');
}

// add platforms to the game
function addPlatforms() {
  platforms = game.add.physicsGroup();
  platforms.create(100, 450, 'platform');
  platforms.create(500, 350, 'platform');
  platforms.create(300, 400, 'platform');
  platforms.setAll('body.immovable', true); // if you set this to false, the platform would move. Makes the game harder
}

// setup game when the web page loads
window.onload = function () {
  game = new Phaser.Game(800, 600, Phaser.AUTO, '', 
    { 
      preload: preload, 
      create: create, 
      update: update // phaser knows this is a loop
    });

  // before the game begins
  function preload() {
    game.stage.backgroundColor = '#5db1ad';
    
    //Load images
    game.load.image('platform', 'platform_1.png');
    
    //Load spritesheets
    game.load.spritesheet('player', 'frog.png', 32, 32); // 48 is the width, 62 is the height - chalkers. Mike the frog is 32, 32
    game.load.spritesheet('coin', 'coin.png', 36, 44);
    game.load.spritesheet('badge', 'badge.png', 42, 54);
    game.load.spritesheet('star', 'star.png', 32, 32);
    game.load.spritesheet('poison', 'poison.png', 32, 32);
  }

  // initial game set up (object attributes)
  function create() {
    player = game.add.sprite(50, 600, 'player');
    player.animations.add('walk');
    player.anchor.setTo(0.5, 1);
    game.physics.arcade.enable(player);
    player.body.collideWorldBounds = true;
    player.body.gravity.y = 500; // the sprite can jump really high, the lower the gravity!
    player.body.bounce.y = .25; // adds bounce (less than 1 keeps it from colliding)

    addItems();
    addPlatforms();

    cursors = game.input.keyboard.createCursorKeys();
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR); // can change to .UP for up arrow
    text = game.add.text(16, 16, "SCORE: " + currentScore, { font: "bold 24px Arial", fill: "white" });
    winningMessage = game.add.text(game.world.centerX, 275, "", { font: "bold 48px Arial", fill: "white" }); // "" is so text isn't shown until end of the game
    winningMessage.anchor.setTo(0.5, 1);
  }

  // while the game is running (constant loopl - encouraged, in this case)
  function update() {
    text.text = "SCORE: " + currentScore;
    game.physics.arcade.collide(player, platforms);
    game.physics.arcade.overlap(player, items, itemHandler);
    game.physics.arcade.overlap(player, badges, badgeHandler);
    player.body.velocity.x = 0;

    // is the left cursor key pressed?
    if (cursors.left.isDown) {
      player.animations.play('walk', 10, true);
      player.body.velocity.x = -300;
      player.scale.x = - 1;
    }
    // is the right cursor key pressed?
    else if (cursors.right.isDown) {
      player.animations.play('walk', 10, true);
      player.body.velocity.x = 300;
      player.scale.x = 1;
    }
    // player doesn't move
    else {
      player.animations.stop();
      player.frame = 1; // the sprite stops on the 2nd frame when not moving
    }
    
    if (jumpButton.isDown && (player.body.onFloor() || player.body.touching.down)) {
      player.body.velocity.y = -500; // affects jump, besides gravity
    }
    // when the player wins the game
    if (won) {
      winningMessage.text = "YOU WIN!!!";
    }
  }
};