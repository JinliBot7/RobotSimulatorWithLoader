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
scene.background = new THREE.Color( 0xeeeeee)
//Axis Helper
const axesHelper = new THREE.AxesHelper(10)
scene.add(axesHelper)

const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Functions
function add_scene(this_object) {
    scene.add(this_object)
}

function set_scale(this_object) {
    this_object.scale.set(0.1,0.1,0.1)
}

function set_material(this_object,material) {
    //console.log(this_object)
    this_object.children[0].material=material
}

function position_gui(this_object,name,pivot_object){
    let a_folder = gui.addFolder( name );
    a_folder.add(pivot_object.position,'x',-3,3,0.01)
    a_folder.add(pivot_object.position,'y',-3,3,0.01)
    a_folder.add(pivot_object.position,'z',-3,3,0.01)
    //a_folder.add(origin_mesh.rotation,'z',0,2*Math.PI,0.01*Math.PI).name('z-rotation')
}


function add_rotation(this_object,name,pivot_object){
    scene.add(pivot_object)
    pivot_object.add(this_object)
    joint_folder.add(pivot_object.rotation,'y',0,2*Math.PI,0.01*Math.PI).name(name)
}



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)
function get_promise(url){
    let a_proimise = new Promise(function(resolve, myReject) {
        gltfLoader.load(
            url,
            (base_gltf) =>
            {    
                console.log(url+' success')
                resolve(base_gltf.scene)    
            },
            (progress) => {},
            (error) =>
            {
                console.log(url+' error')
                console.log(error)
            })})
    return a_proimise
    
}


// A promise to get Base object








//　Light


const directionalLight1 = new THREE.DirectionalLight('#ffffff', 3)
directionalLight1.shadow.normalBias = 0.05
directionalLight1.position.set(0, 10, 0)

const amibient_light = new THREE.AmbientLight('#ffffff', 3)
amibient_light.position.set(0, 10, 0)
scene.add(directionalLight1)

const directionalLight2 = new THREE.DirectionalLight('#ffffff', 3)
directionalLight2.shadow.normalBias = 0.05
directionalLight2.position.set(0, 0, 10)
scene.add(directionalLight2)

const directionalLight3 = new THREE.DirectionalLight('#ffffff', 3)
directionalLight3.shadow.normalBias = 0.05
directionalLight3.position.set(10, 0, 0)
scene.add(directionalLight3)

function change_intensity (value){
    directionalLight1.intensity=value
    directionalLight2.intensity=value
}

var light_params = {intensity: 1}

const light_folder = gui.addFolder( 'light' );
light_folder.add(light_params, 'intensity').min(0).max(10).step(0.001).name('light intensity').onChange(change_intensity)



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
camera.position.x = 10
camera.position.y = 10
camera.position.z = 10
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



const joint_folder = gui.addFolder( 'Joint Control' );

// Pivot　Objects
const pivot_object_base=new THREE.Mesh()
pivot_object_base.position.set(0,0,0)
pivot_object_base.rotation.set(0,0,0)

const pivot_object_Motor1=new THREE.Mesh()
pivot_object_base.add(pivot_object_Motor1)
pivot_object_Motor1.position.set(0,4,0)
pivot_object_Motor1.rotation.set(0,0,0)

let p_base=get_promise('/ur10/base.glb')
const metal_material = new THREE.MeshStandardMaterial({ color: 0x049ef4, metalness:1, roughness:1})
p_base.then(glb_object=> set_material(glb_object,metal_material))
p_base.then(glb_object=> add_scene(glb_object))
p_base.then(glb_object=> set_scale(glb_object))
p_base.then(glb_object=> position_gui(glb_object,'base',pivot_object_base))
p_base.then(glb_object=> add_rotation(glb_object,'base',pivot_object_base))

// Motor 1



let p_Motor1=get_promise('/ur10/Motor1.glb')
const metal_material_motor1 = new THREE.MeshStandardMaterial({ color: 0x78ff00, metalness:1, roughness:1})
p_Motor1.then(glb_object=> set_material(glb_object,metal_material_motor1))
p_Motor1.then(glb_object=> add_scene(glb_object))
p_Motor1.then(glb_object=> set_scale(glb_object))
p_Motor1.then(glb_object=> position_gui(glb_object,'Motor 1',pivot_object_Motor1))

p_Motor1.then(glb_object=> add_rotation(glb_object,'Motor 1',pivot_object_Motor1))
