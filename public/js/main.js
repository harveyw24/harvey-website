import 'css/style.css'

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'

// Setup
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer( {
  canvas: document.querySelector( '#bg' ),
} )

renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
camera.position.x = 5;
camera.position.y = 3;
camera.position.z = 2;

renderer.render( scene, camera );


// Lighting
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(15, 5, -5);

const pointLight2 = new THREE.PointLight(0xffffff);
pointLight2.position.set(-15, 5, -5);

const pointLight3 = new THREE.PointLight(0xffffff);
pointLight3.position.set(0, 15, -5);

const spotlight = new THREE.SpotLight(0xffffff, 1, 500);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add( pointLight, pointLight2, pointLight3, ambientLight );


// Helpers
const lightHelper = new THREE.PointLightHelper(pointLight);
const lightHelper2 = new THREE.PointLightHelper(pointLight2);
const lightHelper3= new THREE.PointLightHelper(pointLight3);
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(lightHelper, lightHelper2, lightHelper3, gridHelper);

const controls = new OrbitControls(camera, renderer.domElement);
// controls.target = new THREE.Vector3( -5, 3, -5 );


// Background
const bgTexture = new THREE.TextureLoader().load('space.jpg')
scene.background = bgTexture;


// Torus geometry
const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const material = new THREE.MeshStandardMaterial({color: 0xFF6347});
const torus = new THREE.Mesh(geometry, material);

// scene.add(torus)


// Avatar cube
const harveyTexture = new THREE.TextureLoader().load('harvey_bg_cropped.png')

const harvey = new THREE.Mesh(
  new THREE.BoxGeometry(3, 3, 3),
  new THREE.MeshBasicMaterial({map: harveyTexture})
);

scene.add(harvey);


// Stars
function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({color: 0xffffff});
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star);
}

Array(200).fill().forEach(addStar);


// Earth
const earthTexture = new THREE.TextureLoader().load( 'earth_day_texture.jpg' );
const normalTexture = new THREE.TextureLoader().load( 'earth_normal.jpeg' );

const earth = new THREE.Mesh(
  new THREE.SphereGeometry( 3, 32, 32 ),
  new THREE.MeshStandardMaterial({

    map: earthTexture,
    normalMap: normalTexture

  })
);

scene.add(earth);

earth.position.z = 15;
earth.position.x = -10;

harvey.position.z = -2;
harvey.position.y = 2;
harvey.position.x = 2;


// Desk
const loader = new GLTFLoader();
loader.load( 'cyberpunk_desk/scene.gltf' , function( gltf ) {

  scene.add( gltf.scene );
  scene.position.x = 6.5;
  scene.position.y = -4;
  scene.position.z = 6.5;

}, undefined, function ( error ) {

  console.error( error );

} );


// Screen
// const planeTexture = new THREE.TextureLoader().load('harvey_bg_cropped.png')

const screen2 = new THREE.Mesh(
  new THREE.PlaneGeometry(2.33, 1.16),
  new THREE.MeshPhongMaterial({color: 0x1e1e1e})
);
screen2.position.set(-6.02, 4.1, -6.08);
screen2.rotateX(-0.07);
screen2.rotateZ(-0.02);
screen2.rotateY(-0.22);

scene.add(screen2);


const curve = new THREE.QuadraticBezierCurve3(
	new THREE.Vector3( -9.5, 3.52, -5.81 ),
  new THREE.Vector3( -7.2, 3.52, -6.72 ),
	new THREE.Vector3( -4.9, 3.52, -5.78 )
);

const points = curve.getPoints( 50 );

// Create the final object to add to the scene
const curveObject = new THREE.Line(
  new THREE.BufferGeometry().setFromPoints( points ),
  new THREE.LineBasicMaterial( { color : 0xff0000 } )
);

scene.add(curveObject);

// Scroll animation
function moveCamera() {

  const t = document.body.getBoundingClientRect().top;
  earth.rotation.x += 0.05;
  earth.rotation.y += 0.075;
  earth.rotation.z += 0.05;

  harvey.rotation.y += 0.01;
  harvey.rotation.z += 0.01;

  camera.position.x = 0 + t * 0.0002;
  camera.position.y = 0 + t * 0.0002;
  camera.position.z = 1 + t * -0.02;
}

// document.body.onscroll = moveCamera;


// Animation loop
function animate() {
  requestAnimationFrame(animate);

  torus.rotation.x += 0.012;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.007;

  controls.update();

  renderer.render(scene, camera);
}

animate();