import * as ClickHouse from "@apla/clickhouse"

export function initClickhouseConnection(config): ClickHouse {
    const credentials = JSON.parse(config.get("clickhouse.credentials"))
    credentials.dataObjects = true
    credentials.readonly = false
    return new ClickHouse(credentials)
}
