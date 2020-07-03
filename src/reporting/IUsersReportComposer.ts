import {IUsersStatsDataAccessor} from "./IUsersStatsDataAccessor"
import {addDays} from "../common/utils"

export interface UsersStats {
    todayUsers: number
    growthInPercent: number
    medianForLastSevenDays: number
}

export interface IUsersReportComposer {
    getUserStats(date: Date): Promise<UsersStats>
}

export class UsersReportComposer implements IUsersReportComposer {
    constructor(private readonly dataAccessor: IUsersStatsDataAccessor) { }

    public async getUserStats(date: Date): Promise<UsersStats> {
        const dayBefore = addDays(date, -1)
        const [yesterdayCount, todayCount] = await this.dataAccessor.getUsersCountByDateRange(dayBefore, date)

        const growth = yesterdayCount > 0 ?
            (todayCount - yesterdayCount) / yesterdayCount * 100 :
            Math.min(100, todayCount * 100)

        const median = await this.dataAccessor.getMediaForDateRange(addDays(date, -7), date)

        return {
            todayUsers: todayCount,
            growthInPercent: Math.round(growth),
            medianForLastSevenDays: median
        }
    }
}
