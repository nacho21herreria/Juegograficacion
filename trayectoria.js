var state = new Kiwi.State('Play');

state.preload = function() {
    this.addJSON( 'tilemap', 'ambiente1.json');
    this.addSpriteSheet( 'circle', 'book1.png', 70, 70 );
    this.addSpriteSheet( 'tiles', 'tileset.png', 48, 48 );
    //this.addImage('background','jungle.png');
    //this.addImage( "ground", "ground.png" );
};

state.create = function() {

    //this.ground = new Platform( this, 0, 505 );
    //this.addChild( this.ground );

    this.background = new Kiwi.GameObjects.StaticImage(this, this.textures[ "background" ], 0, 0, true );
    this.addChild(this.background);

    this.game.stage.color = "7CA8B4";

    this.SHOT_DELAY = 300;
    this.BULLET_SPEED = 200;
    this.NUMBER_OF_BULLETS = 20;
    this.GRAVITY = 50;

    this.trajectoryGroup = new Kiwi.Group ( this );
    this.addChild( this.trajectoryGroup );
    this.gun = new Kiwi.GameObjects.Sprite( this, this.textures.circle, 50, this.game.stage.height - 100 );
    this.addChild( this.gun );

    this.gun.anchorPointX = this.gun.width * 0.5;
    this.gun.anchorPointY = this.gun.height * 0.5;

    this.bulletPool = new Kiwi.Group( this );
    this.addChild ( this.bulletPool );
    for( var i = 0; i < this.NUMBER_OF_BULLETS; i++ ) {
        var bullet = new Kiwi.GameObjects.Sprite( this, this.textures.circle, -100, -100 );
        this.bulletPool.addChild( bullet );
        bullet.anchorPointX = this.gun.width * 0.5;
        bullet.anchorPointY = this.gun.height * 0.5;
        bullet.physics = bullet.components.add(new Kiwi.Components.ArcadePhysics(bullet, bullet.box));
        bullet.physics.acceleration.y = this.GRAVITY;
        bullet.alive = false;
        bullet.active = false;
    }

    this.tilemap = new Kiwi.GameObjects.Tilemap.TileMap(this, 'tilemap', this.textures.tiles);

    for( var i = 0; i < this.tilemap.layers.length; i++ ) {
        this.addChild( this.tilemap.layers[ i ] );
    }

  /*  for(var i = 1; i < this.tilemap.tileTypes.length; i++) {
        this.tilemap.tileTypes[i].allowCollisions = Kiwi.Components.ArcadePhysics.ANY;
    }
*/

};

state.checkCollision = function () {
    this.tilemap.layers[0].physics.overlapsTiles( this.character, true );
}



state.shootBullet = function() {
  if (this.lastBulletShotAt === undefined) this.lastBulletShotAt = 0;
    if (this.game.time.now() - this.lastBulletShotAt < this.SHOT_DELAY) return;
    this.lastBulletShotAt = this.game.time.now();

    var bullet = this.getFirstDeadBullet();

    if (bullet === null || bullet === undefined) return;
    this.revive( bullet );
    bullet.x = this.gun.x;
    bullet.y = this.gun.y;

    bullet.rotation = this.gun.rotation;
    bullet.physics.velocity.x = Math.cos(bullet.rotation) * this.BULLET_SPEED;
    bullet.physics.velocity.y = Math.sin(bullet.rotation) * this.BULLET_SPEED;
};

state.getFirstDeadBullet = function () {

    var bullets = this.bulletPool.members;

    for (var i = bullets.length - 1; i >= 0; i--) {
        if ( !bullets[i].alive ) {
            return bullets[i];
        }
    };
    return null;
}

state.revive = function ( bullet ){
    bullet.alive = true;
    bullet.active = true;
}
state.checkBulletPosition = function ( bullet ) {
    
    if( bullet.x > this.game.stage.width || bullet.x < 0 ||
        bullet.y > this.game.stage.height || bullet.y < 0 ){
        bullet.alive = false;
        bullet.active = false;
    } 
}

state.drawTrajectory = function () {

}

state.update = function() {
    Kiwi.State.prototype.update.call( this );
    this.drawTrajectory();

    this.gun.rotation = Kiwi.Utils.GameMath.angleBetween( this.gun.x, this.gun.y, this.game.input.x, this.game.input.y );
    this.bulletPool.forEach(this, function( bullet ) {
        bullet.rotation = Math.atan2(bullet.physics.velocity.y, bullet.physics.velocity.x);
    }, this);


    if (this.game.input.mouse.isDown) {
        this.shootBullet();
    }

    this.bulletPool.forEach( this, this.checkBulletPosition );
};

state.angleToPointer = function ( from ) {
    return Math.atan2( this.game.input.y - from.y, this.game.input.x - from.x );

}

/*state.drawTrajectory = function() {
    this.trajectoryGroup.clear();

    // Calculate a time offset. This offset is used to alter the starting
    // time of the draw loop so that the dots are offset a little bit each
    // frame. It gives the trajectory a "marching ants" style animation.
    var MARCH_SPEED = 15; // Smaller is faster
    this.timeOffset = this.timeOffset + 1 || 0;
    this.timeOffset = this.timeOffset % MARCH_SPEED;

    // Draw the trajectory
    // http://en.wikipedia.org/wiki/Trajectory_of_a_projectile#Angle_required_to_hit_coordinate_.28x.2Cy.29
    var theta = -this.gun.rotation;
    var x = 0, y = 0;
    for(var t = 0 + this.timeOffset/(1000*MARCH_SPEED/60); t < 9; t += 0.06) {
        x = this.BULLET_SPEED * t * Math.cos(theta);
        y = this.BULLET_SPEED * t * Math.sin(theta) - 0.5 * this.GRAVITY * t * t;
        this.drawRect( x + this.gun.x + this.gun.width * 0.5, this.gun.y - y + this.gun.height * 0.5, 3, 3 );
        if (y < -160) break;
    }

};*/

state.drawRect = function ( x, y, width, height ) {
    var params = {
            state: this,
            width: width,
            height: height,
            x: x - width * 0.5,
            y: y - height * 0.5,
            alpha: 0.5,
            drawStroke: false,
            color: [ 1.0, 1.0, 1.0 ]
        };
        var trajDot = new Kiwi.Plugins.Primitives.Rectangle( params );
        this.trajectoryGroup.addChild ( trajDot );
}

/*State.updateParallax = function() {
    var i;

    //Ground
    for ( i =0; i < this.grassGroup.members.length; i++ ) {
        this.grassGroup.members[ i ].transform.x -= 1;
        if ( this.grassGroup.members[ i ].transform.worldX <= -48 ) {
            this.grassGroup.members[ i ].transform.x = 48 * 19;
        }
    }
};


var Platform = function ( state, x, y ) {
    Kiwi.GameObjects.Sprite.call(
        this, state, state.textures[ "ground" ], x, y, true );
    this.physics = this.components.add( new Kiwi.Components.ArcadePhysics(
        this, this.box) );
    this.physics.immovable = true;
};
Kiwi.extend( Platform, Kiwi.GameObjects.Sprite );
*/

var gameOptions = {
    width: 1100,
    height: 500
};
var game = new Kiwi.Game('game-container', 'Follower', state, gameOptions);
