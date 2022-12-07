uniform float time;

varying vec2 vUv;
void main(){
  vUv=uv;
  
  // vec3 posChanged=position;
  // posChanged.x=posChanged.x*(abs(sin(time*2.)));
  // posChanged.y=posChanged.y*(abs(cos(time*1.)));
  // posChanged.z=posChanged.z*(abs(sin(time*.5)));
  
  // gl_Position=projectionMatrix*modelViewMatrix*vec4(posChanged,1.);
  vec3 transformed=vec3(position);
  float freq=3.;
  float amp=.2;
  float angle=(time+position.y)*freq;
  transformed.z+=sin(angle)*amp;
  
  gl_Position=projectionMatrix*modelViewMatrix*vec4(transformed,1.);
  csm_Position=transformed;
}