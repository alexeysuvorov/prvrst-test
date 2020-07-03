import {expect} from 'chai'
import {Arg, Substitute} from "@fluffy-spoon/substitute"
import {IUsersStatsDataAccessor} from "../../src/reporting/IUsersStatsDataAccessor"
import {UsersReportComposer} from "../../src/reporting/IUsersReportComposer"
import {addDays, getUTCDateNoTime} from "../../src/common/utils"

describe("Users report composer", async () => {
    it("Should calculate growth correctly", async () => {
        await checkGrowth(5,10,100)
        await checkGrowth(0,0,0)
        await checkGrowth(10,0,-100)
        await checkGrowth(10,10,0)
        await checkGrowth(100,105,5)
        await checkGrowth(10,5,-50)
    })

    it("Should set median correctly", async () => {
        const daStub = Substitute.for<IUsersStatsDataAccessor>()
        daStub.getUsersCountByDateRange(Arg.any(), Arg.any())
            .returns(Promise.resolve([0, 0]))

        daStub.getMediaForDateRange(Arg.any(), Arg.any()).returns(Promise.resolve(100500))

        const component = new UsersReportComposer(daStub)
        const res = await component.getUserStats(new Date())
        expect(res.medianForLastSevenDays).eq(100500)
    })

    it("Should calculate median date range correctly", async () => {
        const date = getUTCDateNoTime()

        const daStub = Substitute.for<IUsersStatsDataAccessor>()
        daStub.getUsersCountByDateRange(Arg.any(), Arg.any())
            .returns(Promise.resolve([0, 0]))

        daStub.getMediaForDateRange(addDays(date, -7), date).returns(Promise.resolve(100500))

        const component = new UsersReportComposer(daStub)
        await component.getUserStats(date)

        daStub.received(1).getMediaForDateRange(addDays(date, -7), date)
    })

    const checkGrowth = async function(yesterday: number, today: number, growth: number) {
        const daStub = Substitute.for<IUsersStatsDataAccessor>()
        daStub.getUsersCountByDateRange(Arg.any(), Arg.any())
            .returns(Promise.resolve([yesterday, today]))
        daStub.getMediaForDateRange(Arg.any(), Arg.any()).returns(Promise.resolve(100500))
        const component = new UsersReportComposer(daStub)
        const res = await component.getUserStats(new Date())
        expect(res.growthInPercent).eq(growth)
    }
})
