<script>
  import { onMount } from 'svelte'

  export let data
  export let fontScale = 2

  let el
  onMount(async({
  size = group => group.length, // Given a grouping of words, returns the size factor for that word
  word = d => d, // Given an item of the data array, returns the word
  marginTop = 0, // top margin, in pixels
  marginRight = 0, // right margin, in pixels
  marginBottom = 0, // bottom margin, in pixels
  marginLeft = 0, // left margin, in pixels
  width = 1200, // outer width, in pixels
  height = 800, // outer height, in pixels
  maxWords = 250, // maximum number of words to extract from the text
  fontFamily = "sans-serif", // font family
  padding = 0, // amount of padding between the words (in pixels)
  rotate = 0, // a constant or function to rotate the words
  invalidation // when this promise resolves, stop the simulation
  } = {}) => {
    // const words = typeof text === "string" ? text.split(/\W+/g) : Array.from(text);
  
    // const data = d3.rollups(words, size, w => w)
    //   .sort(([, a], [, b]) => d3.descending(a, b))
    //   .slice(0, maxWords)
    //   .map(([key, size]) => ({text: word(key), size}));
    console.log('data', data)
    
    const svg = d3.select(el)
      .append("svg")
      .attr("viewBox", [0, 0, width, height])
      .attr("width", width)
      .attr("font-family", fontFamily)
      .attr("text-anchor", "middle")
      .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

    const g = svg.append("g").attr("transform", `translate(${marginLeft},${marginTop})`);

    const cloud = d3Cloud()
        .size([width - marginLeft - marginRight, height - marginTop - marginBottom])
        .words(data.slice(0, maxWords))
        .padding(padding)
        .rotate(rotate)
        .font(fontFamily)
        .fontSize(d => Math.sqrt(d.size) * fontScale)
        .on("word", ({size, x, y, rotate, text}) => {
          g.append("text")
              .attr("font-size", size)
              .attr("transform", `translate(${x},${y}) rotate(${rotate})`)
              .text(text);
        });

    cloud.start();
  })
</script>

<div bind:this={el} class="chart"></div>
