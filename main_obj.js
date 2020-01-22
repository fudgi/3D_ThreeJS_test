import * as THREE from "./lib/three.module.js";
import { MTLLoader } from "./lib/MTLLoader.js";
import { OBJLoader } from "./lib/OBJLoader.js";
import { OrbitControls } from "./lib/OrbitControls.js";
import texture from "./model/pack_7/0_1.mtl";
import model from "./model/pack_7/0_1.obj";

let container, controls;
let camera, scene, renderer;

init();
animate();

function init() {
  container = document.createElement("div");
  document.body.appendChild(container);
  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.zoom = 2;
  camera.position.x = 0;
  camera.position.y = 0;
  camera.position.z = -600;

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

  const light = new THREE.DirectionalLight(0xff0000, 0.2, 200);
  light.position.set(50, 200, 100);
  light.position.multiplyScalar(2);
  light.castShadow = true;
  light.shadow.mapSize.width = 1024;
  light.shadow.mapSize.height = 1024;
  const d = 500;
  light.shadow.camera.left = -d;
  light.shadow.camera.right = d;
  light.shadow.camera.top = d;
  light.shadow.camera.bottom = -d;
  light.shadow.camera.far = 1000;
  scene.add(light);

  scene.add(camera);
  // manager
  const onProgress = function(xhr) {
    if (xhr.lengthComputable) {
      const percentComplete = (xhr.loaded / xhr.total) * 100;
      console.log(Math.round(percentComplete, 2) + "% downloaded");
    }
  };
  const onError = function(err) {
    console.log(err);
  };

  const manager = new THREE.LoadingManager();
  new MTLLoader(manager).load(texture, function(materials) {
    materials.preload();
    new OBJLoader(manager).setMaterials(materials).load(
      model,
      function(object) {
        object.position.y = 0;
        object.position.z = 0;
        object.position.x = 0;
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
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);
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
