// utils
import {get as getConfig} from "config"
import * as path from "path"


export function unhandledRejection(error, promise) {
  console.error(colors.red("ERROR PROCESSING: ", error, promise))
}

export function uncaughtException(error) {
  console.error(colors.red("ERROR PROCESSING: ", error))
}

process.on("uncaughtException", uncaughtException)
process.on("unhandledRejection", unhandledRejection)


const colors = require('colors')



// interface ServerConfig {
//   port: number
// }
//
// // const initDb = new InitialDbSetup(app)
// // await initDb.initDatabase()
//
// const serverConfig = getConfig<ServerConfig>("server")

// console.log(colors.green(`- Server running on port ${serverConfig.port}`))

// init()
//   .then(() => {
//     console.log(colors.green("- Application is up and running"))
//   })
//   .catch(err => {
//     console.log(colors.red(`Cannot create app: ${err}`))
//     process.exit(1)
//   })
