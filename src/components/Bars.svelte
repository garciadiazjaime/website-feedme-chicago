<script>
	import { onMount } from 'svelte'

  export let data = []

  let el
  let svg
  let stats = {
    average: 0,
    median: 0,
    max: 0,
    min: 0,
    deviation: 0,
    q95: 0
  }

  const margin = {top: 20, right: 20, bottom: 20, left: 20}
  const width = 800 - margin.left - margin.right
  const height = ((data.length * barHeight) || 800 ) - margin.top - margin.bottom
  const barHeight = 50

  function initChart({dataset, xScale, yScale, color }) {
    const bars = svg.selectAll("rect").data(dataset)

    bars
      .enter()
      .append("rect")
      .attr("x", 1)
      .attr("y", (d) => yScale(d.className))
      .attr("width", d => width - xScale(d.total))
      .attr("height", barHeight * .9)
      .attr("fill", (d)  => color(d.total))
    
    bars
      .enter()
      .append("text")
      .text(d => `${d.total}: ${d.className}`)
      .attr("x", 5)
      .attr("y", (d) => yScale(d.className) + yScale.bandwidth() / 2)
      .attr("fill", "black")
      .attr("font-family", "sans-serif")
      .attr("font-size", "16px")
      .attr("text-anchor", "start")
      .attr("fill", "#666")
  }

  async function drawBars() {
    const maxValue = d3.max(data, item => item.total)
    const xScale = d3.scaleLinear()
      .domain([0, maxValue])
      .range([width, 0]);
    
    const yScale = d3.scaleBand()
      .domain(data.map(d => d.className))
      .rangeRound([0, data.length * barHeight])

    const color = (value) => d3.interpolateBlues( value / maxValue )

    const xAxis = d3.axisBottom()
      .scale(xScale)
    
    const yAxis = d3.axisLeft()
      .scale(yScale)
    
    svg.append("g")
      .attr("class", "x axis")
      .call(xAxis.ticks(null).tickSize(0))

    initChart({dataset: data, xScale, yScale, color })

    svg.append("g")
      .attr("class", "axis-y")
      .call(yAxis.ticks(null).tickSize(0))
  }

  function setStats() {
    stats.average = d3.mean(data, d => d.total)
    stats.median = d3.median(data, d => d.total)
    stats.max = d3.max(data, d => d.total)
    stats.min = d3.min(data, d => d.total)
    stats.deviation = d3.deviation(data, d => d.total)
    stats.q95 = d3.quantile(data, 0.95, d => d.total)
  }

  onMount(async() => {
    svg = d3.select(el)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

    playHandler()

    setStats()
	})

  async function playHandler() {
    if (d3) {
      d3.selectAll("svg > g > *").remove();
      await drawBars()
    }
  }
</script>

<style>
  :global(.axis-y text){
    fill: #CCC;
    font-size: 2em;
    display: none;
  }
</style> 

<div bind:this={el} class="chart"></div>

<p>
  Average: {stats.average}
</p>
<p>
  Median: {stats.median}
</p>
<p>
  Max: {stats.max}
</p>
<p>
  Min: {stats.min}
</p>
<p>
  Deviation: {stats.deviation}
</p>
<p>
  Quantile 95: {stats.q95}
</p>
