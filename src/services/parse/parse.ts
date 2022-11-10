import { IAllVacancies } from "../../interfaces/IAllVacancies";
import { Djinni } from "./djinni";
import { WorkUa } from "./work-ua";

export class Parse {
  async init(searchText: string): Promise<IAllVacancies[]> {
    const [workUaVacancies, djinniVacancies] = await Promise.all([
      new WorkUa(searchText).init(),
      new Djinni(searchText).init(),
    ]);
    return [workUaVacancies, djinniVacancies];
  }
}
