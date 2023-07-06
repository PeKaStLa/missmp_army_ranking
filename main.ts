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
    moveOfficer(officerID: number, managerID: number) {
        console.log("inside of moceOfficer");
        if (officers[officerID - 1] !== app["general"]) {
            console.log("Not MMP. Now move officer:" + officers[officerID - 1])
            officers[managerID - 1].subordinates.push(officers[officerID - 1]);
        } else if (officers[officerID - 1] === app["general"]) {
            console.log("You cannot move the general MMP under somebody!");
        }
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
var app: ArmyRankingApp;
var mmp: Officer;

mmp = new Officer(1, "MMP");
officers.push(mmp);
app = new ArmyRankingApp(mmp);

//
//3. functions
//

//create Office by name from the formular-input. The ID gets assigned automatically
function createOfficer() {
    console.log("inside createOfficer")
    let id = officers.length + 1;
    let name = (<HTMLInputElement>document.getElementById('name')).value;
    //prevent empty officer-names
    if (name != "") {
        console.log("name is not empty inside createOfficer")
        officers.push(new Officer(id, name));
        console.log("can we move officer:" + officers[id - 1]);
        console.log("can we move officer:" + officers[id - 1].name);
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


