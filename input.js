class Input {
    constructor(game) {
        this.canvas = game.canvas;
        this.camera = game.camera;
        this.world = game.world;

        this.mouse = { x: 0, y: 0, element: document.getElementById('mouseCoords') };
        this.keys = {};

        this.canvas.addEventListener("contextmenu", (e) => {e.preventDefault()});
        this.canvas.addEventListener('mousemove', this.handleMouseMove);
        this.canvas.addEventListener('mousedown', this.handleMouseDown);
        this.canvas.addEventListener('mouseup', this.handleMouseUp);
        this.canvas.addEventListener('click', this.handleMouseClick);
        this.canvas.addEventListener('mouseout', this.handleMouseOut);
        window.addEventListener('wheel', this.handleMouseWheel)
        window.addEventListener('keydown', this.handlekeyDown);
        window.addEventListener('keyup', this.handlekeyUp);
        window.addEventListener('resize', this.handleResize);
    }

    updateCamera() {
        const speed = this.camera.speed;

        if (this.keys['w']) { this.camera.y -= speed; this.mouse.y -= speed;}
        if (this.keys['a']) { this.camera.x -= speed; this.mouse.x -= speed;}
        if (this.keys['s']) { this.camera.y += speed; this.mouse.y += speed;}
        if (this.keys['d']) { this.camera.x += speed; this.mouse.x += speed;}
    
        this.mouse.element.textContent = this.mouse.x + ',' + this.mouse.y;
    }

    updateMouseCoordinates(e) {
        const rect = this.canvas.getBoundingClientRect();

        // canvas offset
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;

        // center offset
        let offset = { x: this.canvas.width / 2, y: this.canvas.height / 2 };
        x -= offset.x;
        y -= offset.y;

        // zoom adjustment
        x = x / this.camera.zoom;
        y = y / this.camera.zoom;

        // camera position in world offset
        x += this.camera.x;
        y += this.camera.y;

        this.mouse.x = Math.round(x);
        this.mouse.y = Math.round(y);
    
        this.mouse.element.textContent = this.mouse.x + ',' + this.mouse.y;
    }

    handleMouseMove = (e) => {
        this.updateMouseCoordinates(e);

        // click drag to pan camera
        if (this.mouse.isDragging) {
            let deltaX = e.clientX - this.mouse.dragStartX;
            let deltaY = e.clientY - this.mouse.dragStartY;
    
            this.camera.x -= deltaX / this.camera.zoom;
            this.camera.y -= deltaY / this.camera.zoom;
    
            this.mouse.dragStartX = e.clientX;
            this.mouse.dragStartY = e.clientY;
        }
    }

    handleMouseDown = (e) => {
        // initiate click drag panning
        this.mouse.isDragging = true;
        this.mouse.dragStartX = e.clientX;
        this.mouse.dragStartY = e.clientY;
    }

    handleMouseUp = (e) => {
        // end click drag panning
        delete this.mouse.isDragging;
        delete this.mouse.dragStartX;
        delete this.mouse.dragStartY;
    }

    handleMouseClick = (e) => {
        const hoveredEntity = this.world.getHovering(this.mouse);
        if (!hoveredEntity) { player.selectedEntity = null; return; }

        if (player.selectedEntity) {
            if (player.selectedEntity.type !== 'nitwit' || player.selectedEntity === hoveredEntity) {
                player.selectedEntity = null;
                return;
            }
    
            player.selectedEntity.task.target = hoveredEntity;
            player.selectedEntity = null;
            return;
        }
    
        player.selectedEntity = hoveredEntity;
    }

    handleMouseOut = (e) => {
        // end click drag panning
        delete this.mouse.isDragging;
        delete this.mouse.dragStartX;
        delete this.mouse.dragStartY;
    }

    handleMouseWheel = (e) => {
        const maxZoom = 250;
        const minZoom = 50;

        // move decimal place to avoid floating point inaccuracy
        let newZoomLevel = this.camera.zoom * 100;
    
        if (e.deltaY < 0) { // zoom in
            if (newZoomLevel >= maxZoom) { return; }
            newZoomLevel += 10;
        } else { // zoom out
            if (newZoomLevel <= minZoom) { return; }
            newZoomLevel -= 10;
        }

        this.camera.zoom = Math.floor(newZoomLevel) / 100;
    }

    handlekeyDown = (e) => {
        this.keys[e.key] = true;
    }

    handlekeyUp = (e) => {
        delete this.keys[e.key];
    }

    handleResize = (e) => {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        let ctx = this.canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;
    }
}