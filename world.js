class World {
    constructor(tileSize = 32, chunkSize = 8) {
        this.tileSize = tileSize;
        this.chunkSize = chunkSize;

        this.chunks = new Set();
    }

    render(ctx) {
        this.chunks.forEach((chunk) => {
            if (!chunk.image) { this.cacheChunk(chunk); }
            const x = chunk.x * this.tileSize * this.chunkSize;
            const y = chunk.y * this.tileSize * this.chunkSize;
            ctx.drawImage(chunk.image, x, y)
        });
    }

    cacheChunk(chunk) {
        const canvas = document.createElement('canvas');
        canvas.width = this.tileSize * this.chunkSize;
        canvas.height = this.tileSize * this.chunkSize;
        const ctx = canvas.getContext('2d');

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
                } else {
                    ctx.fillStyle = "#000";
                }
                ctx.fillRect(x * this.tileSize, y * this.tileSize, this.tileSize, this.tileSize);
            }
        }

        chunk.image = new Image();
        chunk.image.src = canvas.toDataURL();
    }

    generateChunk(x, y) {
        const chunk = {
            id: 'chunk.' + x + '.' + y,
            x: x,
            y: y,
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
        this.chunks.add(chunk);
        this.cacheChunk(chunk);
    }
}