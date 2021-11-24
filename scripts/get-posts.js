const fs = require('fs');
const fetch = require('node-fetch')
const debug = require('debug')('app:get-posts')

const config = require('../config')
const apiURL = config.get('api.url')

async function getPosts() {
  debug('getting posts...')
  const response = await fetch(`${apiURL}/posts/by-day`)
  const postsByDay = await response.json()

  fs.writeFileSync('./static/posts-by-day.json', JSON.stringify(postsByDay));
}

getPosts().then(() => {
  debug('done')
})
