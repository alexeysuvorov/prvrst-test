import * as ClickHouse from "@apla/clickhouse"
import * as path from "path"
const { google } = require('googleapis')

const analyticsreporting = google.analyticsreporting('v4')

class ComponentsFactory {
    public constructor(private readonly db: ClickHouse, private readonly config: any) {}
}

export async function runService(db: ClickHouse, config: any) {
    console.log("transfer service")

    const auth = new google.auth.GoogleAuth({
        // It is unsecure to store keyfile in source contol, but I want to make it simple for now
        keyFile: path.join(__dirname, '../../service-account.keys.json'),
        scopes: "https://www.googleapis.com/auth/analytics",
    });

    google.options({auth});

    const res = await analyticsreporting.reports.batchGet({
        requestBody: {
            reportRequests: [
                {
                    viewId: '123808379',
                    dateRanges: [
                        {
                            startDate: '2018-03-17',
                            endDate: '2018-03-24',
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
    });

    console.log(res.data);
    // return res.data;

    // const componentFactory = new ComponentsFactory(db, config)
}
