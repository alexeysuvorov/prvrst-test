import * as ClickHouse from "@apla/clickhouse"
import {ALIASES, encodeRow} from "../common/utils"

export interface IUserStatsWriter {
    writeUsersCountForDate(count: number, date: Date): Promise<any>
}

export class UserStatsWriter implements IUserStatsWriter{
    private static readonly tableName = "CountOfUsersByDate"

    constructor(private readonly db: ClickHouse) { }

    public async writeUsersCountForDate(count: number, date: Date): Promise<any> {
        return new Promise((complete, reject) => {
            const writableStream = this.db.query(`INSERT INTO ${UserStatsWriter.tableName} FORMAT TSV`, (err) => {
                if (err) {
                    reject(`Cannot write user stats: ${err}`)
                }
                complete()
            })

            // countOfUsers UInt32
            // today DateTime
            // updateDate DateTime
            writableStream.write(encodeRow([count, date, new Date()], ALIASES.TabSeparated))
            writableStream.end()
        })
    }
}
