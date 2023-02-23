uniform float time;
uniform vec2 resolution;

void main(){
  
  float c1=mod(time,.5);
  float c2=mod(time,.7);
  float c3=mod(time,.9);

  gl_FragColor=vec4(c1,c2,c3,1.);
}