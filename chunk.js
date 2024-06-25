class Chunk {
    constructor(x, y, tileSize, chunkSize, tileData) {
        this.id = 'chunk.' + x + '.' + y;
        this.x = x;
        this.y = y;

        this.boundary = new Rectangle(
            x * tileSize * chunkSize,
            y * tileSize * chunkSize,
            tileSize * chunkSize,
            tileSize * chunkSize,
        );

        this.tileData = tileData || [
            [0,1,0,1,0,1,0,1],
            [1,0,1,0,1,0,1,0],
            [0,1,0,1,0,1,0,1],
            [1,0,1,0,1,0,1,0],
            [0,1,0,1,0,1,0,1],
            [1,0,1,0,1,0,1,0],
            [0,1,0,1,0,1,0,1],
            [1,0,1,0,1,0,1,0],
        ];

        this.entities = new Set();
    }

    cache(tileSize) {
        const canvas = document.createElement('canvas');
        canvas.width = this.boundary.width;
        canvas.height = this.boundary.height;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;

        for (let y = 0; y < canvas.height; y++) {
            if (this.tileData[y] === undefined) { continue; }
 
            for (let x = 0; x < canvas.width; x++) {
                if (this.tileData[y][x] === undefined) { continue; }

                let tileId = undefined;
                let tileValue = this.tileData[y][x];

                if (tileValue === 0) { ctx.fillStyle = "#000";
                } else if (tileValue === 1) { ctx.fillStyle = "#111";
                } else if (tileValue === 2) { tileId = 'grass_0'; }

                if (tileId) {
                    ctx.drawImage(sprites[tileId], x * tileSize, y * tileSize, tileSize, tileSize);
                } else {
                    ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
                }
                
            }
        }

        ctx.font = "12px monospace";
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fillText(this.id, 2, 10);

        this.canvas = canvas;
        //chunk.image = new Image();
        //chunk.image.src = canvas.toDataURL();
    }

    insert(entity) {
        if (this.entities.has(entity)) { return; }

        this.entities.add(entity);
    }

    remove(entity) {
        if (!this.entities.has(entity)) { return; }

        this.entities.delete(entity);
    }
}