
class Wall {
  constructor(width = 10, height = 10, alias = 'wall') {
    this.alias = alias;
    this.width = width;
    this.height = height;
    this.vertices = [];
    this.indices = [];
    this.normals = [];
    
    this.wireframe = false;
    this.diffuse = [0.8, 0.8, 0.8, 1.0]; // Light gray color
    
    this.build();
  }

  build() {
    const w = this.width / 2;
    const h = this.height / 2;
    
    // Wall vertices (rectangular plane)
    this.vertices = [
      // Front face
      -w, -h, 0,
      w, -h, 0,
      w, h, 0,
      -w, h, 0
    ];
    
    // Wall normals (pointing outward)
    this.normals = [
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1
    ];
    
    // Wall indices
    this.indices = [
      0, 1, 2,
      0, 2, 3
    ];
  }
}
