class Table {
  constructor(width = 2.9, depth = 2, height = 3, alias = 'table') {
    this.alias = alias;
    this.width = width;
    this.depth = depth;
    this.height = height;
    this.vertices = [];
    this.indices = [];
    this.normals = [];
    
    this.wireframe = false;
    this.diffuse = [0.6, 0.4, 0.2, 1.0]; // Brown wood color
    
    this.build();
  }

  build() {
    this.vertices = [];
    this.indices = [];
    this.normals = [];
    
    let indexOffset = 0;
    
    // Table leg parameters
    const legRadius = 0.05;
    const legHeight = this.height;
    const legSegments = 8;
    
    // Shelf parameters
    const shelfThickness = 0.05;
    const shelf1Y = this.height - shelfThickness/2; // Top shelf
    const shelf2Y = this.height * 0.7 - shelfThickness/2; // 30% lower
    const shelf3Y = this.height * 0.4 - shelfThickness/2; // 60% lower
    
    // Leg positions (at corners)
    const legPositions = [
      [-this.width/2 + legRadius, 0, -this.depth/2 + legRadius],
      [this.width/2 - legRadius, 0, -this.depth/2 + legRadius],
      [this.width/2 - legRadius, 0, this.depth/2 - legRadius],
      [-this.width/2 + legRadius, 0, this.depth/2 - legRadius]
    ];
    
    // Create 4 cylindrical legs
    for (let leg = 0; leg < 4; leg++) {
      const [legX, legY, legZ] = legPositions[leg];
      
      // Create cylinder vertices for this leg
      for (let i = 0; i <= legSegments; i++) {
        const angle = (i / legSegments) * 2 * Math.PI;
        const x = Math.cos(angle) * legRadius;
        const z = Math.sin(angle) * legRadius;
        
        // Bottom circle
        this.vertices.push(legX + x, legY, legZ + z);
        this.normals.push(Math.cos(angle), 0, Math.sin(angle));
        
        // Top circle
        this.vertices.push(legX + x, legY + legHeight, legZ + z);
        this.normals.push(Math.cos(angle), 0, Math.sin(angle));
      }
      
      // Center vertices for top and bottom caps
      this.vertices.push(legX, legY, legZ); // Bottom center
      this.normals.push(0, -1, 0);
      
      this.vertices.push(legX, legY + legHeight, legZ); // Top center
      this.normals.push(0, 1, 0);
      
      // Create indices for cylinder sides
      for (let i = 0; i < legSegments; i++) {
        const current = indexOffset + i * 2;
        const next = indexOffset + ((i + 1) % legSegments) * 2;
        
        // Two triangles per segment
        this.indices.push(current, next, current + 1);
        this.indices.push(next, next + 1, current + 1);
      }
      
      // Create indices for bottom cap
      const bottomCenter = indexOffset + legSegments * 2 + 2;
      for (let i = 0; i < legSegments; i++) {
        const current = indexOffset + i * 2;
        const next = indexOffset + ((i + 1) % legSegments) * 2;
        this.indices.push(bottomCenter, next, current);
      }
      
      // Create indices for top cap
      const topCenter = indexOffset + legSegments * 2 + 3;
      for (let i = 0; i < legSegments; i++) {
        const current = indexOffset + i * 2 + 1;
        const next = indexOffset + ((i + 1) % legSegments) * 2 + 1;
        this.indices.push(topCenter, current, next);
      }
      
      indexOffset += (legSegments + 1) * 2 + 2;
    }
    
    // Create 3 rectangular shelves
    const shelfYPositions = [shelf1Y, shelf2Y, shelf3Y];
    
    for (let shelf = 0; shelf < 3; shelf++) {
      const y = shelfYPositions[shelf];
      const w = this.width / 2;
      const d = this.depth / 2;
      const t = shelfThickness / 2;
      
      // Shelf vertices (rectangular prism)
      const shelfVertices = [
        // Top face
        -w, y + t, -d,
        w, y + t, -d,
        w, y + t, d,
        -w, y + t, d,
        
        // Bottom face
        -w, y - t, -d,
        -w, y - t, d,
        w, y - t, d,
        w, y - t, -d,
        
        // Front face
        -w, y - t, d,
        w, y - t, d,
        w, y + t, d,
        -w, y + t, d,
        
        // Back face
        -w, y - t, -d,
        -w, y + t, -d,
        w, y + t, -d,
        w, y - t, -d,
        
        // Left face
        -w, y - t, -d,
        -w, y - t, d,
        -w, y + t, d,
        -w, y + t, -d,
        
        // Right face
        w, y - t, -d,
        w, y + t, -d,
        w, y + t, d,
        w, y - t, d
      ];
      
      // Shelf normals
      const shelfNormals = [
        // Top face
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        
        // Bottom face
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        
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
        1, 0, 0
      ];
      
      // Add shelf vertices and normals
      this.vertices.push(...shelfVertices);
      this.normals.push(...shelfNormals);
      
      // Shelf indices
      const shelfIndices = [
        // Top face
        0, 1, 2, 0, 2, 3,
        // Bottom face
        4, 5, 6, 4, 6, 7,
        // Front face
        8, 9, 10, 8, 10, 11,
        // Back face
        12, 13, 14, 12, 14, 15,
        // Left face
        16, 17, 18, 16, 18, 19,
        // Right face
        20, 21, 22, 20, 22, 23
      ];
      
      // Add shelf indices with offset
      for (let i = 0; i < shelfIndices.length; i++) {
        this.indices.push(shelfIndices[i] + indexOffset);
      }
      
      indexOffset += 24; // 24 vertices per shelf
    }
  }
}
