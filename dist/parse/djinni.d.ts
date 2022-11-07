import { IAllVacancies } from "../models/IAllVacancies";
export declare class Djinni {
    searchText: string;
    constructor(searchText: string);
    init(): Promise<IAllVacancies>;
    private getAllVacancies;
    private createLinks;
    private formatLinks;
    private formatSearchText;
}
