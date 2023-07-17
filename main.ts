/*
    main.ts
    missmp_army_ranking
    Frontend assignment
    by Peter Stadler
    05.07.2023, 22:45 Uhr

    1. Interfaces and classes with OOP functions
    2. variable declarations
    3. single functions
    4. window.onload
*/

//
//1. Interfaces and classes
//

interface ArmyRankingAppInterface {
    officers: Officer[]
    general: Officer

    last_change_old_subordinates: Officer[]
    last_change_old_officer: Officer
    last_change_moved_officer: Officer
    last_change_new_officer: Officer

    copySubordinatesToAnotherOfficer(old_officer_id: number, future_officer_id: number): void
    displayHierarchy(): void
    printAllOfficersToConsole(): void
    createOfficer(): void
    moveOfficer(future_subordinate_id: number, future_officer_id: number): void
    undo(): void
    redo(): void
}

class ArmyRankingApp implements ArmyRankingAppInterface {
    officers: Officer[]
    general: Officer

    last_change_old_subordinates: Officer[]
    last_change_old_officer: Officer
    last_change_moved_officer: Officer
    last_change_new_officer: Officer

    constructor(general: Officer) {
        this.general = general;
        this.officers = [];
    }


    copySubordinatesToAnotherOfficer(old_officer_id: number, future_officer_id: number): void {
        //clear the old_subordinates every time so every action can be undon correctly
        app.last_change_old_subordinates = [];

        //call all subordinates and push them to the other officer
        app.officers[old_officer_id - 1].subordinates.forEach(el => {
            app.officers[future_officer_id - 1].subordinates.push(el);

            //save all pushed subordinates in case General MMP wants to undo its action later
            app.last_change_old_subordinates.push(el)
        })
    }

    displayHierarchy(): void {
        mmp.printSubordinates();
    }

    printAllOfficersToConsole(): void {
        app.officers.forEach(el => {
            console.log(el.name, el.id, el.subordinates);
        });
    }

    //create Office by name from the formular-input. The ID gets assigned automatically
    createOfficer(): void {
        let id = app.officers.length + 1;
        let name = (<HTMLInputElement>document.getElementById('name')).value;

        //prevent empty officer-names
        if (name != "") {
            //create new Officer and push it to the officers-array
            app.officers.push(new Officer(id, name));

            //push every freshly created officer to MMP-General's subordinates on default!
            app.general.subordinates.push(app.officers[id - 1]);

            //clear the input-field
            (<HTMLInputElement>document.getElementById('name')).value = "";

            app.displayHierarchy();
        }
    }

    //Move future_subordinate_id to future_officer_id's subordinates.
    moveOfficer(future_subordinate_id: number, future_officer_id: number): void {

        if (future_subordinate_id == future_officer_id) {
            console.log("You cannot move an Officer under itself.");

        } else if (future_subordinate_id == 1) {
            console.log("You cannot move the general MMP under somebody!");

        } else if (isOfficerAlreadySubordinate(future_subordinate_id, future_officer_id)) {
            console.log("future_subordinate_id is already Subordinate of the future_officer_id.");

        } else {
            //for moving an Officer under an other officer we need to do 4 tasks.
            let old_officer = whoIsOfficerOfSubordinate(future_subordinate_id);

            //save these variables in case the Geeneral want to undo() its action.
            app.last_change_old_officer = old_officer;
            app.last_change_moved_officer = app.officers[future_subordinate_id - 1];
            app.last_change_new_officer = app.officers[future_officer_id - 1];

            //1. remove future_subordinate_id from its old Officer:
            removeSpecificSubordinateFromOfficer(future_subordinate_id, old_officer.id);

            //2. copy the own subordinates from future_subordinate to its old officer
            app.copySubordinatesToAnotherOfficer(future_subordinate_id, old_officer.id)

            //3. delete future_subordinate_id's old subordinates 
            app.officers[future_subordinate_id - 1].subordinates = [];

            //4. push future_subordinate_id to future_officer_id's subordinates
            app.officers[future_officer_id - 1].subordinates.push(app.officers[future_subordinate_id - 1]);

            //clear the input-fields
            (<HTMLInputElement>document.getElementById('a')).value = "";
            (<HTMLInputElement>document.getElementById('b')).value = "";

            app.displayHierarchy();
        }
    }

    undo(): void {
        //Check if an officer was moved before and if there is a past action to undo
        if (app.last_change_old_officer == undefined) {
            console.log("cannot undo an action because no action was done yet.");

        } else if (isOfficerAlreadySubordinate(app.last_change_moved_officer.id, app.last_change_old_officer.id)) {
            console.log("Officer ", app.last_change_moved_officer.name, " already was pushed back to its old officer ", app.last_change_old_officer.name)

        } else {
            //Undo the last action. Therefore we need to undo 4 tasks.

            //1. remove moved Officer from its new Officers' subordinates
            removeSpecificSubordinateFromOfficer(app.last_change_moved_officer.id, app.last_change_new_officer.id);

            //2. move back the moved Officer to its old original Officer's subordinates
            app.last_change_old_officer.subordinates.push(app.last_change_moved_officer);

            app.last_change_old_subordinates.forEach(el => {
                //3. remove old subordinates from moved_officers' old original officer
                removeSpecificSubordinateFromOfficer(el.id, app.last_change_old_officer.id);
                //4. add old subordinates to moved_officers' subordinates
                app.last_change_moved_officer.subordinates.push(el);
            })
            app.displayHierarchy();
        }
    }

    redo(): void {
        //Check if an officer was moved before and if there is a past action to undo
        if (app.last_change_old_officer == undefined) {
            console.log("cannot redo an action because no action was done yet.");

        } else {
            console.log("cannot redo an action because no action was done yet.");
            //move back the moved Officer to its last new Officer
            this.moveOfficer(app.last_change_moved_officer.id, app.last_change_new_officer.id);
            app.displayHierarchy();
        }
    }
}


interface OfficerInterface {
    readonly id: number;
    readonly name: string;
    subordinates: Officer[];
    printSubordinates(): void;
}

class Officer implements OfficerInterface {
    readonly id: number;
    readonly name: string;
    subordinates: Officer[] = [];

    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }

    //print this officers' subordinates and also their subordinates inside the visual-div.
    printSubordinates(level: number = 0): void {
        //create needed elements
        let visual = document.getElementById("visual");
        let box = document.createElement("div");
        let text = document.createElement("p");
        let tab = document.createElement("span");

        //add css-style classes 
        box.classList.add("box");
        tab.classList.add("tab");
        text.classList.add("box");

        //clear the HTML-element every time the function gets called
        if (level == 0) { visual.innerHTML = ""; }

        //add the current officers' name to the string
        text.innerHTML = this.name + " (" + this.id + ")";

        //add the correct space to the left of the Officer for making the Hierarchy
        for (let i = level; i > 0; i--) {
            if (i == 1) { tab.innerHTML += "&emsp;|_________"; }
            if (i != 1) { tab.innerHTML += "&emsp; &emsp; &emsp; &emsp; &emsp; &emsp;"; }
        }

        //append the created elements with officer-data and spaces into the line
        box.appendChild(tab);
        box.appendChild(text);

        //tell everysubordinate to do the same
        this.subordinates.forEach(element => {
            level = level + 1;
            element.printSubordinates(level);
            level = level + - 1;
        });
        //insert all lines to the visual DIV to build up the Hierarchy
        visual.insertBefore(box, visual.firstChild);
    };
}

//
//2. variable declarations
//


const mmp: Officer = new Officer(1, "MMP");
const app: ArmyRankingApp = new ArmyRankingApp(mmp);
app.officers.push(mmp);


//
//3. single functions
//


function removeSpecificSubordinateFromOfficer(old_subordinate_id: number, old_officer_id: number): void {
    //find out which index the old subordinate has in the officers' subordinate-array
    let index = app.officers[old_officer_id - 1].subordinates.indexOf(app.officers[old_subordinate_id - 1]);

    //use the index to cut out the subordinate
    app.officers[old_officer_id - 1].subordinates.splice(index, 1);
}


function whoIsOfficerOfSubordinate(subordinate_id: number): Officer {
    let officer;

    //call all officers and look through their subordinates and compare them
    app.officers.forEach(el => {
        if (isOfficerAlreadySubordinate(subordinate_id, el.id)) {
            officer = el;
        }
    })
    //return the subordinates' localised officer.
    return officer;
}

//use isOfficerAlreadySubordinate(), to prevent that one subordinate can get moved under the same officer multiple times
function isOfficerAlreadySubordinate(future_subordinate_id: number, future_officer_id: number): boolean {

    // return true if future_subordinate is already in subordinates of future_officer
    return app.officers[future_officer_id - 1].subordinates.some(e => e === app.officers[future_subordinate_id - 1]);
}

function isOfficerInArray(officer: Officer, array: Officer[]): boolean {
    // check if officer-object is in the array
    return array.some(e => e === officer);
}


function areAllSubordinatesAlreadySaved(officer: Officer, array: Officer[]): boolean {
    //set the variable to true. It can only get set false one way, so that its function is save.
    let all_in_array = true;

    //compare all of the subordinates to the Officers in the array
    officer.subordinates.forEach(el => {

        //it is enough if at least one officer is found in the array and seta the variable to false.
        if (!array.some(e => e === el)) {
            all_in_array = false;
        }
    })
    return all_in_array;
}

//
//4. window.onload
//

window.onload = function () {
    console.log(app)
    console.log("Apps' General:" + app["general"].name)
    app.displayHierarchy();

}
