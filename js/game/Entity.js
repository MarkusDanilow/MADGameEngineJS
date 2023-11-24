class Entity extends GameObject{

    constructor(){
        super();
        this.setSize(new Vector(World.TileSize, 2 * World.TileSize));
        this._updateCollisionBoundingBox(
            this.renderingBoundingBox.x, this.renderingBoundingBox.y + this.renderingBoundingBox.height / 2,
            this.renderingBoundingBox.width, this.renderingBoundingBox.height / 2
        );  
        this.speed = World.TileSize * 6; 
    }

    getCenter(){
        return new Vector(
            this.collisionBoundingBox.x + this.collisionBoundingBox.width / 2,
            this.collisionBoundingBox.y + this.collisionBoundingBox.height / 2
        );
    }

    render(){
        super.render(); 
        const ctx = CoreRenderer.RequestRenderingContext(); 
        const center = this.getCenter(); 
        ctx.fillRect(center.x-1, center.y-1, 2, 2); 
    }

}