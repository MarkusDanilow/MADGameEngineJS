
/*****************************************************************************************************
 * 
 *****************************************************************************************************/

class IRenderable {
    render() {
        throw "This method is not implemented in the interface! Use a real class instance instead!";
    }
}

class IUpdatable {
    update() {
        throw "This method is not implemented in the interface! Use a real class instance instead!";
    }
}

class IRenderableUpdatable {
    render() {
        throw "This method is not implemented in the interface! Use a real class instance instead!";
    }
    update() {
        throw "This method is not implemented in the interface! Use a real class instance instead!";
    }
}

/*****************************************************************************************************
 * 
 *****************************************************************************************************/
class Engine {

    constructor(gameCanvasId) {

        this.canRenderPerformance = true;
        this.drawMode = DrawMode.SOLID;
        this.canvasElement = document.getElementById(gameCanvasId);

        PerformanceModule.Init();
        InputManager.Init(this.canvasElement);

        CoreRenderer.Init(this.canvasElement);
        CoreRenderer.ChangeTargetResolution(new Vector(640, 480));

        MatrixStack.Init();

    }

    injectGame(gameInstance) {
        if (gameInstance instanceof BaseGame) {
            Engine.Instance.gameInstance = gameInstance;
            Engine.Instance.gameInstance.init();
        }
    }

    start() {
        requestAnimationFrame(Engine.Instance.gameLoop);
    }

    gameLoop() {
        Engine.Instance.update();
        Engine.Instance.render();
        requestAnimationFrame(Engine.Instance.gameLoop);
    }

    update() {
        PerformanceModule.Update();
        if (InputManager.IsKeyPressed(KeyCodes.F2)) {
            var allObjects = Engine.Instance.gameInstance.getAllObjects();
            Engine.Instance.drawMode = Engine.Instance.drawMode === DrawMode.WIREFRAME ? DrawMode.SOLID : DrawMode.WIREFRAME;
            allObjects.forEach(o => {
                o.setDrawMode(Engine.Instance.drawMode);
            });
        }
        if (InputManager.IsKeyPressed(KeyCodes.F3)) {
            Engine.Instance.canRenderPerformance = !Engine.Instance.canRenderPerformance;
        }
        if (Engine.Instance.gameInstance instanceof BaseGame) {
            Engine.Instance.gameInstance.update();
        }
        InputManager.Clear();
    }

    render() {
        CoreRenderer.Clear();
        MatrixStack.ApplyResolution();
        MatrixStack.Push();
        if (Engine.Instance.gameInstance instanceof BaseGame) {
            MatrixStack.Push();
            MatrixStack.ApplyGlobalScale();
            MatrixStack.ApplyGlobalTranslation();
            Engine.Instance.renderGame();
            MatrixStack.Pop();
        }
        if (Engine.Instance.canRenderPerformance) {
            Engine.Instance.renderPerformanceScreen();
        }
        MatrixStack.Pop();
    }

    renderGame() {
        MatrixStack.Push();
        Engine.Instance.gameInstance.render();
        MatrixStack.Pop();
    }

    renderPerformanceScreen() {
        MatrixStack.Push();
        MatrixStack.Scale(1, 1);
        PerformanceModule.Render();
        MatrixStack.Pop();
    }

    /**
     * 
     */
    static Instance = undefined;

    /**
     * 
     * @param {*} callbackFn 
     */
    static Create(gameCanvasId, callbackFn = () => { }) {
        Loader.LoadModules(() => {
            Engine.Instance = new Engine(gameCanvasId);
            Engine.Instance.start();
            Core.Invoke(callbackFn);
        });
    }

    static GetInstance() {
        return Engine.Instance;
    }

}


/* -------------------------------------------------------  */
/*                       INPUT MANAGER                      */
/* -------------------------------------------------------  */
class InputManager {
    static KeyDownList = {};
    static KeyPressedList = {};

    static MousePosition = {x: 0, y: 0}; 

    static IsInDevMode = true;

    static Init(canvasElement) {
        document.body.addEventListener('keydown', (e) => {
            if (!InputManager.IsInDevMode) {
                e.preventDefault();
                e.stopImmediatePropagation();
            }
            InputManager.KeyDownList[e.code] = true;
        });

        document.body.addEventListener('keyup', (e) => {
            e.preventDefault();
            e.stopImmediatePropagation();
            delete InputManager.KeyDownList[e.code];
            InputManager.KeyPressedList[e.code] = true;
        });

        window.addEventListener("resize", (e) => {
            CoreRenderer.Resize();
        });

        canvasElement.addEventListener("mousemove", (e) => {
            InputManager.MousePosition = {x: e.layerX, y: e.layerY}; 
        });

    }

    static Clear() {
        InputManager.KeyPressedList = {};
    }

    static IsKeyDown(keyCode) {
        return (keyCode in InputManager.KeyDownList) && (InputManager.KeyDownList[keyCode]);
    }

    static IsKeyPressed(keyCode) {
        const isPressed = (keyCode in InputManager.KeyPressedList) && (InputManager.KeyPressedList[keyCode]);
        if (isPressed) {
            delete InputManager.KeyPressedList[keyCode];
        }
        return isPressed;
    }

}

class KeyCodes {
    static get BACKSPACE() { return "Backspace"; }
    static get TAB() { return "Tab"; }
    static get ENTER() { return "Enter"; }
    static get SHIFT() { return "ShiftLeft"; }
    static get CTRL() { return "ControlLeft"; }
    static get ALT() { return "AltLeft"; }
    static get PAUSE_BREAK() { return "Pause"; }
    static get CAPS_LOCK() { return "CapsLock"; }
    static get ESCAPE() { return "Escape"; }
    static get SPACE() { return "Space"; }
    static get PAGE_UP() { return "PageUp"; }
    static get PAGE_DOWN() { return "PageDown"; }
    static get END() { return "End"; }
    static get HOME() { return "Home"; }
    static get LEFT_ARROW() { return "ArrowLeft"; }
    static get UP_ARROW() { return "ArrowUp"; }
    static get RIGHT_ARROW() { return "ArrowRight"; }
    static get DOWN_ARROW() { return "ArrowDown"; }
    static get INSERT() { return "Insert"; }
    static get DELETE() { return "Delete"; }
    static get KEY_0() { return "Digit0"; }
    static get KEY_1() { return "Digit1"; }
    static get KEY_2() { return "Digit2"; }
    static get KEY_3() { return "Digit3"; }
    static get KEY_4() { return "Digit4"; }
    static get KEY_5() { return "Digit5"; }
    static get KEY_6() { return "Digit6"; }
    static get KEY_7() { return "Digit7"; }
    static get KEY_8() { return "Digit8"; }
    static get KEY_9() { return "Digit9"; }
    static get KEY_A() { return "KeyA"; }
    static get KEY_B() { return "KeyB"; }
    static get KEY_C() { return "KeyC"; }
    static get KEY_D() { return "KeyD"; }
    static get KEY_E() { return "KeyE"; }
    static get KEY_F() { return "KeyF"; }
    static get KEY_G() { return "KeyG"; }
    static get KEY_H() { return "KeyH"; }
    static get KEY_I() { return "KeyI"; }
    static get KEY_J() { return "KeyJ"; }
    static get KEY_K() { return "KeyK"; }
    static get KEY_L() { return "KeyL"; }
    static get KEY_M() { return "KeyM"; }
    static get KEY_N() { return "KeyN"; }
    static get KEY_O() { return "KeyO"; }
    static get KEY_P() { return "KeyP"; }
    static get KEY_Q() { return "KeyQ"; }
    static get KEY_R() { return "KeyR"; }
    static get KEY_S() { return "KeyS"; }
    static get KEY_T() { return "KeyT"; }
    static get KEY_U() { return "KeyU"; }
    static get KEY_V() { return "KeyV"; }
    static get KEY_W() { return "KeyW"; }
    static get KEY_X() { return "KeyX"; }
    static get KEY_Y() { return "KeyY"; }
    static get KEY_Z() { return "KeyZ"; }
    static get LEFT_WINDOW_KEY() { return "MetaLeft"; }
    static get RIGHT_WINDOW_KEY() { return "MetaRight"; }
    static get SELECT_KEY() { return "Select"; }
    static get NUMPAD_0() { return "Numpad0"; }
    static get NUMPAD_1() { return "Numpad1"; }
    static get NUMPAD_2() { return "Numpad2"; }
    static get NUMPAD_3() { return "Numpad3"; }
    static get NUMPAD_4() { return "Numpad4"; }
    static get NUMPAD_5() { return "Numpad5"; }
    static get NUMPAD_6() { return "Numpad6"; }
    static get NUMPAD_7() { return "Numpad7"; }
    static get NUMPAD_8() { return "Numpad8"; }
    static get NUMPAD_9() { return "Numpad9"; }
    static get MULTIPLY() { return "NumpadMultiply"; }
    static get ADD() { return "NumpadAdd"; }
    static get SUBTRACT() { return "NumpadSubtract"; }
    static get DECIMAL_POINT() { return "NumpadDecimal"; }
    static get DIVIDE() { return "NumpadDivide"; }
    static get F1() { return "F1"; }
    static get F2() { return "F2"; }
    static get F3() { return "F3"; }
    static get F4() { return "F4"; }
    static get F5() { return "F5"; }
    static get F6() { return "F6"; }
    static get F7() { return "F7"; }
    static get F8() { return "F8"; }
    static get F9() { return "F9"; }
    static get F10() { return "F10"; }
    static get F11() { return "F11"; }
    static get F12() { return "F12"; }
    static get NUM_LOCK() { return "NumLock"; }
    static get SCROLL_LOCK() { return "ScrollLock"; }
    static get SEMI_COLON() { return "Semicolon"; }
    static get EQUAL_SIGN() { return "Equal"; }
    static get COMMA() { return "Comma"; }
    static get DASH() { return "Minus"; }
    static get PERIOD() { return "Period"; }
    static get FORWARD_SLASH() { return "Slash"; }
    static get GRAVE_ACCENT() { return "Backquote"; }
    static get OPEN_BRACKET() { return "BracketLeft"; }
    static get BACK_SLASH() { return "Backslash"; }
    static get CLOSE_BRACKET() { return "BracketRight"; }
    static get SINGLE_QUOTE() { return "Quote"; }
}




/*****************************************************************************************************
 * 
 *****************************************************************************************************/

class PerformanceModule {

    static Init() {
        PerformanceModule.delta = 0;
        PerformanceModule.fps = 0;
        PerformanceModule.fpsCounter = 0;
        PerformanceModule.currentTimestamp = Core.NowMillis();
        PerformanceModule.lastTimestamp = Core.NowMillis();
        PerformanceModule.updated = false;
        PerformanceModule.lastDelta = 0;
    }

    static Update() {
        PerformanceModule.updated = false;
        PerformanceModule.currentTimestamp = Core.NowMillis();
        PerformanceModule.lastDelta = (PerformanceModule.currentTimestamp - PerformanceModule.lastTimestamp);
        PerformanceModule.delta += PerformanceModule.lastDelta;
        PerformanceModule.fpsCounter++;
        if (PerformanceModule.delta > 1000) {
            PerformanceModule.delta %= 1000;
            PerformanceModule.fps = PerformanceModule.fpsCounter;
            PerformanceModule.fpsCounter = 0;
            PerformanceModule.updated = true;
        }
        PerformanceModule.lastTimestamp = PerformanceModule.currentTimestamp;
    }

    static Render() {
        var ctx = CoreRenderer.RequestRenderingContext();
        ctx.fillStyle = "rgba(0,0,0,0.55)";
        ctx.fillRect(0, 0, 50, 13);
        ctx.font = "10px lucida console";
        ctx.fillStyle = "#ddd";
        ctx.textBaseline = "hanging";
        ctx.fillText(`${PerformanceModule.fps} FPS`, 5, 5);
    }

    static GetDelta() {
        return PerformanceModule.lastDelta;
    }

    static GetFps() {
        return PerformanceModule.fps;
    }

    static IsUpdated() {
        return PerformanceModule.updated;
    }

}


/*****************************************************************************************************
 * 
 *****************************************************************************************************/
class Loader {

    static RequiredModules = [
    ];


    /**
     * 
     * @param {*} moduleName 
     * @returns 
     */
    static LoadSingleModule(moduleName) {
        return new Promise(function (resolve, reject) {
            var scriptElement = document.createElement('script');
            scriptElement.src = `js/${moduleName}.js`;
            scriptElement.async = false;
            scriptElement.onload = resolve;
            scriptElement.onerror = reject;
            document.getElementsByTagName('head')[0].appendChild(scriptElement);
        });
    }

    /**
     * 
     * @param {*} callbackFn 
     */
    static LoadModules(callbackFn = () => { }) {

        fetch('./js/config/modules.json')
            .then((response) => response.json())
            .then((json) => {

                for (let moduleBlock in json.modules) {
                    json.modules[moduleBlock].forEach((m) => {
                        Loader.RequiredModules.push(`${moduleBlock}/${m}`);
                    });
                }

                var allLoadingPromises = Loader.RequiredModules.map(Loader.LoadSingleModule);
                Promise.all(allLoadingPromises)
                    .then(() => {
                        Core.Invoke(callbackFn);
                    })
                    .catch((error) => {
                        console.error('An error occurred while loading the required script files!', error);
                    });

            });


    }

}

/*****************************************************************************************************
 * 
 *****************************************************************************************************/
class Core {

    /**
     * 
     * @param {*} callbackFn 
     * @param  {...any} args 
     */
    static Invoke(callbackFn = () => { }, ...args) {
        if (callbackFn && callbackFn instanceof Function) {
            callbackFn(args);
        }
    }

    static NowSeconds() {
        return Math.floor(performance.now() / 1000);
    }

    static NowMillis() {
        return performance.now();
    }

    static RandomIntFromInterval(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min)
    }

}
