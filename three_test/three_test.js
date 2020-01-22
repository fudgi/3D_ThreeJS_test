let canvasContainer, controls;
let camera, scene, renderer;
const container = document.querySelector(".container");
init();
animate();

function init() {
  canvasContainer = document.createElement("div");
  container.appendChild(canvasContainer);
  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.zoom = 4;
  camera.position.x = 0;
  camera.position.y = 0;
  camera.position.z = -60;

  // scene
  scene = new THREE.Scene();
  const color = new THREE.Color(0xffffff);
  scene.background = color;

  const ambientLight = new THREE.AmbientLight(0xffffff, 1.1);
  ambientLight.position.set(0, 50, -1);
  ambientLight.castShadow = true;
  scene.add(ambientLight);

  const pointLight = new THREE.PointLight(0xffffff, 0.02);
  pointLight.position.set(0, 50, 1);
  pointLight.castShadow = true;
  pointLight.receiveShadow = true;
  camera.add(pointLight);

  const light = new THREE.DirectionalLight(0xff0000, 0.1);
  light.position.set(50, 200, 100);
  light.position.multiplyScalar(0.5);
  scene.add(light);

  scene.add(camera);
  // manager
  const onProgress = function(xhr) {
    if (xhr.lengthComputable) {
      const percentComplete = (xhr.loaded / xhr.total) * 100;
      console.log(Math.round(percentComplete, 2) + "% downloaded");
    }
  };
  const onError = function() {};

  const manager = new THREE.LoadingManager();
  new MTLLoader(manager).load("./img/model/pack.mtl", function(materials) {
    materials.preload();
    new OBJLoader(manager).setMaterials(materials).load(
      "./img/model/pack.obj",
      function(object) {
        object.position.y = -85;
        object.position.z = -403;
        object.position.x = 153;
        object.castShadow = true;
        object.receiveShadow = true;
        // object.rotation.x = 180;
        scene.add(object);
      },
      onProgress,
      onError
    );
  });

  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(container.offsetWidth, container.offsetHeight);
  renderer.domElement.classList.add("canvas");
  canvasContainer.appendChild(renderer.domElement);
  // controls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
  controls.dampingFactor = 0.05;
  controls.enableZoom = false;
  controls.enablePan = false;
  controls.screenSpacePanning = false;
  controls.minDistance = 100;
  controls.maxDistance = 500;
  // controls.minPolarAngle = 0; // radians
  // controls.maxPolarAngle = Math.PI; // radians
}

function animate() {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
  camera.updateProjectionMatrix();
}
