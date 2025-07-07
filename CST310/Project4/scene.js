// Vertex Shader


// Fragment Shader


// Setup WebGL
function initWebGL() {
  const canvas = document.getElementById('canvas');
  const gl = canvas.getContext('webgl');
  if (!gl) {
    alert('WebGL not supported');
    return;
  }

  // Compile shaders and create program
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
  const program = createProgram(gl, vertexShader, fragmentShader);
  gl.useProgram(program);

  // Set up attributes and uniforms
  const positionLocation = gl.getAttribLocation(program, 'gl_position');
  const colorLocation = gl.getUniformLocation(program, 'fcolor');
  const modelViewMatrixLocation = gl.getUniformLocation(program, 'modelViewMatrix');
  const projectionMatrixLocation = gl.getUniformLocation(program, 'projectionMatrix');

  // Camera setup
  const fieldOfView = 45 * Math.PI / 180;
  const aspect = canvas.width / canvas.height;
  const zNear = 0.1;
  const zFar = 100.0;
  const projectionMatrix = mat4.create();
  mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

  const cameraPosition = [5, 3, 10];
  const cameraTarget = [5, 1, 0];
  const upVector = [0, 1, 0];
  const viewMatrix = mat4.create();
  mat4.lookAt(viewMatrix, cameraPosition, cameraTarget, upVector);

  // Render objects
  const objects = [
    { primitive: 'plane', position: [5, 0, 3], scale: [10, 1, 6], color: [0.5, 0.3, 0.1], desc: 'Floor' },
    { primitive: 'cube', position: [1.5, 0.5, 1], scale: [3, 1, 1], color: [0.5, 0.3, 0.3], desc: 'SofaBase' },
    { primitive: 'cube', position: [1.5, 1, 1], scale: [3, 0.5, 0.5], color: [0.5, 0.3, 0.3], desc: 'SofaBottomCushion' },
    { primitive: 'cube', position: [1.5, 1.5, 1], scale: [3, 0.5, 0.5], color: [0.5, 0.3, 0.3], desc: 'SofaBackCushion' },
    { primitive: 'cube', position: [0.2, 0.5, 1], scale: [0.4, 1, 1], color: [0.5, 0.3, 0.3], desc: 'SofaArmRest (left)' },
    { primitive: 'cube', position: [2.8, 0.5, 1], scale: [0.4, 1, 1], color: [0.5, 0.3, 0.3], desc: 'SofaArmRest (right)' },
    { primitive: 'plane', position: [0, 1.5, 3], scale: [6, 1, 0.1], color: [1, 1, 1], desc: 'Wall (left)' },
    { primitive: 'plane', position: [10, 1.5, 3], scale: [6, 1, 0.1], color: [1, 1, 1], desc: 'Wall (right)' },
    { primitive: 'plane', position: [5, 1.5, 0], scale: [10, 1, 0.1], color: [1, 1, 1], desc: 'Wall (back)' },
    { primitive: 'cube', position: [9, 1, 0.05], scale: [2, 2, 0.1], color: [0.4, 0.2, 0.2], desc: 'Door' },
    { primitive: 'cylinder', position: [9, 1, 0.1], radius: 0.05, height: 0.1, color: [0.7, 0.7, 0.7], desc: 'Door_Handle (Flat_sphere)' },
    { primitive: 'cube', position: [9, 1, 0.15], scale: [0.03, 0.08, 0.01], color: [0.7, 0.7, 0.7], desc: 'Door_Handle (Rectangle)' },
    { primitive: 'plane', position: [5, 3, 3], scale: [10, 1, 6], color: [1, 1, 1], desc: 'Ceiling' },
    { primitive: 'cube', position: [9.5, 0.4, 1], scale: [0.8, 0.4, 0.8], color: [0, 0, 0], desc: 'Small table' },
    { primitive: 'cylinder', position: [9.7, 0.4, 1.5], radius: 0.3, height: 0.8, color: [0, 0, 0], desc: 'Trash can' },
    { primitive: 'cylinder', position: [8.5, 0.6, 1], radius: 0.02, height: 1.2, color: [0, 0, 1], desc: 'Broom (handle)' },
    { primitive: 'cube', position: [9.5, 0.2, 1], scale: [0.2, 0.6, 0.1], color: [0, 0, 1], desc: 'Broom (brush)' },
    { primitive: 'cube', position: [9.5, 0.6, 1], scale: [0.2, 0.6, 0.1], color: [0, 0, 1], desc: 'Box of Trash Bags (blue)' },
    { primitive: 'cube', position: [9.5, 0.8, 1], scale: [0.2, 0.6, 0.1], color: [1, 1, 0], desc: 'Box of Trash Bags (yellow)' },
    { primitive: 'cube', position: [0.2, 0.2, 1], scale: [0.2, 0.4, 0.1], color: [0.9, 0.9, 0.9], desc: 'Electric plug' },
    { primitive: 'sphere', position: [5, 3, 3], radius: 0.1, color: [1, 1, 1], desc: 'Light source' }
  ];

  objects.forEach(obj => {
    const modelMatrix = mat4.create();
    mat4.translate(modelMatrix, modelMatrix, obj.position);
    mat4.scale(modelMatrix, modelMatrix, obj.scale || [1, 1, 1]);
    if (obj.radius) mat4.scale(modelMatrix, modelMatrix, [obj.radius, obj.height || 1, obj.radius]);
    const modelViewMatrix = mat4.create();
    mat4.multiply(modelViewMatrix, viewMatrix, modelMatrix);

    gl.uniformMatrix4fv(modelViewMatrixLocation, false, modelViewMatrix);
    gl.uniformMatrix4fv(projectionMatrixLocation, false, projectionMatrix);
    gl.uniform4fv(colorLocation, obj.color.concat(1.0));

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    let vertices;
    switch (obj.primitive) {
      case 'plane': vertices = new Float32Array([-1, 0, -1, 1, 0, -1, -1, 0, 1, 1, 0, 1]); break;
      case 'cube': vertices = new Float32Array([-1,-1,-1, 1,-1,-1, -1,1,-1, 1,1,-1, -1,-1,1, 1,-1,1, -1,1,1, 1,1,1].flatMap(x => [x,x,x])); break;
      case 'sphere': vertices = createSphereVertices(8, 8); break;
      case 'cylinder': vertices = createCylinderVertices(8); break;
    }
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertices.length / 3);
  });
}

function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return shader;
}

function createProgram(gl, vertexShader, fragmentShader) {
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  return program;
}

function createSphereVertices(latBands, longBands) {
  const vertices = [];
  for (let latNumber = 0; latNumber <= latBands; latNumber++) {
    const theta = latNumber * Math.PI / latBands;
    const sinTheta = Math.sin(theta);
    const cosTheta = Math.cos(theta);
    for (let longNumber = 0; longNumber <= longBands; longNumber++) {
      const phi = longNumber * 2 * Math.PI / longBands;
      const sinPhi = Math.sin(phi);
      const cosPhi = Math.cos(phi);
      const x = cosPhi * sinTheta;
      const y = cosTheta;
      const z = sinPhi * sinTheta;
      vertices.push(x, y, z);
    }
  }
  return new Float32Array(vertices);
}

function createCylinderVertices(slices) {
  const vertices = [];
  for (let i = 0; i <= slices; i++) {
    const theta = i * 2 * Math.PI / slices;
    const x = Math.cos(theta);
    const z = Math.sin(theta);
    vertices.push(x, -0.5, z, x, 0.5, z);
  }
  return new Float32Array(vertices);
}

initWebGL();