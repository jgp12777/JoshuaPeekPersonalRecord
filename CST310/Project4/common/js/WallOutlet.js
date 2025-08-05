class WallOutlet {
    constructor(width = 0.3, height = 0.4, depth = 0.02, alias = 'wall-outlet') {
        this.alias = alias;
        this.width = width;
        this.height = height;
        this.depth = depth;
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.wireframe = false;
        this.diffuse = [0.95, 0.9, 0.8, 1.0]; // Cream color

        this.build();
    }

    build() {
        const w = this.width / 2;
        const h = this.height / 2;
        const d = this.depth / 2;

        // Vertices: front face (z = d), back face (z = -d)
        this.vertices = [
            // Front face
            -w, -h, d,  w, -h, d,  w, h, d,  -w, h, d,
            // Back face
            -w, -h, -d,  w, -h, -d,  w, h, -d,  -w, h, -d
        ];

        // Indices for the faces (triangles)
        this.indices = [
            // Front face
            0, 1, 2,  0, 2, 3,
            // Back face
            5, 4, 7,  5, 7, 6,
            // Left face
            4, 0, 3,  4, 3, 7,
            // Right face
            1, 5, 6,  1, 6, 2,
            // Top face
            3, 2, 6,  3, 6, 7,
            // Bottom face
            4, 5, 1,  4, 1, 0
        ];

        // Normals for each face
        this.normals = [
            // Front face (positive z)
            0, 0, 1,  0, 0, 1,  0, 0, 1,  0, 0, 1,
            // Back face (negative z)
            0, 0, -1,  0, 0, -1,  0, 0, -1,  0, 0, -1,
            // Left face (negative x)
            -1, 0, 0,  -1, 0, 0,  -1, 0, 0,  -1, 0, 0,
            // Right face (positive x)
            1, 0, 0,  1, 0, 0,  1, 0, 0,  1, 0, 0,
            // Top face (positive y)
            0, 1, 0,  0, 1, 0,  0, 1, 0,  0, 1, 0,
            // Bottom face (negative y)
            0, -1, 0,  0, -1, 0,  0, -1, 0,  0, -1, 0
        ];
    }
}