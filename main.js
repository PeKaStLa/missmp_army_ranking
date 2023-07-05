/*
    main.ts
    missmp_army_ranking
    Frontend assignment
    by Peter Stadler
    05.07.2023, 22:45 Uhr
*/
var test4 = "main.ts works test3";
console.log(test4);
/*
interface Officer {
    readonly id: number;
    readonly name: string;
    subordinates: Officer[]
}*/
var Officer = /** @class */ (function () {
    function Officer(id, name) {
        this.id = id;
        this.name = name;
    }
    return Officer;
}());
var officers = [];
officers.push(new Officer(12, "Peter"));
officers.push(new Officer(14, "An"));
officers.push(new Officer(16, "Johannes"));
officers.forEach(function (element) {
    console.log(element.name);
});
