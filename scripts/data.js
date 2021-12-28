const fs = require('fs');
const fetch = require('node-fetch')
const debug = require('debug')('app:get-data')

const config = require('../config')
const apiURL = config.get('api.url')

async function getPostsByDay() {
  debug('getting posts by day...')
  const response = await fetch(`${apiURL}/posts/by-day`)
  const postsByDay = await response.json()

  fs.writeFileSync('./static/posts-by-day.json', JSON.stringify(postsByDay));
}

async function getPostsSummary() {
  debug('getting posts summary...')
  const response = await fetch(`${apiURL}/posts/summary`)
  const summary = await response.json()

  fs.writeFileSync('./static/posts-summary.json', JSON.stringify(summary));
}

async function getPosts() {
  debug('getting posts ...')
  const response = await fetch(`${apiURL}/posts`)
  const posts = await response.json()

  fs.writeFileSync('./static/posts.json', JSON.stringify(posts));
}

async function getPostsClassification() {
  debug('getting posts classifications ...')
  const response = await fetch(`${apiURL}/posts/classification`)
  const classification = await response.json()

  fs.writeFileSync('./static/classification.json', JSON.stringify(classification));
}

async function getPostsTopics() {
  debug('getting posts topics ...')
  const response = await fetch(`${apiURL}/posts/topics`)
  const topics = await response.json()

  fs.writeFileSync('./static/topics.json', JSON.stringify(topics));
}

async function getPostsHashtag() {
  debug('getting posts hashtags ...')
  const response = await fetch(`${apiURL}/posts/hashtags`)
  const hashtags = await response.json()

  fs.writeFileSync('./static/hashtags.json', JSON.stringify(hashtags));
}

async function getPostsUsers() {
  debug('getting posts users ...')
  const response = await fetch(`${apiURL}/posts/users`)
  const users = await response.json()

  fs.writeFileSync('./static/users.json', JSON.stringify(users));
}

async function main() {
  await getPostsByDay()
  await getPostsSummary()
  await getPosts()
  await getPostsClassification()
  await getPostsTopics()
  await getPostsHashtag()
  await getPostsUsers()
}

main().then(() => {
  debug('end')
})
