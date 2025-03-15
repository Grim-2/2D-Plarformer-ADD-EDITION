const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

function preload() {
    this.load.image('sky', 'assets/sky.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('plank', 'assets/plank.png');
    this.load.image('ad', 'assets/ad.png');
    this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
}

function create() {
    this.add.image(400, 300, 'sky');

    const platforms = this.physics.add.staticGroup();
    platforms.create(400, 568, 'ground').setScale(2).refreshBody();
    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');

    const player = this.physics.add.sprite(100, 450, 'dude');
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [{ key: 'dude', frame: 4 }],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    this.physics.add.collider(player, platforms);

    const cursors = this.input.keyboard.createCursorKeys();

    const ads = this.physics.add.group();
    const ad = ads.create(400, 300, 'ad');
    ad.setCollideWorldBounds(true);
    ad.setBounce(1);
    ad.setVelocity(Phaser.Math.Between(-200, 200), 20);

    const planks = this.physics.add.group();
    const plank = planks.create(400, 300, 'plank');
    plank.setInteractive();
    plank.on('pointerdown', () => {
        plank.destroy();
        ad.destroy();
    });

    this.physics.add.collider(planks, platforms);

    this.input.on('pointerdown', function (pointer) {
        const plank = planks.create(pointer.x, pointer.y, 'plank');
        plank.setInteractive();
        plank.on('pointerdown', () => {
            plank.destroy();
        });
    });
}

function update() {
    const cursors = this.input.keyboard.createCursorKeys();
    const player = this.physics.add.sprite(100, 450, 'dude');

    if (cursors.left.isDown) {
        player.setVelocityX(-160);
        player.anims.play('left', true);
    } else if (cursors.right.isDown) {
        player.setVelocityX(160);
        player.anims.play('right', true);
    } else {
        player.setVelocityX(0);
        player.anims.play('turn');
    }

    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-330);
    }
}
