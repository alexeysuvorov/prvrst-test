import * as ClickHouse from "@apla/clickhouse"
import {AnalyticsClient, IAnalyticsClient} from "./IAnalyticsClient"
import {IUserStatsWriter, UserStatsWriter} from "./IUserStatsWriter"

// I would prefer to have DI instead, but there is no good DI for the moment
// In real project it is the place when all dependencies are connected with each other
export class ComponentsFactory {
    public constructor(private readonly db: ClickHouse,
                       private readonly config: any) {
    }

    public getAnalyticsClient(): IAnalyticsClient {
        return new AnalyticsClient(this.config.ga)
    }

    public getStatsWriter(): IUserStatsWriter {
        return new UserStatsWriter(this.db)
    }
}
