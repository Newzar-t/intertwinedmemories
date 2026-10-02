import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import gsap from "gsap";
import sendAction from "./message";

const params = [
  {
    name: "ropeNode",
    link: "public/ropeNodeMiddle.glb",
    msg: "/",
    sound: "/play_vent",
  },
  {
    name: "rope1",
    link: "public/rope1.glb",
    msg: "/play_vent",
    sound: "/play_vent",
  },
  {
    name: "rope2",
    link: "public/rope2.glb",
    msg: "/play_cloche",
    sound: "/play_vent",
  },
  {
    name: "rope3",
    link: "public/rope3.glb",
    msg: "/play_boule",
    sound: "/play_vent",
  },
  {
    name: "rope4",
    link: "public/rope4.glb",
    msg: "/play_bouee",
    sound: "/play_vent",
  },
  {
    name: "rope5",
    link: "public/rope5.glb",
    msg: "/play_ticket",
    sound: "/play_vent",
  },
  {
    name: "rope6",
    link: "public/rope6.glb",
    msg: "/play_peluche",
    sound: "/play_vent",
  },
  {
    name: "rope7",
    link: "public/rope7.glb",
    msg: "/play_voiture",
    sound: "/play_vent",
  },
  {
    name: "rope8",
    link: "public/rope8.glb",
    msg: "/play_telephone",
    sound: "/play_vent",
  },
  {
    name: "rope9",
    link: "public/rope9.glb",
    msg: "/play_bouquet",
    sound: "/play_vent",
  },
];

function instanceRope(scene) {
  params.forEach((rope) => {
    const gltfLoader = new GLTFLoader();
    gltfLoader.load(rope.link, (gltf) => {
      const root = gltf.scene;

      root.traverse((child) => {
        if (child.isMesh) {
          child.material = new THREE.MeshBasicMaterial({
            color: 0x520509,
          });
          child.castShadow = true;
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
    pickHelper.pick(pickPosition, scene, camera, time);

    const ropeSelected = params.find(
      (p) => p.name === pickHelper.pickedObject?.name,
    );
    const higlightColor = new THREE.Color(0xc43535);

    if (ropeSelected) {
      console.log(ropeSelected.name);
      sendAction(ropeSelected.msg, ropeSelected.sound);
      /*       pickHelper.pickedObject.material.emissive = new THREE.Color(
        higlightColor,
      ); */
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
