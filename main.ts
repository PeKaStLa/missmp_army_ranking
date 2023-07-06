/*
    main.ts
    missmp_army_ranking
    Frontend assignment
    by Peter Stadler
    05.07.2023, 22:45 Uhr
*/

let test4: string = "main.ts works test3";
console.log(test4);

let officers: Array<Officer> = [];


/*
interface Officer {
    readonly id: number;
    readonly name: string;
    subordinates: Officer[]
}*/

class Officer {
    id: number;
    name: string;
    subordinates: Officer[];

    constructor(id: number, name: string) {
        this.id =  id;
        this.name = name;
      }
}

interface ArmyRankingApp {
    general: Officer
    moveOfficer(officerID: number, managerID: number): void
    undo(): void
    redo(): void
}

function createOfficer(){
    let id = officers.length + 1;
    let name = (<HTMLInputElement>document.getElementById('name')).value;
    officers.push(new Officer(id, name));
    printAllOfficers();
    (<HTMLInputElement>document.getElementById('name')).value = "";

}



//initial test objects
officers.push(new Officer(1, "Peter"));
officers.push(new Officer(2, "An"));
officers.push(new Officer(3, "Johannes"));

function printAllOfficers(){
officers.forEach(element => {
    console.log(element.name, element.id);
});
}
