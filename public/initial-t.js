/* eslint-disable prettier/prettier */
(function initialT() {
  // remove unnecessary script
  window.document.getElementById('remove-me-t')?.remove()
  var token = window._T
  var version = window._webapp_version
  delete window._T
  delete window._webapp_version
  // if track js exists
  if (window.location.host.indexOf('localhost') !== 0 && window.location.host.indexOf('127.0.0.1') !== 0 && window.TrackJS && token) {
    // for offline support
    var offlineErrors = []

    var sendOrQueueError = function (errorPayload) {
      var xhr = new XMLHttpRequest()
      xhr.open('POST', 'https://capture.trackjs.com/capture?token=' + token + '&v=' + window.TrackJS.version, true)
      xhr.onerror = function () {
        offlineErrors.push(errorPayload)
      }
      xhr.setRequestHeader('Content-type', 'text/plain')
      xhr.send(JSON.stringify(errorPayload).substring(0, 100 * 1024))
    }

    window.addEventListener('online', () => {
      while (offlineErrors.length) {
        window.setTimeout(
          function (offlineError) {
            sendOrQueueError(offlineError)
          },
          0,
          offlineErrors.shift(),
        )
      }
    })

    // observe for resource
    var Observer = window.MutationObserver || window.WebKitMutationObserver
    if (Observer) {
      var listenForLoadError = function (node) {
        if (['SCRIPT', 'LINK', 'IMG'].indexOf(node.tagName) >= 0) {
          var origOnError = node.onerror
          node.onerror = function (evt) {
            if (!evt || !evt.srcElement) {
              return
            }
            evt.path = evt.path || []
            var path = ''
            for (var elIdx = 0; elIdx < evt.path.length; elIdx++) {
              var currentEl = evt.path[elIdx]
              if (currentEl === window) {
                path += 'Window'
                continue
              }
              path += currentEl.nodeName
              path += currentEl.id ? '#' + currentEl.id : ''
              path += currentEl.className ? '.' + currentEl.className.split(' ').join('.') : ''
              if (elIdx < evt.path.length) {
                path += ' > '
              }
            }
            // this is how we send error
            console.info({
              asset: evt.srcElement.src,
              integrity: evt.srcElement.integrity,
              element: evt.srcElement.outerHTML,
              path: path,
            })
            console.error('Failed to load ' + evt.srcElement.tagName + ': ' + (evt.srcElement.src || evt.srcElement.href))
            if (origOnError) {
              origOnError.call(node, evt)
            }
          }
        }
      }

      new Observer(function (mutations) {
        [].forEach.call(mutations, function (mutation) {
          [].forEach.call(mutation.addedNodes, listenForLoadError)
        })
      }).observe(window.document, { childList: true, subtree: true })
    }

    // if it's not install, install it
    if (!window.TrackJS.isInstalled()) {
      window.TrackJS.install({
        token: token,
        version: version,
        application: 'fix',
        console: { display: false },
        onError: function (payload) {
          payload.network = payload.network.filter(function (item) {
            if (item.url.indexOf('posthog.com') === -1) {
              sendOrQueueError(payload)
            }
            return false
          })
          sendOrQueueError(payload)
          return false
        },
      })
    }
  }
  // vite preload error
  window.addEventListener('vite:preloadError', (event) => {
    if (window.TrackJS && window.TrackJS.isInstalled()) {
      window.TrackJS.track(event.payload)
    }
    window.setTimeout(function () {
      window.location.reload()
    }, 3_000)
  })

  window._load_page_timeout = window.setTimeout(function () {
    if (window.TrackJS && window.TrackJS.isInstalled()) {
      window.TrackJS.track(new Error('It took more than ' + (window._load_page_timeout / 1000) + 's to load the page'))
    }
    window.setTimeout(function () {
      window.location.reload()
    }, 3_000)
  }, window._load_page_timeout)
})()
