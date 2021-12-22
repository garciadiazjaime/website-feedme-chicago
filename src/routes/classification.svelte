<script>
	import { onMount } from 'svelte'

	export let classification;
	let Bars
  let Histogram

	onMount(async() => {
		window.d3 = await import('d3')
		
		const BarsComponent = await import('../components/Bars.svelte')
		Bars = BarsComponent.default

    const HistogramComponent = await import('../components/Histogram.svelte')
		Histogram = HistogramComponent.default
	})
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

<h2>Histogram</h2>
<svelte:component this={Histogram} data={classification} x={d => d.total} />

<h1>Posts Classifications</h1>
<svelte:component this={Bars} data={classification} />


