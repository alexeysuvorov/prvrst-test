import * as config from "config"
import * as ClickHouse from "@apla/clickhouse"
import { initClickhouseConnection } from "../common/initClickhouseConnection"
import { runService } from "./service"

const colors = require('colors')

function unhandledRejection(error, promise) {
  console.error("ERROR PROCESSING: ", error, promise)
}

function uncaughtException(error) {
  console.error("ERROR PROCESSING: ", error)
}

process.on("uncaughtException", uncaughtException)
process.on("unhandledRejection", unhandledRejection)

const clickHouse: ClickHouse = initClickhouseConnection(config)

runService(clickHouse, config)
    .then( () => {
      console.log("Transfer completed")
      process.exit(0)
    })
    .catch((e) => {
      console.log(colors.red(e))
      process.exit(1)
    })
