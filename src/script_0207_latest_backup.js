import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import * as dat from 'lil-gui'

//#region Loaders
const manager = new THREE.LoadingManager();

const gui = new dat.GUI()
// Canvas
const canvas = document.querySelector('canvas.webgl')
// Scene
const scene = new THREE.Scene()
//scene.background = new THREE.Color( 0xeeeeee)
//Axis Helper
const axesHelper = new THREE.AxesHelper(10)
scene.add(axesHelper)

const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')
//#endregion

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


function set_pivot(this_object,pivot){
    pivot.add(this_object)
}


function get_name(this_object){
    const name_array=[]
    for (let i=0;i<this_object.children.length;i++){
        //console.log(this_object.children[i].name)
        name_array.push(this_object.children[i].name)
    }
    console.log(name_array)
}

const log_scene_components = () =>
{
    scene.traverse((child) =>
    {   
        console.log(child)
    })
}

const set_rotation_by_name = () =>
{
    scene.traverse((child) =>
    {   
        if(child instanceof THREE.Mesh)
        {   var vector_world = new THREE.Vector3()
            child.getWorldPosition(vector_world)
            console.log(child.name,child.position)
        }
    })
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)
gltfLoader.load(
    './ur10/robot.glb',
    (gltf) =>
    {
        scene.add(gltf.scene)
        gui.add(gltf.scene.rotation, 'y').min(- Math.PI).max(Math.PI).step(0.001).name('rotation')
        
        set_rotation_by_name()

    }
)

//#region
/**
 * Lights
 */
 const directionalLight = new THREE.DirectionalLight('#ffffff', 3)
 directionalLight.castShadow = true
 directionalLight.shadow.camera.far = 15
 directionalLight.shadow.mapSize.set(1024, 1024)
 directionalLight.shadow.normalBias = 0.05
 directionalLight.position.set(0.25, 3, - 2.25)
 scene.add(directionalLight)
 
 gui.add(directionalLight, 'intensity').min(0).max(10).step(0.001).name('lightIntensity')
 gui.add(directionalLight.position, 'x').min(- 5).max(5).step(0.001).name('lightX')
 gui.add(directionalLight.position, 'y').min(- 5).max(5).step(0.001).name('lightY')
 gui.add(directionalLight.position, 'z').min(- 5).max(5).step(0.001).name('lightZ')


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
//#endregion
