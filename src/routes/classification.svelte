<script>
	import { onMount } from 'svelte'

	export let classification;
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
		return classification.map(item => ({text: item.className.split(',')[0].replace(' ', '-').toLowerCase(), size: item.total}))
	}
</script>

<script context="module">
	export async function preload() {
		const response = await this.fetch('/classification.json');
		const classification = await response.json();

		return {
			classification
		}
	}
</script>

<svelte:head>
	<title>Chicago Food Posts | Classifications</title>
</svelte:head>

<h2>World Cloud</h2>
<svelte:component this={WordCloud} data={getWordCloudData()} />

<h2>Histogram</h2>
<svelte:component this={Histogram} data={classification} x={d => d.total} />

<h1>Posts Classifications</h1>
<svelte:component this={Bars} data={classification} />


