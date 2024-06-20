import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/Addons.js'
import GUI from 'lil-gui'
import { RGBELoader } from 'three/examples/jsm/Addons.js'
import { FontLoader } from 'three/examples/jsm/Addons.js'
import { TextGeometry } from 'three/examples/jsm/Addons.js'

const gui = new GUI()

const loadingManager = new THREE.LoadingManager()

const textureLoader = new THREE.TextureLoader(loadingManager)
const matcapTexture2 = textureLoader.load('/matcaps/8.png')
matcapTexture2.colorSpace = THREE.SRGBColorSpace

const doorColorTexture = textureLoader.load('/door/color.jpg')
const doorAlphaTexture = textureLoader.load('/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('/door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('/door/height.jpg')
const doorNormalTexture = textureLoader.load('/door/normal.jpg')
const doorMetalnessTexture = textureLoader.load('/door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('/door/roughness.jpg')
const matcapTexture = textureLoader.load('/matcaps/1.png')
const gradientTexture = textureLoader.load('/gradients/3.jpg')
const phone = textureLoader.load('./phone.png', (texture) => {
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
});

doorColorTexture.colorSpace = THREE.SRGBColorSpace
matcapTexture.colorSpace = THREE.SRGBColorSpace

// Cursor
const cursor = {
  x: 0,
  y:0
}

window.addEventListener('mousemove', (e) => {
  cursor.x = e.clientX / sizes.width - 0.5
  cursor.y = - (e.clientY / sizes.height - 0.5)
})

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

const fontsLoader = new FontLoader()

fontsLoader.load(
  '/fonts/helvetiker_regular.typeface.json',
  (font) => {
    const textGeometry = new TextGeometry(
      'Studio Wozzie',
      {
        font: font,
        size: 0.5,
        height: 0.2,
        depth: 0,
        curveSegments: 5,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 4
      }
    )

    textGeometry.center()
    
    const textMaterial = new THREE.MeshStandardMaterial({color: "#39ff14"})
    const text = new THREE.Mesh(textGeometry, textMaterial)
    
    // text.position.y = -1
    // text.position.x = -1.8
    scene.add(text)

    const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 28, 45)
    const donutMaterial = new THREE.MeshMatcapMaterial({matcap: matcapTexture2})

    for (let i = 0; i < 200; i++) {
      const donut = new THREE.Mesh(donutGeometry, donutMaterial)
      donut.position.x = (Math.random() - 0.5) * 10
      donut.position.y = (Math.random() - 0.5) * 10
      donut.position.z = (Math.random() - 0.5) * 10

      donut.rotation.x = Math.random() * Math.PI
      donut.rotation.y = Math.random() * Math.PI

      const scale = Math.random()
      donut.scale.set(scale, scale, scale)
      // scene.add(donut)
    }
  }
)

const material = new THREE.MeshStandardMaterial()
// material.metalness = 0.7
// material.roughness= 0.2
material.map =  matcapTexture
// material.aoMapIntensity = 1
// material.displacementMap = doorHeightTexture
// material.displacementScale = 0.1
// material.metalnessMap = doorMetalnessTexture
material.roughnessMap = doorRoughnessTexture
material.transparent = true
// material.alphaMap = doorAlphaTexture
const materialTwo = new THREE.MeshStandardMaterial()
materialTwo.map = phone

// material.clearcoat = 1
// material.clearcoatRoughness = 0

// material.transmission = 1
// material.ior = 1.5
// material.thickness = 0.5

gui.add(material, 'metalness').min(0).max(1).step(0.0001)
gui.add(material, 'roughness').min(0).max(1).step(0.0001)

// material.flatShading = true
// material.map = doorColorTexture
material.side = THREE.DoubleSide
materialTwo.side = THREE.DoubleSide

const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.5,16,16),
  material
)
sphere.position.x = 1.5

const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(1.5,3),
  materialTwo
)

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3,0.2,16,32),
  material
)
torus.position.x = -1.5

plane.receiveShadow = true

scene.add(torus, plane, sphere)

torus.position.y = 1
sphere.position.y = 1
plane.position.y = 1

const ambientLight = new THREE.AmbientLight(0xfffffff, 1)
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xfffffff, 30)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)

const directionalLight = new THREE.DirectionalLight('blue', 10)
directionalLight.castShadow = true
directionalLight.position.set(1, 0.25, 0)
const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 20)
// scene.add(directionalLight)
// scene.add(ambientLight)
// scene.add(hemisphereLight)
// const pointLight = new THREE.PointLight(0xff0000, 5)
// scene.add(pointLight)

const rectAreaLight = new THREE.RectAreaLight('green',10,1,1)
rectAreaLight.position.set(- 1.5, 0, 1.5)
rectAreaLight.lookAt(new THREE.Vector3())
// scene.add(rectAreaLight)

const spotLight = new THREE.SpotLight(0x78ff00, 4.5, 10, Math.PI * 0.1, 0.25, 1)
scene.add(spotLight)
const rgbeLoader = new RGBELoader()
rgbeLoader.load('./environment-map/evening_field_2k.hdr', (envMap) => {
  envMap.mapping = THREE.EquirectangularReflectionMapping

  scene.background = envMap
  scene.environment = envMap
})

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

window.addEventListener("dblclick", () => {
  if (!document.fullscreenElement) {
    canvas.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
})
/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 4

scene.add(camera)

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true
})
renderer.setSize(sizes.width, sizes.height)

const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  sphere.rotation.y = 0.6 * elapsedTime
  // plane.rotation.y = 0.6 * elapsedTime
  torus.rotation.y = 0.6 * elapsedTime
  sphere.rotation.x = - 0.6 * elapsedTime
  // plane.rotation.x = - 0.6 * elapsedTime
  torus.rotation.x = - 0.6 * elapsedTime

  controls.update()

  // camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3
  // camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3
  // camera.position.y = cursor.y * 5
  // camera.lookAt(mesh.position)

  renderer.render(scene, camera)

  window.requestAnimationFrame(tick)
}

tick()