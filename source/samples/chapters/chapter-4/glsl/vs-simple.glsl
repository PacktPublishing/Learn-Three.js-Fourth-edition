uniform float time;
varying vec2 vUv;

void main(){

  vUv=uv;
  vec3 posChanged=position;
  posChanged.x=posChanged.x*(abs(sin(time*2.)));
  posChanged.y=posChanged.y*(abs(sin(time*1.)));
  posChanged.z=posChanged.z*(abs(cos(time*.5)));
  
  gl_Position=projectionMatrix*modelViewMatrix*vec4(posChanged,1.);
  csm_Position=posChanged;
}