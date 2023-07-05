/*
    main.ts
    missmp_army_ranking
    Frontend assignment
    by Peter Stadler
    05.07.2023, 22:45 Uhr
*/

let test4: string = "main.ts works test3";
console.log(test4);

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


let officers: Array<Officer> = [];

//initial test objects
officers.push(new Officer(12, "Peter"));
officers.push(new Officer(14, "An"));
officers.push(new Officer(16, "Johannes"));

officers.forEach(element => {
    console.log(element.name);
});
