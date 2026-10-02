import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import gsap from "gsap";
import sendAction from "./message";

const params = [
  {
    name: "ropeNode",
    link: "public/ropeNodeMiddle.glb",
    msg: "/",
    sound: "/",
  },
  {
    name: "rope1",
    link: "public/rope1.glb",
    msg: "/play_billet",
    sound: "/play_billet",
  },
  {
    name: "rope2",
    link: "public/rope2.glb",
    msg: "/play_boule",
    sound: "/play_boule",
  },
  {
    name: "rope3",
    link: "public/rope3.glb",
    msg: "/play_cloche",
    sound: "/play_cloche",
  },
  {
    name: "rope4",
    link: "public/rope4.glb",
    msg: "/play_telephone",
    sound: "/play_telephone",
  },
  {
    name: "rope5",
    link: "public/rope5.glb",
    msg: "/play_peluche",
    sound: "/play_peluche",
  },
  {
    name: "rope6",
    link: "public/rope6.glb",
    msg: "/play_fleur",
    sound: "/play_fleur",
  },
  {
    name: "rope7",
    link: "public/rope7.glb",
    msg: "/play_bouee",
    sound: "/play_bouee",
  },
  {
    name: "rope8",
    link: "public/rope8.glb",
    msg: "/play_voiture",
    sound: "/play_voiture",
  },
  {
    name: "rope9",
    link: "public/rope9.glb",
    msg: "/play_bouteille",
    sound: "/play_bouteille",
  },
];

const baseColor = new THREE.Color(0x7a2117);
const trigColor = new THREE.Color(0xfc8274);

function instanceRope(scene) {
  params.forEach((rope) => {
    const gltfLoader = new GLTFLoader();
    gltfLoader.load(rope.link, (gltf) => {
      const root = gltf.scene;

      root.traverse((child) => {
        if (child.isMesh) {
          child.material = new THREE.MeshToonMaterial({
            color: baseColor,
          });
          child.castShadow = true;
        }
      });
      scene.add(root);
    });
  });
}

let isRopedTouched = false;

const fadeColor = (obj) => {
  gsap.to(obj.material.color, {
    r: trigColor.r,
    g: trigColor.g,
    b: trigColor.b,
    duration: 4,
  });
};

function touchRope(scene, camera, time, canvas) {
  const pickHelper = new PickHelper();
  const onTouch = (event) => {
    setPickPosition(event, canvas);
    pickHelper.pick(pickPosition, scene, camera, time);

    const ropeSelected = params.find(
      (p) => p.name === pickHelper.pickedObject?.name,
    );

    if (ropeSelected) {
      fadeColor(pickHelper.pickedObject);
      isRopedTouched = true;
      sendAction(ropeSelected.msg, ropeSelected.sound);
      setTimeout(() => {
        isRopedTouched = false;
      }, 10000);
    }
  };

  window.addEventListener("pointerdown", (event) => {
    !isRopedTouched && onTouch(event);
    if (isRopedTouched === true) {
      return;
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
