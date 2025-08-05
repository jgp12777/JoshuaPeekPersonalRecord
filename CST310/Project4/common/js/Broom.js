
class Broom {
  constructor(handleLength = 4.0, handleRadius = 0.05, brushWidth = 0.8, brushHeight = 0.3, brushDepth = 0.15) {
    this.handleLength = handleLength;
    this.handleRadius = handleRadius;
    this.brushWidth = brushWidth;
    this.brushHeight = brushHeight;
    this.brushDepth = brushDepth;

    this.vertices = [];
    this.indices = [];
    this.normals = [];

    this.alias = 'broom';
    this.wireframe = false;
    this.diffuse = [0.0, 0.0, 1.0, 1.0]; // Blue color for handle

    this.build();
  }

  build() {
    // Create handle (cylinder)
    this.buildHandle();

    // Create brush (rectangular prism)
    this.buildBrush();
  }

  buildHandle() {
    const segments = 16;
    const radius = this.handleRadius;
    const height = this.handleLength;

    // Generate vertices for cylinder
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      // Bottom circle
      this.vertices.push(x, 0, z);
      this.normals.push(x / radius, 0, z / radius);

      // Top circle
      this.vertices.push(x, height, z);
      this.normals.push(x / radius, 0, z / radius);
    }

    // Center vertices for caps
    const bottomCenter = this.vertices.length / 3;
    this.vertices.push(0, 0, 0);
    this.normals.push(0, -1, 0);

    const topCenter = this.vertices.length / 3;
    this.vertices.push(0, height, 0);
    this.normals.push(0, 1, 0);

    // Generate indices for cylinder sides
    for (let i = 0; i < segments; i++) {
      const current = i * 2;
      const next = ((i + 1) % segments) * 2;

      // Two triangles per segment
      this.indices.push(current, next, current + 1);
      this.indices.push(current + 1, next, next + 1);
    }

    // Generate indices for bottom cap
    for (let i = 0; i < segments; i++) {
      const current = i * 2;
      const next = ((i + 1) % segments) * 2;
      this.indices.push(bottomCenter, next, current);
    }

    // Generate indices for top cap
    for (let i = 0; i < segments; i++) {
      const current = i * 2 + 1;
      const next = ((i + 1) % segments) * 2 + 1;
      this.indices.push(topCenter, current, next);
    }
  }

  buildBrush() {
    const startIndex = this.vertices.length / 3;
    const width = this.brushWidth;
    const height = this.brushHeight;
    const depth = this.brushDepth;

    // Position brush at bottom of handle
    const brushY = -height / 2;

    // Brush vertices (rectangular prism)
    const brushVertices = [
      // Front face
      -width/2, brushY, depth/2,
      width/2, brushY, depth/2,
      width/2, brushY + height, depth/2,
      -width/2, brushY + height, depth/2,

      // Back face
      -width/2, brushY, -depth/2,
      -width/2, brushY + height, -depth/2,
      width/2, brushY + height, -depth/2,
      width/2, brushY, -depth/2,

      // Left face
      -width/2, brushY, -depth/2,
      -width/2, brushY, depth/2,
      -width/2, brushY + height, depth/2,
      -width/2, brushY + height, -depth/2,

      // Right face
      width/2, brushY, -depth/2,
      width/2, brushY + height, -depth/2,
      width/2, brushY + height, depth/2,
      width/2, brushY, depth/2,

      // Top face
      -width/2, brushY + height, -depth/2,
      -width/2, brushY + height, depth/2,
      width/2, brushY + height, depth/2,
      width/2, brushY + height, -depth/2,

      // Bottom face
      -width/2, brushY, -depth/2,
      width/2, brushY, -depth/2,
      width/2, brushY, depth/2,
      -width/2, brushY, depth/2
    ];

    // Add brush vertices
    this.vertices.push(...brushVertices);

    // Brush normals
    const brushNormals = [
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

    this.normals.push(...brushNormals);

    // Brush indices
    const brushIndices = [
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

    // Add brush indices with offset
    brushIndices.forEach(index => {
      this.indices.push(index + startIndex);
    });
  }
}