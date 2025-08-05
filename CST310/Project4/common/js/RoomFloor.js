class RoomFloor {
  constructor(width = 10, depth = 10) {
    this.alias = 'room-floor';
    this.width = width;
    this.depth = depth;
    this.vertices = [];
    this.indices = [];
    this.normals = [];
    
    this.wireframe = false;
    this.diffuse = [0.6, 0.4, 0.2, 1.0]; // Brown wood color
    
    this.build();
  }

  build() {
    const w = this.width / 2;
    const d = this.depth / 2;
    
    // Floor vertices (horizontal plane)
    this.vertices = [
      -w, 0, -d,
      w, 0, -d,
      w, 0, d,
      -w, 0, d
    ];
    
    // Floor normals (pointing upward)
    this.normals = [
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,
      0, 1, 0
    ];
    
    // Floor indices
    this.indices = [
      0, 1, 2,
      0, 2, 3
    ];
  }
}
