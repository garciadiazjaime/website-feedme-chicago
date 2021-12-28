<script>
	import { onMount } from 'svelte'

	export let usersLikes;
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
		return usersLikes.map(item => ({text: item.username.toLowerCase(), size: item.total}))
	}
</script>

<script context="module">
	export async function preload() {
		const response = await this.fetch('/likes.json');
		const usersLikes = await response.json();

		return {
			usersLikes
		}
	}
</script>

<svelte:head>
	<title>Chicago Food Posts | User Likes</title>
</svelte:head>

<h2>World Cloud</h2>
<svelte:component this={WordCloud} data={getWordCloudData()} fontScale={1} />

<h2>Histogram</h2>
<svelte:component this={Histogram} data={usersLikes} x={d => d.total} />

<h1>User Likes</h1>
<svelte:component 
	this={Bars} 
	data={usersLikes} 
	value={d => d.username} 
	onclick={(d) => window.open(`https://www.instagram.com/${d.username}/`)} />


