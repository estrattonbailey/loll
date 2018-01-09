export default function href (cb) {
  window.addEventListener('click', e => {
    if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || e.defaultPrevented) return

    let a = e.target

    while (a && !(a.href && a.nodeName === 'A')) {
      a = a.parentNode
    }

    if (
      !a ||
      window.location.origin !== a.origin ||
      a.hasAttribute('download') ||
      a.target === '_blank' ||
      /mailto|tel/.test(a.href)
    ) return

    e.preventDefault()

    cb(a)
  })
}
