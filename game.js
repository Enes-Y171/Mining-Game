<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Deep Miner</title>

<style>
body{
    margin:0;
    background:#111;
    color:white;
    font-family:Arial;
}

#container{
    display:flex;
    height:100vh;
}

#game{
    display:grid;
    grid-template-columns:repeat(11,40px);
    grid-template-rows:repeat(11,40px);

    margin:20px;
}

.cell{
    width:40px;
    height:40px;
    border:1px solid #222;
    box-sizing:border-box;
}

#sidebar{
    width:300px;
    padding:20px;
    border-left:2px solid #333;
}

#log{
    background:#000;
    height:400px;
    overflow:auto;
    padding:10px;
}
</style>

</head>

<body>

<div id="container">

<div id="game"></div>

<div id="sidebar">

<h2>Deep Miner</h2>

<p>Gold: <span id="gold">0</span></p>

<h3>Event Queue</h3>

<div id="log"></div>

</div>

</div>

<script>

const MAP_SIZE = 75;
const VIEW_SIZE = 11;
const CENTER = Math.floor(MAP_SIZE / 2);

const game = document.getElementById("game");
const log = document.getElementById("log");
const goldText = document.getElementById("gold");

let gold = 0;

const eventQueue = [];

const BLOCKS = {

    dirt:{
        hp:1,
        gold:1,
        color:"#6b4423"
    },

    copper:{
        hp:3,
        gold:5,
        color:"#b87333"
    },

    iron:{
        hp:8,
        gold:20,
        color:"#888"
    },

    gold:{
        hp:20,
        gold:60,
        color:"#ffd700"
    },

    diamond:{
        hp:50,
        gold:200,
        color:"#33dfff"
    }

};

const player = {

    x:CENTER,
    y:CENTER,

    power:1,
    direction:"right"

};

const map = [];

function emitEvent(type,payload={}){

    eventQueue.push({
        type,
        payload
    });

}

function addLog(text){

    const div = document.createElement("div");

    div.textContent = text;

    log.prepend(div);

}

function getBlockType(distance){

    const roll = Math.random();

    if(distance < 10){

        if(roll < 0.90) return "dirt";
        return "copper";

    }

    if(distance < 20){

        if(roll < 0.75) return "dirt";
        if(roll < 0.90) return "copper";

        return "iron";

    }

    if(distance < 30){

        if(roll < 0.65) return "dirt";
        if(roll < 0.80) return "copper";
        if(roll < 0.95) return "iron";

        return "gold";

    }

    if(distance < 40){

        if(roll < 0.55) return "dirt";
        if(roll < 0.70) return "copper";
        if(roll < 0.85) return "iron";
        if(roll < 0.95) return "gold";

        return "diamond";

    }

    if(roll < 0.50) return "dirt";
    if(roll < 0.65) return "copper";
    if(roll < 0.80) return "iron";
    if(roll < 0.90) return "gold";

    return "diamond";
}

function createMap(){

    for(let y=0;y<MAP_SIZE;y++){

        map[y] = [];

        for(let x=0;x<MAP_SIZE;x++){

            const distance = Math.sqrt(

                Math.pow(x-CENTER,2)+
                Math.pow(y-CENTER,2)

            );

            const blockType = getBlockType(distance);

            map[y][x] = {

                type:blockType,
                hp:BLOCKS[blockType].hp

            };

        }

    }

    map[CENTER][CENTER] = {

        type:"empty",
        hp:0

    };

}

function render(){

    game.innerHTML = "";

    const startX =
        player.x - Math.floor(VIEW_SIZE/2);

    const startY =
        player.y - Math.floor(VIEW_SIZE/2);

    for(let screenY=0;screenY<VIEW_SIZE;screenY++){

        for(let screenX=0;screenX<VIEW_SIZE;screenX++){

            const worldX =
                startX + screenX;

            const worldY =
                startY + screenY;

            const cell =
                document.createElement("div");

            cell.classList.add("cell");

            if(
                worldX >= 0 &&
                worldX < MAP_SIZE &&
                worldY >= 0 &&
                worldY < MAP_SIZE
            ){

                const block =
                    map[worldY][worldX];

                if(block.type !== "empty"){

                    cell.style.background =
                        BLOCKS[block.type].color;

                }

            }

            if(
                worldX === player.x &&
                worldY === player.y
            ){

                cell.style.background =
                    "#00ff88";

            }

            game.appendChild(cell);

        }

    }

}

function processEvents(){

    while(eventQueue.length){

        const event =
            eventQueue.shift();

        addLog(event.type);

        switch(event.type){

            case "PLAYER_MOVE":

                const nx =
                    player.x +
                    event.payload.dx;

                const ny =
                    player.y +
                    event.payload.dy;

                if(
                    nx >= 0 &&
                    nx < MAP_SIZE &&
                    ny >= 0 &&
                    ny < MAP_SIZE
                ){

                    player.x = nx;
                    player.y = ny;

                }

                break;

        }

    }

}

document.addEventListener(
"keydown",
(e)=>{

    if(e.key==="w"){

        player.direction="up";

        emitEvent(
            "PLAYER_MOVE",
            {
                dx:0,
                dy:-1
            }
        );

    }

    if(e.key==="s"){

        player.direction="down";

        emitEvent(
            "PLAYER_MOVE",
            {
                dx:0,
                dy:1
            }
        );

    }

    if(e.key==="a"){

        player.direction="left";

        emitEvent(
            "PLAYER_MOVE",
            {
                dx:-1,
                dy:0
            }
        );

    }

    if(e.key==="d"){

        player.direction="right";

        emitEvent(
            "PLAYER_MOVE",
            {
                dx:1,
                dy:0
            }
        );

    }

});

function loop(){

    processEvents();
    render();

    requestAnimationFrame(loop);

}

createMap();
loop();

</script>

</body>
</html>
