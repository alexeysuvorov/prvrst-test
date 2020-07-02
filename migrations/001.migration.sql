create table if not exists CountOfUsersByDate (
    countOfUsers UInt32,
    today DateTime,
    updateDate DateTime
)
ENGINE = MergeTree()
PARTITION BY toYYYYMM(today)
ORDER BY today;
