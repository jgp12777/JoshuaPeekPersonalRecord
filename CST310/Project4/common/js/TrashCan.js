class TrashCan {
    constructor(width = 1.2, depth = 1.2, height = 2, baseScale = 0.8, segments = 32, cornerRadius = 0.1, alias = 'trash-can') {
        this.alias = alias;
        this.width = width; // Top width
        this.depth = depth; // Top depth
        this.height = height;
        this.baseScale = baseScale; // Scale factor for base (smaller than top)
        this.segments = segments;
        this.cornerRadius = cornerRadius;
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.wireframe = false;
        this.diffuse = [0.0, 0.0, 0.0, 1.0]; // Black color for the trash can

        this.build();
    }

    build() {
        const step = 2 * Math.PI / this.segments;
        const n = 3.5; // Increased superellipse parameter for less rounded edges

        // Generate vertices for the base and top profiles
        for (let i = 0; i <= this.segments; i++) {
            const theta = i * step;
            const cosTheta = Math.cos(theta);
            const sinTheta = Math.sin(theta);

            // Superellipse equation for rounded rectangle
            const xFactor = Math.pow(Math.abs(cosTheta), 2 / n) * Math.sign(cosTheta);
            const zFactor = Math.pow(Math.abs(sinTheta), 2 / n) * Math.sign(sinTheta);

            // Top profile (full size)
            const xTop = (this.width / 2 - this.cornerRadius) * xFactor + this.cornerRadius * cosTheta;
            const zTop = (this.depth / 2 - this.cornerRadius) * zFactor + this.cornerRadius * sinTheta;

            // Base profile (scaled down)
            const xBase = xTop * this.baseScale;
            const zBase = zTop * this.baseScale;

            // Base ring
            this.vertices.push(xBase, 0, zBase);
            // Top ring (open top)
            this.vertices.push(xTop, this.height, zTop);
        }

        // Generate side faces
        for (let i = 0; i < this.segments; i++) {
            const baseIndex1 = i * 2;
            const baseIndex2 = ((i + 1) % this.segments) * 2;
            const topIndex1 = i * 2 + 1;
            const topIndex2 = ((i + 1) % this.segments) * 2 + 1;

            // Two triangles per segment
            this.indices.push(baseIndex1, topIndex1, baseIndex2);
            this.indices.push(baseIndex2, topIndex1, topIndex2);

            // Calculate normals
            const dx = this.vertices[topIndex1 * 3] - this.vertices[baseIndex1 * 3];
            const dy = this.height;
            const dz = this.vertices[topIndex1 * 3 + 2] - this.vertices[baseIndex1 * 3 + 2];

            // Compute normal for the face
            const v1 = [
                this.vertices[baseIndex2 * 3] - this.vertices[baseIndex1 * 3],
                this.vertices[baseIndex2 * 3 + 1] - this.vertices[baseIndex1 * 3 + 1],
                this.vertices[baseIndex2 * 3 + 2] - this.vertices[baseIndex1 * 3 + 2]
            ];
            const v2 = [dx, dy, dz];

            let normal = [
                v1[1] * v2[2] - v1[2] * v2[1],
                v1[2] * v2[0] - v1[0] * v2[2],
                v1[0] * v2[1] - v1[1] * v2[0]
            ];

            const length = Math.sqrt(normal[0] * normal[0] + normal[1] * normal[1] + normal[2] * normal[2]);
            normal = normal.map(n => n / length);

            // Apply normal to all vertices of the quad
            for (let j = 0; j < 6; j++) {
                this.normals.push(normal[0], normal[1], normal[2]);
            }
        }

        // Generate base (bottom face)
        const baseCenterIndex = this.vertices.length / 3;
        this.vertices.push(0, 0, 0); // Center of base
        for (let i = 0; i < this.segments; i++) {
            const baseIndex1 = i * 2;
            const baseIndex2 = ((i + 1) % this.segments) * 2;
            this.indices.push(baseCenterIndex, baseIndex1, baseIndex2);
            this.normals.push(0, -1, 0); // Downward normal for base
            this.normals.push(0, -1, 0);
            this.normals.push(0, -1, 0);
        }
    }
}