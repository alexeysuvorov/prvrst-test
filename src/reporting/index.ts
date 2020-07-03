import * as config from "config"
import * as ClickHouse from "@apla/clickhouse"

import {runReportingService} from "./service"
import {initClickhouseConnection} from "../common/connections/initClickhouseConnection"

const colors = require('colors')

export function unhandledRejection(error, promise) {
    console.error("ERROR PROCESSING: ", error, promise)
}

export function uncaughtException(error) {
    console.error("ERROR PROCESSING: ", error)
}

process.on("uncaughtException", uncaughtException)
process.on("unhandledRejection", unhandledRejection)

const clickHouse: ClickHouse = initClickhouseConnection(config)

runReportingService(clickHouse, config)
    .then(() => {
        console.log("Application is up and running")
    })
    .catch((e) => {
        console.log(colors.red(e))
        process.exit(1)
    })
