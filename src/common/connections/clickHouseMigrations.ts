import {promises as fsp} from "fs"
import * as path from "path"
import * as ClickHouse from "@apla/clickhouse"

interface IMigrationFileModel {
    name: string,
    fileName: string
}

const extension = ".migration.sql"
const tableName = "_migrations"

export async function migrate(db: ClickHouse, dir: string){
    const files = await fsp.readdir(dir)
    const migrationFiles = files.filter(x => x.endsWith(extension))
        .map(x => {
            return {
                name: x.substr(0, x.length - extension.length),
                fileName: path.join(dir, x)
            } as IMigrationFileModel
        })

    // create if doesn't exists
    const sql =
            `
            create table if not exists ${tableName} ( version String )
            ENGINE = MergeTree()
            ORDER BY version
            `

    await db.querying(sql)
    // pool.execute("CREATE TABLE IF NOT EXISTS _migrations (version char(20) not null, sequence int PRIMARY KEY AUTO_INCREMENT)")

    const {data} = await db.querying(`select version from ${tableName}`)
    const records = data.map(x => x.version)

    const migrationsToRun = migrationFiles.filter(x => records.indexOf(x.name) < 0)
        .sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))

    if(migrationsToRun.length === 0) {
        console.log("No new migrations")
        return
    }

    console.log("Run migrations")

    for await (const migration of migrationsToRun) {
        const content = await fsp.readFile(migration.fileName, 'utf8')
        console.log(`Execute migration ${migration.name}`)
        await db.querying(content)
    }

    return new Promise((complete, reject) => {
        const writableStream = db.query(`INSERT INTO ${tableName} FORMAT TSV`, (err) => {
            if (err) {
                reject(`Cannot save executed migrations: ${err}`)
            }
            complete()
        })

        for (const migration of migrationsToRun) {
            writableStream.write([migration.name])
        }

        writableStream.end()
    })
}
