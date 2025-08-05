class Door {
  constructor(width = 1.5, height = 7, depth = 0.1, alias = 'door') {
    this.alias = alias;
    this.width = width;
    this.height = height;
    this.depth = depth;
    this.vertices = [];
    this.indices = [];
    this.normals = [];
    
    this.wireframe = false;
    this.diffuse = [0.6, 0.4, 0.2, 1.0]; // Brown wood color
    
    this.build();
  }

  build() {
    const w = this.width / 0.9;
    const h = this.height / 2;
    const d = this.depth / 2;
    
    // Door vertices (rectangular prism)
    this.vertices = [
      // Front face
      -w, -h, d,
      w, -h, d,
      w, h, d,
      -w, h, d,

      // Back face
      -w, -h, -d,
      -w, h, -d,
      w, h, -d,
      w, -h, -d,

      // Left face
      -w, -h, -d,
      -w, -h, d,
      -w, h, d,
      -w, h, -d,

      // Right face
      w, -h, -d,
      w, h, -d,
      w, h, d,
      w, -h, d,

      // Top face
      -w, h, -d,
      -w, h, d,
      w, h, d,
      w, h, -d,

      // Bottom face
      -w, -h, -d,
      w, -h, -d,
      w, -h, d,
      -w, -h, d
    ];
    
    // Door normals
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
    
    // Door indices
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
