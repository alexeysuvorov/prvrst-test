import * as ClickHouse from "@apla/clickhouse"
import {IUsersReportComposer, UsersReportComposer} from "./IUsersReportComposer"
import {UsersStatsDataAccessor} from "./IUsersStatsDataAccessor"

export class ComponentsFactory {
    private readonly dataAccessor = new UsersStatsDataAccessor(this.db)

    public constructor(private readonly db: ClickHouse) { }

    public getStatsReader(): IUsersReportComposer {
        return new UsersReportComposer(this.dataAccessor)
    }
}
