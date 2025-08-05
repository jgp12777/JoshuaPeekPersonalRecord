class Ceiling {
  constructor(width = 10, depth = 10) {
    this.alias = 'ceiling';
    this.width = width;
    this.depth = depth;
    this.vertices = [];
    this.indices = [];
    this.normals = [];
    
    this.wireframe = false;
    this.diffuse = [0.9, 0.9, 0.9, 1.0]; // Light gray color
    
    this.build();
  }

  build() {
    const w = this.width / 2;
    const d = this.depth / 2;
    
    // Ceiling vertices (horizontal plane)
    this.vertices = [
      -w, 0, -d,
      w, 0, -d,
      w, 0, d,
      -w, 0, d
    ];
    
    // Ceiling normals (pointing downward)
    this.normals = [
      0, -1, 0,
      0, -1, 0,
      0, -1, 0,
      0, -1, 0
    ];
    
    // Ceiling indices
    this.indices = [
      0, 1, 2,
      0, 2, 3
    ];
  }
}
