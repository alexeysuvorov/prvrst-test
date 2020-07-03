import * as ClickHouse from "@apla/clickhouse"
import * as path from "path"
import * as Koa from 'koa'
import * as Router from 'koa-router'
import {oas} from 'koa-oas3'
import {buildCommonRoutes} from "./routes/common"
import {buildUserStatsRoutes} from "./routes/userStats"
import {ComponentsFactory} from "./componentsFactory"
import koaBody = require("koa-body")

const swaggerCombine = require('swagger-combine')

export async function runReportingService(db: ClickHouse, config: any) {
    const server = new Koa()
    const router = new Router()

    const pathToOpenApi = path.resolve(process.cwd() + "/schemas/openapi.yml")
    const openApiSchema = await swaggerCombine(pathToOpenApi)
    
    server.use(koaBody())

    server.use(oas({
        spec: openApiSchema,
        endpoint: '/openapi.json',
        uiEndpoint: '/doc',
    }))

    const cp = new ComponentsFactory(db)
    
    await buildCommonRoutes(router)
    await buildUserStatsRoutes(router, cp)

    const serverConfig = config.get("reporting_server")
    server.use(router.routes())
    server.listen(process.env.PORT || serverConfig.port)

    console.log(`- Server running on port ${serverConfig.port}`)
}
