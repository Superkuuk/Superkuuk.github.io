// Import libraries
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.126.0/build/three.module.js'
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.126.0/examples/jsm/controls/OrbitControls.js'
import rhino3dm from 'https://cdn.jsdelivr.net/npm/rhino3dm@0.15.0-beta/rhino3dm.module.js'

const file = 'FaultyObj_3dm.3dm'

// wait until the rhino3dm library is loaded, then load the 3dm file
rhino3dm().then(async m => {
    console.log('Loaded rhino3dm.')
    let rhino = m
    console.log('1')
    let res = await fetch(file)
    console.log('2')
    let buffer = await res.arrayBuffer()
    console.log('3')
    let arr = new Uint8Array(buffer)
    console.log('4')
    let doc = rhino.File3dm.fromByteArray(arr)
    
    console.log('read file.')

    init()

    let material = new THREE.MeshNormalMaterial()

    let objects = doc.objects()
    for (let i = 0; i < objects.count; i++) {
        let mesh = objects.get(i).geometry()
        if(mesh instanceof rhino.Mesh) {
            // convert all meshes in 3dm model into threejs objects
            let threeMesh = meshToThreejs(mesh, material)
            scene.add(threeMesh)
        }
    }
    console.log('added objects to scene')
})

// BOILERPLATE //
let scene, camera, renderer

function init(){

    THREE.Object3D.DefaultUp = new THREE.Vector3(0,0,1)

    scene = new THREE.Scene()
    scene.background = new THREE.Color(1,1,1)
    camera = new THREE.PerspectiveCamera( 45, window.innerWidth/window.innerHeight, 1, 1000 )
    camera.position.set(26,-40,5)

    renderer = new THREE.WebGLRenderer({antialias: true})
    renderer.setPixelRatio( window.devicePixelRatio )
    renderer.setSize( window.innerWidth, window.innerHeight )
    document.body.appendChild( renderer.domElement )

    const controls = new OrbitControls( camera, renderer.domElement )

    window.addEventListener( 'resize', onWindowResize, false )
    animate()
    console.log('finished init()')
}

function animate () {
    requestAnimationFrame( animate )
    renderer.render( scene, camera )
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize( window.innerWidth, window.innerHeight )
    animate()
}

function meshToThreejs(mesh, material) {
    const loader = new THREE.BufferGeometryLoader()
    const geometry = loader.parse(mesh.toThreejsJSON())
    console.log('mesh to threejs')
    return new THREE.Mesh(geometry, material)
}
