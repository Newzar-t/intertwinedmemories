import * as THREE from "three";

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

function instanceRope(scene, url) {
  params.forEach(() => {
    const gltfLoader = new GLTFLoader();
    gltfLoader.load(url, (gltf) => {
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

export default instanceRope;
