<script>
	import { onMount } from 'svelte'

	export let topics;
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
		return topics.map(item => ({text: item.className.split(',')[0].replace(' ', '-').toLowerCase(), size: item.total}))
	}
</script>

<script context="module">
	export async function preload() {
		const response = await this.fetch('/topics.json');
		const topics = await response.json();

		return {
			topics
		}
	}
</script>

<svelte:head>
	<title>Chicago Food Posts | Topics</title>
</svelte:head>

<h2>World Cloud</h2>
<svelte:component this={WordCloud} data={getWordCloudData()} />

<h2>Histogram</h2>
<svelte:component this={Histogram} data={topics} x={d => d.total} />

<h1>Posts Topics</h1>
<svelte:component this={Bars} data={topics} />


