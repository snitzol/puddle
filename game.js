class Game {
    constructor() {
        this.updateInterval = null;
        this.canvas = document.createElement('canvas');
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.ctx = this.canvas.getContext('2d');
        this.ctx.imageSmoothingEnabled = false;
        document.body.prepend(this.canvas);

        this.canvas.addEventListener("contextmenu", (e) => {e.preventDefault()});
        this.canvas.addEventListener('mousemove', handleMouseMoveInput);
        this.canvas.addEventListener('mouseout', handleMouseOutInput);
        this.canvas.addEventListener('mousedown', handleMouseDownInput);
        this.canvas.addEventListener('mouseup', handleMouseUpInput);
        this.canvas.addEventListener('click', handleMouseInput);
        window.addEventListener('wheel', handleMouseWheel)
        window.addEventListener('keydown', handlekeyDown);
        window.addEventListener('keyup', handlekeyUp);
        window.addEventListener('resize', resizeCanvas);

        this.camera = {
            x: 0,
            y: 0,
            zoom: 1,
            speed: 8,
        }

        this.world = new World();
        this.entities = new Set();
    }

    update = () => {
        //console.log('update tick');
        processInput();

        this.entities.forEach((entity) => {
            if (entity.task && entity.task.target !== null) {
                entity.update();
            }
        });
    }

    render = () => {
        const ctx = this.ctx;
        let offset = { x: this.canvas.width / 2, y: this.canvas.height / 2 };

        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        ctx.save();

        ctx.translate(offset.x, offset.y);
        ctx.scale(this.camera.zoom, this.camera.zoom);
        ctx.translate(-this.camera.x, -this.camera.y);

        this.world.render(ctx);

        this.entities.forEach((entity) => {
            entity.render(ctx);
            entity.hitbox.render(ctx);
        })

        if (player.selectedEntity) {
            player.selectedEntity.hitbox.render(ctx);
        }

        ctx.restore();
        requestAnimationFrame(this.render);
    }

    start() {
        this.updateInterval = setInterval(this.update, 1000 / 60);
        requestAnimationFrame(this.render);
    }

    stop() {
        clearInterval(this.updateInterval);
    }
}