class GameObject extends IRenderableUpdatable{

    constructor(){
        super();
        this.id = MathUtil.UuidV4(); 
        this.color = "cyan" ; 
        this.collidable = false ; 
        this.drawMode = DrawMode.SOLID; 
        this.renderingBoundingBox = new AABB(0, 0, 10, 10); 
        this.collisionBoundingBox = new AABB(0, 0, 10, 10); 
    }

    _adjustToFramerate(val){
        return (val / 1000.0) * PerformanceModule.GetDelta(); 
    }

    _updateCollisionBoundingBox(x, y, w, h){
        this.collisionBoundingBox = new AABB(x, y, w, h); 
    }

    isCollidable(){
        return this.collidable; 
    }

    setSize(vecSize){
        if(vecSize instanceof Vector){
            this.collisionBoundingBox.width = vecSize.x ; 
            this.collisionBoundingBox.height = vecSize.y ; 
            this.renderingBoundingBox.width = vecSize.x ; 
            this.renderingBoundingBox.height = vecSize.y ; 
        }
    }

    setPosition(vecPos){
        if(vecPos instanceof Vector){
            const deltaX = this.collisionBoundingBox.x - this.renderingBoundingBox.x; 
            const deltaY = this.collisionBoundingBox.y - this.renderingBoundingBox.y; 
            this.collisionBoundingBox.x = vecPos.x ; 
            this.collisionBoundingBox.y= vecPos.y ; 
            this.renderingBoundingBox.x = vecPos.x - deltaX; 
            this.renderingBoundingBox.y= vecPos.y - deltaY; 
        }
    }

    setColor(colorString){
        this.color = colorString; 
    }

    setDrawMode(drawMode){
        if(drawMode === DrawMode.SOLID || drawMode === DrawMode.WIREFRAME){
            this.drawMode  = drawMode; 
        }
    }

    setCollisionVector(cx, cy){
        this.collisionBoundingBox.setCollisionVector(cx, cy); 
    }

    getCollisionVector(){
        return this.collisionBoundingBox.getCollisionVector(); 
    }

    resetCollisionState(){
        this.setCollisionVector(0, 0); 
    }

    doCheckForCollision(otherGameObject, deltaVec = undefined){
        if(otherGameObject && otherGameObject.collisionBoundingBox){
            const collision = this.collisionBoundingBox.collidesWith(otherGameObject.collisionBoundingBox, deltaVec); 
            const otherCollision = collision.invert(); 
            this.setCollisionVector(collision.x, collision.y); 
            otherGameObject.setCollisionVector(otherCollision.x, otherCollision.y); 
        }
    }

    hasCollisionDetected(){
        const collisionVector = this.getCollisionVector(); 
        return collisionVector.x !== 0 || collisionVector.y !== 0 ; 
    }

    move(vecDelta){
        if(vecDelta instanceof Vector){
            this.collisionBoundingBox.x += vecDelta.x; 
            this.collisionBoundingBox.y += vecDelta.y;
            this.renderingBoundingBox.x += vecDelta.x; 
            this.renderingBoundingBox.y += vecDelta.y;  
        }
    }

    update(){

    }

    getCenter(){
        return new Vector(
            this.collisionBoundingBox.x + this.collisionBoundingBox.width / 2,
            this.collisionBoundingBox.y + this.collisionBoundingBox.height / 2
        );
    }

    render(){
        var ctx = CoreRenderer.RequestRenderingContext(); 
        
        switch(this.drawMode){
            case DrawMode.SOLID: {
                ctx.fillStyle = this.color; 
                ctx.fillRect(this.renderingBoundingBox.x, this.renderingBoundingBox.y, this.renderingBoundingBox.width, this.renderingBoundingBox.height); 
            }
            case DrawMode.WIREFRAME:{
                ctx.lineWidth = 1 ; 
                ctx.strokeStyle = this.color; 
                ctx.beginPath(); 
                ctx.rect(this.renderingBoundingBox.x, this.renderingBoundingBox.y, this.renderingBoundingBox.width, this.renderingBoundingBox.height); 
                ctx.stroke(); 
            }
        }
        
    }

}
