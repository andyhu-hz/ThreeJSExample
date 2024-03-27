import * as THREE from 'three';
import { GLTFLoader } from 'GLTFLoader';

// 创建场景
var scene = new THREE.Scene();

// 创建相机
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// 创建渲染器
var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0); // 设置背景色为透明
document.body.appendChild(renderer.domElement);

// 添加环境光
var light = new THREE.AmbientLight(0xffffff, 0.8); // Increased intensity to 2
scene.add(light);

var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(-50, 50, 50);
directionalLight.intensity = 1;
scene.add(directionalLight);

var directionalLight2 = new THREE.DirectionalLight(0xffffff, 1);
directionalLight2.position.set(50, 50, 50);
directionalLight2.intensity = 1;
scene.add(directionalLight2);

// Instantiate a loader
const loader = new GLTFLoader();
loader.morphTargets = true;

loader.load('girl.glb', function (gltf) {
    var model = gltf.scene;

    var morphTargetMesh;

    // 遍历模型中的每个 mesh
    gltf.scene.traverse(function (object) {
        if (object.isMesh) {
            var mesh = object;
            // 检查每个 mesh 是否具有 morphTargets 信息
            if (mesh.morphTargetInfluences !== undefined && mesh.morphTargetInfluences.length > 0) {
                console.log('Mesh具有 morphTargets 信息:', mesh);
                if(mesh.name === 'Wolf3D_Head') {
                    morphTargetMesh = mesh;
                }
            } else {
                console.log('Mesh不具有 morphTargets 信息:', mesh);
            }
        }
    });

    model.scale.set(3, 3, 3);
    model.position.set(0, -3, 0);

    //var blendshapes = model.morphTargetDictionary['Wolf3D_Head'];

    function animate(blendshapeValues) {
        requestAnimationFrame(animate);
        if (!morphTargetMesh) {
            return;
        }

        var testBlendshapes = generateRandomBlendShapes();
        for (var i = 0; i < 52; i++) {
            morphTargetMesh.morphTargetInfluences[i] = testBlendshapes[i] || 0;
        }
        //console.log('morphTargetMesh.morphTargetInfluences:', testBlendshapes);
        renderer.render(scene, camera);
    }

    animate([1, 1, 1, 1]);

    function receiveBlendshapes(blendshapeValues) {
        console.log('receiveBlendshapes, blendshapeValues:', blendshapeValues);
        animate(blendshapeValues);
    }

    window.receiveBlendshapes = receiveBlendshapes;

    scene.add(model);
}, undefined, function (error) {
    console.error('Error loading model:', error);
});

function generateRandomBlendShapes() {
    const blendshapeValues = Array.from({ length: 52 }, () => 0);
    const indices = [];
    while (indices.length <52) {
        const index = Math.floor(Math.random() * 52);
        if (!indices.includes(index)) {
            indices.push(index);
            blendshapeValues[index] = Math.random();
        }
    }
    return blendshapeValues;
}