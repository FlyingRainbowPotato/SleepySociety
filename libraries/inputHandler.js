import { buildingsSprite,  buildingTypes, buildings, buildingButtons, interactButtons, scrollSpeedVector, scrollSpeed, player, map, origo } from '../constants/index.js';
import { Hex } from './hex.js';
import { Point2D } from './point2d.js';
import { Button } from './hud.js';
import { Vector } from './vector.js';
import { Housing } from './buildings.js'

export function keyHandlerDown(e)
{  
 
    if (e.key == "ArrowDown") {
         scrollSpeedVector.y = -scrollSpeed;
    }
    else if (e.key == "ArrowUp")
    {
        scrollSpeedVector.y = scrollSpeed;
    }
    else if (e.key == "ArrowRight")
    {
        scrollSpeedVector.x = -scrollSpeed;
    }
    else if (e.key == "ArrowLeft")
    {
        scrollSpeedVector.x = scrollSpeed;
    }
    else 
    {
    }
}

export function keyHandlerUp(e)
{
    if (e.key == "ArrowDown")
    {
        scrollSpeedVector.y = 0;
    }
    else if (e.key == "ArrowUp")
    {
        scrollSpeedVector.y = 0;
    }
    else if (e.key == "ArrowRight")
    {
        scrollSpeedVector.x = 0;
    }
    else if (e.key == "ArrowLeft")
    {
        scrollSpeedVector.x = 0;
    }
    else 
    {
    }
}



export function mouseHandler(e, hud) {
    const pointerPos = new Point2D(e.clientX, e.clientY);

    if (e.which == 3){
        player.avatar.newDestination(new Vector (pointerPos.x - origo.x, pointerPos.y - origo.y));
    }
    else{
        if (player.currentAction === 0) {
            for (let i = 0; i < hud.buttonsList.length; i++) 
            {
                if(hud.buttonsList[i].pointIsWithin(pointerPos)) 
                {
                    console.log(hud.buttonsList[i].name)
                    if (hud.buttonsList[i].name === "buildMenu") 
                    {
                        player.currentAction = "buildMenu";
                        console.log(hud.buttonsList);
                        return 0;  
                    }
                }
            }
            let hexCoords = Hex.pixelToHex(pointerPos);
            player.currentAction = 
            {
                name: "interact",
                hexCoords: new Point2D(hexCoords.x,hexCoords.y)
            };


            let buttonStartLoc = Hex.hexToPixel(player.currentAction.hexCoords);
            for (let i = 0; i < 3; i++)
            {
                Button.constructButton(interactButtons,buttonStartLoc.x + i*100,buttonStartLoc.y,100,100,"interact"+i);
            }
            console.log(hud.buttonsList);
            return 0;
        }
        else if (player.currentAction === "buildMenu") {
       
            makeBuildingButtons();
    
            for (let j = 0; j < buildingButtons.length; j++) {
                if (buildingButtons[j].pointIsWithin(pointerPos)) {
                    player.currentAction = buildingButtons[j].name
                    Button.constructButton(hud.buttonsList, 1, 43, 119, 358, "hudButton");
    
                    return 0;
                }
            }
        }
        else if (player.currentAction === "buildHouse") {
            if(hud.buttonsList[1].pointIsWithin(pointerPos)) {
                player.currentAction = 0;
            }
            else {
    
                let hexCoords = Hex.pixelToHex(pointerPos);
                map.mapHexes[hexCoords.x][hexCoords.y].building = 1;
               
                if(typeof(buildings[hexCoords.x]) !== "object") {
                    buildings[hexCoords.x] = [];
                }
                if (typeof(buildings[hexCoords.x][hexCoords.y]) !== "object" ) {
                    buildings[hexCoords.x][hexCoords.y] = new Housing(buildingsSprite, hexCoords.x, hexCoords.y)
                    
                }
            } 
        }
        if (player.currentAction.name === "interact"){
            
            for (let i = 0; i < interactButtons.length; i++) 
            {
                if(interactButtons[i].pointIsWithin(pointerPos)) 
                {
                    if (interactButtons[i].name === "interact0") 
                    {
                        
                        interactButtons.splice(0,interactButtons.length);
                        player.currentAction = 0;
                        return 0;  
                    }
                }
            }
        }
        buildingButtons.length = 0;
        player.currentAction = 0;
    }
}  


function makeBuildingButtons() {
    let step = 43;
    let yInit = 63;
    let building = 0;

    for (let i = 0; i < 4; i++) {
        let xInit = 75;
        for (let j = 0; j < 2; j++ ) {
            Button.constructButton(buildingButtons, xInit, yInit, 28, 27, `build${buildingTypes[building]}`);
            
            
            building += 1;
            xInit += step;
        }
        yInit += step;
    }
}
