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
            if (!chunk.canvas) { this.cacheChunk(chunk); }
            ctx.drawImage(chunk.canvas, chunk.boundary.x, chunk.boundary.y, chunk.boundary.width, chunk.boundary.height)
        });

        ctx.strokeStyle = 'red';
        ctx.strokeRect(range.x, range.y, range.width, range.height);

        this.region.render(ctx);
    }

    cacheChunk(chunk) {
        const canvas = document.createElement('canvas');
        canvas.width = this.tileSize * this.chunkSize;
        canvas.height = this.tileSize * this.chunkSize;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;

        let tile = null;

        for (let y = 0; y < this.chunkSize; y++) {
            if (chunk.tileData[y] === undefined) {
                console.log('error', chunk, 'y: ' + y);
                continue;
            }
 
            for (let x = 0; x < this.chunkSize; x++) {
                if (chunk.tileData[y][x] === undefined) {
                    console.log('error', chunk, 'x: ' + x);
                    continue;
                }

                if (chunk.tileData[y][x] === 1) {
                    ctx.fillStyle = "#111";
                    tile = 'grass_0';
                } else {
                    ctx.fillStyle = "#000";
                    tile = 'grass_0';
                }

                if (tile) {
                    ctx.drawImage(sprites[tile], x * this.tileSize, y * this.tileSize, this.tileSize, this.tileSize);
                } else {
                    ctx.fillRect(x * this.tileSize, y * this.tileSize, this.tileSize, this.tileSize);
                }
                
            }
        }

        chunk.canvas = canvas;
        //chunk.image = new Image();
        //chunk.image.src = canvas.toDataURL();
    }

    generateChunk(x, y) {
        const chunk = {
            id: 'chunk.' + x + '.' + y,
            x: x,
            y: y,
            boundary: new Rectangle(
                x * this.tileSize * this.chunkSize,
                y * this.tileSize * this.chunkSize,
                this.tileSize * this.chunkSize,
                this.tileSize * this.chunkSize,
            ),
            tileData: [
                [0,1,0,1,0,1,0,1],
                [1,0,1,0,1,0,1,0],
                [0,1,0,1,0,1,0,1],
                [1,0,1,0,1,0,1,0],
                [0,1,0,1,0,1,0,1],
                [1,0,1,0,1,0,1,0],
                [0,1,0,1,0,1,0,1],
                [1,0,1,0,1,0,1,0],
            ],
        };
        this.region.insert(chunk);
        this.cacheChunk(chunk);
    }
}