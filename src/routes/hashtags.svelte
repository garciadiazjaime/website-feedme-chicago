<script>
	import { onMount } from 'svelte'

	export let hashtags;
	let Bars
  let Histogram
	let WordCloud

	onMount(async() => {
		window.d3 = await import('d3')
		window.d3Cloud = (await import('d3-cloud')).default
		
		const BarsComponent = await import('../components/Bars.svelte')
		Bars = BarsComponent.default

    const HistogramComponent = await import('../components/Histogram.svelte')
		Histogram = HistogramComponent.default

		const WordCloudComponent = await import('../components/WordCloud.svelte')
		WordCloud = WordCloudComponent.default
	})

	function getWordCloudData() {
		return hashtags.map(item => ({text: item.hashtag.replace('#', '').toLowerCase(), size: item.total}))
	}
</script>

<script context="module">
	export async function preload() {
		const response = await this.fetch('/hashtags.json');
		const hashtags = await response.json();

		return {
			hashtags
		}
	}
</script>

<svelte:head>
	<title>Chicago Food Posts | Hashtags</title>
</svelte:head>

<h2>World Cloud</h2>
<svelte:component this={WordCloud} data={getWordCloudData()} />

<h2>Histogram</h2>
<svelte:component this={Histogram} data={hashtags} x={d => d.total} />

<h1>Posts Hashtags</h1>
<svelte:component 
	this={Bars} 
	data={hashtags} 
	value={d => d.hashtag} 
	onclick={(d) => window.open(`https://www.instagram.com/explore/tags/${d.hashtag.replace('#', '')}/`)} />


