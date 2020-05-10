(() => {
  var clientWidth = document.documentElement.clientWidth,
  viewport = null,
  viewportWidth = 'device-width',
  viewportScale = 1
  if (clientWidth > 320) {
    viewport = document.getElementById('viewport')
    viewportScale = clientWidth / 320;
    viewportWidth = 320 * (320 / clientWidth);
    viewport.setAttribute('content', `width=${viewportWidth}, initial-scale=${viewportScale}, maximum-scale=${viewportScale}, user-scalable=0`)
  }
})()