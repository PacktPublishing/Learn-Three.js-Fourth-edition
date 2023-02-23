uniform float time;

varying vec2 vUv;
void main(){
  vUv=uv;
  
  vec3 transformed=vec3(position);
  float freq=3.;
  float amp=.2;
  float angle=(time+position.y)*freq;
  transformed.z+=sin(angle)*amp;
  
  gl_Position=projectionMatrix*modelViewMatrix*vec4(transformed,1.);
}