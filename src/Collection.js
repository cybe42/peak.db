const CollectionManager = require("./CollectionManager.js")
  , sqlite3 = require("better-sqlite3")
  , fs = require("fs")
  , path = require("path")
  , bson = require("bson")
  , findremove = require("find-remove");

function filterCollectionName(e) {
  let t = "";
  e = e.trim()
    .toUpperCase()
    .split(" ")
    .join("_");
  for (let a = 0; a < e.length; a++) {
    let o = e.charAt(a);
    "abcdefghijklmnoprstuvyzwxqABCDEFGHIJKLMNOPRSTUVYZWXQ1234567890_".includes(o) && (t += o)
  }
  return t.substr(0, 16)
}

function filterTime(e, t = !1) {
  return e = e.toString(), !0 === t ? ("00" === e && (e = "0"), "01" === e && (e = "1"), "02" === e && (e = "2"), "03" === e && (e = "3"), "04" === e && (e = "4"), "05" === e && (e = "5"), "06" === e && (e = "6"), "07" === e && (e = "7"), "08" === e && (e = "8"), "09" === e && (e = "9")) : ("0" === e && (e = "00"), "1" === e && (e = "01"), "2" === e && (e = "02"), "3" === e && (e = "03"), "4" === e && (e = "04"), "5" === e && (e = "05"), "6" === e && (e = "06"), "7" === e && (e = "07"), "8" === e && (e = "08"), "9" === e && (e = "09")), e
}
class Collection {
  constructor(e) {
    return e && e.name ? e.name && "string" != typeof e.name ? console.error("\x1b[36mpeakdb \x1b[34m» \x1b[31mIncorrect parameter type: Collection.Name\x1b[0m") : e.id_length && "number" != typeof e.id_length ? console.error("\x1b[36mpeakdb \x1b[34m» \x1b[31mIncorrect parameter type: Collection.Id_Length\x1b[0m") : e.delete_backups_before_this_day && "number" != typeof e.delete_backups_before_this_day ? console.error("\x1b[36mpeakdb \x1b[34m» \x1b[31mIncorrect parameter type: Collection.Delete_Backups_Before_This_Day\x1b[0m") : e.auto_backup && "boolean" != typeof e.auto_backup ? console.error("\x1b[36mpeakdb \x1b[34m» \x1b[31mIncorrect parameter type: Collection.Auto_Backup\x1b[0m") : e.indicate_created_at && "boolean" != typeof e.indicate_created_at ? console.error("\x1b[36mpeakdb \x1b[34m» \x1b[31mIncorrect parameter type: Collection.Indicate_Created_At\x1b[0m") : e.indicate_created_timestamp && "boolean" != typeof e.indicate_created_timestamp ? console.error("\x1b[36mpeakdb \x1b[34m» \x1b[31mIncorrect parameter type: Collection.Indicate_Created_Timestamp\x1b[0m") : e.indicate_updated_at && "boolean" != typeof e.indicate_updated_at ? console.error("\x1b[36mpeakdb \x1b[34m» \x1b[31mIncorrect parameter type: Collection.Indicate_Updated_At\x1b[0m") : e.indicate_updated_timestamp && "boolean" != typeof e.indicate_updated_timestamp ? console.error("\x1b[36mpeakdb \x1b[34m» \x1b[31mIncorrect parameter type: Collection.Indicate_Updated_Timestamp\x1b[0m") : (e.name = filterCollectionName(e.name), console.log("\x1b[36mpeakdb \x1b[34m» \x1b[32mStarting collection '\x1b[35m" + e.name + "\x1b[32m'...\x1b[0m"), fs.mkdirSync(path.join("./", "./peakdb/Collections"), {
        recursive: !0
      }, e => console.error("\x1b[36mpeakdb \x1b[34m» \x1b[31mError creating folders.\x1b[0m")), this.db = new sqlite3("./peakdb/Collections/" + e.name + ".pea"), this.db.prepare("CREATE TABLE IF NOT EXISTS peakdb (data)")
      .run(), this.db.prepare("SELECT data FROM peakdb")
      .all()[0] || this.db.prepare("INSERT INTO peakdb (data) VALUES (?)")
      .run(bson.serialize({
        data: []
      })), console.log("\x1b[36mpeakdb \x1b[34m» \x1b[32mCollection '\x1b[35m" + e.name + "\x1b[32m' has been started.\x1b[0m"), !0 === e.auto_backup && setInterval(() => {
        fs.mkdirSync(path.join("./", "./peakdb/Backups/Collections"), {
          recursive: !0
        }, e => console.error("\x1b[36mpeakdb \x1b[34m» \x1b[31mError creating folders.\x1b[0m")), findremove("./peakdb/Backups/Collections", {
          age: {
            seconds: 86400 * (e.delete_backups_before_this_day || 3)
          }
          , extensions: [".pea"]
        });
        let t = e.name + (new Date)
          .getFullYear() + "-" + filterTime((new Date)
            .getMonth() + 1) + "-" + filterTime((new Date)
            .getDate()) + "_AUTO.pea";
        !1 === fs.existsSync("./peakdb/Backups/Collections/" + t) && this.db.backup("./peakdb/Backups/Collections/" + t)
          .then(() => {
            console.log("\x1b[36mpeakdb \x1b[34m» \x1b[32mCollection '\x1b[35m" + e.name + "\x1b[32m' is backed up with name '\x1b[35m" + t + "\x1b[32m'.\x1b[0m")
          })
          .catch(t => {
            console.error("\x1b[36mpeakdb \x1b[34m» \x1b[32mError when backup collection '\x1b[35m" + e.name + "\x1b[32m'.\x1b[0m")
          })
      }, 6e4), this.insert = (t => CollectionManager.insert(this.db, e, t)), this.find = (t => CollectionManager.find(this.db, e, t)), this.filter = (t => CollectionManager.filter(this.db, e, t)), this.update = ((t, a) => CollectionManager.update(this.db, e, t, a)), this.delete = (t => CollectionManager.delete(this.db, e, t)), void(this.backup = (() => CollectionManager.backup(this.db, e)))) : console.error("\x1b[36mpeakdb \x1b[34m» \x1b[31mNot specified: Collection.Name\x1b[0m")
  }
}
module.exports = Collection;
