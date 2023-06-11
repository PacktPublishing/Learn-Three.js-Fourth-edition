# Learn-Three.js-Fourth-edition
Learn Three.js, Fourth edition, published by Packt


<a href="https://www.packtpub.com/product/learn-three.js-fourth-edition/9781803233871"><img src="https://static.packt-cdn.com/products/9781803233871/cover/smaller" alt="Learn Three.js, Fourth edition" height="256px" align="right"></a>

This is the code repository for [Learn Three.js, Fourth edition](https://www.packtpub.com/product/learn-three.js-fourth-edition/9781803233871), published by Packt.

**Program 3D animations and visualizations for the web with JavaScript and WebGL**

## What is this book about?

This book is for JavaScript developers looking to learn the use of Three.js library.	

This book covers the following exciting features:

* Implement the different camera controls provided by Three.js to navigate your 3D scene
* Discover working with vertices directly to create snow, rain, and galaxy-like effects
* Import and animate models from external formats, such as glTF, OBJ, STL, and COLLADA
* Design and run animations using morph targets and bone-based animation
* Create realistic-looking 3D objects using advanced textures on materials
* Interact directly with WebGL by creating custom vertex and fragment shaders
* Make scenes using the Rapier physics engine, and integrate Three.js with VR and AR

If you feel this book is for you, get your [copy](https://www.amazon.com/dp/1803233877) today!

<a href="https://www.packtpub.com/?utm_source=github&utm_medium=banner&utm_campaign=GitHubBanner"><img src="https://raw.githubusercontent.com/PacktPublishing/GitHub/master/GitHub.png" 
alt="https://www.packtpub.com/" border="5" /></a>


## Instructions and Navigations

The code will look like the following:

```
const normalMap = new THREE.TextureLoader().load('/assets/textures/red-bricks/red_bricks_04_nor_gl_1k.jpg',(texture) => {
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(4, 4)
  }
)

```

**Following is what you need for this book:**

Three.js has become the industry standard for creating stunning 3D WebGL content. In this edition, you’ll learn about all the features of Three.js and understand how to integrate it with the newest physics engines. You'll also develop a strong grip on creating and animating immersive 3D scenes directly in your browser, reaping the full potential of WebGL and modern browsers.
The book starts with the basic concepts and building blocks used in Three.js and helps you explore these essential topics in detail through extensive examples and code samples. 

With the following software and hardware list you can run all code files present in the book (Chapter 2-9).

### Related products <Other books you may enjoy>
* Going the Distance with Babylon.js  [[Packt]](https://www.packtpub.com/product/going-the-distance-with-babylonjs/9781801076586) [[Amazon]](https://www.amazon.com/Going-Distance-Babylon-js-maintainable-browser-based-ebook/dp/B09ZBB2Q1H)

* Real-Time 3D Graphics with WebGL 2 [[Packt]](https://www.packtpub.com/product/real-time-3d-graphics-with-webgl-2-second-edition/9781788629690) [[Amazon]](https://www.amazon.com/Real-Time-Graphics-WebGL-interactive-applications/dp/1788629698)


## Get to Know the Author
**Jos Dirksen** has worked as a software developer and architect for almost two decades. He has a lot of experience in many technologies, ranging from backend technologies, such as Java and Scala, to frontend development using HTML5, CSS, JavaScript, and Typescript. Besides working with these technologies, Jos regularly speaks at conferences and likes to write about new and interesting technologies on his blog. He also likes to experiment with new technologies and see how they can best be used to create beautiful data visualizations.

### Download a free PDF

 <i>If you have already purchased a print or Kindle version of this book, you can get a DRM-free PDF version at no cost.<br>Simply click on the link to claim your free PDF.</i>
<p align="center"> <a href="https://packt.link/free-ebook/9781803233871">https://packt.link/free-ebook/9781803233871 </a> </p>

## Errata

- On page 11: Before running the install commands, make sure to change to the `source` directory. 

- On page 133: at the bottom of the page, the book mentions `vertextShader`, this should be `vertexShader`

