varying vec2 vUv;
varying vec4 vPosition;
uniform vec2 pixels;
uniform float time;
float PI = 3.14159265338793238;


void main() {
    vUv = uv;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);


}