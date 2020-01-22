import * as THREE from "./lib/three.module.js";
import { OrbitControls } from "./lib/OrbitControls.js";
import { FBXLoader } from "./lib/FBXLoader.js";
import model from "./model/Samba Dancing.fbx";
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
    1,
    2000
  );
  camera.position.set(0, 0, 0);

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xa0a0a0);
  // scene.fog = new THREE.Fog(0xa0a0a0, 200, 1000);

  const ambientLight = new THREE.AmbientLight(0xffffff, 1.1);
  ambientLight.position.set(0, 50, -1);
  // ambientLight.castShadow = true;
  scene.add(ambientLight);

  const pointLight = new THREE.PointLight(0xffffff, 0.02);
  pointLight.position.set(0, 50, 1);
  // pointLight.castShadow = true;
  // pointLight.receiveShadow = true;
  camera.add(pointLight);

  const light = new THREE.DirectionalLight(0xff0000, 0.2, 200);
  light.position.set(50, 200, 100);
  light.position.multiplyScalar(2);
  // light.castShadow = true;
  // light.shadow.mapSize.width = 1024;
  // light.shadow.mapSize.height = 1024;
  // const d = 500;
  // light.shadow.camera.left = -d;
  // light.shadow.camera.right = d;
  // light.shadow.camera.top = d;
  // light.shadow.camera.bottom = -d;
  // light.shadow.camera.far = 1000;
  scene.add(light);
  // light = new THREE.HemisphereLight(0xffffff, 0x444444);
  // light.position.set(0, 200, 0);
  // scene.add(light);

  // light = new THREE.DirectionalLight(0xffffff);
  // light.position.set(0, 200, 100);
  // light.castShadow = true;
  // light.shadow.camera.top = 180;
  // light.shadow.camera.bottom = -100;
  // light.shadow.camera.left = -120;
  // light.shadow.camera.right = 120;
  // scene.add(light);

  // scene.add( new CameraHelper( light.shadow.camera ) );

  // ground
  var mesh = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(2000, 2000),
    new THREE.MeshPhongMaterial({ color: 0x999999, depthWrite: false })
  );
  mesh.rotation.x = -Math.PI / 2;
  mesh.receiveShadow = true;
  scene.add(mesh);

  var grid = new THREE.GridHelper(2000, 20, 0x000000, 0x000000);
  grid.material.opacity = 0.2;
  grid.material.transparent = true;
  scene.add(grid);
  const onProgress = function(xhr) {
    if (xhr.lengthComputable) {
      const percentComplete = (xhr.loaded / xhr.total) * 100;
      console.log(Math.round(percentComplete, 2) + "% downloaded");
    }
  };
  const onError = function(err) {
    console.log(err);
  };

  // model
  var loader = new FBXLoader();
  loader.load(
    model,
    function(object) {
      // mixer = new THREE.AnimationMixer(object);

      // var action = mixer.clipAction(object.animations[0]);
      // action.play();

      // object.traverse(function(child) {
      //   if (child.isMesh) {
      //     // child.castShadow = true;
      //     // child.receiveShadow = true;
      //   }
      // }
      // );

      scene.add(object);
    },
    onProgress,
    onError
  );

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  // renderer.shadowMap.enabled = true;
  container.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 100, 0);
  controls.update();

  window.addEventListener("resize", onWindowResize, false);

  // stats
  // stats = new Stats();
  // container.appendChild(stats.dom);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

//

function animate() {
  requestAnimationFrame(animate);

  // var delta = clock.getDelta();

  // if (mixer) mixer.update(delta);

  renderer.render(scene, camera);

  // stats.update();
}
