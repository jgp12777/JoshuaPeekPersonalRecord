class CouchArmrestRight {
    constructor(width = 3.4, depth = 1.7, height = 2.6, slantHeight = 0.3, alias = 'couch-armrest-right') {
        this.alias = alias;
        this.width = width;
        this.depth = depth;
        this.height = height;
        this.slantHeight = slantHeight; // Reduced by half
        this.vertices = [];
        this.indices = [];
        this.normals = [];

        this.wireframe = false;
        this.diffuse = [0.6, 0.4, 0.2, 1.0]; // Brown color matching the couch base

        this.build();
    }

    build() {
        const w = this.width / 2;
        const d = this.depth / 2;
        const h = this.height - this.slantHeight; // Base height before slant

        // Right armrest vertices with high edge on outside (+z) and low edge inward (-z)
        this.vertices = [
            // Bottom face
            -w, 0, -d,
            w, 0, -d,
            w, 0, d,
            -w, 0, d,

            // Front face (inside, low edge)
            -w, 0, -d,
            w, 0, -d,
            w, h, -d,
            -w, h, -d,

            // Back face (outside, high edge)
            -w, 0, d,
            -w, this.height, d,
            w, this.height, d,
            w, 0, d,

            // Left face
            -w, 0, -d,
            -w, h, -d,
            -w, this.height, d,
            -w, 0, d,

            // Right face
            w, 0, -d,
            w, h, -d,
            w, this.height, d,
            w, 0, d,

            // Slanted top face
            -w, h, -d,
            w, h, -d,
            w, this.height, d,
            -w, this.height, d
        ];

        // Right armrest normals
        this.normals = [
            // Bottom face
            0, -1, 0,
            0, -1, 0,
            0, -1, 0,
            0, -1, 0,

            // Front face
            0, 0, -1,
            0, 0, -1,
            0, 0, -1,
            0, 0, -1,

            // Back face
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,

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

            // Slanted top face (approximate normal for inward slant, reduced angle)
            0, 0.9806, -0.1961, // Adjusted for half angle (cos(11.31°), -sin(11.31°))
            0, 0.9806, -0.1961,
            0, 0.9806, -0.1961,
            0, 0.9806, -0.1961
        ];

        // Right armrest indices
        this.indices = [
            // Bottom face
            0, 1, 2, 0, 2, 3,
            // Front face
            4, 5, 6, 4, 6, 7,
            // Back face
            8, 9, 10, 8, 10, 11,
            // Left face
            12, 13, 14, 12, 14, 15,
            // Right face
            16, 17, 18, 16, 18, 19,
            // Slanted top face
            20, 21, 22, 20, 22, 23
        ];
    }
}