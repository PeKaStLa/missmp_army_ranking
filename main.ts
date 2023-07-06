/*
    main.ts
    missmp_army_ranking
    Frontend assignment
    by Peter Stadler
    05.07.2023, 22:45 Uhr
*/

let test: string = "test main.ts works";
console.log(test);

let officers: Officer[] = [];
let general: Officer;
let mmp;
/* test2 branch iss01 */

/*
interface Officer {
    readonly id: number;
    readonly name: string;
    subordinates: Officer[]
}
*/

interface ArmyRankingApp {
    general: Officer
    moveOfficer(officerID: number, managerID: number): void
    undo(): void
    redo(): void
}

class General{
    general: Officer
    id: number;
    name: string;
    subordinates: Officer[] = [];
    
    constructor(general: Officer, id: number, name: string) {
        this.general = general;
        this.id = id;
        this.name = name;
    }

    //move A under B. 
    //Move officerID under managerID. 
    //Push A to B's subordinates.
    moveOfficer(officerID: number, managerID: number){
        console.log("inside of moceOfficer");
        officers[managerID].subordinates.push(officers[officerID]);
    }
}

class Officer {
    id: number;
    name: string;
    subordinates: Officer[] = [];

    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }
}


//create Office by name from the formular. The ID gets assigned automatically
function createOfficer() {
    let id = officers.length + 1;
    let name = (<HTMLInputElement>document.getElementById('name')).value;
    //prevent empty officer-names
    if (name != "") {
        officers.push(new Officer(id, name));
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
    var temp = "";
    officers.forEach(element => { temp += element.name + "<br>"; });
    document.getElementById("officers").innerHTML = temp;
}


//initial test objects
mmp = new Officer(1, "MMP");
officers.push(mmp);
general = new General(mmp, 1, "MMP");

//general = new General(1, "MMP");



window.onload = function () { 

    let peter = new Officer(2, "Peter");
    let joh = new Officer(3, "joh");
    let an = new Officer(4, "an");

    officers.push(peter);
    officers.push(joh);
    officers.push(an);
    //officers.push(new Officer(2, "Peter"));
    //officers.push(new Officer(3, "An"));
    //officers.push(new Officer(4, "Johannes"));

    printAllOfficersToHtml(); 
    officers[1].subordinates.push(officers[2]);
    officers[1].subordinates.push(officers[3]);


}


