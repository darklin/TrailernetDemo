const thousands = (val) => {
  let arr = String(val).split('.')
  let str = arr[1] ? `.${arr[1]}` : ''
  return arr[0].replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') + str
}

export default thousands
