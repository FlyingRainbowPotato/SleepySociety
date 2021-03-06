import { Point2D } from './point2d.js';

export class HUD
{
    buttonsList;
    infoLists;
    constructor(buttonsList, infoLists)
    {
        this.buttonsList = buttonsList;
        this.infoLists = infoLists;
    }
}

export class Button
{
    pointStartButton;
    pointEndButton;
    name;

    constructor(point2DStart, point2DEnd, name)
    {
        this.pointStartButton = point2DStart;
        this.pointEndButton = point2DEnd;
        this.name = name;
    }

    pointIsWithin(point)
    {
        if ((this.pointStartButton.x <= point.x && point.x <= this.pointEndButton.x )&&(this.pointStartButton.y <= point.y && point.y <= this.pointEndButton.y))
        {
            return true;
        }
        else{return false;}
    }
    static constructButton(listOfButtons, startx,starty,width,height,name){
        listOfButtons.push(new Button(new Point2D(startx,starty), new Point2D(startx+width,starty+height),name));
    }
}