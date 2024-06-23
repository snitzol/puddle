class Quadtree {
    constructor(boundary, capacity = 4, depth = 0, maxDepth = 3) {
        this.boundary = boundary;
        this.maxDepth = maxDepth;
        this.depth = depth;
        this.capacity = capacity;
        this.points = [];
    }

    render(ctx) {
        this.boundary.render(ctx);

        if (this.nw) {
            this.nw.render(ctx);
            this.ne.render(ctx);
            this.sw.render(ctx);
            this.se.render(ctx);
        }
    }

    insert(point) {
        if (!this.boundary.intersect(point.boundary)) {
            return;
        }

        if (this.depth === this.maxDepth) {
            this.points.push(point);
            return;
        }

        if (this.points.length < this.capacity && !this.nw) {
            this.points.push(point);
            return;
        }

        if (!this.nw) {
            this.subdivide();
        }

        this.nw.insert(point);
        this.ne.insert(point);
        this.sw.insert(point);
        this.se.insert(point);
    }

    remove(point) {
        if (!this.boundary.intersect(point.boundary)) {
            return;
        }

        if (this.depth === this.maxDepth) {
            const index = this.points.findIndex(p => p === point);
            if (index !== -1) {
                this.points.splice(index, 1);
            }
            return;
        }

        if (!this.nw) {
            return;
        }

        this.nw.remove(point);
        this.ne.remove(point);
        this.sw.remove(point);
        this.se.remove(point);
    }

    subdivide() {
        let x = this.boundary.x;
        let y = this.boundary.y;
        let w = this.boundary.width / 2;
        let h = this.boundary.height / 2;
        let depth = this.depth + 1;

        this.nw = new Quadtree(new Rectangle(x, y, w, h), this.capacity, depth, this.maxDepth);
        this.ne = new Quadtree(new Rectangle(x + w, y, w, h), this.capacity, depth, this.maxDepth);
        this.sw = new Quadtree(new Rectangle(x, y + h, w, h), this.capacity, depth, this.maxDepth);
        this.se = new Quadtree(new Rectangle(x + w, y + h, w, h), this.capacity, depth, this.maxDepth);

        this.points.forEach((point) => {
            this.nw.insert(point);
            this.ne.insert(point);
            this.sw.insert(point);
            this.se.insert(point);
        });

        this.points = [];
    }

    query(range, found = new Set()) {
        if (!this.boundary.intersect(range)) {
            return found;
        }

        if (!this.nw) {
            this.points.forEach((point) => {
                if (point.boundary.intersect(range)) {
                    found.add(point);
                }
            });
            return found;
        }

        this.nw.query(range, found);
        this.ne.query(range, found);
        this.sw.query(range, found);
        this.se.query(range, found);

        return found;
    }
}