<script>
	import { onMount } from 'svelte'

  export let data

  let d3
  let el;
  let title = ''

  const duration = 2000
  const getWidth = (item, xScale) => `${xScale(item.total)}px`
  const getText = (item) => `${item.username} / ${item.total}`
  const getColor = (item, color) => color(item.total)
  const waitFor = async (timeout = 1000) => new Promise(resolve => setTimeout(resolve, timeout))

  function updateChart({d3, el, data, xScale, i, color}) {
    const svg = d3.select(el)
      .selectAll("div")
      .data(data)
    if (i === 0) {
      svg
        .enter()
        .append("div")
        .style("background", item => getColor(item, color))
        .style("width", item => getWidth(item, xScale))
        .text(getText)
    } else {
      svg
        .enter()
        .append("div")
        .merge(svg)
        .transition()
        .duration(duration)
        .style("background", item => getColor(item, color))
        .style("width", item => getWidth(item, xScale))
        .text(getText)
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
        item.total = (item.total + post.total) / 2
      }
    })

    return history.sort((a, b) => b.total - a.total)
  }

  async function drawBars({ d3, el, postsByDay }) {
    const width = 500
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
      updateChart({d3, el, xScale, data: history, i, color})	
      await waitFor(duration)
      i++
    }
  }

  onMount(async() => {
		d3 = await import('d3')

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
<br />
