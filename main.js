import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import gsap from "gsap";
import vertex from './shader/vertex.glsl';
import fragment from './shader/fragment.glsl';




export default class Sketch {
    constructor(options) {
        this.scene = new THREE.Scene();
      
        this.container = options.dom;
        this.width = this.container.offsetWidth;
        this.height = this.container.offsetHeight;
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setSize(this.width, this.height);
        this.renderer.setClearColor(0xffffff, 1);
        this.renderer.physicallyCorrectLights = true;
        this.renderer.outputEncoding = THREE.sRGBEncoding;

        this.container.appendChild(this.renderer.domElement);

        this.camera = new THREE.PerspectiveCamera(70, this.width / this.height, 0.001, 1000);



        this.camera.position.set(0, 0, 2);
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.time = 0;




        this.isPlaying = true;

        this.addObjects();
        this.resize();
        this.render();
        this.setupResize();
    }

    settings() {
        let that = this;
        this.settings = {
            progress: 0,
        };
        this.gui = new GUI();
        this.gui.add(this.settings, "progress", 0, 1, 0.01);

        
    }

    setupResize() {
        window.addEventListener("resize", this.resize.bind(this));
    }

    resize() {
        this.width = this.container.offsetWidth;
        this.height = this.container.offsetHeight;
        this.renderer.setSize(this.width, this.height);
        this.camera.aspect = this.width / this.height;

        this.camera.updateProjectionMatrix();

        this.imageAspect = 1;
        let a1; let a2;
        if(this.height/this.width>this.imageAspect) {
          a1 = (this.width/this.height) * this.imageAspect;
          a2 = 1;
        } else {
          a1 = 1;
          a2 = (this.height/this.width) / this.imageAspect;
        }

        this.material.uniforms.resolution.value.x = this.width;
        this.material.uniforms.resolution.value.y = this.height;
        this.material.uniforms.resolution.value.z = a1;
        this.material.uniforms.resolution.value.w = a2;

        const dist = this.camera.position.z;
        const height = 1;
        this.camera.fov = 2*(180/Math.PI)*Math.atan(height/(2*dist));

        if(this.width/this.height>1){
          this.plane.scale.x = this.camera.aspect;
        } else {
          this.plane.scale.y = 1/this.camera.aspect;
        }

        this.camera.updateProjectionMatrix();
    }

    addObjects() {
      let that = this;
      this.material = new THREE.ShaderMaterial({
        extensions: {
          derivatives: "#extensions GL_DES_standard_derivatives : enable"
        },
        side: THREE.DoubleSide,
        uniforms: {
          time: {type:"f",value: 0},
          resolution: {type:"v4",value: new THREE.Vector4()},
        },

        vertexShader: vertex,
        fragmentShader: fragment
      });

      this.geometry = new THREE.PlaneGeometry(1,1,1,1);

      this.plane = new THREE.Mesh(this.geometry, this.material);
      this.scene.add(this.plane);

    }

    addLights() {

        const light1 = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(light1);

        const light2 = new THREE.DirectionalLight(0xffffff, 0.5);
        light2.position.set(0.5, 0, 0.866);
        this.scene.add(light2);
    }

    stop() {
        this.isPlaying = false;
    }

    play() {
        if (!this.isPlaying){
            this.isPlaying = true;
            this.renderer()
        }
    }

    render() {
        if (!this.isPlaying) return;
        this.time += 0.05;
        this.renderer.render(this.scene, this.camera);
        window.requestAnimationFrame(this.render.bind(this));
    }
}

new Sketch({
    dom: document.getElementById("container")
});


