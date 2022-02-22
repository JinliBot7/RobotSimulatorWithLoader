import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import * as dat from 'lil-gui'

const manager = new THREE.LoadingManager();

const gui = new dat.GUI()
// Canvas
const canvas = document.querySelector('canvas.webgl')
// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color( 0xaba7a7)
//Axis Helper
const axesHelper = new THREE.AxesHelper(2)
scene.add(axesHelper)

let target_object

// Object
// const geometry = new THREE.BoxGeometry(1, 1, 1)
// const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
// const mesh = new THREE.Mesh(geometry, material)
// scene.add(mesh)

const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')




////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Functions
function add_scene(this_object) {
    scene.add(this_object)
}


function set_scale(this_object) {
    this_object.scale.set(0.01,0.01,0.01)
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// A promise to get Base object
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)
let base_promise = new Promise(function(myResolve, myReject) {
gltfLoader.load(
    '/ur10/base.glb',
    (base_gltf) =>
    {    
        console.log('success')
        myResolve(base_gltf.scene)    
    },
    (progress) => {},
    (error) =>
    {
        console.log('error')
        console.log(error)
    })})






//　Light
const ambientLight = new THREE.AmbientLight('#ffffff', 0.5)
ambientLight.position.set(0, 10, 0)
scene.add(ambientLight)
const directionalLight = new THREE.DirectionalLight('#ffffff', 1)
directionalLight.position.set(0, 10, 0)
scene.add(directionalLight)
const light_folder = gui.addFolder( 'light' );
light_folder.add(ambientLight, 'intensity').min(0).max(10).step(0.001).name('amibient_lightIntensity')
light_folder.add(directionalLight, 'intensity').min(0).max(10).step(0.001).name('lightIntensity')
light_folder.add(directionalLight.position, 'x').min(- 5).max(5).step(0.001).name('lightX')
light_folder.add(directionalLight.position, 'y').min(- 5).max(5).step(0.001).name('lightY')
light_folder.add(directionalLight.position, 'z').min(- 5).max(5).step(0.001).name('lightZ')


// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// Window resize
window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})


// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 1
//camera.lookAt(test_object.position)
//console.log(test_object.position)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

//Render
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


// Animation
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()


// Base
// base_promise.then(
//     function(glb_object) {add_scene(glb_object);},
//     );

// base_promise.then(
//     function(glb_object) {set_scale(glb_object);},
//     );