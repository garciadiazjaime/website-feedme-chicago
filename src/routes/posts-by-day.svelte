<script>
	import { onMount } from 'svelte'

	export let summary;
	let Bars
	let Histogram

	onMount(async() => {
		window.d3 = await import('d3')
		
		const BarsComponent = await import('../components/BarsSummary.svelte')
		Bars = BarsComponent.default

		const HistogramComponent = await import('../components/Histogram.svelte')
		Histogram = HistogramComponent.default
	})
</script>

<script context="module">
	export async function preload() {
		const response = await this.fetch('/posts-summary.json');
		const summary = await response.json();

		return {
			summary
		}
	}
</script>

<svelte:head>
	<title>Chicago Food Posts</title>
</svelte:head>

<h1>Posts by day</h1>
<div>Number of posts using #chicagofood in the last 30 days</div>
<svelte:component this={Bars} data={summary} />

<h2>Histogram</h2>
<svelte:component this={Histogram} data={summary} />
