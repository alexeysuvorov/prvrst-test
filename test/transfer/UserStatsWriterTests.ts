import { expect } from "chai"
import * as config from "config"

import {initClickhouseConnection} from "../../src/common/connections/initClickhouseConnection"
import {UserStatsWriter} from "../../src/transfer/IUserStatsWriter"
import {getUTCDateNoTime} from "../../src/common/utils"

const db = initClickhouseConnection(config)

describe("User stats writer", async () => {
    beforeEach(async () => {
        await new Promise((complete, reject) => {
            db.query("ALTER TABLE CountOfUsersByDate DELETE WHERE 1=1", () => {
                complete()
            })
        })
        // required to give DB time for cleanup
        return new Promise((resolve) => {
            setTimeout(resolve, 500);
        });
    })

    // requirements for multiple run on the same date is not specified, so I don't test duplicates and etc.
    it("Should successfully write", async () => {
        const component = new UserStatsWriter(db)
        const date = getUTCDateNoTime()

        await component.writeUsersCountForDate(100500, date)

        const { data } = await db.querying("SELECT countOfUsers, toUInt64(today) as today FROM CountOfUsersByDate")

        expect(data.length).eq(1)
        expect(data[0].countOfUsers).eq(100500)
        expect(parseInt(data[0].today)).eq(date.getTime() / 1000)
    })
})
