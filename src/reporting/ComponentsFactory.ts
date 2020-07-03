import * as ClickHouse from "@apla/clickhouse"
import {IUsersReportComposer, UsersReportComposer} from "./IUsersReportComposer"

export class ComponentsFactory {
    private readonly dataAccessor = null

    public constructor(private readonly db: ClickHouse,
                       private readonly config: any) { }

    public getStatsReader(): IUsersReportComposer {
        return new UsersReportComposer(this.dataAccessor)
    }
}
