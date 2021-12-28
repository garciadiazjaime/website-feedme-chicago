<script>
	import { onMount } from 'svelte'

	export let users;
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
		return users.map(item => ({text: item.username.toLowerCase(), size: item.total}))
	}
</script>

<script context="module">
	export async function preload() {
		const response = await this.fetch('/users.json');
		const users = await response.json();

		return {
			users
		}
	}
</script>

<svelte:head>
	<title>Chicago Food Posts | users</title>
</svelte:head>

<h2>World Cloud</h2>
<svelte:component this={WordCloud} data={getWordCloudData()} fontScale={10} />

<h2>Histogram</h2>
<svelte:component this={Histogram} data={users} x={d => d.total} />

<h1>Posts users</h1>
<svelte:component 
	this={Bars} 
	data={users} 
	value={d => d.username} 
	onclick={(d) => window.open(`https://www.instagram.com/${d.username}/`)} />


