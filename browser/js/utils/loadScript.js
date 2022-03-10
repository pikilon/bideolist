export const loadScript = (src) =>
  new Promise((resolve, reject) => {
    const existingTag = document.querySelector(`script[src="${src}"]`)
    if (existingTag) resolve()
    const script = document.createElement("script")
    script.type = "text/javascript"
    script.src = src
    script.async = true
    script.onerror = (err) => reject(err, script)
    script.onload = resolve
    const tag = document.getElementsByTagName("script")[0]
    tag.parentElement.insertBefore(script, tag)
  })
