import {AnalyticsClient, IAnalyticsClient} from "./IAnalyticsClient"
import * as ClickHouse from "@apla/clickhouse"

export class ComponentsFactory {
    public constructor(private readonly db: ClickHouse,
                       private readonly config: any) {
    }

    public getAnalyticsClient(): IAnalyticsClient {
        const gaCfg = this.config.ga
        return new AnalyticsClient(gaCfg)
    }
}
