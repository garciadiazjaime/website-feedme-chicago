<script>
	import { onMount } from 'svelte'

  export let data

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
  const height = 800 - margin.top - margin.bottom

  function initChart({dataset, xScale, yScale, color }) {
    const bars = svg.selectAll("rect").data(dataset)

    bars
      .enter()
      .append("rect")
      .attr("x", (d) => xScale(d._id))
      .attr("y", (d) => yScale(d.count))
      .attr("width", xScale.bandwidth())
      .attr("height", d => height - yScale(d.count))
      .attr("fill", (d)  => color(d.count))
    
    bars
      .enter()
      .append("text")
      .text((d) => d.count)
      .attr("x", (d) => xScale(d._id) + xScale.bandwidth() / 2)
      .attr("y", (d) => yScale(d.count) - 5)
      .attr("fill", "black")
      .attr("font-family", "sans-serif")
      .attr("font-size", "16px")
      .attr("text-anchor", "middle")
  }

  async function drawBars() {
    const	parseDate = d3.isoParse

    data.forEach(function(d) {
      d._id = parseDate(d._id);
    });

    const xScale = d3.scaleBand()
      .domain(data.map(d => d._id))
      .rangeRound([0, width], .05)
      .padding(0.1);

    const maxValue = d3.max(data, item => item.count)
    const yScale = d3.scaleLinear()
      .domain([0, maxValue])
      .range([height, 0]);

    const color = (value) => d3.interpolateBlues( value / maxValue )

    const xAxis = d3.axisBottom()
      .scale(xScale)
      .tickFormat(d3.timeFormat("%m.%d"));
    
    const yAxis = d3.axisLeft()
      .scale(yScale)
    
    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis.ticks(null).tickSize(0))
    
    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis.ticks(null).tickSize(0))

    initChart({dataset: data, xScale, yScale, color })
  }

  function setStats() {
    stats.average = d3.mean(data, d => d.count)
    stats.median = d3.median(data, d => d.count)
    stats.max = d3.max(data, d => d.count)
    stats.min = d3.min(data, d => d.count)
    stats.deviation = d3.deviation(data, d => d.count)
    stats.q95 = d3.quantile(data, 0.95, d => d.count)
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
