import { expect } from "chai"
import * as config from "config"

import {initClickhouseConnection} from "../../src/common/connections/initClickhouseConnection"
import {UserStatsWriter} from "../../src/transfer/IUserStatsWriter"
import {addDays, ALIASES, encodeRow, getUTCDateNoTime} from "../../src/common/utils"
import {UsersStatsDataAccessor} from "../../src/reporting/IUsersStatsDataAccessor"

const db = initClickhouseConnection(config)

describe("User stats data accessor", async () => {
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

    it("Should return users stats for date range", async () => {
        const date = getUTCDateNoTime()
        const dateFrom = addDays(date, -10)

        await new Promise((complete, reject) => {
            const writableStream = db.query(`INSERT INTO CountOfUsersByDate FORMAT TSV`, (err) => {
                if (err) {
                    reject(`Cannot write user stats: ${err}`)
                    return
                }
                complete()
            })

            for(let i = 0; i < 10; i++) {
                const dateX = addDays(date, -1 * i)
                writableStream.write(encodeRow([i + 10, dateX, new Date()], ALIASES.TabSeparated))
            }

            writableStream.end()
        })

        const component = new UsersStatsDataAccessor(db)
        const res = await component.getUsersCountByDateRange(dateFrom, date)

        expect(res.length).eq(10)
        expect(res).eql([19,18,17,16,15,14,13,12,11,10])
    })

    it("Should return median", async () => {
        const date = getUTCDateNoTime()
        const dateFrom = addDays(date, -10)

        await new Promise((complete, reject) => {
            const writableStream = db.query(`INSERT INTO CountOfUsersByDate FORMAT TSV`, (err) => {
                if (err) {
                    reject(`Cannot write user stats: ${err}`)
                    return
                }
                complete()
            })

            for(let i = 0; i < 10; i++) {
                const dateX = addDays(date, -1 * i)
                writableStream.write(encodeRow([i + 10, dateX, new Date()], ALIASES.TabSeparated))
            }

            writableStream.end()
        })

        const component = new UsersStatsDataAccessor(db)
        const res = await component.getMediaForDateRange(dateFrom, date)

        expect(res).eql(15)
    })
})
