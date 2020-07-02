import { expect } from "chai"
import { get as getConfig } from "config"

describe("Log environment variables", async () => {
    it("Test environment should be selected", async () => {
        const environment = getConfig<string>("environment")
        expect(environment).eq("test")
    })
})
