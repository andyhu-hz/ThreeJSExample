import * as THREE from 'three';
import { GLTFLoader } from 'GLTFLoader';
import { DRACOLoader } from 'DRACOLoader';

document.addEventListener('DOMContentLoaded', function() {
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

    // 创建一个时钟
    var clock = new THREE.Clock();

    // 在加载模型的回调函数中创建动画混合器
    var mixer;

    var morphTargets = [];

    // Instantiate a loader
    const loader = new GLTFLoader();

    // Optional: Provide a DRACOLoader instance to decode compressed mesh data
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath( './draco/' );
    loader.setDRACOLoader( dracoLoader );

    loader.morphTargets = true;


    loader.load('raccoon_head.glb', function (gltf) {
        var model = gltf.scene;
        // 在模型对象中检查是否具有 morphTargets 信息
        if (model.morphTargetInfluences !== undefined && model.morphTargetInfluences.length > 0) {
            console.log('模型具有 morphTargets 信息');
        } else {
            console.log('模型不具有 morphTargets 信息');
        }
        console.log(model);
        console.log('--------2--------------');
        console.log(model.morphTargetInfluences);

        if (model.morphTargetInfluences) {
            var wolf3dHeadIndex = model.morphTargetInfluences.findIndex(function(target, index) {
                return model.morphTargetDictionary[index] === 'Wolf3D_Head';
            });
            console.log("Wolf3D_Head 的索引为: " + wolf3dHeadIndex);
        }

        model.scale.set(3, 3, 3);
        model.position.set(0, -3, 0);

        var blendshapes = model.morphTargetDictionary['Wolf3D_Head'];

        function animate(blendshapeValues) {
            for (var i = 0; i < blendshapes.length; i++) {
                model.morphTargetInfluences[i] = blendshapeValues[i] || 0;
            }
            renderer.render(scene, camera);
        }

        animate([0, 0, 0, 0]);

        function receiveBlendshapes(blendshapeValues) {
            animate(blendshapeValues);
        }

        window.receiveBlendshapes = receiveBlendshapes;

        scene.add(model);
    }, undefined, function (error) {
        console.error('Error loading model:', error);
    });

    function setBlendShapes(index, value) {
        if (0 === morphTargets.length) {
            console.error('Error is not defined');
            return;
        }
        morphTargets[index] = value;
    }

    function generateRandomBlendShapes() {
        const blendshapeValues = Array.from({ length: 52 }, () => 0);
        const indices = [];
        while (indices.length <52) {
            const index = Math.floor(Math.random() * 52);
            if (!indices.includes(index)) {
                indices.push(index);
                blendshapeValues[index] =  Math.round(Math.random());
            }
        }
        return blendshapeValues;
    }

    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }
    animate();
});