/*
    - FIX CHUNK GAP WHEN ZOOMED
    - more advance chunk generation
    - store entities into chunks
    - auto generating chunks based on camera position
    - adjust entity movement
    - adjust entity task processing
    - advance entity pathfinding
*/

class Rectangle {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    render(ctx) {
        ctx.strokeStyle = 'red';
        ctx.strokeRect(this.x, this.y, this.width, this.height);
    }

    intersect(rect) {
        return (
            this.x + this.width  >= rect.x &&
            this.x               <= rect.x + rect.width &&
            this.y + this.height >= rect.y &&
            this.y               <= rect.y + rect.height
        );
    }
}

class Circle {
    constructor(x, y, radius = 32) {
        this.x = x;
        this.y = y;
        this.radius = radius;
    }
}

const player = {
    selectedEntity: null,
};

let sprites = {};
let spritePaths = [
    'nitwit',
    'tree',
    'crate',
    'grass_0',
]

function loadSprites(callback) {
    let loaded = 0;

    spritePaths.forEach((id) => {
        const url = 'i/' + id + '.png';
        const image = new Image();
        image.onload = function() {
            loaded++;
            sprites[id] = image;
            if (loaded === spritePaths.length) {
                callback();
            }
        };
        image.src = url;
    });
}

loadSprites(function() {
    window.game = new Game();
    game.start();

    //
    //
    // temporary

    window.nitwit = createNitwit(16, 16);
    window.tree = createTree(256, 96);
    window.crate = createCrate(80, -142);
    game.entities.add(nitwit);
    game.entities.add(tree);
    game.entities.add(crate);

    window.chunks = [];
    // center chunks
    game.world.generateChunk(-1, -1);
    game.world.generateChunk(0, -1);
    game.world.generateChunk(-1, 0);
    game.world.generateChunk(0, 0);

    chunks[3].insert(nitwit);
    chunks[3].insert(tree);
    chunks[1].insert(crate);

    // additional top
    game.world.generateChunk(-2, -2);
    game.world.generateChunk(-1, -2);
    game.world.generateChunk(0, -2);
    game.world.generateChunk(1, -2);

    // additional sides
    game.world.generateChunk(-2, -1);
    game.world.generateChunk(-2, 0);
    game.world.generateChunk(1, -1);
    game.world.generateChunk(1, 0);

    // additional bottom
    game.world.generateChunk(-2, 1);
    game.world.generateChunk(-1, 1);
    game.world.generateChunk(0, 1);
    game.world.generateChunk(1, 1);
});

