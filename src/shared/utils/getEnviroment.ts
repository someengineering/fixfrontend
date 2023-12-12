export const getEnviromentStr = async () => {
  return new Promise<'prd' | 'dev'>((resolve) => {
    const request = new window.XMLHttpRequest()
    request.onreadystatechange = function () {
      if (request.readyState === window.XMLHttpRequest.DONE) {
        resolve(
          request
            .getAllResponseHeaders()
            .split('\n')
            .find((i) => i.startsWith('fix-environment'))
            ?.substring(17)
            .startsWith('prd')
            ? 'prd'
            : 'dev',
        )
      }
    }

    request.open('HEAD', window.document.location.href, true)
    request.send(null)
  })
}
