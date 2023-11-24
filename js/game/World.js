class World{

    static TileSize = 16; 

    static WorldTileResolution = new Vector(200, 200); 

    static WorldResolution = new Vector(World.WorldTileResolution.x * World.TileSize, World.WorldTileResolution.y * World.TileSize); 

    static GetCurrentMouseTilePos(){
        return World.ScreenPosToTilePos(InputManager.MousePosition.x, InputManager.MousePosition.y);
    }

    static ScreenPosToTilePos(sx, sy){
        return new Vector(
            Math.floor((sx / CoreRenderer.GetScaleRatio() - MatrixStack.GlobalTranslation.x) / World.TileSize),
            Math.floor((sy / CoreRenderer.GetScaleRatio() - MatrixStack.GlobalTranslation.y) / World.TileSize)
        )
    }

    static WorldPosToTilePos(wx, wy){
        return new Vector(
            Math.floor(wx / World.TileSize), 
            Math.floor(wy / World.TileSize)
        ); 
    }

    static Render(player){
        const mouseTilePos = World.GetCurrentMouseTilePos(); 
        const playerCenter = player.getCenter();
        const playerTilePos = World.WorldPosToTilePos(playerCenter.x, playerCenter.y);

        if(Math.abs(mouseTilePos.x - playerTilePos.x) <= 1 && Math.abs(mouseTilePos.y - playerTilePos.y) <= 1){
            var ctx = CoreRenderer.RequestRenderingContext();
            ctx.lineWidth = 0.7 ; 
            ctx.strokeStyle = 'rgba(100, 150, 100, 1)'; 
            ctx.beginPath(); 
            ctx.rect(mouseTilePos.x * World.TileSize, mouseTilePos.y * World.TileSize, World.TileSize, World.TileSize); 
            ctx.stroke(); 
        }
    }

}

/**
 * 
 */
class Terrain extends IRenderableUpdatable{

    render(){
        const ctx = CoreRenderer.RequestRenderingContext(); 
        ctx.lineWidth = 0.5 ; 
        ctx.strokeStyle = 'rgba(100, 100, 100, 0.2)'; 
        for(let x = 0; x <= World.WorldTileResolution.x; x++){
            ctx.beginPath();
            ctx.moveTo(x * World.TileSize, 0);
            ctx.lineTo(x * World.TileSize, World.WorldTileResolution.y * World.TileSize);
            ctx.stroke();
        }
        for(let y = 0; y <= World.WorldTileResolution.y; y++){
            ctx.beginPath();
            ctx.moveTo(0, y * World.TileSize);
            ctx.lineTo(World.WorldTileResolution.x * World.TileSize, y * World.TileSize);
            ctx.stroke();
        }
    }

    update() {

    }

}