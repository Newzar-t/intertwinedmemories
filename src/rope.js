import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import gsap from "gsap";
import sendAction from "./message";

const params = [
  {
    name: "bowRope1",
    link: "public/ropes/rope1.glb",
  },
  {
    name: "corde5",
    link: "public/ropes/rope2.glb",
  },
  {
    name: "corde6",
    link: "public/ropes/rope3.glb",
  },
  {
    name: "ropeNode",
    link: "public/ropes/ropeNode.glb",
  },
];

function instanceRope(scene) {
  params.forEach((rope) => {
    const gltfLoader = new GLTFLoader();
    gltfLoader.load(rope.link, (gltf) => {
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
  });
}

function touchRope(scene, camera, time, canvas) {
  const pickHelper = new PickHelper();
  window.addEventListener("pointerdown", (event) => {
    setPickPosition(event, canvas);
    sendAction();
    pickHelper.pick(pickPosition, scene, camera, time);
    const ropeSelected = params.find(
      (p) => p.name === pickHelper.pickedObject?.name,
    );
    const higlightColor = new THREE.Color(0xc43535);

    if (ropeSelected) {
      console.log(ropeSelected.name);
      pickHelper.pickedObject.material.emissive = new THREE.Color(
        higlightColor,
      );
    }
  });
}

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

export default { instanceRope, touchRope };
