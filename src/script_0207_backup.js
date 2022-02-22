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

function pivot_object(x,y,z,color){
    let a_pivot_object=new THREE.Mesh(new THREE.BoxGeometry(1,1,1), new THREE.MeshBasicMaterial({color: color}))
    scene.add(a_pivot_object)
    a_pivot_object.position.set(x,y,z)
    a_pivot_object.rotation.set(0,0,0)
    return a_pivot_object
}

function add_scene(this_object) {
    scene.add(this_object)
}

function set_scale(this_object) {
    this_object.scale.set(0.1,0.1,0.1)
}


function set_pivot(this_object,pivot){
    pivot.add(this_object)
}

function set_visible(this_object){
    this_object.visible=false
}

function get_name(this_object){
    const name_array=[]
    for (let i=0;i<this_object.children.length;i++){
        //console.log(this_object.children[i].name)
        name_array.push(this_object.children[i].name)
    }
    console.log(name_array)
}

function add_scene_by_name(this_object,name){
    for (let i=0;i<this_object.children.length;i++){
        console.log(this_object.children[i].name)
        if (this_object.children[i].name.includes(name)){
            scene.add((this_object.children[i]))
            console.log(name+' added to the scene')
        }
    }
}

function set_material_by_name(this_object,name,material){
    for (let i=0;i<this_object.children.length;i++){
        //console.log(this_object.children[i].name)
        if (this_object.children[i].name.includes(name)){
            this_object.children[i].material=material
            console.log(name+'material added')
        }
    }
}





////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//#region
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






//　Light


// const directionalLight1 = new THREE.DirectionalLight('#ffffff', 3)
// directionalLight1.shadow.normalBias = 0.05
// directionalLight1.position.set(5, 5, 5)

// const directionalLight2 = new THREE.DirectionalLight('#ffffff', 3)
// directionalLight2.shadow.normalBias = 0.05
// directionalLight2.position.set(5, 5, 5)
// scene.add(directionalLight2)

const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)



// function change_intensity (value){
//     directionalLight1.intensity=value
//     directionalLight2.intensity=value
// }

// var light_params = {intensity: 3}

const light_folder = gui.addFolder( 'light' );
//light_folder.add(light_params, 'intensity').min(0).max(10).step(0.001).name('light intensity').onChange(change_intensity)
light_folder.add(directionalLight, 'intensity').min(0).max(10).step(0.001).name('light intensity')


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


/**
 * Floor
 */
 const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: '#444444',
        metalness: 0,
        roughness: 0.5
    })
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 10
camera.position.y = 10
camera.position.z = 10
//camera.lookAt(test_object.position)

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

//


//#endregion

let robot=get_promise('/ur10/robot.glb')
const metal_material = new THREE.MeshStandardMaterial({ color: 0xeaecee,metalness:0.3,roughness:0})
robot.then(glb_object=> get_name(glb_object))

//Pivots
let pivot_object_base=pivot_object(0,0,0,0x049ef4)

//Base

robot.then(glb_object=> set_material_by_name(glb_object,'BASE_ROT-1',metal_material))

robot.then(glb_object=> add_scene_by_name(glb_object,'BASE_ROT-1'))
const metal_material2 = new THREE.MeshStandardMaterial({ color: 0xeaecee,metalness:0.3,roughness:0})


//robot.then(glb_object=> set_material_by_name(glb_object,'BASE_ROT-1',metal_material))
//robot.then(glb_object=> add_scene_by_name(glb_object,'BASE_ROT-1'))
////p_Motor1.then(glb_object=> set_material(glb_object,metal_material_motor1))
//p_Motor1.then(glb_object=> add_scene(glb_object))







// let pivot_object_base=pivot_object(0,0,0,0x049ef4)
// let pivot_object_Motor1=pivot_object(0,5,0,0x049ef4)
// let pivot_object_Motor2=pivot_object(0,6,0,0x049ef4)
// pivot_object_base.add(pivot_object_Motor1)
// pivot_object_Motor1.add(pivot_object_Motor2)
// let p_base=get_promise('/ur10/base.glb')
// const metal_material = new THREE.MeshStandardMaterial({ color: 0x049ef4, metalness:1, roughness:1})
// p_base.then(glb_object=> set_material(glb_object,metal_material))
// p_base.then(glb_object=> set_scale(glb_object))
// p_base.then(glb_object=> set_pivot(glb_object,pivot_object_base))


// // Motor 1
// let p_Motor1=get_promise('/ur10/Motor1.glb')
// const metal_material_motor1 = new THREE.MeshStandardMaterial({ color: 0xFF9C9C, metalness:1, roughness:1})
// p_Motor1.then(glb_object=> set_material(glb_object,metal_material_motor1))
// p_Motor1.then(glb_object=> set_scale(glb_object))
// p_Motor1.then(glb_object=> set_pivot(glb_object,pivot_object_Motor1))
// //p_Motor1.then(glb_object=> set_visible(glb_object))


// // Motor 2
// let p_Motor2=get_promise('/ur10/Motor1.glb')
// const metal_material_motor2 = new THREE.MeshStandardMaterial({ color: 0xFF9000, metalness:1, roughness:1})
// p_Motor2.then(glb_object=> set_material(glb_object,metal_material_motor1))
// p_Motor2.then(glb_object=> set_scale(glb_object))
// p_Motor2.then(glb_object=> set_pivot(glb_object,pivot_object_Motor2))


// //GUI
const folder_base = joint_folder.addFolder('base');
folder_base.add(pivot_object_base.position,'x',-3,3,0.01)
folder_base.add(pivot_object_base.position,'z',-3,3,0.01)



// folder_base.add(pivot_object_base.rotation,'y',0,2*Math.PI,0.01*Math.PI).name('z-rotation')


// const folder_Motor１ = joint_folder.addFolder('Motor 1');
// folder_Motor１.add(pivot_object_Motor1.rotation,'y',0,2*Math.PI,0.001*Math.PI).name('z-rotation')