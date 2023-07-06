/*
    main.ts
    missmp_army_ranking
    Frontend assignment
    by Peter Stadler
    05.07.2023, 22:45 Uhr

    1. Interfaces and classes
    2. variable declarations
    3. functions
    4. window.onload
*/

//
//1. Interfaces and classes
//

interface ArmyRankingAppInterface {
    general: Officer
    moveOfficer(officerID: number, managerID: number): void
    undo(): void
    redo(): void
}

class ArmyRankingApp implements ArmyRankingAppInterface {
    general: Officer

    constructor(general: Officer) {
        this.general = general;
    }

    //move A under B//Move officerID under managerID//Push A to B's subordinates.
    //but prevent the general to be moved under somebody
    moveOfficer(future_subordinate_id: number, future_officer_id: number) {
        //console.log("inside of moceOfficer");
        if (officers[future_subordinate_id - 1] !== app["general"] && !isOfficerAlreadySubordinate(future_subordinate_id, future_officer_id)) {
            console.log("Not MMP and not already in subordinates. Now move officer:" + officers[future_subordinate_id - 1].name + " under " + officers[future_officer_id - 1].name);
            officers[future_officer_id - 1].subordinates.push(officers[future_subordinate_id - 1]);
        } else if (officers[future_subordinate_id - 1] === app["general"]) {
            console.log("You cannot move the general MMP under somebody!");
        } else if (isOfficerAlreadySubordinate(future_subordinate_id, future_officer_id)) {
            console.log("Officer is already Subordinate of the manager.");
        }
        printAllOfficers();
    }

    undo(): void {
        console.log("doing undo");
    }

    redo(): void {
        console.log("doing redo");
    }

}


interface OfficerInterface {
    readonly id: number;
    readonly name: string;
    subordinates: Officer[]
}

class Officer implements OfficerInterface {
    readonly id: number;
    readonly name: string;
    subordinates: Officer[] = [];

    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }
}

//
//2. variable declarations
//

var test: string = "test main.ts works";
console.log(test);

var officers: Officer[] = [];

const mmp: Officer = new Officer(1, "MMP");
officers.push(mmp);
const app: ArmyRankingApp = new ArmyRankingApp(mmp);

//
//3. functions
//

function moveSubordinatesToAnotherOfficer(old_officer_id: number, future_officer_id: number): boolean{
    return true;
}

function removeSubordinateFromOfficer(old_subordinate_id: number, old_officer_id: number): boolean{
    return true;
}

// check isOfficerAlreadySubordinate(), to prevent that one subordinate can get moved under the same officer multiple times
function isOfficerAlreadySubordinate(future_subordinate_id: number, future_officer_id: number): boolean{
    // return true if future_subordinate is already in subordinates of future_officer
    // return true if officers[future_subordinate_id - 1] is already in officers[future_officer_id - 1].subordinates
    return officers[future_officer_id - 1].subordinates.some(e => e === officers[future_subordinate_id - 1]);
}

//create Office by name from the formular-input. The ID gets assigned automatically
function createOfficer() {
    console.log("inside createOfficer")
    let id = officers.length + 1;
    let name = (<HTMLInputElement>document.getElementById('name')).value;
    //prevent empty officer-names
    if (name != "") {
        officers.push(new Officer(id, name));
        //console.log("can we move officer:" + officers[id - 1].name);
        app.moveOfficer(id, 1);
        (<HTMLInputElement>document.getElementById('name')).value = "";
        printAllOfficers();
        printAllOfficersToHtml();
    }
}

function printAllOfficers() {
    officers.forEach(element => {
        console.log(element.name, element.id, element.subordinates);
    });
}

function printAllOfficersToHtml() {
    let temp = "";
    temp += "Apps' General:" + app["general"].name + app["general"].id + "<br>";
    officers.forEach(element => { temp += "officer: " + element.name + element.id + "<br>"; });
    document.getElementById("officers").innerHTML = temp;
}


//
//4. window.onload
//

window.onload = function () {
    console.log(app)
    console.log("Apps' General:" + app["general"].name)
    printAllOfficersToHtml();

    //initial test objects
    /*
    let peter = new Officer(2, "Peter");
    let joh = new Officer(3, "joh");
    let an = new Officer(4, "an");

    officers.push(peter);
    officers.push(joh);
    officers.push(an);
    */
    //officers.push(new Officer(2, "Peter"));
    //officers.push(new Officer(3, "An"));
    //officers.push(new Officer(4, "Johannes"));

    //officers[1].subordinates.push(officers[2]);
    //officers[1].subordinates.push(officers[3]);
}


