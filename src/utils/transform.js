// let earthR = 6378137.0
let earthR = 6378245.0

export function outOfChina (lat, lng) {
  if ((lng < 72.004) || (lng > 137.8347)) {
    return true
  }
  if ((lat < 0.8293) || (lat > 55.8271)) {
    return true
  }
  return false
}

function transform (x, y) {
  let xy = x * y
  let absX = Math.sqrt(Math.abs(x))
  let xPi = x * Math.PI
  let yPi = y * Math.PI
  let d = 20.0 * Math.sin(6.0 * xPi) + 20.0 * Math.sin(2.0 * xPi)

  let lat = d
  let lng = d

  lat += 20.0 * Math.sin(yPi) + 40.0 * Math.sin(yPi / 3.0)
  lng += 20.0 * Math.sin(xPi) + 40.0 * Math.sin(xPi / 3.0)

  lat += 160.0 * Math.sin(yPi / 12.0) + 320 * Math.sin(yPi / 30.0)
  lng += 150.0 * Math.sin(xPi / 12.0) + 300.0 * Math.sin(xPi / 30.0)

  lat *= 2.0 / 3.0
  lng *= 2.0 / 3.0

  lat += -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * xy + 0.2 * absX
  lng += 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * xy + 0.1 * absX

  return { lat: lat, lng: lng }
}

function delta (lat, lng) {
  let ee = 0.00669342162296594323
  let d = transform(lng - 105.0, lat - 35.0)
  let radLat = lat / 180.0 * Math.PI
  let magic = Math.sin(radLat)
  magic = 1 - ee * magic * magic
  let sqrtMagic = Math.sqrt(magic)
  d.lat = (d.lat * 180.0) / ((earthR * (1 - ee)) / (magic * sqrtMagic) * Math.PI)
  d.lng = (d.lng * 180.0) / (earthR / sqrtMagic * Math.cos(radLat) * Math.PI)
  return d
}

export function wgs2gcj (wgsLat, wgsLng) {
  if (outOfChina(wgsLat, wgsLng)) {
    return {lat: wgsLat, lng: wgsLng}
  }
  let d = delta(wgsLat, wgsLng)
  return {lat: wgsLat + d.lat, lng: wgsLng + d.lng}
}

export function gcj2wgs (gcjLat, gcjLng) {
  if (outOfChina(gcjLat, gcjLng)) {
    return {lat: gcjLat, lng: gcjLng}
  }
  let d = delta(gcjLat, gcjLng)
  return {lat: gcjLat - d.lat, lng: gcjLng - d.lng}
}

export function gcj2wgsExact (gcjLat, gcjLng) {
  // newCoord = oldCoord = gcjCoord
  let newLat = gcjLat
  let newLng = gcjLng
  let oldLat = newLat
  let oldLng = newLng
  let threshold = 1e-6 // ~0.55 m equator & latitude
  for (let i = 0; i < 30; i++) {
    // oldCoord = newCoord
    oldLat = newLat
    oldLng = newLng
    // newCoord = gcjCoord - wgs_to_gcj_delta(newCoord)
    let tmp = wgs2gcj(newLat, newLng)
    // approx difference using gcj-space difference
    newLat -= gcjLat - tmp.lat
    newLng -= gcjLng - tmp.lng
    // diffchk
    if (Math.max(Math.abs(oldLat - newLat), Math.abs(oldLng - newLng)) < threshold) {
      break
    }
  }
  return { lat: newLat, lng: newLng }
}

export function distance (latA, lngA, latB, lngB) {
  let pi180 = Math.PI / 180
  let arcLatA = latA * pi180
  let arcLatB = latB * pi180
  let x = Math.cos(arcLatA) * Math.cos(arcLatB) * Math.cos((lngA - lngB) * pi180)
  let y = Math.sin(arcLatA) * Math.sin(arcLatB)
  let s = x + y
  if (s > 1) {
    s = 1
  }
  if (s < -1) {
    s = -1
  }
  let alpha = Math.acos(s)
  let distance = alpha * earthR
  return distance
}

export function gcj2bd (gcjLat, gcjLng) {
  if (outOfChina(gcjLat, gcjLng)) {
    return { lat: gcjLat, lng: gcjLng }
  }
  let x = gcjLng
  let y = gcjLat
  let z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * Math.PI)
  let theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * Math.PI)
  let bdLng = z * Math.cos(theta) + 0.0065
  let bdLat = z * Math.sin(theta) + 0.006
  return { lat: bdLat, lng: bdLng }
}

export function bd2gcj (bdLat, bdLng) {
  if (outOfChina(bdLat, bdLng)) {
    return { lat: bdLat, lng: bdLng }
  }
  let x = bdLng - 0.0065
  let y = bdLat - 0.006
  let z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * Math.PI)
  let theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * Math.PI)
  let gcjLng = z * Math.cos(theta)
  let gcjLat = z * Math.sin(theta)
  return {lat: gcjLat, lng: gcjLng}
}

export function wgs2bd (wgsLat, wgsLng) {
  let gcj = wgs2gcj(wgsLat, wgsLng)
  return gcj2bd(gcj.lat, gcj.lng)
}

export function bd2wgs (bdLat, bdLng) {
  let gcj = bd2gcj(bdLat, bdLng)
  return gcj2wgs(gcj.lat, gcj.lng)
}

export default {
  wgs2gcj,
  gcj2wgs,
  gcj2wgsExact,
  distance,
  gcj2bd,
  bd2gcj,
  wgs2bd,
  bd2wgs,
  outOfChina
}
