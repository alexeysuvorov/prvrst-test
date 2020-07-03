import * as ClickHouse from "@apla/clickhouse"
import {dateToClickHouseYYYYMMDD, daysBetween} from "../common/utils"

export interface IUsersStatsDataAccessor {
    getUsersCountByDateRange(dateFrom: Date, dateTo: Date): Promise<number[]>

    // since is it only 7 days we can make it anywhere in app or in DB
    // I decided to make it in DB
    getMediaForDateRange(dateFrom: Date, dateTo: Date): Promise<number>
}

export class UsersStatsDataAccessor implements IUsersStatsDataAccessor {
    constructor(private readonly db: ClickHouse) {}

    public async getMediaForDateRange(dateFrom: Date, dateTo: Date): Promise<number> {
        const sqlDateFrom = dateToClickHouseYYYYMMDD(dateFrom)
        const sqlDateTo = dateToClickHouseYYYYMMDD(dateTo)

        // https://clickhouse.tech/docs/en/sql-reference/aggregate-functions/reference/median/
        const sql =
            `
            select medianExact(countOfUsers) as median
            from CountOfUsersByDate
            where toYYYYMMDD(today) between ${sqlDateFrom} and ${sqlDateTo}
            `
        const { data } = await this.db.querying(sql)

        return data[0].median
    }

    // It is pretty clear this method will return wrong result when there is not enough data for previous days.
    // Keep it as is for now.
    public async getUsersCountByDateRange(dateFrom: Date, dateTo: Date): Promise<number[]> {
        const sqlDateFrom = dateToClickHouseYYYYMMDD(dateFrom)
        const sqlDateTo = dateToClickHouseYYYYMMDD(dateTo)

        const sql =
            `
            select countOfUsers
            from CountOfUsersByDate
            where toYYYYMMDD(today) between ${sqlDateFrom} and ${sqlDateTo}
            order by today
            `
        const { data } = await this.db.querying(sql)

        return data.length === 0 ? [] : data.map(x => x.countOfUsers)
    }
}
