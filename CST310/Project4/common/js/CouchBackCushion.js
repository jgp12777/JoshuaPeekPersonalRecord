class CouchBackCushion {
    constructor(width = 6, height = 6, depth = 6, alias = 'couch-back-cushion') {
        this.alias = alias;
        this.width = width;
        this.height = height;
        this.depth = depth;
        this.vertices = [];
        this.indices = [];
        this.normals = [];

        this.wireframe = false;
        this.diffuse = [0.8, 0.6, 0.4, 1.0]; // Light brown matching the seat cushions

        this.build();
    }

    build() {
        const w = this.width / 2;
        const h = this.height;
        const d = this.depth;

        // Back cushion vertices
        this.vertices = [
            // Front face
            -w, 0, 0,
            w, 0, 0,
            w, h, 0,
            -w, h, 0,

            // Back face
            -w, 0, -d,
            w, 0, -d,
            w, h, -d,
            -w, h, -d,

            // Left face
            -w, 0, 0,
            -w, 0, -d,
            -w, h, -d,
            -w, h, 0,

            // Right face
            w, 0, 0,
            w, h, 0,
            w, h, -d,
            w, 0, -d,

            // Top face
            -w, h, 0,
            w, h, 0,
            w, h, -d,
            -w, h, -d,

            // Bottom face
            -w, 0, 0,
            -w, 0, -d,
            w, 0, -d,
            w, 0, 0
        ];

        // Back cushion normals
        this.normals = [
            // Front face
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,

            // Back face
            0, 0, -1,
            0, 0, -1,
            0, 0, -1,
            0, 0, -1,

            // Left face
            -1, 0, 0,
            -1, 0, 0,
            -1, 0, 0,
            -1, 0, 0,

            // Right face
            1, 0, 0,
            1, 0, 0,
            1, 0, 0,
            1, 0, 0,

            // Top face
            0, 1, 0,
            0, 1, 0,
            0, 1, 0,
            0, 1, 0,

            // Bottom face
            0, -1, 0,
            0, -1, 0,
            0, -1, 0,
            0, -1, 0
        ];

        // Back cushion indices
        this.indices = [
            // Front face
            0, 1, 2, 0, 2, 3,
            // Back face
            4, 5, 6, 4, 6, 7,
            // Left face
            8, 9, 10, 8, 10, 11,
            // Right face
            12, 13, 14, 12, 14, 15,
            // Top face
            16, 17, 18, 16, 18, 19,
            // Bottom face
            20, 21, 22, 20, 22, 23
        ];
    }
}