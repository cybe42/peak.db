let Debug = true;

function _error(...inp) { if(Debug) { console.error(...inp) } }
function _log(...inp) { if(Debug) { console.log(...inp) } }


const sqlite3 = require("better-sqlite3")
  , fs = require("fs")
  , path = require("path")
  , bson = require("bson")
  , {
    nanoid: nanoid
  } = require("nanoid");

function isJSON(e) {
  if ("object" == typeof e && null !== e) return !0;
  try {
    JSON.parse(e)
  } catch (e) {
    return !1
  }
  return !0
}

function filterTime(e, a = !1) {
  return e = e.toString(), !0 === a ? ("00" === e && (e = "0"), "01" === e && (e = "1"), "02" === e && (e = "2"), "03" === e && (e = "3"), "04" === e && (e = "4"), "05" === e && (e = "5"), "06" === e && (e = "6"), "07" === e && (e = "7"), "08" === e && (e = "8"), "09" === e && (e = "9")) : ("0" === e && (e = "00"), "1" === e && (e = "01"), "2" === e && (e = "02"), "3" === e && (e = "03"), "4" === e && (e = "04"), "5" === e && (e = "05"), "6" === e && (e = "06"), "7" === e && (e = "07"), "8" === e && (e = "08"), "9" === e && (e = "09")), e
}
module.exports = {
  insert: (e, a, r) => {
    if (!r) return _error("\x1b[36mpeakdb \x1b[34m» \x1b[31mNot specified: Collection.Insert(Params)\x1b[0m");
    if (!1 === isJSON(r)) return _error("\x1b[36mpeakdb \x1b[34m» \x1b[31mInvalid parameters: Collection.Insert(Params)\x1b[0m");
    let t = bson.deserialize(e.prepare("SELECT * FROM peakdb")
        .all()[0].data)
      .data
      , n = r._id || nanoid(a.id_length || 32)
      , i = t.find(e => e._id === n)
      , o = {
        _id: n
        , _updated: !1
      };
    return i ? _error("\x1b[36mpeakdb \x1b[34m» \x1b[31mDocument with this ID already exists: " + n + "\x1b[0m") : (!0 === a.indicate_created_at && (o._created_at = new Date), !0 === a.indicate_created_timestamp && (o._created_timestamp = Date.now()), o = Object.assign(o, r), t.push(o), e.prepare("UPDATE peakdb SET data = (?)")
      .run(bson.serialize({
        data: t
      })), o)
  }
  , find: (e, a, r) => {
    if (!r) return _error("\x1b[36mpeakdb \x1b[34m» \x1b[31mNot specified: Collection.Find(Params)\x1b[0m");
    if ("function" != typeof r) return _error("\x1b[36mpeakdb \x1b[34m» \x1b[31mInvalid parameters: Collection.Find(Params)\x1b[0m");
    let t = bson.deserialize(e.prepare("SELECT * FROM peakdb")
        .all()[0].data)
      .data.find(r);
    return t || _error("\x1b[36mpeakdb \x1b[34m» \x1b[31mDocument not found.\x1b[0m")
  }
  , filter: (e, a, r) => {
    if (!r) return _error("\x1b[36mpeakdb \x1b[34m» \x1b[31mNot specified: Collection.Filter(Params)\x1b[0m");
    if ("function" != typeof r) return _error("\x1b[36mpeakdb \x1b[34m» \x1b[31mInvalid parameters: Collection.Filter(Params)\x1b[0m");
    let t = bson.deserialize(e.prepare("SELECT * FROM peakdb")
        .all()[0].data)
      .data.filter(r);
    return t || _error("\x1b[36mpeakdb \x1b[34m» \x1b[31mDocuments not found.\x1b[0m")
  }
  , update: (e, a, r, t) => {
    if (!r) return _error("\x1b[36mpeakdb \x1b[34m» \x1b[31mNot specified: Collection.Update(Id, ...)\x1b[0m");
    if (!t) return _error("\x1b[36mpeakdb \x1b[34m» \x1b[31mNot specified: Collection.Update(..., Params)\x1b[0m");
    if (!1 === isJSON(t)) return _error("\x1b[36mpeakdb \x1b[34m» \x1b[31mInvalid parameters: Collection.Update(..., Params)\x1b[0m");
    let n = bson.deserialize(e.prepare("SELECT * FROM peakdb")
        .all()[0].data)
      .data
      , i = n.find(e => e._id === r)
      , o = {
        _id: r
        , _updated: !0
      };
    return i ? (i._created_at && (o._created_at = i._created_at), i._created_timestamp && (o._created_timestamp = i._created_timestamp), !0 === a.indicate_updated_at && (o._updated_at = new Date), !0 === a.indicate_updated_timestamp && (o._updated_timestamp = Date.now()), o = Object.assign(o, t), n[n.indexOf(i)] = o, e.prepare("UPDATE peakdb SET data = (?)")
      .run(bson.serialize({
        data: n
      })), o) : _error("\x1b[36mpeakdb \x1b[34m» \x1b[31mInvalid document ID: " + r + "\x1b[0m")
  }
  , delete: (e, a, r) => {
    if (!r) return _error("\x1b[36mpeakdb \x1b[34m» \x1b[31mNot specified: Collection.Delete(Id)\x1b[0m");
    let t = bson.deserialize(e.prepare("SELECT * FROM peakdb")
        .all()[0].data)
      .data
      , n = t.find(e => e._id === r);
    return n ? (t.splice(t.indexOf(n), 1), e.prepare("UPDATE peakdb SET data = (?)")
      .run(bson.serialize({
        data: t
      })), !0) : _error("\x1b[36mpeakdb \x1b[34m» \x1b[31mInvalid document ID: " + r + "\x1b[0m")
  }
  , backup: (e, a) => {
    fs.mkdirSync(path.join("./", "./peakdb/Backups/Collections"), {
      recursive: !0
    }, e => _error("\x1b[36mpeakdb \x1b[34m» \x1b[31mError creating folders.\x1b[0m"));
    let r = a.name + (new Date)
      .getFullYear() + "-" + filterTime((new Date)
        .getMonth() + 1) + "-" + filterTime((new Date)
        .getDate()) + "_" + filterTime((new Date)
        .getHours()) + filterTime((new Date)
        .getMinutes()) + ".pea";
    return !1 === fs.existsSync("./peakdb/Backups/Collections/" + r) && e.backup("./peakdb/Backups/Collections/" + r)
      .then(() => {
        _log("\x1b[36mpeakdb \x1b[34m» \x1b[32mCollection '\x1b[35m" + a.name + "\x1b[32m' is backed up with name '\x1b[35m" + r + "\x1b[32m'.\x1b[0m")
      })
      .catch(e => {
        _error("\x1b[36mpeakdb \x1b[34m» \x1b[32mError when backup collection '\x1b[35m" + a.name + "\x1b[32m'.\x1b[0m")
      }), !0
  }
};
