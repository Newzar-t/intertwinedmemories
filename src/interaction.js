import OSC from "osc-js";
import * as THREE from "three";
import { GLTFLoader, OrbitControls } from "three/examples/jsm/Addons.js";
import { PointLight, Vector3 } from "three/webgpu";
import { time } from "three/tsl";
import { gsap } from "gsap";
import all from "./rope";

window.addEventListener("DOMContentLoaded", () => {
  main();
});

function main() {
  const canvas = document.querySelector("#c");
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas,
  });
  renderer.setClearColor(0x00ff00);
  renderer.shadowMap.enabled = true;
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);
  let fogValue = { value: 0.002 };
  scene.fog = new THREE.FogExp2(0xffe6e6, fogValue.value);

  const fov = 75;
  const aspect = window.innerWidth / window.innerHeight;
  const near = 0.1;
  const far = 300;

  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 40, 115);
  const cameraPole = new THREE.Object3D();
  cameraPole.add(camera);
  scene.add(cameraPole);

  const controls = new OrbitControls(camera, renderer.domElement);

  {
    const light = new THREE.AmbientLight(0x404040, 50);
    scene.add(light);

    const pointLight = new THREE.PointLight(0xff0000, 1, 100);
    pointLight.position.set(50, 50, 50);
    pointLight.castShadow = true;
    scene.add(pointLight);

    const dirLight = new THREE.DirectionalLight({ color: 0xfffceb }, 5);
    dirLight.castShadow = true;
    dirLight.lookAt(new Vector3(0, 0, 0));
    cameraPole.add(dirLight);
  }

  function resizeRenderer() {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  all.instanceRope(scene);
  all.touchRope(scene, camera, time, canvas);

  function animate(time) {
    time *= 0.001;

    cameraPole.rotation.y = time * 0.1;

    if (resizeRenderer(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    }
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);

  gsap.to(fogValue, {
    duration: 9,
    value: 0.008,
    onUpdate: function () {
      scene.fog = new THREE.FogExp2(0xffd1d1, fogValue.value);
    },
    yoyo: true,
    repeat: -1,
  });
}
