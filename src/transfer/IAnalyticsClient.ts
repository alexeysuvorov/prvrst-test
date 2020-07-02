import {analyticsreporting_v4} from "googleapis"
import * as path from "path"
const { google } = require("googleapis")
import Analyticsreporting = analyticsreporting_v4.Analyticsreporting

export interface IAnalyticsClient {
    getUsersCount(startDate: Date, endDate: Date): Promise<number>
}

export interface AnalyticsConfig {
    viewId: string
}

export class AnalyticsClient implements IAnalyticsClient {
    private readonly reportingInstance: Analyticsreporting

    public constructor(private readonly siteConfig: AnalyticsConfig) {
        const auth = new google.auth.GoogleAuth({
            // It is not secure to store keyfile in a SVC, but I want to make it simple for now
            keyFile: path.join(__dirname, "../../service-account.keys.json"),
            scopes: "https://www.googleapis.com/auth/analytics",
        });

        this.reportingInstance = google.analyticsreporting({
            version: 'v4',
            auth: auth
        })
    }

    public async getUsersCount(startDate: Date, endDate: Date): Promise<number> {
        const request = AnalyticsClient.bakeRequest(this.siteConfig.viewId, startDate, endDate)
        const { data } = await this.reportingInstance.reports.batchGet(request)
        if(!data.reports || data.reports.length === 0) {
            throw new Error(`No reports returned for dates ${startDate} to ${endDate}`)
        }
        const { totals } = data.reports[0].data
        return parseInt(totals[0].values[0])
    }

    // Actually GA provides all required functions to calculate both grow in % from yesterday and median for 7 days
    // But we are supposed to use our own database in this case
    private static bakeRequest(viewId: string, startDate: Date, endDate: Date): any {
        return  {
            requestBody: {
                reportRequests: [
                    {
                        viewId,
                        dateRanges: [
                            {
                                startDate: startDate.toISOString().split('T')[0],
                                endDate: endDate.toISOString().split('T')[0]
                            }
                        ],
                        metrics: [
                            {
                                expression: 'ga:users',
                            },
                        ],
                    },
                ],
            },
        }
    }
}
