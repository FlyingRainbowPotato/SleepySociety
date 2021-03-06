import { map, mapArray, mapHeight, mapWidth, size, listOfButtons,scrollSpeedVector, ctx, origo, hexSpritesheet, HUDSprite, canvas, buildingsSprite, buildingHUDSprite, player, tileInteract, keys, people} from './constants/index.js'
import { HUD, Button } from './libraries/hud.js';
import { isLoaded, load} from './loadHandler.js';
import { cameraMovement, mouseHandler } from './libraries/inputHandler.js';
import { fpsCounter } from './libraries/fpsCounter.js';
import drawGrid from './libraries/draw.js';
import { Hex } from './libraries/hex.js';
import { Point2D } from './libraries/point2d.js';
import { Person, Queue, PersonAction } from './libraries/person.js';
import { Vector } from './libraries/vector.js';
import loadMainMenu from './menu.js';


ctx.webkitImageSmoothingEnabled = false;
ctx.imageSmoothingEnabled = false;
ctx.font = "20px Arial"
ctx.lineWidth = 2;

hexSpritesheet.src = "./img/hexagonTerrain_sheet.png";
HUDSprite.src = "./img/hud.png";
buildingsSprite.src = "./img/buildings.png";
buildingHUDSprite.src = "./img/buildingHUD.png";
tileInteract.src = "./img/tileInteract.png"


// Construct static buttons
Button.constructButton(listOfButtons, 10,50,40,40,"buildMenu");
Button.constructButton(listOfButtons, 0, 39, 119, 360, "hudButton");

const hud = new HUD(listOfButtons,[]);

function arrayRemove(arr, value) { 
    
    return arr.filter(function(ele){ 
        return ele != value; 
    });
}

document.addEventListener("keydown", function(e) {if (keys.indexOf(e.key) < 0) keys.push(e.key);});

document.addEventListener("keyup", function(e) {
    keys.splice(keys.indexOf(e.key), 1);
    scrollSpeedVector.x = 0;
    scrollSpeedVector.y = 0;
});

document.addEventListener("mousedown", function(e) {mouseHandler(e, hud)});

//PROOF OF CONCEPT. DOESN'T SAVE ANYTHING OF NOTE AS NOTHING HAS YET HAPPENED IN THE GAME. TODO: ADD AUTOSAVE EVERY 5 MINUTES
//const mapJSON = JSON.stringify(map);
//localStorage.setItem("mapJSON", mapJSON);
player.avatar.destination = new Vector (3000,3000);
function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}

let debugLoop;
debugLoop = setInterval(debug(),100);

function debug(){
    // console.log(hud.buttonsList);
}

canvas.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    
    return false;
}, false);

function gameLoop() {
    //Calculations
    origo.add(scrollSpeedVector);
    if (origo.x > -100) origo.x = -100;
    if (origo.y > -100) origo.y = -100;

    if (origo.y < -Hex.hexToPixel(new Point2D(0,mapHeight)).y + origo.y + canvas.height + 200) {
        origo.y = -Hex.hexToPixel(new Point2D(0,mapHeight)).y + origo.y + canvas.height + 200;
    }

    if (origo.x < -Hex.hexToPixel(new Point2D(mapWidth,0)).x + origo.x + canvas.width + 200) {
        origo.x = -Hex.hexToPixel(new Point2D(mapWidth,0)).x + origo.x + canvas.width + 200;
    }
    //Animation
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();
    player.avatar.draw(ctx);
    if (typeof player.avatar.destination !== 'undefined'){
        player.avatar.move();
    }
    
    ctx.drawImage(HUDSprite, 0, 0, 1920, 1080, 0, 0, 1920, 1080);
    if (player.currentAction === "buildMenu") {
        ctx.drawImage(buildingHUDSprite, 67, 54);
    }
    if (player.currentAction.name == "interact")
    {
        let pixelCoords = Hex.hexToPixel(player.currentAction.hexCoords);
        ctx.drawImage(tileInteract, pixelCoords.x, pixelCoords.y);
    }
    for (let i = 0; i<people.length; i++)
    {
        if(people[i].actionIsDone)
        {
            if(people[i].actionqueue.actionQueue.length > 0)
            {
                people[i].nextAction();
            }
        }
        else{
            people[i].actionHandler();
        }
    }

    fpsCounter();
    cameraMovement(keys);
    requestAnimationFrame(gameLoop);
}

// loadMainMenu(ctx, canvas.width, canvas.height);
load();
let isLoadedLoop;
isLoadedLoop = setInterval(init(),100);



function init(){
    if(isLoaded()) {
        clearInterval(isLoadedLoop);
        gameLoop();
    }
}
