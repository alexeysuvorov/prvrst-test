export interface IUsersStatsDataAccessor {
    getUsersCountByDateRange(dateFrom: Date, dateTo: Date): Promise<number[]>

    // since is it only 7 days we can make it anywhere in app or in DB
    // I decided to make it in DB
    getMediaForDateRange(dateFrom: Date, dateTo: Date): Promise<number>
}

export class UsersStatsDataAccessor implements IUsersStatsDataAccessor{
    getMediaForDateRange(dateFrom: Date, dateTo: Date): Promise<number> {
        return Promise.resolve(0);
    }

    getUsersCountByDateRange(dateFrom: Date, dateTo: Date): Promise<number[]> {
        return Promise.resolve([]);
    }
}
