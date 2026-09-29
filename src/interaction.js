import OSC from "osc-js";
import * as THREE from "three";
import { GLTFLoader, OrbitControls } from "three/examples/jsm/Addons.js";
import { PointLight, Vector3 } from "three/webgpu";
import { time } from "three/tsl";
import { gsap } from "gsap";

const THREADS_PARAMS = [
  {
    model: "/cordeBasic.glb",
    trigger: console.log("corde 1 active !"),
    identity: "Corde1",
  },
  {
    model: "/cordeRoule.glb",
    trigger: console.log("autrecorde lol"),
    identity: "Corde2",
  },
  {
    model: "/CordeLongue.glb",
    trigger: console.log("chdhhd"),
    identity: "Corde3",
  },
];

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
  let fogValue = { value: 0.02 };
  scene.fog = new THREE.FogExp2(0xffffff, fogValue.value);

  const fov = 75;
  const aspect = window.innerWidth / window.innerHeight;
  const near = 0.1;
  const far = 120;

  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 40, 70);
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

  threadObject(scene, THREADS_PARAMS[0].model);
  threadObject(scene, THREADS_PARAMS[1].model);
  threadObject(scene, THREADS_PARAMS[2].model);

  const pickHelper = new PickHelper();

  {
    window.addEventListener("pointerdown", (event) => {
      setPickPosition(event, canvas);
      pickHelper.pick(pickPosition, scene, camera, time);
      const threadSelected = THREADS_PARAMS.find(
        (params) => params.identity === pickHelper.pickedObject?.name,
      );
      const higlightColor = new THREE.Color(0xc43535);

      if (threadSelected) {
        pickHelper.pickedObject.material.emissive = new THREE.Color(
          higlightColor,
        );
      }
    });

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

    gsap.to(
      fogValue,
      {
        duration: 9,
        value: 0.008,
        onUpdate: function () {
          scene.fog = new THREE.FogExp2(0xffffff, fogValue.value);
        },
        yoyo: true,
        repeat: -1,
      },
    );
  }
}

const threadObject = (scene, link) => {
  const gltfLoader = new GLTFLoader();
  gltfLoader.load(link, (gltf) => {
    const root = gltf.scene;

    root.traverse((child) => {
      if (child.isMesh) {
        child.material = new THREE.MeshPhongMaterial({
          color: 0x520509,
        });
        child.receiveShadow = true;
      }
    });
    scene.add(root);
  });
};

class PickHelper {
  constructor() {
    this.raycaster = new THREE.Raycaster();
    this.pickedObject = null;
  }

  pick(normalisedPosition, scene, camera, time) {
    if (this.pickedObject) {
      this.pickedObject = undefined;
    }

    this.raycaster.setFromCamera(normalisedPosition, camera);

    const intersectedObjects = this.raycaster.intersectObjects(scene.children);
    if (intersectedObjects.length) {
      this.pickedObject = intersectedObjects[0].object;
    }
  }
}

const pickPosition = { x: 0, y: 0 };
clearPickPosition();

function getCanvasRelativePosition(event, canvas) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: ((event.clientX - rect.left) * canvas.width) / rect.width,
    y: ((event.clientY - rect.top) * canvas.height) / rect.height,
  };
}

function setPickPosition(event, canvas) {
  const pos = getCanvasRelativePosition(event, canvas);
  pickPosition.x = (pos.x / canvas.width) * 2 - 1;
  pickPosition.y = (pos.y / canvas.height) * -2 + 1;
}

function clearPickPosition() {
  pickPosition.x = -10000;
  pickPosition.y = -10000;
}
