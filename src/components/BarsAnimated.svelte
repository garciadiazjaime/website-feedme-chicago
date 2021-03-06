<script>
	import { onMount } from 'svelte'

  export let postsByDay

  let d3
  let el;
  let svg
  let title = ''

  const width = 800
  const height = 800
  const duration = 2000
  const waitFor = async (timeout = 1000) => new Promise(resolve => setTimeout(resolve, timeout))
  const barHeight = 80

  function initChart({dataset, xScale, yScale, color }) {
    const bars = svg.selectAll("rect").data(dataset)
    const text = svg.selectAll("text").data(dataset)

    bars
      .enter()
      .append("rect")
      .attr("x", () => 0)
      .attr("y", d => barHeight * yScale(d.username, true))
      .attr("width", d => xScale(d.likes))
      .attr("height", (d, i) => barHeight * .9)
      .attr("fill", (d)  => color(d.likes))
    
    text
      .enter()
      .append("text")
      .on("click", (e, d) => window.open(`https://instagram.com/${d.username}/`))
      .on("mouseover", (event) => d3.select(event.target).style("cursor", "pointer"))
      .text((d) => `@${d.username} 🤍 ${d.likes} 📷 ${d.posts}`)
      .attr("x", (d) => xScale(d.likes) - 10)
      .attr("y", (d, i) => barHeight * yScale(d.username) + barHeight / 2)
      .attr("fill", "white")
      .attr("font-family", "sans-serif")
      .attr("font-size", "16px")
      .attr("text-anchor", "end")
  }

  function updateChart({dataset, xScale, yScale, color }) {
    const bars = svg.selectAll("rect").data(dataset)
    const text = svg.selectAll("text").data(dataset)

    bars
      .enter()
      .append("rect")
      .attr("y", height * 2)
      .merge(bars)
      .transition()
      .duration(duration)
      .attr("x", () => 0)
      .attr("y", d => barHeight * yScale(d.username, true))
      .attr("width", d => xScale(d.likes))
      .attr("height", (d, i) => barHeight * .9)
      .attr("fill", (d)  => color(d.likes))
    
    text
      .enter()
      .append("text")
      .on("click", (e, d) => window.open(`https://instagram.com/${d.username}/`))
      .on("mouseover", (event) => d3.select(event.target).style("cursor", "pointer"))
      .attr("y", height * 2)
      .merge(text)
      .transition()
      .duration(duration)
      .text((d) => `@${d.username} 🤍 ${d.likes} 📷 ${d.posts}`)
      .attr("x", (d) => xScale(d.likes) - 10)
      .attr("y", (d, i) => barHeight * yScale(d.username) + barHeight / 2)
      .attr("fill", "white")
      .attr("font-family", "sans-serif")
      .attr("font-size", "16px")
      .attr("text-anchor", "end")
  }

  function getHistory(history, posts) {
    posts.forEach(post => {
      const item = history.find(item => item.username === post.username)
      if (!item) {
        history.push({
          username: post.username,
          likes: post.likeCount,
          posts: post.postsCount,
        })
      } else {
        item.likes += post.likeCount
        item.posts += post.postsCount
      }
    })

    return history
  }

  function getUsernames(data) {
    return data
      .map(item => ({ likes: item.likes, username: item.username}))
      .sort((a, b) => b.likes - a.likes)
      .map(item => item.username)
  }

  async function drawBars(data) {
    let i = 0
    let history = []
    for (const posts of data){
      title = new Date(posts[0].date).toDateString()
      history = getHistory(history, posts)

      const maxValue = d3.max(history, item => item.likes)
      const xScale = d3.scaleLinear()
        .domain([0, maxValue])
        .range([0, width]);

      const yScale = d3.scaleBand()
      .domain(getUsernames(history))
      .range([0, history.length]);

      const color = d3.scaleSequential()
        .domain([maxValue, 0])
        .range(['red', 'blue']);

      if ( i === 0 ){
        initChart({dataset: history, xScale, yScale, color })
      } else {
        updateChart({dataset: history, xScale, yScale, color })	
      }

      await waitFor(duration)
      i++
    }
  }

  onMount(async() => {
		d3 = await import('d3')

    svg = d3.select(el)
      .append("svg")
      .attr("width", width)
      .attr("height", height)

    playHandler()
	})

  async function playHandler() {
    if (d3) {
      d3.selectAll("svg > *").remove();
      await drawBars(postsByDay)
    }
  }
</script>

<style>
	a {
    padding: 12px;
    margin: 10px 0;
    text-decoration: none;
    border: 1px solid #ff3e00;
    display: inline-block;
  }
</style>


<a href="/" on:click={playHandler}>Replay</a>
<h2>{title}</h2>
<div bind:this={el} class="chart"></div>
