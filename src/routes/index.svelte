<script>
	import { onMount } from 'svelte'


	const postsByDay = [
		[
			{
				date: new Date('2000-01-01'),
				name: 'Coca-Cola',
				category: 'Beverages',
				value: 72537
			}, {
				date: new Date('2000-01-01'),
				name: 'Microsoft',
				category: 'Technology',
				value: 70196
			},
			{
				date: new Date('2000-01-01'),
				name: 'IBM,Business ',
				category: 'Services',
				value: 53183
			},
			{
				date: new Date('2000-01-01'),
				name: 'Intel,',
				category: 'Technology',
				value: 39048
			},
			{
				date: new Date('2000-01-01'),
				name: 'Nokia,',
				category: 'Technology',
				value: 38528
			},
			{
				date: new Date('2000-01-01'),
				name: 'GE,',
				category: 'Diversified',
				value: 38127
			},
			{
				date: new Date('2000-01-01'),
				name: 'Ford,',
				category: 'Automotive',
				value: 36368
			},
			{
				date: new Date('2000-01-01'),
				name: 'Disney,',
				category: 'Media',
				value: 33553
			},
			{
				date: new Date('2000-01-01'),
				name: 'McDonalds',
				category: 'Restaurants',
				value: 27859
			},
		],
		[
			{
				date: new Date('2000-02-01'),
				name: 'Coca-Cola',
				category: 'Beverages',
				value: 83527
			}, {
				date: new Date('2000-02-01'),
				name: 'Microsoft',
				category: 'Technology',
				value: 73126
			},
			{
				date: new Date('2000-02-01'),
				name: 'IBM,Business ',
				category: 'Services',
				value: 53123
			},
			{
				date: new Date('2000-02-01'),
				name: 'Intel,',
				category: 'Technology',
				value: 43028
			},
			{
				date: new Date('2000-02-01'),
				name: 'Nokia,',
				category: 'Technology',
				value: 33528
			},
			{
				date: new Date('2000-02-01'),
				name: 'GE,',
				category: 'Diversified',
				value: 33127
			},
			{
				date: new Date('2000-02-01'),
				name: 'Ford,',
				category: 'Automotive',
				value: 53328
			},
			{
				date: new Date('2000-02-01'),
				name: 'Disney,',
				category: 'Media',
				value: 33523
			},
			{
				date: new Date('2000-02-01'),
				name: 'McDonalds',
				category: 'Restaurants',
				value: 13829
			},
		],
		
		[
			{
				date: new Date('2000-01-01'),
				name: 'Coca-Cola - AA',
				category: 'Beverages',
				value: 72537
			}, {
				date: new Date('2000-01-01'),
				name: 'Microsoft - AA',
				category: 'Technology',
				value: 70196
			},
			{
				date: new Date('2000-01-01'),
				name: 'IBM,Business  - AA',
				category: 'Services',
				value: 53183
			},
			{
				date: new Date('2000-01-01'),
				name: 'Intel, - AA',
				category: 'Technology',
				value: 39048
			},
			{
				date: new Date('2000-01-01'),
				name: 'Nokia, - AA',
				category: 'Technology',
				value: 38528
			},
			{
				date: new Date('2000-01-01'),
				name: 'GE, - AA',
				category: 'Diversified',
				value: 38127
			},
			{
				date: new Date('2000-01-01'),
				name: 'Ford, - AA',
				category: 'Automotive',
				value: 36368
			},
			{
				date: new Date('2000-01-01'),
				name: 'Disney, - AA',
				category: 'Media',
				value: 33553
			},
			{
				date: new Date('2000-01-01'),
				name: 'McDonalds - AA',
				category: 'Restaurants',
				value: 27859
			},
		],
	]

	let d3
	let el;
	let svg
	const duration = 2000

	function initChart({svg, data, xScale}) {
		svg
			.selectAll("div")
			.data(data)
			.enter()
			.append("div")
			.style("width", function(item) {
				return xScale(item.value) + "px";
			})
			.text(function(item) {
				return `${item.name} / ${item.value}`;
			})
	}

	function updateChart({svg, data, xScale}) {
		svg
			.selectAll("div")
			.data(data)
			.transition()
			.ease(d3.easeLinear)
			.duration(duration)
			.style("width", function(item) {
				return xScale(item.value) + "px";
			})
			.text(function(item) {
				return `${item.name} / ${item.value}`;
			})
	}

	async function waitFor(timeout = 1000) {
		return new Promise(resolve => {
			setTimeout(resolve, timeout);
		})
	}

	onMount(async() => {
		d3 = await import('d3')

		svg = d3.select(el)

		const width = 500
		const maxValue = 60000
		const xScale = d3.scaleLinear()
			.domain([0, maxValue])
			.range([0, width]);


		initChart({svg, xScale, data: postsByDay[0]})
		
		await waitFor(duration)

		updateChart({svg, xScale, data: postsByDay[1]})	

		await waitFor(duration)
		
		updateChart({svg, xScale, data: postsByDay[2]})	
	})
</script>

<style>
	.chart :global(div) {
		font: 10px sans-serif;
		background-color: steelblue;
		text-align: right;
		padding: 3px;
		margin: 1px;
		color: white;
	}
</style>

<svelte:head>
	<title>Sapper project template</title>
</svelte:head>

<h1>Posts by Day</h1>

<div bind:this={el} class="chart"></div>
