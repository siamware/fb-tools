const logger = new Logger()
var totalClicked = 0

startAddingFriends(getMax())

async function startAddingFriends (max) {
  let sent = getSent()
  logger.info(`Checking for status...`)
  logger.info(`Added ${sent.length} out of ${max} friends.`)
  if (sent.length === max) {
    report()
    window.alert(`Added ${sent.length} out of ${max} friends. Application stopped.`)
    return
  }

  await addFriend(max - sent.length)

  if (isEndOfScroll()) {
    report()
    window.alert(`Hit the bottom. Application stopped.`)
    return
  }

  if (sent.length > 0) {
    /* Clean all cards except for ones that has [Friend Request Sent] buttons */
    cleanTrashCards()
  } else {
    logger.info(`0 sent found. Cleaning cards...`)
    let notSent = getNotSent()
    let deleted = 0
    for (let i = 0; i < notSent.length; i++) {
      let parent = notSent[i].closest('._4p2o')
      if (parent) {
        deleted++
        parent.parentNode.removeChild(parent)
      }
      if (deleted >= max) {
        break
      }
    }
  }

  startAddingFriends(max)
}

/* Click $max number of  visible [Add Friend] buttons on the screen */
async function addFriend (max) {
  logger.info(`Need to add (another) ${max} friends.`)
  logger.info(`Scanning...`)
  for (let i = 0; ; i++) {
    let notSent = getNotSent()
    if (notSent.length >= max || isEndOfScroll()) {
      max = notSent.length > max ? max : notSent.length
      logger.info(`Found ${notSent.length} [Add Friend] buttons.`)
      logger.info(`Adding...`)
      for (let j = 0; j < max; j++) {
        notSent[j].click()
        totalClicked += 1
        await wait(2000)
        dismissDialogs()
      }
      logger.info(`Done adding.`)
      break
    }
    scrollToBottom()
    await wait(2000)
  }
}

/* Get all visible [Friend Request Sent] buttons on the screen */
function getSent () {
  return document.querySelectorAll('.FriendRequestOutgoing:not(.hidden_elem)')
}

/* Get all visible [Add Friend] buttons on the screen */
function getNotSent () {
  return document.body.querySelectorAll('.FriendRequestAdd:not(.hidden_elem)')
}

/* Get max amount of friends will be Added. Default: 100 */
function getMax () {
  let max = parseInt(window.prompt('Enter how many friends you wanna add: ', '100'))
  if (isNaN(max)) {
    max = 100
  }
  return max
}
function scrollToBottom () {
  window.scrollTo(0, document.body.scrollHeight)
}

function wait (milliseconds) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve()
    }, milliseconds)
  })
}

function isEndOfScroll () {
  let endScroll = document.body.querySelector('._24j')
  if (endScroll !== null) {
    return true
  }
  return false
}

function cleanTrashCards () {
  let card = document.body.querySelectorAll('._4p2o')
  for (let i = 0; i < card.length; i++) {
    if (!card[i].querySelector('.FriendRequestOutgoing:not(.hidden_elem)')) {
      card[i].parentNode.removeChild(card[i])
    }
  }
  logger.info('Cleaned trash cards.')
}

function dismissDialogs () {
  let dialog = document.body.querySelectorAll('.uiLayer div[role="dialog"]:not(.uiContextualLayerBelowLeft)')
  for (let i = 0; i < dialog.length; i++) {
    if (dialog[i].innerHTML.indexOf('Does This Person Know You') > 0) {
      if (dialog[i].querySelector('.layerConfirm')) {
        dialog[i].querySelector('.layerConfirm').click()
      }
    } else {
      if (dialog[i].querySelector('.layerCancel')) {
        dialog[i].querySelector('.layerCancel').click()
      }
    }
  }
}

function Logger () {
  this.info = function (message) {
    console.log('[INFO][' + getTime() + ']: ' + message)
  }
  this.error = function (message) {
    console.error('[ERROR][' + getTime() + ']: ' + message)
  }
}

function getTime () {
  return (new Date()).toUTCString()
}

function scrollDistance () {
  return window.pageXOffset
}

function report () {
  logger.info(`Scrolled down (px): ${scrollDistance()}`)
  logger.info(`Total [Add Friend] buttons clicked: ${totalClicked}`)
  logger.info(`Total [Friend Request Sent] buttons found: ${getSent().length}`)
}
