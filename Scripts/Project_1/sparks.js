import { getPosition } from "../Useful_Scripts/divPosition.js";
import { randomU, randomG } from "../Useful_Scripts/random.js";
// Used in the first project page

export function sparks(canvas){
  const maxRadius = 15;
  const minRadius = 8;
  const minVelocity = 3;
  const maxVelocity = 10;
  let sparks = [];
  var maxX = canvas.width;
  var maxY = canvas.height;
  var sourceX = maxX / 2;
  var sourceY = maxY / 2;
  let context = canvas.getContext('2d');

  draw();

  canvas.onmousemove = function mouseCoords(event){
    var canvasPosition = getPosition(canvas);
    sourceX = event.clientX - canvasPosition.x;
    sourceY = event.clientY - canvasPosition.y;
  };
  // have the sparks snap back to the center of the canvas
  canvas.onmouseleave = function revertPos() {
    sourceX = maxX / 2;
    sourceY = maxY / 2;
  }

  function draw() {
      context.clearRect(0,0, maxX, maxY);
      create();
      
      function create() {
        var velocity = randomU(minVelocity, maxVelocity);
        var spark = {
          opacity: 1,
          x: sourceX,
          y: sourceY,
          sourceX: sourceX,
          sourceY: sourceY,
          velocity: velocity,
          radius: minRadius + (maxRadius - minRadius) * velocity,
          // radius: easeInCubic(Math.random(), minRadius, maxRadius),
          direction: Math.random() * 2 * Math.PI,
          diffuseRate: 0,//1/(Math.pow(velocity,3)),
          length: 100 * 1/velocity,
          width: 1
        };

        sparks.push(spark);
        diffuse();
      }
      
      function diffuse() {
        var length;
        sparks.forEach(element => {
          element.opacity -= element.diffuseRate;
          element.radius -= 0.04;
          element.x += element.velocity * Math.cos(element.direction);
          element.y += element.velocity * Math.sin(element.direction);
          element.velocity -= 0.01

          length = 100/element.velocity;

          if ((element.radius <= 1) || (element.opacity <= 0.2) || (element.velocity < 1)) {
            sparks.splice(sparks.indexOf(element), 1);
          }

          // glow
          // context.beginPath();
          // context.ellipse(element.x, element.y, element.radius, length + 1, element.direction, 0, 2 * Math.PI);
          // context.fillStyle = "rgba(255, 255, 0," + element.opacity+")" ;
          // context.fill();
          // context.closePath();

          // light
          var startPoint;
          var h = Math.sqrt(Math.pow((element.x - element.sourceX),2) + Math.pow((element.y - element.sourceY),2));
          var ratio = element.length / h;
          if (ratio > element.length){
            startPoint = {
              x: element.sourceX,
              y: element.sourceY
            };
          } else {
            startPoint = {
              x: ratio * element.sourceX + (1-ratio) * element.x,
              y: ratio * element.sourceY + (1-ratio) * element.y
            };
          }
          

          context.beginPath();
          context.lineCap = "round";
          context.moveTo(startPoint.x, startPoint.y);
          context.lineTo(element.x, element.y);
          context.strokeStyle = "rgba(255, 255, 255, " + element.opacity + ")";
          context.stroke();
          // context.ellipse(element.x, element.y, element.radius, length, element.direction, 0, 2 * Math.PI);
          // context.fillStyle = "rgba(255, 255, 255, " + element.opacity + ")";
          // context.fill();
          context.closePath();
        });
        // context.filter = 'blur(4px)';
      }
      window.requestAnimationFrame(draw);
  }
}
