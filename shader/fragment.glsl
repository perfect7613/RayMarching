uniform float time;
uniform float progress;
uniform sampler2D texture1;
uniform sampler2D texture2;
uniform vec4 resolution;
varying vec2 vUv;
varying vec4 vPosition;

mat4 rotationMatrix(vec3 axis, float angle) {
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;
    
    return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
                oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
                oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
                0.0,                                0.0,                                0.0,                                1.0
            );
}

vec3 rotate(vec3 v, vec3 axis, float angle) {
	mat4 m = rotationMatrix(axis, angle);
	return (m * vec4(v, 1.0)).xyz;
}

float sphere(vec3 p){
    return length(p) - 0.5;
}

float sdBox( vec3 p, vec3 b )
{
  vec3 q = abs(p) - b;
  return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0);
}

float scene(vec3 p){

    vec3 p1 = rotate(p,vec3(1.,1.,1.),time/5.);

    return max(sdBox(p1, vec3(0.4,0.4,0.4)), sphere(p));
}

vec3 getNormal(vec3 p){
    vec2 o = vec2(0.001,0.);

    return normalize(
        vec3(
            scene(p + o.xyy) - scene(p - o.xyy),
            scene(p + o.yxy) - scene(p - o.yxy),
            scene(p + o.yyx) - scene(p - o.yyx)
        )
    );
}

void main() {
    vec2 newUV = (vUv - vec2(0.5))*resolution.zw + vec2(0.5);

    vec2 p = newUV - vec2(0.5);


    vec3 camPos = vec3(0.,0.,2.);

    vec3 ray = normalize(vec3(p,-1.));

    vec3 rayPos = camPos;

    float curDist = 0.;
    float rayLen = 0.;

    vec3 light = vec3(-1.,1.,1.);

    vec3 color = vec3(0.);

    for(int i = 0;i<=64;i++){
        curDist = scene(rayPos);
        rayLen += curDist;

        rayPos = camPos + ray*rayLen;

        if(abs(curDist)<0.001){

            vec3 n = getNormal(rayPos);

            float diff = dot(n,light);
            color = vec3(diff,0.,0.);
        }

    }


    gl_FragColor = vec4(color,1.);
}