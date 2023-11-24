class DontLeaveGame extends BaseGame {

    static SIZE_X = 400; 
    static SIZE_Y = 240; 

    constructor() {
        super();
    }

    init(){
        super.init();

        CoreRenderer.ChangeTargetResolution(new Vector(DontLeaveGame.SIZE_X, DontLeaveGame.SIZE_Y)); 

        this.addScene(Constants.Scenes.Game);
        this.addLayer(Constants.Scenes.Game, Constants.Layers.Terrain, 1);
        this.addLayer(Constants.Scenes.Game, Constants.Layers.Entity, 2);

        this.terrain = new Terrain(); 

        this.player = new Player(); 
        this.player.setPosition(new Vector(50, 50)); 
        this.addObject(Constants.Scenes.Game, Constants.Layers.Entity, this.player);

        this._addRandomEntities(); 

        this.activateScene(Constants.Scenes.Game);
    }

    _addRandomEntities(){
        for(var i = 0; i <150; i++){
            const enemy = new Entity(); 
            enemy.setPosition(new Vector(MathUtil.GetRandomInt(0, World.WorldResolution.x), MathUtil.GetRandomInt(0, World.WorldResolution.y))); 
            enemy.collidable = true ; 
            enemy.setColor("rgba(50, 180, 90, 0.5)");
            this.addObject(Constants.Scenes.Game, Constants.Layers.Entity, enemy);
        }
    }

    update() {
        this.terrain.update(); 
        super.update();
    }

    render() {
        World.Render(this.player); 
        super.render();
        this.terrain.render(); 
    }

}