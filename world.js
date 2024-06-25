class World {
    constructor(tileSize = 32, chunkSize = 8) {
        this.tileSize = tileSize;
        this.chunkSize = chunkSize;

        const boundary = new Rectangle(-2048, -2048, 4096, 4096);
        this.region = new Quadtree(boundary);
    }

    render(ctx) {
        let range = new Rectangle(
            game.camera.x - ((game.canvas.width / game.camera.zoom) / 2),
            game.camera.y - ((game.canvas.height / game.camera.zoom) / 2),
            game.canvas.width / game.camera.zoom,
            game.canvas.height / game.camera.zoom,
        );

        let found = this.region.query(range);

        found.forEach((chunk) => {
            if (!chunk.canvas) { chunk.cache(this.tileSize); }
            ctx.drawImage(chunk.canvas, chunk.boundary.x, chunk.boundary.y, chunk.boundary.width, chunk.boundary.height)
        });

        ctx.strokeStyle = 'red';
        ctx.strokeRect(range.x, range.y, range.width, range.height);

        this.region.render(ctx);
    }

    getHovering(mouse) {
        const range = new Rectangle(mouse.x, mouse.y, 1, 1);

        const found = this.region.query(range);
        if (found.size === 0) { return; }
        const chunk = Array.from(found)[0];

        let hovering = false;

        chunk.entities.forEach((entity) => {
            if (entity.hitbox.intersect(range)) {
                hovering = entity;
            }
        });

        return hovering;
    }

    generateChunk(x, y) {
        const tileData = [
            [2,2,2,2,2,2,2,2],
            [2,2,2,2,2,2,2,2],
            [2,2,2,2,2,2,2,2],
            [2,2,2,2,2,2,2,2],
            [2,2,2,2,2,2,2,2],
            [2,2,2,2,2,2,2,2],
            [2,2,2,2,2,2,2,2],
            [2,2,2,2,2,2,2,2],
        ];

        const chunk = new Chunk(x, y, this.tileSize, this.chunkSize, tileData);

        chunk.cache(this.tileSize);

        this.region.insert(chunk);
        window.chunks.push(chunk);
    }
}