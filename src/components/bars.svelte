<script>
	import { onMount } from 'svelte'

  export let data

  let d3
  let el;
  let svg
  let title = ''

  const width = 800
  const height = 800
  const duration = 2000
  const waitFor = async (timeout = 1000) => new Promise(resolve => setTimeout(resolve, timeout))
  const barHeight = 80

  function updateChart({data, xScale, i, color}) {
    const bars = svg.selectAll("rect").data(data)
    const text = svg.selectAll("text").data(data)

    if (i === 0) {
      bars
        .enter()
        .append("rect")
        .attr("x", () => 0)
        .attr("y", (d, i) => barHeight * i)
        .attr("width", d => xScale(d.total))
        .attr("height", (d, i) => barHeight * .9)
        .attr("fill", (d)  => color(d.total))
      
      text
        .enter()
        .append("text")
        .text((d) => `${d.username} - ${d.total}`)
        .attr("x", (d) => xScale(d.total) - 10)
        .attr("y", (d, i) => barHeight * i + barHeight / 2)
        .attr("fill", "white")
        .attr("font-family", "sans-serif")
        .attr("font-size", "16px")
        .attr("text-anchor", "end")
    }
    else {
      bars
        .enter()
        .append("rect")
        .attr("y", (d, i) => height)
        .merge(bars)
        .transition()
        .duration(duration)
        .attr("x", () => 0)
        .attr("y", (d, i) => barHeight * i)
        .attr("width", d => xScale(d.total))
        .attr("height", (d, i) => barHeight * .9)
        .attr("fill", (d)  => color(d.total))
      
      text
        .enter()
        .append("text")
        .attr("y", (d, i) => height)
        .merge(text)
        .transition()
        .duration(duration)
        .text((d) => `${d.username} - ${d.total}`)
        .attr("x", (d) => xScale(d.total) - 10)
        .attr("y", (d, i) => barHeight * i + barHeight / 2)
        .attr("fill", "white")
        .attr("font-family", "sans-serif")
        .attr("font-size", "16px")
        .attr("text-anchor", "end")
    }
  }

  function getMaxValue(postsByDay, d3) {
    return postsByDay.reduce((accu, items) => {
      const newMax = d3.max(items, d => d.total)
      
      return accu > newMax ? accu : newMax
    }, 0)
  }

  function getHistory(history, posts) {
    posts.forEach(post => {
      const item = history.find(item => item.username === post.username)
      if (!item) {
        history.push(post)
      } else {
        item.total = Math.round((item.total + post.total) / 2)
      }
    })

    return history.sort((a, b) => b.total - a.total)
  }

  async function drawBars({ d3, el, postsByDay }) {
    const maxValue = getMaxValue(postsByDay, d3)
    
    const xScale = d3.scaleLinear()
      .domain([0, maxValue])
      .range([0, width]);
    
    const color = d3.scaleSequential()
      .domain([maxValue, 0])
      .interpolator(d3.interpolateViridis);
    
    let i = 0
    let history = []
    for (const posts of postsByDay){
      title = new Date(posts[0].date).toLocaleDateString()
      history = getHistory(history, posts)
      updateChart({xScale, data: history, i, color})	
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
      .attr("style", "border: 1px solid black;")

    playHandler()
	})

  async function playHandler() {
    if (d3) {
      await drawBars({ d3, el, postsByDay: data })
    }
  }
</script>

<style>
	.chart :global(div) {
		font: 16px sans-serif;
		text-align: right;
		padding: 12px;
		margin: 1px;
		color: white;
	}
</style>


<button on:click={playHandler}>Play</button>
<h2>{title}</h2>
<div bind:this={el} class="chart"></div>
