class CoreRenderer {

    /**
     * 
     * @param {*} canvas 
     */
    static Init(canvas = undefined) {
        if(!canvas) throw "Please provide a canvas!";

        CoreRenderer.Canvas = canvas; 

        CoreRenderer.ScreenResolution = new Vector(window.outerWidth, window.outerHeight);
        CoreRenderer.ScreenResolutionRatio = CoreRenderer.ScreenResolution.x / CoreRenderer.ScreenResolution.y;
        CoreRenderer.DPR = window.devicePixelRatio;
    }

    /**
     * 
     * @returns 
     */
    static RequestRenderingContext(){
        if(!CoreRenderer.RenderingContext){
            CoreRenderer.RenderingContext = CoreRenderer.Canvas.getContext("2d");
        }
        return CoreRenderer.RenderingContext; 
    }

    /**
     * 
     * @param {Vector} targetResolution 
     */
    static ChangeTargetResolution(targetResolution = undefined) {

        if (targetResolution instanceof Vector) {
            CoreRenderer.TargetResolution = targetResolution;
        } else {
            CoreRenderer.TargetResolution = CoreRenderer.ScreenResolution;
        }

        let xScale = Math.floor(CoreRenderer.ScreenResolution.x * CoreRenderer.DPR / CoreRenderer.TargetResolution.x);
        let yScale = Math.floor(CoreRenderer.ScreenResolution.y * CoreRenderer.DPR / CoreRenderer.TargetResolution.y);
        xScale = Math.floor(xScale * 100) / 100;
        yScale = Math.floor(yScale * 100) / 100;

        CoreRenderer.ScaleRatio = Math.max(xScale, yScale);
        if(CoreRenderer.ScaleRatio <= 0) CoreRenderer.ScaleRatio = 1; 

        CoreRenderer.Canvas.width = CoreRenderer.TargetResolution.x * CoreRenderer.ScaleRatio ;
        CoreRenderer.Canvas.height = CoreRenderer.TargetResolution.y * CoreRenderer.ScaleRatio ;

        var ctx = CoreRenderer.RequestRenderingContext(); 
        ctx.lineWidth = Math.floor(1.0 * CoreRenderer.ScaleRatio); 
        ctx.imageSmoothingEnabled =  true ; 

    }

    static GetScaleRatio(){
        return CoreRenderer.ScaleRatio ; 
    }

    static Clear(){
        CoreRenderer.RequestRenderingContext().clearRect(0, 0, CoreRenderer.Canvas.width, CoreRenderer.Canvas.height);
    }

    static Resize(){
        CoreRenderer.ScreenResolution = new Vector(window.outerWidth, window.outerHeight);
        CoreRenderer.ScreenResolutionRatio = CoreRenderer.ScreenResolution.x / CoreRenderer.ScreenResolution.y;
        CoreRenderer.DPR = window.devicePixelRatio;
        CoreRenderer.ChangeTargetResolution(CoreRenderer.TargetResolution); 
    }


}


class DrawMode{

    static get SOLID() { return "solid"; } 
    static get WIREFRAME() { return "wireframe"; } 

}