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
        stopper,
        i;
    
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
    var wall1 = Bodies.rectangle(6, 300, 10, 600, { isStatic : true });
    var wall2 = Bodies.rectangle(794, 300, 10, 600, { isStatic : true });
    var ground = Bodies.rectangle(400, 610, 776, 60, { isStatic: true });
    World.add(engine.world, [ground, wall1, wall2]);
    
    for (i = 0; ) {
        
    }
    
    Engine.run(engine);
    Render.run(render);
}

draw();