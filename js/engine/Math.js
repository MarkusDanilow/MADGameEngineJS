
/*****************************************************************************************************
 * 
 *****************************************************************************************************/
class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    add(otherVector) {
        this.x += otherVector.x;
        this.y += otherVector.y;
        return this;
    }

    subtract(otherVector) {
        this.x -= otherVector.x;
        this.y -= otherVector.y;
        return this;
    }

    multiply(scalar) {
        this.x *= scalar;
        this.y *= scalar;
        return this;
    }

    divide(scalar) {
        if (scalar !== 0) {
            this.x /= scalar;
            this.y /= scalar;
        }
        return this;
    }

    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    dot(otherVector) {
        return this.x * otherVector.x + this.y * otherVector.y;
    }

    copy() {
        return new Vector(this.x, this.y);
    }

    invert() {
        return new Vector(-this.x, -this.y);
    }

    static subtractVectors(vectorA, vectorB) {
        return new Vector(vectorA.x - vectorB.x, vectorA.y - vectorB.y);
    }

}


/* -------------------------------------------------------  */
/*                AABB for collision detection              */
/* -------------------------------------------------------  */

class AABB {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.collisionVector = new Vector(0, 0); 
    }

    setCollisionVector(cx, cy){
        this.collisionVector = new Vector(cx, cy); 
    }

    getCollisionVector(){
        return this.collisionVector; 
    }


    collidesWith(other, deltaVec = undefined) {

        const isDeltaDefined = deltaVec !== undefined;
        const dx = (isDeltaDefined ? deltaVec.x : 0);
        const dy = (isDeltaDefined ? deltaVec.y : 0);

        const isColliding = (this.x + dx < other.x + other.width &&
            this.x + this.width + dx > other.x &&
            this.y + dy < other.y + other.height &&
            this.y + dy + this.height > other.y);

        let cdx = 0, cdy = 0;

        if (isColliding) {
            const collidedFromLeft = ((this.x + this.width) < other.x) &&
                ((this.x + this.width + dx) >= other.x);
            const collidedFromRight = (this.x >= (other.x + other.width)) &&
                (this.x + dx < (other.x + other.width));

            const collidedFromTop = ((this.y + this.height) < other.y) &&
                ((this.y + this.height + dy) >= other.y);
            const collidedFromBottom = (this.y >= (other.y + other.height)) &&
                (this.y + dy < (other.y + other.height));

            cdx = collidedFromLeft ? 1 : (collidedFromRight ? -1 : 0);
            cdy = collidedFromTop ? 1 : (collidedFromBottom ? -1 : 0);
        }

        if(this.collisionVector.x !== 0) cdx = this.collisionVector.x; 
        if(this.collisionVector.y !== 0) cdy = this.collisionVector.y; 

        return new Vector(cdx, cdy);
    }
}


/* -------------------------------------------------------  */
/*          MATRIX STACK FOR DIFFERENT TRANSFORMATION       */
/* -------------------------------------------------------  */

class MatrixStack {

    static ctx = undefined;
    static stack = [];
    static current = [1, 0, 0, 1, 0, 0];

    static GlobalScale = new Vector(1, 1); 
    static GlobalTranslation = new Vector(0, 0); 

    static Init() {
        MatrixStack.ctx = CoreRenderer.RequestRenderingContext();
    }

    static Push() {
        MatrixStack.stack.push(MatrixStack.current.slice());
    }

    static Pop() {
        if (MatrixStack.stack.length === 0) {
            throw new Error('Cannot pop from an empty matrix stack.');
        }
        MatrixStack.current = MatrixStack.stack.pop();
        MatrixStack.ctx.setTransform.apply(MatrixStack.ctx, MatrixStack.current);
    }

    static Translate(x, y) {
        const ratio = CoreRenderer.GetScaleRatio();
        MatrixStack.current[4] = x * ratio;
        MatrixStack.current[5] = y * ratio;
        MatrixStack.ctx.setTransform.apply(MatrixStack.ctx, MatrixStack.current);
    }

    static Scale(sx, sy) {
        const ratio = CoreRenderer.GetScaleRatio();
        MatrixStack.current[0] = sx * ratio;
        MatrixStack.current[3] = sy * ratio;
        MatrixStack.ctx.setTransform.apply(MatrixStack.ctx, MatrixStack.current);
    }

    static GetMatrix() {
        return MatrixStack.current.slice();
    }

    static ApplyResolution() {
        const ratio = CoreRenderer.GetScaleRatio();
        MatrixStack.ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    }

    static ApplyGlobalScale(){
        MatrixStack.Scale(MatrixStack.GlobalScale.x, MatrixStack.GlobalScale.y);
    }

    static ApplyGlobalTranslation(){
        MatrixStack.Translate(MatrixStack.GlobalTranslation.x, MatrixStack.GlobalTranslation.y);
    }

}



class MathUtil {


    static UuidV4() {
        return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
            (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
    }

    static GetRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }


}