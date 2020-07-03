import * as ClickHouse from "@apla/clickhouse"
import {ComponentsFactory} from "./componentsFactory"
import {migrate as migrateClickHouse} from "../common/connections/ClickHouseMigrations"
import * as path from "path"
import {addDays, getUTCDateNoTime} from "../common/utils"

export async function runTransferService(db: ClickHouse, config: any) {
    // Usually migrations are supposed to run as separated short lived instance
    // when DB schema changes. To save time will run it each time.
    await migrateClickHouse(db, path.join(__dirname, "../../migrations"))

    const componentsFactory = new ComponentsFactory(db, config)

    const gaClient = componentsFactory.getAnalyticsClient()

    const today = getUTCDateNoTime()
    const yesterday = addDays(today, -1)
    const usersCount = await gaClient.getUsersCount(yesterday, today)

    const writer = componentsFactory.getStatsWriter()
    await writer.writeUsersCountForDate(usersCount, today)
}
