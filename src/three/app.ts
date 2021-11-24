import * as $ from 'jquery';
import * as THREE from "three";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import Scroll from './scroll';

export default class ThreeApp {
    private container: HTMLDivElement;
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;
    private clip: THREE.AnimationClip;
    private mixer: THREE.AnimationMixer;
    private mouse: THREE.Vector2;
    private scroll: Scroll;


    constructor(container: HTMLDivElement) {
        this.container = container;
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xcbe0e0);
        this.camera = new THREE.PerspectiveCamera(25, container.clientWidth / container.clientHeight, 0.1, 1000);
        this.camera.position.set(0, 0, 0);
        this.mouse = new THREE.Vector2(0, 0);
        this.camera.rotation.x = THREE.MathUtils.degToRad(75 - 90);

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(this.renderer.domElement);

        window.addEventListener('resize', this.resize.bind(this), false);
        document.addEventListener('mousemove', this.onMouseMove.bind(this), false);

    }

    async start() {
        const envTexture = await new RGBELoader().setDataType(THREE.UnsignedByteType).loadAsync('assets/env/royal_esplanade_1k.hdr');
        var pmremGenerator = new THREE.PMREMGenerator(this.renderer);
        pmremGenerator.compileEquirectangularShader();
        this.scene.environment = pmremGenerator.fromEquirectangular(envTexture).texture;
        envTexture.dispose();
        pmremGenerator.dispose();

        this.scene.add(new THREE.AxesHelper(10));
        this.scene.add(new THREE.HemisphereLight(0xffffff, 0xeeeeee, 1))


        const gltfData = await new GLTFLoader().loadAsync('./assets/model/model.glb');
        const model = gltfData.scene;
        this.scene.add(model)

        this.clip = gltfData.animations[0];
        this.mixer = new THREE.AnimationMixer(gltfData.scene);
        this.mixer.clipAction(this.clip).play();

        this.scroll = new Scroll(this.renderer.domElement);

        // $('#loader').fadeOut();
        this.animate();
    }

    resize() {
        this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
    }

    private onMouseMove(event: MouseEvent) {
        event.preventDefault();
        this.mouse.x = (event.clientX / this.container.clientWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / this.container.clientHeight) * 2 + 1;
    }

    animate() {

        this.mixer.setTime(this.clip.duration * this.scroll.getPercentage());

        this.camera.rotation.z += 0.05 * ((1 - this.mouse.y) * 0.03 - this.camera.rotation.z);
        this.camera.rotation.y += 0.05 * ((1 - this.mouse.x) * 0.03 - this.camera.rotation.y);

        requestAnimationFrame(this.animate.bind(this));
        this.renderer.render(this.scene, this.camera);
    }
}