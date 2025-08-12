import React, { useEffect, useRef } from 'react';
import './AeroLeague.css';
import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';

const Animation = () => {
    const mountRef = useRef(null);

    useEffect(() => {
        if (!mountRef.current) return;

        const mountPoint = mountRef.current;
        let isMounted = true;
        let env;

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
            constructor(font, particle, container) {
                this.font = font;
                this.particle = particle;
                this.container = container;
                this.scene = new THREE.Scene();
                this.renderer = null;
                this.camera = null;
                this.createParticles = null;
                this.boundOnWindowResize = this.onWindowResize.bind(this);

                this.createCamera();
                this.createRenderer();
                this.setup();
                window.addEventListener('resize', this.boundOnWindowResize);
            }

            setup() {
                this.createParticles = new CreateParticles(
                    this.scene,
                    this.font,
                    this.particle,
                    this.camera
                );
            }

            render() {
                if (this.createParticles) this.createParticles.render();
                if (this.renderer) this.renderer.render(this.scene, this.camera);
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
                if (!this.container || !this.renderer || !this.camera) return;
                this.camera.aspect =
                    this.container.clientWidth / this.container.clientHeight;
                this.camera.updateProjectionMatrix();
                this.renderer.setSize(
                    this.container.clientWidth,
                    this.container.clientHeight
                );
            }

            destroy() {
                if (this.renderer) this.renderer.setAnimationLoop(null);
                if (this.createParticles) this.createParticles.destroy();
                window.removeEventListener('resize', this.boundOnWindowResize);
                if (this.renderer && this.renderer.domElement.parentNode === this.container) {
                    this.container.removeChild(this.renderer.domElement);
                }
                if (this.renderer) this.renderer.dispose();
                this.scene.traverse(object => {
                    if (object.geometry) object.geometry.dispose();
                    if (object.material) {
                        if (Array.isArray(object.material)) {
                            object.material.forEach(material => material.dispose());
                        } else {
                            object.material.dispose();
                        }
                    }
                });
                this.scene.clear();
            }
        }

        class CreateParticles {
            constructor(scene, font, particleImg, camera) {
                this.scene = scene;
                this.font = font;
                this.particleImg = particleImg;
                this.camera = camera;
                this.particles = null;
                this.geometryCopy = null;
                this.colorChange = new THREE.Color(0x0047AB);
                this.animationDone = false;

                const isMobile = window.innerWidth < 768;
                this.data = {
                    text: isMobile ? ' THAPAR DRONE CHALLENGE\n     BUILD. FLY. DOMINATE.' : 'THAPAR DRONE CHALLENGE\n     BUILD. FLY. DOMINATE.',
                    amount: isMobile ? 800 : 1500,
                    particleSize: 1,
                    textSize: isMobile ? 4 : 7,
                    area: 250,
                    ease: 0.05,
                };

                this.setup();
            }

            destroy() {
                if (this.particles) {
                    this.scene.remove(this.particles);
                    this.particles.geometry.dispose();
                    this.particles.material.dispose();
                }
            }

            setup() {
                this.createText();
            }

            render() {
                if (!this.particles || !this.geometryCopy || this.animationDone) return;

                const pos = this.particles.geometry.attributes.position;
                const copy = this.geometryCopy.attributes.position;
                const coulors = this.particles.geometry.attributes.customColor;
                const size = this.particles.geometry.attributes.size;

                let allSettled = true;

                for (let i = 0, l = pos.count; i < l; i++) {
                    const initX = copy.getX(i);
                    const initY = copy.getY(i);
                    const initZ = copy.getZ(i);

                    let px = pos.getX(i);
                    let py = pos.getY(i);
                    let pz = pos.getZ(i);

                    coulors.setXYZ(i, this.colorChange.r, this.colorChange.g, this.colorChange.b);
                    size.array[i] = this.data.particleSize;

                    // ease to final
                    px += (initX - px) * this.data.ease;
                    py += (initY - py) * this.data.ease;
                    pz += (initZ - pz) * this.data.ease;

                    if (Math.abs(initX - px) > 0.01 || Math.abs(initY - py) > 0.01 || Math.abs(initZ - pz) > 0.01) {
                        allSettled = false;
                    }

                    pos.setXYZ(i, px, py, pz);
                }

                if (allSettled) {
                    this.animationDone = true;
                }

                pos.needsUpdate = true;
                coulors.needsUpdate = true;
                size.needsUpdate = true;
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
                            holeShapes.push(shape.holes[j]);
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
                    points.forEach((element) => {
                        thePoints.push(new THREE.Vector3(element.x, element.y, 0));
                        colors.push(this.colorChange.r, this.colorChange.g, this.colorChange.b);
                        sizes.push(1);
                    });
                }
                let geoParticles = new THREE.BufferGeometry().setFromPoints(thePoints);
                geoParticles.translate(xMid, yMid, 0);
                geoParticles.setAttribute('customColor', new THREE.Float32BufferAttribute(colors, 3));
                geoParticles.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));

                this.geometryCopy = new THREE.BufferGeometry();
                this.geometryCopy.copy(geoParticles);

                // start scattered
                const positions = geoParticles.attributes.position;
                for (let i = 0; i < positions.count; i++) {
                    positions.setXYZ(
                        i,
                        (Math.random() - 0.5) * this.data.area * 2,
                        (Math.random() - 0.5) * this.data.area,
                        (Math.random() - 0.5) * this.data.area
                    );
                }

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
            }
        }

        const fontLoader = new FontLoader();
        const textureLoader = new THREE.TextureLoader();
        const particle = textureLoader.load('https://res.cloudinary.com/dfvtkoboz/image/upload/v1605013866/particle_a64uzf.png');

        fontLoader.load(
            '/fonts/monster.json',
            (loadedFont) => {
                if (isMounted && mountPoint) {
                    env = new Environment(loadedFont, particle, mountPoint);
                }
            },
            undefined,
            (err) => console.log('An error happened during font loading', err)
        );

        return () => {
            isMounted = false;
            if (env) env.destroy();
        };
    }, []);

    return (
        <section className="animation-section" ref={mountRef}></section>
    );
};

export default Animation;
