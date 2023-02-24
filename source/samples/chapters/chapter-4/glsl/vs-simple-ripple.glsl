uniform float time;

varying vec2 vUv;
void main(){
  vUv=uv;
  
  vec3 transformedRipple=vec3(position);
  float freq=3.;
  float amp=.2;
  float angle=(time+position.y)*freq;
  transformedRipple.z+=sin(angle)*amp;
  
  gl_Position=projectionMatrix*modelViewMatrix*vec4(transformedRipple,1.);
  csm_Position=transformedRipple;
}