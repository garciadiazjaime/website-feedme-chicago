const duration = 2000
const getWidth = (item, xScale) => `${xScale(item.total)}px`
const getText = (item) => `${item.username} / ${item.total}`
const waitFor = async (timeout = 1000) => new Promise(resolve => setTimeout(resolve, timeout))

function updateChart({d3, el, data, xScale, i}) {
  const svg = d3.select(el)
    .selectAll("div")
    .data(data)

  if (i === 0) {
    svg
      .enter()
      .append("div")
      .style("width", item => getWidth(item, xScale))
      .text(getText)
  } else {
    svg
      .transition()
      .duration(duration)
      .style("width", item => getWidth(item, xScale))
      .text(getText)
  }
}

async function drawBars({ d3, el, postsByDay }) {
  const width = 500
  const maxValue = 600
  const xScale = d3.scaleLinear()
    .domain([0, maxValue])
    .range([0, width]);
  
  let i = 0

  for (const data of postsByDay){
    updateChart({d3, el, xScale, data: data.posts, i})	
    await waitFor(duration)
    i++
  }
}


export default drawBars
