import { expect } from "chai"
import * as config from "config"

import {initClickhouseConnection} from "../../src/common/connections/initClickhouseConnection"
import {UserStatsWriter} from "../../src/transfer/IUserStatsWriter"
import {getUTCDateNoTime} from "../../src/common/utils"

const db = initClickhouseConnection(config)

describe("User stats writer", async () => {
    beforeEach(async () => {
        await db.querying("ALTER TABLE CountOfUsersByDate DELETE WHERE 1=1")
    })

    it("Should successfully write", async () => {
        const component = new UserStatsWriter(db)
        const date = getUTCDateNoTime()

        await component.writeUsersCountForDate(100500, date)

        const { data } = await db.querying("select countOfUsers, today from CountOfUsersByDate")
        expect(data.length).eq(1)
        expect(data[0]).eql({ countOfUsers: 100500, today: '2020-07-02 00:00:00' })
    })
})
