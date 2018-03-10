// Jonas Karg

/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
// /*global define */

function draw() {
    var x,
        y,
        stopper,
        wall;
    
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
    
    var ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });
    var ball = Bodies.circle(Math.floor(Math.random() * 140 + 330), Math.floor(Math.random() * 10 + 10), 10);
    World.add(engine.world, [ground, ball]);
    
    for (i = 0; i < 1500; i += 88) {
        wall = Bodies.rectangle(i + 5, 553, 10, 50, { isStatic: true });
        World.add(engine.world, [wall]);
    }
    
    for (y = 0; y < 5; y++) {
        if (y % 2 == 0) {
            for (x = 0; x < 10; x++) {
                stopper = Bodies.circle(x * 40 + 225, y * 40 + 200, 4, { isStatic: true });
                World.add(engine.world, [stopper]);
            }
        }
        else {
            for (x = 0; x < 9; x++) {
                stopper = Bodies.circle(x * 40 + 245, y * 40 + 200, 4, { isStatic: true });
                World.add(engine.world, [stopper]);
            }
        }
    }
    
    Engine.run(engine);
    Render.run(render);
}

draw();