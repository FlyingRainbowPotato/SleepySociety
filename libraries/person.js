import { origo, map, tile } from '../constants/index.js';
import { Point2D } from './point2d.js';
import {Resource, ResourcesStored} from './resources.js';
import { Vector } from "./vector.js";
import { Hex } from "./hex.js";

export class Person 
{
  //attributes
  name
  gender;
  height;
  haircolor;
  religion;
  mother;
  father;
  siblings;
  children;
  actionqueue;
  actionIsDone;
  inventory;
  coordinates;
  destination;

  //Attributes
  strength;
  charisma;
  dexterity;
  wisdom;
  intelligence;
  constitution;

  //Skills
  trade;
  leadership;
  persuasion;
  engineer;
  medicine;
  inventoryManagement;
  tracking;
  forestry;

  //Needs
  thirst;
  temperature;
  prestige;
  social;
  health;
  energy;
  fun;
  happiness;

  //actions
  currentAction;
  futureActions;
  pastActions;


  constructor(father,mother)
  {
    this.name = "Paul";

    //Attributes
    this.strength = 1;
    this.charisma = 1;
    this.dexterity = 1;
    this.wisdom = 1;
    this.intelligence = 1;
    this.constitution = 1;

    //skills
    this.forestry = 0;

    //gender
    let genderNum = Math.round(Math.random());
    if (genderNum === 0) this.gender = 'f';
    else this.gender = 'm';

    if (father == false){
      //height
      this.height = (320 + Math.random()*13)/2;
      if (this.gender === 'f') this.height -= 7;
      else this.height += 7
      

      this.haircolor = Math.round(Math.random()*10);

      this.religion = Math.round(Math.random()*10);

      this.mother = null;
      this.father = null;
      this.siblings = [];
      this.coordinates = new Vector(900, 400);
    }

    else{
      //height
      this.height = ((parents[0].height+parents[1].height) + Math.random()*13)/2;
      if (gender === 'f') this.height -= 7;
      else this.height += 7

      //haircolor
      let haircolorNum = Math.round(Math.random());
      if (genderNum===0) this.haircolor = father.haircolor;
      else this.haircolor = mother.haircolor;

      //religion
      this.religion = mother.religion;

      //parents
      this.mother = mother;
      this.father = father;

      //siblings
      this.siblings = mother.children; //NOT DESIGNED FOR DIVORCE, BASTARD CHILDREN OR UNFAITHFULNESS
      //coordinates
      this.coordinates = new Vector(mother.coordinates.x,mother.coordinates.y); //people usually get born with their mother
    }



    //children
    this.children = []; //people usually don't have children at birth

    //actionqueue
    this.actionqueue = new Queue();
    this.actionIsDone = true;

    //inventory
    this.inventory = [];
  }

  draw(ctx)
  {
    ctx.fillRect(this.coordinates.x-5 + origo.x,this.coordinates.y-5 + origo.y,10,10)
  }
  move()
  {
    let deltax = this.coordinates.x-this.destination.x;
    let deltay = this.coordinates.y-this.destination.y;
    if (Math.abs(deltax) < ((this.dexterity+5)/5) && Math.abs(deltay) < ((this.dexterity+5)/5))
    {
      this.coordinates.x = this.destination.x;
      this.coordinates.y = this.destination.y;
    }
    else {
      let clonedVector = Vector.clone(this.destination);
      clonedVector.subtract(this.coordinates);
      
      clonedVector.normalize();
      clonedVector.scale( (this.dexterity+5)/5 )
      this.coordinates.add( clonedVector );
    }
  }
  newDestination(v)
  {
    this.destination = Vector.clone(v);
    //console.log(this.name + " is moving towards " + this.destination.x + ", " + this.destination.y + " and is currently at " + this.coordinates.x + ", " + this.coordinates.y);
  }
  actionHandler()
  {
    if (this.actionqueue.actionQueue.length > 0){
      if(this.actionqueue.actionQueue[0].actionName == "chopWood")
      {
        let pixelCoordsAction = Hex.hexToPixel(this.actionqueue.actionQueue[0].coordinates);

        if(map.mapHexes[this.actionqueue.actionQueue[0].coordinates.x][this.actionqueue.actionQueue[0].coordinates.y].tile == tile.forestDeep && pixelCoordsAction.x-origo.x == this.coordinates.x && pixelCoordsAction.y-origo.x == this.coordinates.y)
        {

          map.mapHexes[this.actionqueue.actionQueue[0].coordinates.x][this.actionqueue.actionQueue[0].coordinates.y].work += (this.strength + this.forestry + 1);

          if(map.mapHexes[this.actionqueue.actionQueue[0].coordinates.x][this.actionqueue.actionQueue[0].coordinates.y].work > 1000)
          {
            map.mapHexes[this.actionqueue.actionQueue[0].coordinates.x][this.actionqueue.actionQueue[0].coordinates.y].tile = tile.grass;

            this.actionqueue.queueShift();

            this.actionIsDone = true;
          }
        }
        else if (!(this.destination.x == pixelCoordsAction.x - origo.x && this.destination.y == pixelCoordsAction.y-origo.y))
        {
          console.log("cancelled action.. deleting");
          this.actionqueue.queueShift();
  
          this.actionIsDone = true;
        }
        else if(!(map.mapHexes[this.actionqueue.actionQueue[0].coordinates.x][this.actionqueue.actionQueue[0].coordinates.y].tile == tile.forestDeep))
        {
          console.log("invalid action... deleting.");
          this.actionqueue.queueShift();
  
          this.actionIsDone = true;
        }
      }
      else
      {
        console.log("action not supported... deleting.");
        this.actionqueue.queueShift();

        this.actionIsDone = true;
      }
    }
  }
  nextAction()
  {
    this.actionIsDone = false;
    let destCoords = Hex.hexToPixel(this.actionqueue.actionQueue[0].coordinates);
    this.newDestination(new Vector(destCoords.x-origo.x,destCoords.y-origo.y));
  }
}

export class PersonAction {
  actionName;
  coordinates;

  constructor(actionName, coordinates) {
    this.actionName = actionName;
    this.coordinates = coordinates;
  }

}

export class Queue
{
  actionQueue;

  constructor() {
    this.actionQueue = [];
  }

  queueAdd(action) {
    this.actionQueue.push(action)
  }

  queueShift() {
    this.actionQueue.shift();
  }
  queueRemove(action) {
    let index = this.actionQueue.map(actions => actions.coordinates).indexOf(action.coordinates);

    if (index > -1) {
      this.actionQueue.splice(index, 1);
    }
    else {
      console.log("no action")
    }
  }
  queuePeek() {
    return this.actionQueue[0];
  }
}