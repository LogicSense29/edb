const cron = require("cron");

const dt = cron.sendAt("0 0 * * *");
console.log(`The job would run at: ${dt.toISO()}`);
