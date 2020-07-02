import { expect } from "chai"
import { get as getConfig } from "config"
import { createPool, PoolOptions } from "mysql2/promise"

describe("Log environment variables", async () => {
    it("Test environment should be selected", async () => {
        const environment = getConfig<string>("environment")
        expect(environment).eq("test")
    })
})
