/*
    main.ts
    missmp_army_ranking
    Frontend assignment
    by Peter Stadler
    05.07.2023, 22:45 Uhr
*/

interface Officer {
    readonly id: number;
    readonly name: string;
    subordinates: Officer[]
    }
    
interface ArmyRankingApp {
    general: Officer
    moveOfficer(officerID: number, managerID: number): void
    undo(): void
    redo(): void
    }
    