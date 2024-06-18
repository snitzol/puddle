/*

    - sprites
    - create input class
    - auto generating chunks
    - more advance chunks
    - quadtree

*/

const player = {
    selectedEntity: null,
};

let mouse = { x: 0, y: 0, width: 0, height: 0, element: document.getElementById('mouseCoords') };
function updateMouseCoords(e) {
    const rect = game.canvas.getBoundingClientRect();

    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    let offset = { x: game.canvas.width / 2, y: game.canvas.height / 2 };
    x -= offset.x;
    y -= offset.y;

    x = x / game.camera.zoom;
    y = y / game.camera.zoom;

    x += game.camera.x;
    y += game.camera.y;

    mouse.x = Math.round(x);
    mouse.y = Math.round(y);

    mouse.element.textContent = mouse.x + ',' + mouse.y;
}

function handleMouseMoveInput(e) {
    updateMouseCoords(e);
    if (mouse.isDragging) {
        let deltaX = e.clientX - mouse.dragStartX;
        let deltaY = e.clientY - mouse.dragStartY;

        game.camera.x -= deltaX / game.camera.zoom;
        game.camera.y -= deltaY / game.camera.zoom;

        mouse.dragStartX = e.clientX;
        mouse.dragStartY = e.clientY;
    }
}

function handleMouseDownInput(e) {
    mouse.isDragging = true;
    mouse.dragStartX = e.clientX;
    mouse.dragStartY = e.clientY;
}

function handleMouseUpInput() {
    delete mouse.isDragging;
    delete mouse.dragStartX;
    delete mouse.dragStartY;
}

function handleMouseOutInput() {
    delete mouse.isDragging;
    delete mouse.dragStartX;
    delete mouse.dragStartY;
}

function handleMouseInput() {
    let hovering = getHoveredEntity();

    if (!hovering) {
        player.selectedEntity = null;
        return;
    }

    if (player.selectedEntity) {
        if (player.selectedEntity.type !== 'nitwit' || player.selectedEntity === hovering) {
            player.selectedEntity = null;
            return;
        }

        player.selectedEntity.task.target = hovering;
        player.selectedEntity = null;
        return;
    }

    player.selectedEntity = hovering;
}

function getHoveredEntity() {
    let hovering = null;
    game.entities.forEach((entity) => {
        if (entity.hitbox.intersect(mouse)) {
            hovering = entity;
        }
    })
    return hovering;
}

function handleMouseWheel(e) {
    // move decimal place to avoid floating point inaccuracy
    let newZoomLevel = game.camera.zoom * 10;

    if (e.deltaY < 0) { // zoom in
        if (newZoomLevel >= 25) { return; }
        newZoomLevel += 1;
    } else { // zoom out
        if (newZoomLevel <= 5) { return; }
        newZoomLevel -= 1;
    }
    game.camera.zoom = newZoomLevel / 10;
}

let keys = {};
function handlekeyDown(e) {
    keys[e.key] = true;
}
function handlekeyUp(e) {
    delete keys[e.key];
}

function processInput() {
    const speed = game.camera.speed;
    if (keys['w']) { game.camera.y -= speed; mouse.y -= speed;}
    if (keys['a']) { game.camera.x -= speed; mouse.x -= speed;}
    if (keys['s']) { game.camera.y += speed; mouse.y += speed;}
    if (keys['d']) { game.camera.x += speed; mouse.x += speed;}
    mouse.element.textContent = mouse.x + ',' + mouse.y;
}

const game = new Game();
game.start();

let nitwit = createNitwit(0, 0);
let tree = createTree(256, 64);
let crate = createCrate(126, -32);
game.entities.add(nitwit);
game.entities.add(tree);
game.entities.add(crate);

game.world.generateChunk(-1, -1);
game.world.generateChunk(0, -1);
game.world.generateChunk(-1, 0);
game.world.generateChunk(0, 0);