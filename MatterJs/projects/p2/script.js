// Jonas Karg

/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
// /*global define */

function Deg(degrees, top) {
    "use strict";
    if (top === true) {
        // Start from true zero
        return (degrees * Math.PI) / 180;
    } else {
        // Start from logical zero
        return ((degrees - 90) * Math.PI) / 180;
    }
}

function draw() {
    var x,
        y,
        stopper;
    
    // module aliases
    var Engine = Matter.Engine,
        Render = Matter.Render,
        World = Matter.World,
        Bodies = Matter.Bodies;
    
    // create an engine
    var engine = Engine.create();
    
    // create a renderer
    var render = Render.create({
        element: document.body,
        engine: engine
    });
    
    var ball = Bodies.circle(80, 10, 10);
    var arm1 = Bodies.rectangle(300, 160, 600, 10, { isStatic : true });
    var arm2 = Bodies.rectangle(500, 400, 600, 10, { isStatic : true });
    Matter.Body.rotate(arm1, Deg(-60));
    Matter.Body.rotate(arm2, Deg(60));
    var ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });
    World.add(engine.world, [ground, ball, arm1, arm2]);
    
    Engine.run(engine);
    Render.run(render);
}

draw();