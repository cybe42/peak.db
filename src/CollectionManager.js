const sqlite3 = require("better-sqlite3"),
  fs = require("fs"),
  path = require("path"),
  bson = require("bson"),
  {
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
    if (!r) return console.error("\x1b[36mpeakdb \x1b[34m» \x1b[31mNot specified: Collection.Insert(Params)\x1b[0m");
    if (!1 === isJSON(r)) return console.error("\x1b[36mpeakdb \x1b[34m» \x1b[31mInvalid parameters: Collection.Insert(Params)\x1b[0m");
    let t = bson.deserialize(e.prepare("SELECT * FROM peakdb").all()[0].data).data,
      i = r._id || nanoid(a.id_length || 32),
      n = t.find(e => e._id === i),
      o = {
        _id: i,
        _updated: !1
      };
    return n ? console.error("\x1b[36mpeakdb \x1b[34m» \x1b[31mDocument with this ID already exists: " + r._id + "\x1b[0m") : (!0 === a.indicate_created_at && (o._created_at = new Date), !0 === a.indicate_created_timestamp && (o._created_timestamp = Date.now()), o = Object.assign(o, r), t.push(o), e.prepare("UPDATE peakdb SET data = (?)").run(bson.serialize({
      data: t
    })), o)
  },
  find: (e, a, r) => {
    if (!r) return console.error("\x1b[36mpeakdb \x1b[34m» \x1b[31mNot specified: Collection.Find(Params)\x1b[0m");
    if ("function" != typeof r) return console.error("\x1b[36mpeakdb \x1b[34m» \x1b[31mInvalid parameters: Collection.Find(Params)\x1b[0m");
    let t = bson.deserialize(e.prepare("SELECT * FROM peakdb").all()[0].data).data.find(r);
    return t || console.error("\x1b[36mpeakdb \x1b[34m» \x1b[31mDocument not found.\x1b[0m")
  },
  filter: (e, a, r) => {
    if (!r) return console.error("\x1b[36mpeakdb \x1b[34m» \x1b[31mNot specified: Collection.Filter(Params)\x1b[0m");
    if ("function" != typeof r) return console.error("\x1b[36mpeakdb \x1b[34m» \x1b[31mInvalid parameters: Collection.Filter(Params)\x1b[0m");
    let t = bson.deserialize(e.prepare("SELECT * FROM peakdb").all()[0].data).data.filter(r);
    return t || console.error("\x1b[36mpeakdb \x1b[34m» \x1b[31mDocuments not found.\x1b[0m")
  },
  update: (e, a, r, t) => {
    if (!r) return console.error("\x1b[36mpeakdb \x1b[34m» \x1b[31mNot specified: Collection.Update(Id, ...)\x1b[0m");
    if (!t) return console.error("\x1b[36mpeakdb \x1b[34m» \x1b[31mNot specified: Collection.Update(..., Params)\x1b[0m");
    if (!1 === isJSON(t)) return console.error("\x1b[36mpeakdb \x1b[34m» \x1b[31mInvalid parameters: Collection.Update(..., Params)\x1b[0m");
    let i = bson.deserialize(e.prepare("SELECT * FROM peakdb").all()[0].data).data,
      n = i.find(e => e._id === r),
      o = {
        _id: r,
        _updated: !0
      };
    return n ? (n._created_at && (o._created_at = n._created_at), n._created_timestamp && (o._created_timestamp = n._created_timestamp), !0 === a.indicate_updated_at && (o._updated_at = new Date), !0 === a.indicate_updated_timestamp && (o._updated_timestamp = Date.now()), o = Object.assign(o, t), i[i.indexOf(n)] = o, e.prepare("UPDATE peakdb SET data = (?)").run(bson.serialize({
      data: i
    })), o) : console.error("\x1b[36mpeakdb \x1b[34m» \x1b[31mInvalid document ID: " + r + "\x1b[0m")
  },
  delete: (e, a, r) => {
    if (!r) return console.error("\x1b[36mpeakdb \x1b[34m» \x1b[31mNot specified: Collection.Delete(Id)\x1b[0m");
    let t = bson.deserialize(e.prepare("SELECT * FROM peakdb").all()[0].data).data,
      i = t.find(e => e._id === r);
    return i ? (t.splice(t.indexOf(i), 1), e.prepare("UPDATE peakdb SET data = (?)").run(bson.serialize({
      data: t
    })), !0) : console.error("\x1b[36mpeakdb \x1b[34m» \x1b[31mInvalid document ID: " + r + "\x1b[0m")
  },
  backup: (e, a) => {
    fs.mkdirSync(path.join("./", "./peakdb/Backups/Collections"), {
      recursive: !0
    }, e => console.error("\x1b[36mpeakdb \x1b[34m» \x1b[31mError creating folders.\x1b[0m"));
    let r = a.name + (new Date).getFullYear() + "-" + filterTime((new Date).getMonth() + 1) + "-" + filterTime((new Date).getDate()) + "_" + filterTime((new Date).getHours()) + filterTime((new Date).getMinutes()) + ".pea";
    return !1 === fs.existsSync("./peakdb/Backups/Collections/" + r) && e.backup("./peakdb/Backups/Collections/" + r).then(() => {
      console.log("\x1b[36mpeakdb \x1b[34m» \x1b[32mCollection '\x1b[35m" + a.name + "\x1b[32m' is backed up with name '\x1b[35m" + r + "\x1b[32m'.\x1b[0m")
    }).catch(e => {
      console.error("\x1b[36mpeakdb \x1b[34m» \x1b[32mError when backup collection '\x1b[35m" + a.name + "\x1b[32m'.\x1b[0m")
    }), !0
  }
};
