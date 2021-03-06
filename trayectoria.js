var state = new Kiwi.State('Play');

state.preload = function() {
    //this.addJSON( 'tilemap', 'tilemap.json');
    this.addSpriteSheet( 'libroarma', 'assets/libro1.1.png', 70, 70 );
    this.addSpriteSheet( 'botella', 'assets/botella.png', 70, 70 );
    this.addSpriteSheet( 'tiles', 'assets/tileset.png', 48, 48 );
    this.addSpriteSheet( 'profesor', 'assets/profesor1.png', 30, 120 );
    //this.addImage('background','jungle.png');
    this.addImage( 'ground', 'assets/ground.png' );
    this.addImage( 'profe', 'assets/profe1.1.png' );
    this.addImage( 'profe1', 'assets/alumno.png' );
};

state.create = function() {

    this.tilemap = new Kiwi.GameObjects.Tilemap.TileMap( this );
    this.tilemap.setTo( 48, 48, 17, 8 );

    this.tilemap.createTileType( 0 );
    this.tilemap.createTileType( 1 );
    this.tilemap.createTileType( 2 );
    this.tilemap.createTileType( 3 );
    this.tilemap.createTileType( 4 );


    
         var n1=Math.floor((Math.random()*4)+0),n2=Math.floor((Math.random()*4)+0),n3=Math.floor((Math.random()*4)+0);//,n2=(Math.random()*4)+1,n3=(Math.random()*4)+1;
    //this.n1 = new Kiwi.GameObjects.Textfield(this, '0', 250, 30, '#FFF',8);
    //this.addChild(this.n1);
    

    var tilemapdata = [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, n2, 0, 0, 0, 0, n2, 0, 0, 0, n1, 0, 0, 0, 0,
        0, 0, 0, 0, 0, n1, 0, 0, n3, 0, n2, 0, 0, n2, n2, 0, 0,
        0, 0, 0, 0, n1, 0, n2, n3, 0, 0, 0, 0, n1, 0, 0,0, 0,
        0, 0, 0, n1, 0, 0, 0, 0, 0, 0, 0, 0, n2, n3, 0, 0, 0,
        0, 0, 0, 0, n2, n2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, n1, 0, n2, n3, n3, n1, n2, 0, 0, 0,
        0, 0, 0, 0, n1, 0, n2, 0, n3, 0, n3, n2, n1, 0, 0, 0, 0
    ];





    this.ground = new Platform( this, 0, 105 );

    this.background = new Kiwi.GameObjects.StaticImage(this, this.textures[ "background" ], 0, 0, true );
    this.addChild( this.ground );
    this.addChild(this.background);


    this.game.stage.color = "7CA8B4";

   
    this.profesor=new Kiwi.GameObjects.Sprite(this,this.textures.profesor,100,100);
    this.addChild(this.profesor);
    
    this.profesor.animation.add('lanza',[ 0, 1, 2 ], 0.1, true, false);
    this.game.input.mouse.onDown.add(this.mouseClicked,this);


    this.profe = new Kiwi.GameObjects.StaticImage(this, this.textures[ "profe" ], 60, this.game.stage.height-120, true );
    this.addChild( this.profe );
    this.addChild(this.profe);




    this.profe1 = new Kiwi.GameObjects.StaticImage(this, this.textures[ "profe1" ], this.game.stage.width-100, this.game.stage.height-120, true );
    this.addChild( this.profe1 );
    this.addChild(this.profe1);

    this.disparo = 200;
    this.velocidad = Math.floor((Math.random()*250)+20);
    this.numbalas = 20;
    this.gravedad = 50;

    this.explodeGroup = new Kiwi.Group( this );
   // this.libroarma.physics = this.libroarma.components.add( new Kiwi.Components.ArcadePhysics( this.libroarma, this.libroarma.box ) );
    

    this.trajectoryGroup = new Kiwi.Group ( this );
    this.addChild( this.trajectoryGroup );
    this.libroarma = new Kiwi.GameObjects.Sprite( this, '', 100, this.game.stage.height - 100 );


    this.libroarma2 = new Kiwi.GameObjects.Sprite( this, this.textures.botella, this.game.stage.width-100, this.game.stage.height - 110 );
    this.addChild( this.libroarma );
    this.addChild( this.libroarma2 );

    this.libroarma.anchorPointX = this.libroarma.width * 0.5;
    this.libroarma.anchorPointY = this.libroarma.height * 0.5;

    this.libroarma2.anchorPointX = this.libroarma2.width * 0.5;
    this.libroarma2.anchorPointY = this.libroarma2.height * 0.5;



    this.balaPool = new Kiwi.Group( this );
    this.addChild ( this.balaPool );
    for( var i = 0; i < this.numbalas; i++ ) {
        var bala = new Kiwi.GameObjects.Sprite( this, this.textures.libroarma, -100, -100 );
        this.balaPool.addChild( bala );
        bala.anchorPointX = this.libroarma.width * 0.5;
        bala.anchorPointY = this.libroarma.height * 0.5;
        bala.box.hitbox=new Kiwi.Geom.Rectangle(48,9,50,117);
        bala.physics = bala.components.add(new Kiwi.Components.ArcadePhysics(bala, bala.box));
        bala.physics.acceleration.y = this.gravedad;
        bala.alive = false;
        bala.active = false;
    }

  /*  this.balaPool2 = new Kiwi.Group( this );
    this.addChild ( this.balaPool2 );
    for( var i = 0; i < this.numbalas; i++ ) {
        var bala2 = new Kiwi.GameObjects.Sprite( this, this.textures.libroarma2, -100, -100 );
        this.balaPool.addChild( bala );
        bala2.anchorPointX = this.libroarma2.width * 0.5;
        bala2.anchorPointY = this.libroarma2.height * 0.5;
        bala2.box.hitbox=new Kiwi.Geom.Rectangle(48,9,50,117);
        bala2.physics = bala.components.add(new Kiwi.Components.ArcadePhysics(bala2, bala2.box));
        bala2.physics.acceleration.y = this.gravedad;
        bala2.alive = false;
        bala2.active = false;
    }
*/

    //Create a new TileMapLayer
    this.tilemap.createNewLayer( 'Ground', this.textures.tiles, tilemapdata );

    //Add the Layer to the State to be Rendered.
   /* for(var i = 1; i < this.tilemap.tileTypes.length; i++) {
        this.tilemap.tileTypes[i].allowCollisions = Kiwi.Components.ArcadePhysics.ANY;
}*/    
    this.addChild( this.tilemap.layers[0] );

    this.addChild( this.explodeGroup );


    this.addChild(this.ground);

    for(var i = 1; i < this.tilemap.tileTypes.length; i++) {
            this.tilemap.tileTypes[i].allowCollisions = Kiwi.Components.ArcadePhysics.ANY;
        }
  

    this.vx = 0;
    this.vxText = new Kiwi.GameObjects.Textfield(this, '0', 50, 30, '#FFF',8);
    this.addChild(this.vxText);
    this.vx = 0;

    this.vy = 0;
    this.vyText = new Kiwi.GameObjects.Textfield(this, '0', 50, 40, '#FFF',8);
    this.addChild(this.vyText);
  
};

state.mouseClicked = function () {
    this.profesor.animation.play( 'lanza' );
}

state.shootbala = function() {
  if (this.lastbalaShotAt === undefined) this.lastbalaShotAt = 0;
    if (this.game.time.now() - this.lastbalaShotAt < this.disparo) return;
    this.lastbalaShotAt = this.game.time.now();

    var bala = this.getFirstDeadbala();

    if (bala === null || bala === undefined) return;
    this.revive( bala );
    bala.x = this.libroarma.x;
    bala.y = this.libroarma.y;

    bala.rotation = this.libroarma.rotation;
    bala.physics.velocity.x = Math.cos(bala.rotation) * Math.floor((Math.random()*250)+20);
    bala.physics.velocity.y = Math.sin(bala.rotation) * Math.floor((Math.random()*250)+20);
    this.vxText.text='Velocidad x: '+Math.ceil(bala.physics.velocity.x);
    console.log('vx:', this.vx);
    this.vyText.text='Velocidad y: '+Math.ceil(bala.physics.velocity.y);
    console.log('vy:', this.vy);

};

state.getFirstDeadbala = function () {

    var balas = this.balaPool.members;

    for (var i = balas.length - 1; i >= 0; i--) {
      if (balas[i].physics.overlaps(this.profe1,true)) {

        this.explodeGroup.addChild(
                new Explosion( this, balas[ i ].x - 30, balas[ i ].y - 55 ) );
            balas[ i ].destroy();
            break;

      };  if ( !balas[i].alive ) {
            return balas[i];
        }
    };
    return null;
}

state.revive = function ( bala ){
    bala.alive = true;
    bala.active = true;
    
}
state.checkbalaPosition = function ( bala ) {
    
    if( bala.x > this.game.stage.width || bala.x < 0 ||
        bala.y > this.game.stage.height || bala.y < 0 ){
        bala.alive = false;
        bala.active = false;
    } 
}

state.drawTrajectory = function () {

}

state.update = function() {
//    Kiwi.State.prototype.update.call(this);

    //Update physics
    Kiwi.State.prototype.update.call( this );



    this.tilemap.layers[0].physics.overlapsTiles(this.libroarma, true);



    this.checkCollision();
    this.drawTrajectory();

    this.libroarma.rotation = Kiwi.Utils.GameMath.angleBetween( this.libroarma.x, this.libroarma.y, this.game.input.x, this.game.input.y );
    this.balaPool.forEach(this, function( bala ) {
        bala.rotation = Math.atan2(bala.physics.velocity.y, bala.physics.velocity.x);
    }, this);


    if (this.game.input.mouse.isDown) {

        this.shootbala();
    }

    this.balaPool.forEach( this, this.checkbalaPosition );


};

state.checkCollision = function () {
    this.tilemap.layers[0].physics.overlapsTiles( this.libroarma, true );
}
state.angleToPointer = function ( from ) {
    return Math.atan2( this.game.input.y - from.y, this.game.input.x - from.x );

}


var Platform = function ( state, x, y ) {
    Kiwi.GameObjects.Sprite.call(
        this, state, state.textures[ "ground" ], x, y, true );
    this.physics = this.components.add( new Kiwi.Components.ArcadePhysics(
        this, this.box) );
    this.physics.immovable = true;
};
Kiwi.extend( Platform, Kiwi.GameObjects.Sprite );

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



var Explosion = function ( state, x, y ) {
    Kiwi.GameObjects.Sprite.call(
        this, state, state.textures[ "explosion" ], x, y );
    this.animation.add( "explode", [ 0, 1, 2, 3, 4 ], 0.1, false );
    this.animation.play( "explode" );
};
Kiwi.extend( Explosion, Kiwi.GameObjects.Sprite );


Explosion.prototype.update = function() {
    Kiwi.GameObjects.Sprite.prototype.update.call( this );

    this.x -= 2;
    if ( this.animation.currentCell === 4) {
        this.destroy();
    }
};

var gameOptions = {
    width: 1000,
    height: 500
};
var game = new Kiwi.Game('game-container', 'Follower', state, gameOptions);
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
    var theta = -this.libroarma.rotation;
    var x = 0, y = 0;
    for(var t = 0 + this.timeOffset/(1000*MARCH_SPEED/60); t < 9; t += 0.06) {
        x = this.velocidad * t * Math.cos(theta);
        y = this.velocidad * t * Math.sin(theta) - 0.5 * this.gravedad * t * t;
        this.drawRect( x + this.libroarma.x + this.libroarma.width * 0.5, this.libroarma.y - y + this.libroarma.height * 0.5, 3, 3 );
        if (y < -160) break;
    }

};*/