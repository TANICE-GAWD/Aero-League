import React, { useEffect, useRef } from 'react';
import './AeroLeague.css';
import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';

const Animation = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    // This check is important. If the ref isn't attached, do nothing.
    if (!mountRef.current) return;

    // *** KEY CHANGE: Store the mount point in a variable ***
    const mountPoint = mountRef.current;

    const vertexShader = `
      attribute float size;
      attribute vec3 customColor;
      varying vec3 vColor;
      void main() {
        vColor = customColor;
        vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
        gl_PointSize = size * ( 300.0 / -mvPosition.z );
        gl_Position = projectionMatrix * mvPosition;
      }
    `;

    const fragmentShader = `
      uniform vec3 color;
      uniform sampler2D pointTexture;
      varying vec3 vColor;
      void main() {
        gl_FragColor = vec4( color * vColor, 1.0 );
        gl_FragColor = gl_FragColor * texture2D( pointTexture, gl_PointCoord );
      }
    `;

    class Environment {
      // ... constructor and other methods are unchanged
      constructor(font, particle, container) {
            this.font = font;
            this.particle = particle;
            this.container = container;
            this.scene = new THREE.Scene();
            this.createCamera();
            this.createRenderer();
            this.setup();
            this.bindEvents();
        }

        bindEvents() {
            window.addEventListener('resize', this.onWindowResize.bind(this));
        }

        setup() {
            this.createParticles = new CreateParticles(
                this.scene,
                this.font,
                this.particle,
                this.camera,
                this.renderer,
                this.container // *** KEY CHANGE: Pass the container to CreateParticles
            );
        }

        render() {
            this.createParticles.render();
            this.renderer.render(this.scene, this.camera);
        }

        createCamera() {
            this.camera = new THREE.PerspectiveCamera(
                65,
                this.container.clientWidth / this.container.clientHeight,
                1,
                10000
            );
            this.camera.position.set(0, 0, 100);
        }

        createRenderer() {
            this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
            this.renderer.setSize(
                this.container.clientWidth,
                this.container.clientHeight
            );
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            this.renderer.outputEncoding = THREE.sRGBEncoding;
            this.container.appendChild(this.renderer.domElement);
            this.renderer.setAnimationLoop(() => {
                this.render();
            });
        }

        onWindowResize() {
            this.camera.aspect =
                this.container.clientWidth / this.container.clientHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(
                this.container.clientWidth,
                this.container.clientHeight
            );
            if (this.createParticles) {
                this.createParticles.destroy();
                this.setup();
            }
        }
    }

    class CreateParticles {
      // *** KEY CHANGE: Accept 'container' in the constructor ***
      constructor(scene, font, particleImg, camera, renderer, container) {
        this.scene = scene;
        this.font = font;
        this.particleImg = particleImg;
        this.camera = camera;
        this.renderer = renderer;
        this.container = container; // Store the container

        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2(-200, 200);
        this.colorChange = new THREE.Color();
        this.buttom = false;
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.isScrolling = false;
        this.touchMoveThreshold = 10;

        const isMobile = window.innerWidth < 768;
        this.data = {
            text: isMobile ? '       AERO LEAGUE\nBUILD. FLY. DOMINATE.' : '         AERO LEAGUE\nBUILD. FLY. DOMINATE.',
            amount: isMobile ? 800 : 1500,
            particleSize: 1,
            particleColor: 0xffffff,
            textSize: isMobile ? 3 : 10,
            area: 250,
            ease: 0.05,
        };

        this.setup();
        this.bindEvents();
      }

      // ... destroy and setup methods are unchanged ...
      destroy() {
            if (this.particles) {
                this.scene.remove(this.particles);
                this.particles.geometry.dispose();
                this.particles.material.dispose();
            }
            this.geometryCopy = null;
            this.particles = null;
        }

        setup() {
            const geometry = new THREE.PlaneGeometry(
                this.visibleWidthAtZDepth(100, this.camera),
                this.visibleHeightAtZDepth(100, this.camera)
            );
            const material = new THREE.MeshBasicMaterial({
                color: 0x00ff00,
                transparent: true,
            });
            this.planeArea = new THREE.Mesh(geometry, material);
            this.planeArea.visible = false;
            this.createText();
        }

      bindEvents() {
        // *** KEY CHANGE: Add listeners to the container, not the document ***
        this.container.addEventListener('mousedown', this.onMouseDown.bind(this));
        this.container.addEventListener('mousemove', this.onMouseMove.bind(this));
        this.container.addEventListener('mouseup', this.onMouseUp.bind(this));
        this.container.addEventListener('mouseleave', this.onMouseUp.bind(this)); // Good practice

        this.container.addEventListener('touchstart', this.onTouchStart.bind(this));
        this.container.addEventListener('touchmove', this.onTouchMove.bind(this));
        this.container.addEventListener('touchend', this.onTouchEnd.bind(this));
      }

      // All other methods (onMouseDown, onTouchStart, render, etc.) are unchanged
      onMouseDown(event) {
            // We need to adjust coordinates relative to the container, not the window
            const rect = this.container.getBoundingClientRect();
            this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

            const vector = new THREE.Vector3(this.mouse.x, this.mouse.y, 0.5);
            vector.unproject(this.camera);
            const dir = vector.sub(this.camera.position).normalize();
            const distance = -this.camera.position.z / dir.z;
            this.currenPosition = this.camera.position
                .clone()
                .add(dir.multiplyScalar(distance));

            this.buttom = true;
            this.data.ease = 0.01;
        }

        onMouseUp() {
            this.buttom = false;
            this.data.ease = 0.05;
        }

        onMouseMove(event) {
            const rect = this.container.getBoundingClientRect();
            this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        }

        onTouchStart(event) {
            if (event.touches.length > 0) {
                const touch = event.touches[0];
                this.touchStartX = touch.clientX;
                this.touchStartY = touch.clientY;
                this.isScrolling = false; 
                this.onMouseDown(touch); 
            }
        }

        onTouchMove(event) {
            if (event.touches.length > 0) {
                const touch = event.touches[0];
                if (this.isScrolling) return;
                const deltaX = touch.clientX - this.touchStartX;
                const deltaY = touch.clientY - this.touchStartY;
                if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > this.touchMoveThreshold) {
                    this.isScrolling = true;
                    this.onMouseUp(); 
                    return;
                }
                this.onMouseMove(touch);
            }
        }

        onTouchEnd(event) {
            this.isScrolling = false;
            this.onMouseUp();
        }

        render() {
            if (!this.particles) return;
            const time = ((0.001 * performance.now()) % 12) / 12;
            const zigzagTime = (1 + Math.sin(time * 2 * Math.PI)) / 6;

            this.raycaster.setFromCamera(this.mouse, this.camera);

            const intersects = this.raycaster.intersectObject(this.planeArea);

            if (intersects.length > 0) {
                const pos = this.particles.geometry.attributes.position;
                const copy = this.geometryCopy.attributes.position;
                const coulors = this.particles.geometry.attributes.customColor;
                const size = this.particles.geometry.attributes.size;

                const mx = intersects[0].point.x;
                const my = intersects[0].point.y;
                const mz = intersects[0].point.z;

                for (var i = 0, l = pos.count; i < l; i++) {
                    const initX = copy.getX(i);
                    const initY = copy.getY(i);
                    const initZ = copy.getZ(i);

                    let px = pos.getX(i);
                    let py = pos.getY(i);
                    let pz = pos.getZ(i);

                    this.colorChange.setHSL(0.5, 1, 1);
                    coulors.setXYZ(i, this.colorChange.r, this.colorChange.g, this.colorChange.b);
                    coulors.needsUpdate = true;

                    size.array[i] = this.data.particleSize;
                    size.needsUpdate = true;

                    let dx = mx - px;
                    let dy = my - py;
                    const dz = mz - pz;

                    const mouseDistance = this.distance(mx, my, px, py);
                    let d = (dx = mx - px) * dx + (dy = my - py) * dy;
                    const f = -this.data.area / d;

                    if (this.buttom) {
                        const t = Math.atan2(dy, dx);
                        px -= f * Math.cos(t);
                        py -= f * Math.sin(t);

                        this.colorChange.setHSL(0.5 + zigzagTime, 1.0, 0.5);
                        coulors.setXYZ(i, this.colorChange.r, this.colorChange.g, this.colorChange.b);
                        coulors.needsUpdate = true;

                        if (px > initX + 70 || px < initX - 70 || py > initY + 70 || py < initY - 70) {
                            this.colorChange.setHSL(0.15, 1.0, 0.5);
                            coulors.setXYZ(i, this.colorChange.r, this.colorChange.g, this.colorChange.b);
                            coulors.needsUpdate = true;
                        }
                    } else {
                        if (mouseDistance < this.data.area) {
                            if (i % 5 === 0) {
                                const t = Math.atan2(dy, dx);
                                px -= 0.03 * Math.cos(t);
                                py -= 0.03 * Math.sin(t);
                                this.colorChange.setHSL(0.15, 1.0, 0.5);
                                coulors.setXYZ(i, this.colorChange.r, this.colorChange.g, this.colorChange.b);
                                coulors.needsUpdate = true;
                                size.array[i] = this.data.particleSize / 1.2;
                                size.needsUpdate = true;
                            } else {
                                const t = Math.atan2(dy, dx);
                                px += f * Math.cos(t);
                                py += f * Math.sin(t);
                                pos.setXYZ(i, px, py, pz);
                                pos.needsUpdate = true;
                                size.array[i] = this.data.particleSize * 1.3;
                                size.needsUpdate = true;
                            }
                            if (px > initX + 10 || px < initX - 10 || py > initY + 10 || py < initY - 10) {
                                this.colorChange.setHSL(0.15, 1.0, 0.5);
                                coulors.setXYZ(i, this.colorChange.r, this.colorChange.g, this.colorChange.b);
                                coulors.needsUpdate = true;
                                size.array[i] = this.data.particleSize / 1.8;
                                size.needsUpdate = true;
                            }
                        }
                    }
                    px += (initX - px) * this.data.ease;
                    py += (initY - py) * this.data.ease;
                    pz += (initZ - pz) * this.data.ease;
                    pos.setXYZ(i, px, py, pz);
                    pos.needsUpdate = true;
                }
            }
        }

        createText() {
            let thePoints = [];
            let shapes = this.font.generateShapes(this.data.text, this.data.textSize);
            let geometry = new THREE.ShapeGeometry(shapes);
            geometry.computeBoundingBox();
            const xMid = -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);
            const yMid = (geometry.boundingBox.max.y - geometry.boundingBox.min.y) / 2.85;
            geometry.center();
            let holeShapes = [];
            for (let q = 0; q < shapes.length; q++) {
                let shape = shapes[q];
                if (shape.holes && shape.holes.length > 0) {
                    for (let j = 0; j < shape.holes.length; j++) {
                        let hole = shape.holes[j];
                        holeShapes.push(hole);
                    }
                }
            }
            shapes.push.apply(shapes, holeShapes);
            let colors = [];
            let sizes = [];
            for (let x = 0; x < shapes.length; x++) {
                let shape = shapes[x];
                const amountPoints = shape.type === 'Path' ? this.data.amount / 2 : this.data.amount;
                let points = shape.getSpacedPoints(amountPoints);
                points.forEach((element, z) => {
                    const a = new THREE.Vector3(element.x, element.y, 0);
                    thePoints.push(a);
                    colors.push(this.colorChange.r, this.colorChange.g, this.colorChange.b);
                    sizes.push(1);
                });
            }
            let geoParticles = new THREE.BufferGeometry().setFromPoints(thePoints);
            geoParticles.translate(xMid, yMid, 0);
            geoParticles.setAttribute('customColor', new THREE.Float32BufferAttribute(colors, 3));
            geoParticles.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));
            const material = new THREE.ShaderMaterial({
                uniforms: {
                    color: { value: new THREE.Color(0xffffff) },
                    pointTexture: { value: this.particleImg },
                },
                vertexShader,
                fragmentShader,
                blending: THREE.AdditiveBlending,
                depthTest: false,
                transparent: true,
            });
            this.particles = new THREE.Points(geoParticles, material);
            this.scene.add(this.particles);
            this.geometryCopy = new THREE.BufferGeometry();
            this.geometryCopy.copy(this.particles.geometry);
        }

        visibleHeightAtZDepth(depth, camera) {
            const cameraOffset = camera.position.z;
            if (depth < cameraOffset) depth -= cameraOffset;
            else depth += cameraOffset;
            const vFOV = (camera.fov * Math.PI) / 180;
            return 2 * Math.tan(vFOV / 2) * Math.abs(depth);
        }

        visibleWidthAtZDepth(depth, camera) {
            const height = this.visibleHeightAtZDepth(depth, camera);
            return height * camera.aspect;
        }

        distance(x1, y1, x2, y2) {
            return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
        }

    }

    let env;
    const fontLoader = new FontLoader();
    const textureLoader = new THREE.TextureLoader();
    const particle = textureLoader.load('https://res.cloudinary.com/dfvtkoboz/image/upload/v1605013866/particle_a64uzf.png');
    
    fontLoader.load(
      'https://res.cloudinary.com/dydre7amr/raw/upload/v1612950355/font_zsd4dr.json',
      (loadedFont) => {
        // Use the stored mountPoint variable
        if (mountPoint) {
          env = new Environment(loadedFont, particle, mountPoint);
        }
      },
      (xhr) => console.log((xhr.loaded / xhr.total * 100) + '% loaded'),
      (err) => console.log('An error happened')
    );

    return () => {
      if (env && env.renderer) {
        env.renderer.setAnimationLoop(null);
      }
      // Use the stored mountPoint variable for cleanup
      if (mountPoint) {
        while (mountPoint.firstChild) {
          mountPoint.removeChild(mountPoint.firstChild);
        }
      }
    };
  }, []); // The empty dependency array is correct.

  return <div id="magic" ref={mountRef}></div>;
};

export default Animation;