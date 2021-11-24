<script>
	import { onMount } from 'svelte'
	import drawBars from '../support/bars'

	export let postsByDay;
	let d3
	let el;
	
	onMount(async() => {
		d3 = await import('d3')

		await drawBars({ d3, el, postsByDay })
	})
</script>

<script context="module">
	export async function preload() {
		const response = await this.fetch('/posts-by-day.json');
		const postsByDay = await response.json();

		return {
			postsByDay
		}
	}
</script>

<style>
	.chart :global(div) {
		font: 10px sans-serif;
		background-color: steelblue;
		text-align: right;
		padding: 12px;
		margin: 1px;
		color: white;
	}
</style>

<svelte:head>
	<title>Sapper project template</title>
</svelte:head>

<h1>Posts by Day</h1>

<div bind:this={el} class="chart"></div>
