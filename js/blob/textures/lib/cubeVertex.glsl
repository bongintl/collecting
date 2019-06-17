attribute vec3 position;
 
uniform mat4 view;
uniform mat4 projection;
 
varying vec3 vPosition;
 
void main() {
    
    gl_Position = projection * view * vec4(position, 1.0);
    vPosition = position;
    
}