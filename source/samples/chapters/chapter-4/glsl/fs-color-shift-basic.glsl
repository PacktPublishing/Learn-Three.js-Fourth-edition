precision highp float;
uniform float time;
varying vec2 vUv;

vec3 vary(vec3 y)
{
  y=y+sin(time)*y.r;
  return y;
}

void main(){
  vec2 st=vUv;
  vec3 color=vary(vec3(st.x*.5,st.y*1.,.5));
  gl_FragColor=vec4(color,1.);
}