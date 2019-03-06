let colors = {
  'green': 0x3BDAA5,
  'tan': 0xF4E3CF,
  'lightyellow': 0xFFEEAB,
  'brownish': 0xE16641,
  'skyblue': 0xA4D1E9,
  'red': 0xFC3F30,
  'pink': 0xFCC8C8,
  'purple': 0xD2B7FF,
  'yellow': 0xFFEC5F,
  'blue': 0x0091E2,
  'white': 0xffffff,
  'black': 0x000000,
  'gray': 0xCFD1D2
};


function Canvas(width, height, id){
    let that = this;


    var scene = new THREE.Scene();
    // LIGHTS!
    var ambient = new THREE.AmbientLight(colors.white, 1);
    scene.add(ambient);
    //
    // var sun = new THREE.PointLight(colors.white, 1, 3000);
    // // var sun = new THREE.SpotLight(colors.white, 0.4);
    // sun.position.set(-1000, 2000, 0);
    // sun.castShadow = true;
    // // sun.shadowDarkness = 1;
    // // sun.shadow.camera.near = 1;
    // // sun.shadow.bias = -0.00002;
    // // sun.shadowCameraVisible = true;
    // sun.shadow.camera.far = 4000;
    //
    // scene.add(sun);


  	var camera = new THREE.PerspectiveCamera(75, width/height, 1, 10000);
    camera.position.z = 100;
    camera.position.y = 100;
    camera.position.x = -100;

    this.camera = camera;
    this.cameraX = -100;
    this.cameraY = 100;
    this.cameraZ = 100;


    var renderer = new THREE.WebGLRenderer({ alpha: true });
  	renderer.setSize(width, height);
    renderer.antialias = true;
  	document.getElementById(id).appendChild(renderer.domElement);


    // create a grid
    var gridSize = 100;
    var gridDivisions = 10;

    var gridHelper = new THREE.GridHelper( gridSize, gridDivisions, 0xff0000, 0xff0000);
    gridHelper.position.y = 0;
		gridHelper.position.x = 0;
    // gridHelper.geometry.rotateX( Math.PI / 10 );
    gridHelper.name = 'grid';
    // scene.add( gridHelper );




    let roomSize = 200;
    let geometry = new THREE.BoxGeometry(roomSize, roomSize, roomSize, 1, 1, 1);
    var material = new THREE.MeshLambertMaterial({color: colors.white});
    var roomBox = new THREE.Mesh(geometry, material);

    var geo = new THREE.EdgesGeometry( roomBox.geometry );
    var mat = new THREE.LineBasicMaterial( { color: colors.black, linewidth: 10} );
    var wireframe = new THREE.LineSegments( geo, mat );
    wireframe.renderOrder = 1; // make sure wireframes are rendered 2nd
    roomBox.add( wireframe );

    roomBox.position.x = -roomSize/2;
    roomBox.position.y = roomSize/2;
    roomBox.position.z = roomSize/2;

    scene.add( roomBox );


    function RoomObject(x, y, z, size, name, type){
      let geometry;

      switch(type){
        case 'box':
          geometry = new THREE.BoxGeometry(size, size, size, 1, 1, 1);
          break;
        case 'sphere':
          geometry = new THREE.OctahedronGeometry(size, 2);
          break;
        case 'plane':
          geometry = new THREE.PlaneGeometry(size.width, size.height);
          break;
      }

    	var material = new THREE.MeshLambertMaterial({color: colors.black});
    	var cube = new THREE.Mesh(geometry, material);
      cube.position.x = x;
      cube.position.y = y;
      cube.position.z = z;

      if(type == 'plane'){
        cube.rotation.y = Math.PI * 1.5;
      }

      this.cubeX = x;
      this.cubeY = y;
      this.cubeZ = z;


      // upper and lower limit = (width / 2) - (objectWidth / 2)

      var geo = new THREE.EdgesGeometry( cube.geometry );
      var mat = new THREE.LineBasicMaterial( { color: colors.black, linewidth: 10} );
      var wireframe = new THREE.LineSegments( geo, mat );
      wireframe.renderOrder = 1; // make sure wireframes are rendered 2nd
      // cube.add( wireframe );


      cube.name = name;
      cube.castShadow = true;
      cube.receiveShadow = true;

      this.updatePosition = function(x, y, z){
        cube.position.x = x;
        cube.position.y = y;
        cube.position.z = z;
      }

      this.mesh = cube;
    }


    this.object = createObject(-75, 20, 20, 20, 'object-1', 'sphere');
    this.object2 = createObject(20, 50, 40, {width: 35, height: 50}, 'object-2', 'plane');

    function createObject(x, y, z, size, name, type){
      var object = new RoomObject(x, y, z, size, name, type);
      scene.add(object.mesh);

      return object;
    }

    render();


  	function render() {

      camera.position.x = that.cameraX;
      camera.position.y = that.cameraY;
      camera.position.z = that.cameraZ;
      camera.lookAt(0, 0, 0);

  		renderer.render(scene, camera);
      requestAnimationFrame(render);
  	};

}

$(function(){
  let canvas = new Canvas(100, 100, 'logo');

  // create dat GUI
  const gui = new dat.GUI();
  gui.add(canvas, 'cameraX', -500, 500);
  gui.add(canvas, 'cameraY', -500, 500);
  gui.add(canvas, 'cameraZ', -500, 500);
  // gui.close();
});
