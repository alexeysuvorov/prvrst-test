import {get as getConfig} from "config"
import * as Router from "koa-router"
import * as Koa from "koa"

export function buildCommonRoutes(router: Router) {
    router.get('/', (ctx: Koa.Context) => {
        const { version } = getConfig("app")
        ctx.body =  {
            status: `User stats reporting server: ${version}`
        }
    })
}
