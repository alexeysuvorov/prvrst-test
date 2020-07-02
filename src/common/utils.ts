export function addDays(date: Date, days: number): Date {
    const tmp = new Date(date.valueOf())
    tmp.setDate(date.getDate() + days)
    return tmp
}

export function getUTCDateNoTime(date: Date = new Date()): Date {
    date.setUTCHours(0, 0, 0, 0)
    return date
}

// part of alpha driver
const SEPARATORS = {
    TSV: "\t",
    CSV: ",",
    Values: ","
}

export const ALIASES = {
    TabSeparated: "TSV"
}

const ESCAPE_STRING = {
    TSV: function (v, quote) {return v.replace (/\\/g, '\\\\').replace(/\t/g, '\\t').replace(/\n/g, '\\n')},
    CSV: function (v, quote) {return v.replace (/\"/g, '""')},
}

const ESCAPE_NULL = {
    TSV: "\\N",
    CSV: "\\N",
    Values: "\\N",
    // JSONEachRow: "\\N",
}

function encodeValue (quote, v, format) {
    format = ALIASES[format] || format;

    switch (typeof v) {
        case 'string':
            return ESCAPE_STRING[format] ? ESCAPE_STRING[format] (v, quote) : v;
        case 'number':
            if (isNaN (v))
                return 'nan';
            if (v === +Infinity)
                return '+inf';
            if (v === -Infinity)
                return '-inf';
            if (v === Infinity)
                return 'inf';
            return v;
        case 'object':
            // clickhouse allows to use unix timestamp in seconds
            if (v instanceof Date)
                return ("" + v.valueOf ()).substr (0, 10);
            // you can add array items
            if (v instanceof Array)
                return v.map (function(item) {
                    return encodeValue(true, item, format);
                })
            // TODO: tuples support
            if (!format) console.trace ();
            if (v === null)
                return format in ESCAPE_NULL ? ESCAPE_NULL[format] : v;

            return format in ESCAPE_NULL ? ESCAPE_NULL[format] : v;
        case 'boolean':
            return v === true ? 1 : 0;
    }
}

export function encodeRow (row, format) {
    format = ALIASES[format] || format;

    let encodedRow

    if (Array.isArray (row)) {
        encodedRow = row.map (function (field) {
            return encodeValue (false, field, format);
        }.bind (this)).join (SEPARATORS[format]) + "\n";
    } else if (row.toString () === "[object Object]" && format === "JSONEachRow") {
        encodedRow = JSON.stringify (Object.keys (row).reduce (function (encodedRowObject, k) {
            encodedRowObject[k] = encodeValue (false, row[k], format);
            return encodedRowObject;
        }.bind (this), {})) + "\n";
    }

    return encodedRow;
}
