import { expect } from "chai"
import * as config from "config"

import {initClickhouseConnection} from "../../src/common/connections/initClickhouseConnection"
import {UserStatsWriter} from "../../src/transfer/IUserStatsWriter"
import {getUTCDateNoTime} from "../../src/common/utils"

const db = initClickhouseConnection(config)

describe("User stats data accessor", async () => {
    // requirements for multiple run on the same date is not specified, so I don't test duplicates and etc.
    it("Should return", async () => {
        const component = new UserStatsWriter(db)
        const date = getUTCDateNoTime()

        await component.writeUsersCountForDate(100500, date)

        const { data } = await db.querying("SELECT countOfUsers, toUInt64(today) as today FROM CountOfUsersByDate")

        await db.querying("ALTER TABLE CountOfUsersByDate DELETE WHERE 1=1")

        expect(data.length).eq(1)
        expect(data[0].countOfUsers).eq(100500)
        expect(parseInt(data[0].today)).eq(date.getTime() / 1000)
    })
})
