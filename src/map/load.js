// 加载JS库
export const loadJS = url => {
  let script = document.createElement('script')
  script.setAttribute('src', url)
  document.body.appendChild(script)
}
