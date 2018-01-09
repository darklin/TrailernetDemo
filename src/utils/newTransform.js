var GCJ_A = 6378245
var GCJ_EE = 0.00669342162296594323

var PRC_EPS = 1e-5

var BD_DLAT = 0.0060
var BD_DLON = 0.0065

var EARTH_R = 6371000

function distance (a, b) {
  function hav (θ) {
    return Math.pow(Math.sin(θ / 2), 2)
  }

  var Δ = coordDiff(a, b)
  return 2 * EARTH_R * Math.asin(Math.sqrt(
    hav(Δ.lat * Math.PI / 180) +
      Math.cos(a.lat * Math.PI / 180) *
      Math.cos(b.lat * Math.PI / 180) *
      hav(Δ.lon * Math.PI / 180)
  ))
}

function sanityInChinaP (coords) {
  return coords.lat >= 0.8293 && coords.lat <= 55.8271 &&
           coords.lon >= 72.004 && coords.lon <= 137.8347
}

function coordDiff (a, b) {
  return {
    lat: a.lat - b.lat,
    lon: a.lon - b.lon
  }
}

function coordError (a, b) {
  var diff = coordDiff(a, b)
  return Math.max(Math.abs(diff.lat), Math.abs(diff.lon))
}

function wgs2gcj (wgs, checkChina = true) {
  if (checkChina && !sanityInChinaP(wgs)) {
    console.warn(`Non-Chinese coords found, returning as-is: ` +
           `(${wgs.lat}, ${wgs.lon})`)
    return wgs
  }

  var x = wgs.lon - 105
  var y = wgs.lat - 35

  var dLatM = -100 + 2 * x + 3 * y + 0.2 * y * y + 0.1 * x * y +
    0.2 * Math.sqrt(Math.abs(x)) + (
          2 * Math.sin(x * 6 * Math.PI) + 2 * Math.sin(x * 2 * Math.PI) +
          2 * Math.sin(y * Math.PI) + 4 * Math.sin(y / 3 * Math.PI) +
          16 * Math.sin(y / 12 * Math.PI) + 32 * Math.sin(y / 30 * Math.PI)
        ) * 20 / 3
  var dLonM = 300 + x + 2 * y + 0.1 * x * x + 0.1 * x * y +
    0.1 * Math.sqrt(Math.abs(x)) + (
          2 * Math.sin(x * 6 * Math.PI) + 2 * Math.sin(x * 2 * Math.PI) +
          2 * Math.sin(x * Math.PI) + 4 * Math.sin(x / 3 * Math.PI) +
          15 * Math.sin(x / 12 * Math.PI) + 30 * Math.sin(x / 30 * Math.PI)
        ) * 20 / 3

  var radLat = wgs.lat / 180 * Math.PI
  var magic = 1 - GCJ_EE * Math.pow(Math.sin(radLat), 2)

  var latDegArclen = (Math.PI / 180) * (GCJ_A * (1 - GCJ_EE)) * Math.pow(magic, 1.5)

  var lonDegArclen = (Math.PI / 180) * (GCJ_A * Math.cos(radLat) / Math.sqrt(magic))

  return {
    lat: wgs.lat + (dLatM / latDegArclen),
    lon: wgs.lon + (dLonM / lonDegArclen)
  }
}

function gcj2wgs (gcj, checkChina = true) {
  return coordDiff(gcj, coordDiff(wgs2gcj(gcj, checkChina), gcj))
}

function gcj2bd (gcj, __dummy__ = false) {
  var x = gcj.lon
  var y = gcj.lat

  var r = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * Math.PI * 3000 / 180)
  var θ = Math.atan2(y, x) + 0.000003 * Math.cos(x * Math.PI * 3000 / 180)

  return {
    lat: r * Math.sin(θ) + BD_DLAT,
    lon: r * Math.cos(θ) + BD_DLON
  }
}

function bd2gcj (bd, __dummy__ = false) {
  var x = bd.lon - BD_DLON
  var y = bd.lat - BD_DLAT

  var r = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * Math.PI * 3000 / 180)
  var θ = Math.atan2(y, x) - 0.000003 * Math.cos(x * Math.PI * 3000 / 180)

  return {
    lat: r * Math.sin(θ),
    lon: r * Math.cos(θ)
  }
}

function bd2wgs (bd, checkChina = true) {
  return gcj2wgs(bd2gcj(bd), checkChina)
}

function wgs2bd (bd, checkChina = true) {
  return gcj2bd(wgs2gcj(bd, checkChina))
}

function __bored__ (fwd, rev) {
  return function revBored (bad, checkChina = true) {
    var wgs = rev(bad, checkChina)
    var old = bad

    var i = 0
    do {
      old = wgs
      wgs = coordDiff(wgs, coordDiff(fwd(wgs, false), bad))
    } while (coordError(wgs, old) > PRC_EPS && i++ < 10)

    return wgs
  }
}

var exports = {
  distance: distance,
  wgs2gcj: wgs2gcj,
  gcj2wgs: gcj2wgs,
  gcj2bd: gcj2bd,
  bd2gcj: bd2gcj,
  wgs2bd: wgs2bd,
  bd2wgs: bd2wgs,

  __bored__: __bored__,
  gcj2wgs_bored: __bored__(wgs2gcj, gcj2wgs),
  bd2gcj_bored: __bored__(gcj2bd, bd2gcj),
  bd2wgs_bored: __bored__(wgs2bd, bd2wgs)
}

if (typeof module === 'object' && module.exports) {
  module.exports = exports
} else if (typeof window !== 'undefined') {
  window.PRCoords = exports
}
