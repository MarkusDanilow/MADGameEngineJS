
/*****************************************************************************************************
 * 
 *****************************************************************************************************/

class Layer extends IRenderableUpdatable {

    constructor(name, zIndex) {
        super();
        this.name = name;
        this.zIndex = zIndex;
        this.gameObjects = [];
    }

    update() {
        for (var i = 0; i < this.gameObjects.length; i++) {
            if (this.gameObjects[i].update instanceof Function) {
                this.gameObjects[i].update();
            }
        }
    }

    render() {
        this.gameObjects.sort((a,b) => {
            const centerA = a.getCenter(); 
            const centerB = b.getCenter(); 
            return centerA.y > centerB.y ? 1 : (centerA.y < centerB.y ? -1 : 0);
        });
        for (var i = 0; i < this.gameObjects.length; i++) {
            if (this.gameObjects[i].render instanceof Function) {
                this.gameObjects[i].render();
            }
        }
    }

    addObject(obj) {
        if (obj instanceof GameObject) {
            this.gameObjects.push(obj);
        }
    }

    removeObjectByIndex(index) {
        if (index > -1 && index < this.gameObjects.length) {
            this.gameObjects.splice(index, 1);
        }
    }

    removeObject(obj) {
        if (obj instanceof GameObject) {
            let index = myArray.indexOf(obj);
            if (index > -1 && index < this.gameObjects.length) {
                this.gameObjects.splice(index, 1);
            }
        }
    }

    getAllObjects() {
        return this.gameObjects;
    }


    checkForCollision(gameObject, deltaVec = undefined) {
        if (gameObject === undefined || gameObject === null) return;
        const tGameObject = this.gameObjects.find(o => o.id === gameObject.id);
        if (tGameObject === undefined || tGameObject === null) return;
        gameObject.resetCollisionState(); 
        for (var i = 0; i < this.gameObjects.length; i++) {
            if (this.gameObjects[i].id !== gameObject.id) {
                this.gameObjects[i].resetCollisionState(); 
                if(gameObject.isCollidable() && this.gameObjects[i].isCollidable()){
                    gameObject.doCheckForCollision(this.gameObjects[i], deltaVec);
                }
            }
        }
    }


}


/*****************************************************************************************************
 * 
 *****************************************************************************************************/

class Scene extends IRenderableUpdatable {

    constructor(name) {
        super();
        this.name = name;
        this.layers = {};
        this.layerNames = [];
    }

    _createSortedLayerCache() {
        this.layerNames = Object.keys(this.layers);
        this.layerNames.sort((a, b) => this.layers[a].zIndex - this.layers[b].zIndex);
    }

    _isValidLayerName(layerName) {
        return (layerName && layerName.length && layerName.length > 0);
    }

    layerExists(layerName) {
        return this._isValidLayerName(layerName) && (layerName in this.layers);
    }

    addLayer(layerName, zIndex = 0) {
        if (this._isValidLayerName(layerName)) {
            this.layers[layerName] = new Layer(layerName, zIndex);
            this._createSortedLayerCache();
        }
    }

    removeLayer(layerName) {
        if (this.layerExists(layerName)) {
            delete this.layers[layerName];
            this._createSortedLayerCache();
        }
    }

    update() {
        let self = this;
        this.layerNames.forEach(n => {
            if (self.layers[n].update instanceof Function) {
                self.layers[n].update();
            }
        });
    }

    render() {
        let self = this;
        this.layerNames.forEach(n => {
            if (self.layers[n].render instanceof Function) {
                self.layers[n].render();
            }
        });
    }

    addObjectToLayer(layerName, obj) {
        if (this.layerExists(layerName)) {
            this.layers[layerName].addObject(obj);
        }
    }

    removeObjectFromLayer(layerName, obj) {
        if (this.layerExists(layerName)) {
            this.layers[layerName].removeObject(obj);
        }
    }

    getAllLayers() {
        return Object.values(this.layers);
    }

    checkForCollision(gameObject, deltaVec = undefined) {
        let self = this;
        this.layerNames.forEach(n => {
            if (self.layers[n].checkForCollision instanceof Function) {
                self.layers[n].checkForCollision(gameObject, deltaVec);
            }
        });
    }


}


/*****************************************************************************************************
 * 
 *****************************************************************************************************/

class BaseGame extends IRenderableUpdatable {

    constructor() {
        super();
        this.additionalModules = []; 
    }

    injectAdditionalModules(modules = []){
        this.additionalModules = modules; 
    }

    init(){
        this.scenes = {};
        this.activeScene = undefined;
    }

    update() {
        if (this.activeScene) {
            this.activeScene.update();
        }
    }

    render() {
        if (this.activeScene) {
            this.activeScene.render();
        }
    }

    _isValidSceneName(sceneName) {
        return (sceneName && sceneName.length && sceneName.length > 0);
    }

    sceneExists(sceneName) {
        return this._isValidSceneName(sceneName) && (sceneName in this.scenes);
    }

    addScene(sceneName) {
        if (this._isValidSceneName(sceneName)) {
            this.scenes[sceneName] = new Scene(sceneName);
        }
    }

    removeScene(sceneName) {
        if (this.sceneExists(sceneName)) {
            delete this.scenes[sceneName];
        }
    }

    activateScene(sceneName) {
        if (this.sceneExists(sceneName)) {
            this.activeScene = this.scenes[sceneName];
        }
    }

    addLayer(sceneName, layerName, zIndex = 0) {
        if (this.sceneExists(sceneName)) {
            this.scenes[sceneName].addLayer(layerName, zIndex);
        }
    }

    removeLayer(sceneName, layerName) {
        if (this.sceneExists(sceneName)) {
            this.scenes[sceneName].removeLayer(layerName);
        }
    }

    addObject(sceneName, layerName, obj) {
        if (this.sceneExists(sceneName)) {
            this.scenes[sceneName].addObjectToLayer(layerName, obj);
        }
    }

    removeObject(sceneName, layerName, obj) {
        if (this.sceneExists(sceneName)) {
            this.scenes[sceneName].removeObjectFromLayer(layerName, obj);
        }
    }

    getAllScenes() {
        return Object.values(this.scenes);
    }

    getAllLayers() {
        var layers = [];
        var scenes = this.getAllScenes();
        scenes.forEach(s => {
            layers = layers.concat(s.getAllLayers());
        });
        return layers;
    }

    getAllObjects() {
        var objects = [];
        var layers = this.getAllLayers();
        layers.forEach(l => {
            objects = objects.concat(l.getAllObjects());
        })
        return objects;
    }

    checkForCollision(gameObject, deltaVec = undefined) {
        if (this.activeScene) {
            this.activeScene.checkForCollision(gameObject, deltaVec);
        }
    }


}