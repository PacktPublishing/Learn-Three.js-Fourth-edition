// https://www.shadertoy.com/view/Nlffzj
// 3D Gradient noise from: https://www.shadertoy.com/view/Xsl3Dl
uniform float time;
uniform vec3 resolution;
varying vec2 vUv;

vec3 hash(vec3 p)// replace this by something better
{
  p=vec3(dot(p,vec3(127.1,311.7,74.7)),
  dot(p,vec3(269.5,183.3,246.1)),
  dot(p,vec3(113.5,271.9,124.6)));
  
  return-1.+2.*fract(sin(p)*43758.5453123);
}
float noise(in vec3 p)
{
  vec3 i=floor(p);
  vec3 f=fract(p);
  
  vec3 u=f*f*(3.-2.*f);
  
  return mix(mix(mix(dot(hash(i+vec3(0.,0.,0.)),f-vec3(0.,0.,0.)),
  dot(hash(i+vec3(1.,0.,0.)),f-vec3(1.,0.,0.)),u.x),
  mix(dot(hash(i+vec3(0.,1.,0.)),f-vec3(0.,1.,0.)),
  dot(hash(i+vec3(1.,1.,0.)),f-vec3(1.,1.,0.)),u.x),u.y),
  mix(mix(dot(hash(i+vec3(0.,0.,1.)),f-vec3(0.,0.,1.)),
  dot(hash(i+vec3(1.,0.,1.)),f-vec3(1.,0.,1.)),u.x),
  mix(dot(hash(i+vec3(0.,1.,1.)),f-vec3(0.,1.,1.)),
  dot(hash(i+vec3(1.,1.,1.)),f-vec3(1.,1.,1.)),u.x),u.y),u.z);
}

// from Unity's black body Shader Graph node
vec3 Unity_Blackbody_float(float Temperature)
{
  vec3 color=vec3(255.,255.,255.);
  color.x=56100000.*pow(Temperature,(-3./2.))+148.;
  color.y=100.04*log(Temperature)-623.6;
  if(Temperature>6500.)color.y=35200000.*pow(Temperature,(-3./2.))+184.;
  color.z=194.18*log(Temperature)-1448.6;
  color=clamp(color,0.,255.)/255.;
  if(Temperature<1000.)color*=Temperature/1000.;
  return color;
}

void main()
{
  // Normalized pixel coordinates (from 0 to 1)
  // vec2 uv=vUv/resolution.xy;
  vec2 uv=vUv;
  
  // Stars computation:
  vec3 stars_direction=normalize(vec3(uv*2.f-1.f,1.f));// could be view vector for example
  float stars_threshold=8.f;// modifies the number of stars that are visible
  float stars_exposure=200.f;// modifies the overall strength of the stars
  float stars=pow(clamp(noise(stars_direction*200.f),0.f,1.f),stars_threshold)*stars_exposure;
  stars*=mix(.4,1.4,noise(stars_direction*100.f+vec3(time)));// time based flickering
  
  // star color by randomized temperature
  float stars_temperature=noise(stars_direction*150.)*.5+.5;
  vec3 stars_color=Unity_Blackbody_float(mix(1500.,65000.,pow(stars_temperature,4.)));
  
  // Output to screen
  gl_FragColor=vec4(stars_color*stars,1.);
}