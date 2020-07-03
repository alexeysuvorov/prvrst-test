import {get as getConfig} from "config"
import * as Router from "koa-router"
import * as Koa from "koa"
import {ComponentsFactory} from "../ComponentsFactory"
import {getUTCDateNoTime} from "../../common/utils"

export function buildUserStatsRoutes(router: Router, componentsFactory: ComponentsFactory) {
    router.get('/stats', async (ctx: Koa.Context) => {
        const userStatsReader = componentsFactory.getStatsReader()
        const date = getUTCDateNoTime()
        ctx.body = await userStatsReader.getUserStats(date)
    })
}
