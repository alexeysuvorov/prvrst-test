import {get as getConfig} from "config"
import * as path from "path"

export function unhandledRejection(error, promise) {
  console.error("ERROR PROCESSING: ", error, promise)
}

export function uncaughtException(error) {
  console.error("ERROR PROCESSING: ", error)
}

process.on("uncaughtException", uncaughtException)
process.on("unhandledRejection", unhandledRejection)

