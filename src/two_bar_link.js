import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'
import * as dat from 'lil-gui'


const gui = new dat.GUI()
const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()

//Axis Helper
const axesHelper = new THREE.AxesHelper(2)
scene.add(axesHelper)
scene.background = new THREE.Color( 0xaba7a7)

//Texture loader
const loadingManager = new THREE.LoadingManager()
loadingManager.onStart = () =>
{
    console.log('loading started')
}
loadingManager.onLoad = () =>
{
    console.log('loading finished')
}
loadingManager.onProgress = () =>
{
    console.log('loading progressing')
}
loadingManager.onError = () =>
{
    console.log('loading error')
}

const textureLoader = new THREE.TextureLoader(loadingManager)

//Origin
const origin_geo = new THREE.SphereGeometry(0.25, 32, 16)
const colorTexture = textureLoader.load('/textures/checkerboard-8x8.png')
colorTexture.magFilter = THREE.NearestFilter
const origin_material = new THREE.MeshBasicMaterial({map: colorTexture})
const origin_mesh = new THREE.Mesh(origin_geo, origin_material)
scene.add(origin_mesh)
// gui; origin
const origin_folder = gui.addFolder( 'origin' );
origin_folder.add(origin_mesh.position,'x',-3,3,0.01)
origin_folder.add(origin_mesh.position,'y',-3,3,0.01)
origin_folder.add(origin_mesh.position,'z',-3,3,0.01)
origin_folder.add(origin_mesh.rotation,'z',0,2*Math.PI,0.01*Math.PI).name('z-rotation')



//link 1
const geometry = new THREE.BoxGeometry(3, 0.2, 0.2)
const material = new THREE.MeshBasicMaterial()
const link1 = new THREE.Mesh(geometry, material)
link1.position.set(1.5, 0, 0)
scene.add(link1)
origin_mesh.add(link1)


//gui; reset
const reset = {
	reset() {
        origin_mesh.position.set(0, 0, 0)
        link1.position.set(1.5, 0, 0)
        console.log('reset')
	}
}

// gui; link 1
const folder1 = gui.addFolder( 'link 1' );
gui.add(reset,'reset')


//joint 2
const joint2_geo = new THREE.SphereGeometry(0.25, 32, 16)
const joint2_material = new THREE.MeshBasicMaterial({map: colorTexture})
const joint2_mesh = new THREE.Mesh(joint2_geo, joint2_material)
joint2_mesh.position.set(1.5,0,0)
scene.add(joint2_mesh)
// gui; joint2
const joint2_folder = gui.addFolder( 'joint2' );
joint2_folder.add(joint2_mesh.rotation,'z',0,2*Math.PI,0.01*Math.PI).name('z-rotation')
link1.add(joint2_mesh)


//link 2

const link2 = new THREE.Mesh(geometry, material)


//scene.add(link2)
joint2_mesh.add(link2)
link2.position.set(1.5, 0, 0)
/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

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
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    console.log(elapsedTime)
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()