class Player extends Entity{

    constructor(){
        super(); 
        this.setColor("rgba(200,0,0,1"); 
        this.collidable = true ; 
    }
    
    update(){
        super.update();
        var speed = this._adjustToFramerate(this.speed); 
        var dx = 0, dy = 0; 
        if((InputManager.IsKeyDown(KeyCodes.KEY_A) || InputManager.IsKeyDown(KeyCodes.LEFT_ARROW))){
            dx -= speed;  
        }
        if((InputManager.IsKeyDown(KeyCodes.KEY_D) || InputManager.IsKeyDown(KeyCodes.RIGHT_ARROW))){
            dx += speed;  
        }
        if((InputManager.IsKeyDown(KeyCodes.KEY_W) || InputManager.IsKeyDown(KeyCodes.UP_ARROW))){
            dy -= speed ; 
        }
        if((InputManager.IsKeyDown(KeyCodes.KEY_S) || InputManager.IsKeyDown(KeyCodes.DOWN_ARROW))){
            dy += speed ; 
        }
        if (dx !== 0 && dy !== 0) {
            const length = Math.sqrt(dx * dx + dy * dy);
            dx = (dx / length) * speed;
            dy = (dy / length) * speed;
        }

        Engine.Instance.gameInstance.checkForCollision(this, new Vector(dx, dy)); 

        if(this.hasCollisionDetected()){
            if(this.getCollisionVector().x !== 0){
                dx = 0; 
            }
            if(this.getCollisionVector().y !== 0){
                dy = 0; 
            }
        }

        if(this.collisionBoundingBox.x + dx < 0 || this.collisionBoundingBox.x + this.collisionBoundingBox.width + dx > World.WorldResolution.x) dx = 0 ; 
        if(this.collisionBoundingBox.y + dy < 0 || this.collisionBoundingBox.y + this.collisionBoundingBox.height + dy > World.WorldResolution.y) dy = 0 ; 

        this.move(new Vector(dx, dy)); 

        // change global translation and move the entire world in the opposite direction
        if(this.collisionBoundingBox.x + this.collisionBoundingBox.width / 2 > CoreRenderer.TargetResolution.x / 2 && 
            this.collisionBoundingBox.x + this.collisionBoundingBox.width / 2 < World.WorldResolution.x - CoreRenderer.TargetResolution.x / 2){
            MatrixStack.GlobalTranslation.x -= dx ; 
        }
        if(this.collisionBoundingBox.y + this.collisionBoundingBox.height / 2 > CoreRenderer.TargetResolution.y / 2 && 
            this.collisionBoundingBox.y + this.collisionBoundingBox.height / 2 < World.WorldResolution.y - CoreRenderer.TargetResolution.y / 2){
            MatrixStack.GlobalTranslation.y -= dy ; 
        }

    }

}