function taskComponent() {
    return {
        task: {
            target: null,
            step: null,
            cooldown: 100,
        },
        update() {
            switch(this.task.step) {
                case 'traveling':
                    const dx = this.x - this.task.target.x;
                    const dy = this.y - this.task.target.y;

                    const signX = Math.sign(dx);
                    const signY = Math.sign(dy);

                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance > this.speed) {
                        this.x -= this.speed * signX;
                        this.y -= this.speed * signY;
                    }

                    if (this.hitbox.intersect(this.task.target.hitbox)) {
                        this.task.step = 'harvesting';
                    }

                    this.hitbox.x = this.x - 16;
                    this.hitbox.y = this.y - 16;
                    break;
                case 'harvesting':
                    this.task.cooldown -= 1;
                    if (this.task.cooldown > 0) { return; }
                    this.task.cooldown = 100;

                    if (this.inventory.length >= 8) { 
                        console.log('inventory full');
                        return;
                    }

                    const chance = 0.3;
                    const rng = Math.random();

                    if (rng < chance) {
                        this.inventory.push('log');
                        console.log('success');
                    } else {
                        console.log('unsuccesful');
                    }

                    break;
                default:
                    this.task.step = 'traveling';
              }
        },
    };
}

function renderComponent() {
    return {
        render(ctx) {
            if (!this.hitbox) { return; }

            if (this.sprite) {
                ctx.drawImage(this.sprite, this.hitbox.x, this.hitbox.y, this.hitbox.width, this.hitbox.height);
                return;
            }

            if (this.hitbox.radius) {
                const { x: x, y: y, radius: radius } = this.hitbox;
                ctx.beginPath();
                ctx.fillStyle = this.color;
                ctx.arc(x, y, radius, 0, 2 * Math.PI);
                ctx.fill();
            } else {
                const { x: x, y: y, width: width, height: height } = this.hitbox;
                ctx.fillStyle = this.color;
                ctx.fillRect(x, y, width, height);
            }
        },
    };
}

function moveComponent() {
    return {
        speed: 1,
        move(x, y) {
            this.x = x;
            this.y = y;

            this.hitbox.x = this.x - 16;
            this.hitbox.y = this.y - 16;
        },
    }
}

function inventoryComponent() {
    return {
        inventory: [],
    }
}

function createNitwit(x, y) {
    const base = {
        type: 'nitwit',
        id: 'nitwit_' + x + ',' + y,
        x: x,
        y: y,
        width: 1,
        height: 1,
        hitbox: new Rectangle(
            x - 16 * 1,
            y - 16 * 1,
            1 * 32,
            1 * 32,
        ),
        color: 'wheat',
        sprite: sprites['nitwit'],
    };

    return {
        ...base,
        ...renderComponent(),
        ...moveComponent(),
        ...taskComponent(),
        ...inventoryComponent(),
    };
}

function createCrate(x, y) {
    const base = {
        type: 'crate',
        id: 'crate_' + x + ',' + y,
        x: x,
        y: y,
        width: 1,
        height: 1,
        hitbox: new Rectangle(
            x - 16 * 1,
            y - 16 * 1,
            1 * 32,
            1 * 32,
        ),
        color: 'saddlebrown',
        sprite: sprites['crate'],
    };

    return {
        ...base,
        ...renderComponent(),
        ...inventoryComponent(),
    };
}

function createTree(x, y) {
    const base = {
        type: 'tree',
        id: 'tree_' + x + ',' + y,
        x: x,
        y: y,
        width: 2,
        height: 2,
        hitbox: new Rectangle(
            x - 16 * 2,
            y - 16 * 2,
            2 * 32,
            2 * 32,
        ),
        color: 'yellowgreen',
        sprite: sprites['tree'],
    };
    return {
        ...base,
        ...renderComponent(),
    };
}