varying vec2 vUv;

void main(){
  vUv=uv;
  
  vec4 modelViewPosition=modelViewMatrix*vec4(position,1.);
  gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);
}