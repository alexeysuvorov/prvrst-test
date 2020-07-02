import * as ClickHouse from "@apla/clickhouse"
import {ComponentsFactory} from "./componentsFactory"
import {addDays} from "../common/utils"

export async function runService(db: ClickHouse, config: any) {
    const componentsFactory = new ComponentsFactory(db, config)
    const gaClient = componentsFactory.getAnalyticsClient()
    const today = new Date()
    const yesterday = addDays(today, -1)
    const usersCount = await gaClient.getUsersCount(yesterday, today)
    console.log(usersCount)
}
