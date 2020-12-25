//Utilities for CPU-side render prep. Contains graphnodes and projection matrices

export class graphNode { //Use this to organize 3D models hierarchically if needed 
    constructor(parent=null, children=[null], id=null) {
        this.id = id;
        this.parent = parent; //Access/inherit parent object
        this.children = children; //List of child objects for this node, each with independent data
        this.globalPos = {x:0,y:0,z:0}; //Global x,y,z position
        this.localPos = {x:0,y:0,z:0};  //Local x,y,z position offset. Render as global + local pos
        this.globalRot = {x:0,y:0,z:0}; //Global x,y,z rotation (rads)
        this.localRot = {x:0,y:0,z:0}; //Local x,y,z rotation (rads). Render as global + local rot
        this.functions = []; // List of functions. E.g. function foo(x) {return x;}; this.functions["foo"] = foo; this.functions.foo = foo(x) {return x;}. Got it?

        //3D Rendering stuff
        this.model = null; //
        this.mesh = [[0,0,0],[1,1,1],[1,0,0],[0,0,0]]; // Model vertex list, array of vec3's xyz, so push x,y,z components. For ThreeJS use THREE.Mesh(vertices, material) to generate a model from this list with the selected material
        this.colors = [[0,0,0],[255,255,255],[255,0,0],[0,0,0]]; // Vertex color list, array of vec3's rgb or vec4's rgba for outside of ThreeJS. For ThreeJS use THREE.Color("rgb(r,g,b)") for each array item. 
        this.materials = []; // Array of materials maps i.e. lighting properties and texture maps.
        this.textures = []; // Array of texture image files.

        if(parent !== null){
            this.inherit(parent);
        }
    }

    inherit(parent) { //Sets globals to be equal to parent info and adds parent functions to this node. 
        this.parent = parent;
        this.globalPos = parent.globalPos;
        this.globalRot = parent.globalRot;
        this.functions.concat(parent.functions);
        this.children.forEach((child)=>{
            child.globalPos = parent.global;
            child.functions.concat(parent.functions);
        });
    }

    addChild(child){ //Add child node reference
        this.children.push(child); //Remember: JS is all pass by object reference.
    }

    removeChild(id){ //Remove child node reference
        this.children.forEach((child, idx)=>{
            if(child.id == id){
                this.children.splice(idx,1);
            }
        });
    }

    translate(offset=[0,0,0]){ //Recursive global translation of this node and all children
        this.globalPos=[this.globalPos.x+offset[0],this.globalPos.y+offset[1],this.globalPos.z+offset[2]];
        this.children.forEach((child)=>{
            child.translate(offset);
        });
    }

    setGlobalRotation(offset=[0,0,0]){ //Offsets the global rotation of this node and all child nodes (radian)
        this.globalRot.x+=offset[0];
        this.globalRot.y+=offset[1];
        this.globalRot.z+=offset[2];
        this.children.forEach((child)=>{
            child.rotate(offset);
        });
    }

    getGlobalMesh() { //Get mesh with rotation and translation applied
        var globalmeshvertices = [];
        var rotated = math3D.rotate(this.mesh,this.globalRot.x+this.localRot.x,this.globalRot.y+this.localRot.y,this.globalRot.z+this.localRot.z);
        for(var i = 0; i < this.mesh.length; i++){
            globalmeshvertices.push([
                rotated[i][0]+this.globalPos.x+this.localPos.x,
                rotated[i][1]+this.globalPos.y+this.localPos.y,
                rotated[i][2]+this.globalPos.z+this.localPos.z
            ]);
        }

        return globalmeshvertices;
    }

    getCameraProjection(globalmeshvertices) {

    }
}


export class math2D { //some functions for 2d matrix work
    constructor(){

    }

    static transpose2D(mat2D){
		return mat2D[0].map((_, colIndex) => mat2.map(row => row[colIndex]));
    }
    
    static mul(a, b) { //Multiply two 2D matrices (array of arrays)
		var aNumRows = a.length, aNumCols = a[0].length,
			bNumRows = b.length, bNumCols = b[0].length,
			m = new Array(aNumRows);  // initialize array of rows
		for (var r = 0; r < aNumRows; ++r) {
		  m[r] = new Array(bNumCols); // initialize the current row
		  for (var c = 0; c < bNumCols; ++c) {
			m[r][c] = 0;             // initialize the current cell
			for (var i = 0; i < aNumCols; ++i) {
			  m[r][c] += a[r][i] * b[i][c];
			}
		  }
		}
		return m;
    }
      
}

export class math3D { //some stuff for doing math in 3D
    constructor() {

    }

    static dot(vec1,vec2) { //Generalized
        var dot=0;
        for(var i=0; i<vec.length; i++) {
            dot+= vec1[i]*vec2[i];
        }
    }

    static cross(vec1,vec2) { //3D cross product
        return [
            vec1[1]*vec2[2]-vec1[2]*vec2[1],
            vec1[2]*vec2[0]-vec1[0]*vec2[2],
            vec1[0]*vec2[1]-vec1[1]*vec2[0]]
    }

    static normalize(vec){
        var norm = 0;
        vec.forEach((c) => {
            norm += c*c;
        });
        norm = Math.sqrt(norm);
        return [vec[0]*norm,vec[1]*norm,vec[2]*norm];
    }

    //Rotates a list of 3D vectors about the origin
    static rotate(mesh, pitch, roll, yaw) {
        var cosa = Math.cos(yaw);
        var sina = Math.sin(yaw);
    
        var cosb = Math.cos(pitch);
        var sinb = Math.sin(pitch);
    
        var cosc = Math.cos(roll);
        var sinc = Math.sin(roll);
    
        var Axx = cosa*cosb;
        var Axy = cosa*sinb*sinc - sina*cosc;
        var Axz = cosa*sinb*cosc + sina*sinc;
    
        var Ayx = sina*cosb;
        var Ayy = sina*sinb*sinc + cosa*cosc;
        var Ayz = sina*sinb*cosc - cosa*sinc;
    
        var Azx = -sinb;
        var Azy = cosb*sinc;
        var Azz = cosb*cosc;

        var result = [...mesh];
    
        for (var i = 0; i < mesh.length; i++) {
            var px = mesh[i][0];
            var py = mesh[i][1];
            var pz = mesh[i][2];
    
            result[i][0] = Axx*px + Axy*py + Axz*pz;
            result[i][1] = Ayx*px + Ayy*py + Ayz*pz;
            result[i][2] = Azx*px + Azy*py + Azz*pz;
        }

        return result;
    }
}


export class camera { //pinhole camera model
    constructor (position={x:0,y:0,z:0},rotation={x:0,y:0,z:0},fov=90,aspect=1,near=0,far=1,fx=1,fy=1,cx=0,cy=0) {
        this.position = position;
        this.rotation = rotation;
        this.fov = fov;
        this.aspect = aspect;

        //View distance
        this.near = near; 
        this.far = far;

        //Focal length
        this.fx = fx;
        this.fy = fy;

        //Center image pixel location?
        this.cx = cx;
        this.cy = cy;


        /*
        To use:
        create class and set parameters,
        do this.getViewProjectionMatrix()
        now set the translate of each model uniform relative to the viewprojection result
        */
    }

    getPerspectiveMatrix(fieldOfViewInRadians=this.fov, aspectRatio=this.aspect, near=this.near, far=this.far) {
        var f = 1.0 / Math.tan(fieldOfViewInRadians / 2);
        var rangeInv = 1 / (near - far);
      
        return [
          [f / aspectRatio, 0,                          0,   0],
          [0,               f,                          0,   0],
          [0,               0,    (near + far) * rangeInv,  -1],
          [0,               0,  near * far * rangeInv * 2,   0]
        ];
    }

    
    getProjectionMatrix(width, height, depth) {
        return [
            [2/width,   0,        0, 0],
            [0, -2/height,        0, 0],
            [0,         0,  2/depth, 0],
            [-1,        1,        0, 1]
        ];
    }


    getCameraMatrix(fx=1, fy=1, cx=window.innerWidth*0.5, cy=window.innerHeight*0.5) {
        return [
            [fx, 0, cx, 0],
            [0, fy, cy, 0],
            [0,  0,  1, 0]
        ];
    }

    getViewProjectionMatrix() { //Translate geometry based on this result then set location. Demonstrated: https://webglfundamentals.org/webgl/lessons/webgl-3d-camera.html
        var cameraMat = this.getCameraMatrix(fx,fy,cx,cy);
        cameraMat = cameraMat.rotateM4(cameraMat,this.rotation.x,this.rotation.y,this.rotation.z);
        cameraMat = cameraMat.translateM4(cameraMat, this.position.x, this.position.y, this.position.z);
        var viewMat = this.invertM4(cameraMat);
        return math2D.mul(this.getPerspectiveMatrix(), viewMat); //View projection matrix result
    }

    //4D matrix inversion
    invertM4(mat4) {
        var m = mat4;
        var inv = [...mat4];
        inv[0][0] = m[1][1]  * m[2][2]* m[3][3] - 
                m[1][1]  * m[2][3]* m[3][2]- 
                m[2][1] * m[1][2] * m[3][3] + 
                m[2][1] * m[1][3]* m[3][2]+
                m[3][1]* m[1][2] * m[2][3]- 
                m[3][1]* m[1][3]* m[2][2];

        inv[1][0] = -m[1][0] * m[2][2]* m[3][3] + 
                m[1][0] * m[2][3]* m[3][2]+ 
                m[2][0] * m[1][2] * m[3][3] - 
                m[2][0] * m[1][3]* m[3][2]- 
                m[3][0]* m[1][2] * m[2][3]+ 
                m[3][0]* m[1][3]* m[2][2];

        inv[2][0] = m[1][0] * m[2][1]* m[3][3] - 
                m[1][0] * m[2][3]* m[3][1]- 
                m[2][0] * m[1][1] * m[3][3] + 
                m[2][0] * m[1][3]* m[3][1]+ 
                m[3][0]* m[1][1] * m[2][3]- 
                m[3][0]* m[1][3]* m[2][1];

        inv[3][0] = -m[1][0] * m[2][1]* m[3][2]+ 
                m[1][0] * m[2][2]* m[3][1]+
                m[2][0] * m[1][1] * m[3][2]- 
                m[2][0] * m[1][2]* m[3][1]- 
                m[3][0]* m[1][1] * m[2][2]+ 
                m[3][0]* m[1][2]* m[2][1];

        inv[0][1] = -m[0][1] * m[2][2]* m[3][3] + 
                m[0][1] * m[2][3]* m[3][2]+ 
                m[2][1] * m[0][2]* m[3][3] - 
                m[2][1] * m[0][3]* m[3][2]- 
                m[3][1]* m[0][2]* m[2][3]+ 
                m[3][1]* m[0][3]* m[2][2];

        inv[1][1] = m[0][0]  * m[2][2]* m[3][3] - 
                m[0][0]  * m[2][3]* m[3][2]- 
                m[2][0] * m[0][2]* m[3][3] + 
                m[2][0] * m[0][3]* m[3][2]+ 
                m[3][0]* m[0][2]* m[2][3]- 
                m[3][0]* m[0][3]* m[2][2];

        inv[2][1] = -m[0][0]  * m[2][1]* m[3][3] + 
                m[0][0]  * m[2][3]* m[3][1]+ 
                m[2][0] * m[0][1]* m[3][3] - 
                m[2][0] * m[0][3]* m[3][1]- 
                m[3][0]* m[0][1]* m[2][3]+ 
                m[3][0]* m[0][3]* m[2][1];

        inv[3][1] = m[0][0]  * m[2][1]* m[3][2]- 
                m[0][0]  * m[2][2]* m[3][1]- 
                m[2][0] * m[0][1]* m[3][2]+ 
                m[2][0] * m[0][2]* m[3][1]+ 
                m[3][0]* m[0][1]* m[2][2]- 
                m[3][0]* m[0][2]* m[2][1];

        inv[0][2] = m[0][1] * m[1][2]* m[3][3] - 
                m[0][1] * m[1][3]* m[3][2]- 
                m[1][1]  * m[0][2]* m[3][3] + 
                m[1][1]  * m[0][3]* m[3][2]+ 
                m[3][1]* m[0][2]* m[1][3]- 
                m[3][1]* m[0][3]* m[1][2];

        inv[1][2] = -m[0][0]  * m[1][2]* m[3][3] + 
                m[0][0]  * m[1][3]* m[3][2]+ 
                m[1][0] * m[0][2]* m[3][3] - 
                m[1][0] * m[0][3]* m[3][2]- 
                m[3][0]* m[0][2]* m[1][3]+ 
                m[3][0]* m[0][3]* m[1][2];

        inv[2][2] = m[0][0]  * m[1][1] * m[3][3] - 
                m[0][0]  * m[1][3]* m[3][1]- 
                m[1][0] * m[0][1]* m[3][3] + 
                m[1][0] * m[0][3]* m[3][1]+ 
                m[3][0]* m[0][1]* m[1][3]- 
                m[3][0]* m[0][3]* m[1][1];

        inv[3][2] = -m[0][0]  * m[1][1] * m[3][2]+ 
                m[0][0]  * m[1][2]* m[3][1]+ 
                m[1][0] * m[0][1]* m[3][2]- 
                m[1][0] * m[0][2]* m[3][1]- 
                m[3][0]* m[0][1]* m[1][2]+ 
                m[3][0]* m[0][2]* m[1][1];

        inv[0][3] = -m[0][1]* m[1][2]* m[2][3]+ 
                m[0][1]* m[1][3]* m[2][2]+ 
                m[1][1] * m[0][2]* m[2][3]- 
                m[1][1] * m[0][3]* m[2][2]- 
                m[2][1]* m[0][2]* m[1][3]+ 
                m[2][1]* m[0][3]* m[1][2];

        inv[1][3] = m[0][0] * m[1][2]* m[2][3]- 
                m[0][0] * m[1][3]* m[2][2]- 
                m[1][0]* m[0][2]* m[2][3]+ 
                m[1][0]* m[0][3]* m[2][2]+ 
                m[2][0]* m[0][2]* m[1][3]- 
                m[2][0]* m[0][3]* m[1][2];

        inv[2][3] = -m[0][0] * m[1][1] * m[2][3]+ 
                m[0][0] * m[1][3]* m[2][1]+ 
                m[1][0]* m[0][1]* m[2][3]- 
                m[1][0]* m[0][3]* m[2][1]- 
                m[2][0]* m[0][1]* m[1][3]+ 
                m[2][0]* m[0][3]* m[1][1];

        inv[3][3] = m[0][0] * m[1][1] * m[2][2]- 
                m[0][0] * m[1][2]* m[2][1]- 
                m[1][0]* m[0][1]* m[2][2]+ 
                m[1][0]* m[0][2]* m[2][1]+ 
                m[2][0]* m[0][1]* m[1][2]- 
                m[2][0]* m[0][2]* m[1][1];

        return inv;
    }

    scaleM4(mat4,scalex,scaley,scalez){
        var scale = [
            [scalex, 0, 0, 0],
            [0, scaley, 0, 0],
            [0, 0, scalez, 0],
            [0, 0,      0, 1]
        ];

        return math2D.multiply(mat4, scale);
    }

    translateM4(mat4, tx, ty, tz) {
        var translate = [
            [1,   0,  0, 0],
            [0,   1,  0, 0],
            [0,   0,  1, 0],
            [tx, ty, tz, 1]
        ];
        
        return math2D.mul(mat4, translate);
    }

    xRotationM4(angleInRadians) {
        var c = Math.cos(angleInRadians);
        var s = Math.sin(angleInRadians);
    
        return [
          [1, 0, 0, 0],
          [0, c, s, 0],
          [0, -s, c, 0],
          [0, 0, 0, 1],
        ];
    }
    
    yRotationM4(angleInRadians) {
        var c = Math.cos(angleInRadians);
        var s = Math.sin(angleInRadians);
    
        return [
          [c, 0, -s, 0],
          [0, 1, 0, 0],
          [s, 0, c, 0],
          [0, 0, 0, 1]
        ];
    }
    
    zRotationM4(angleInRadians) {
        var c = Math.cos(angleInRadians);
        var s = Math.sin(angleInRadians);
    
        return [
           [c, s, 0, 0],
          [-s, c, 0, 0],
           [0, 0, 1, 0],
           [0, 0, 0, 1]
        ];
    }

    //Rotate a 4D matrix
    rotateM4(mat4, anglex, angley, anglez) {
        var result = [...mat4];
        if(anglex !== 0){
            result = math2D.mul(result,this.xRotationM4(anglex));
        }
        if(angley !== 0){
            result = math2D.mul(result,this.yRotationM4(angley));
        }
        if(anglez !== 0){
            result = math2D.mul(result,this.zRotationM4(anglez));
        }

        return result;
    }


    

}