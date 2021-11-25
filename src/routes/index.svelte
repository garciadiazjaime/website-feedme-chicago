<script>
	import Bars from '../components/bars.svelte'

	export let postsByDay;
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

<svelte:head>
	<title>Chicago Food Posts</title>
</svelte:head>

<h1>Posts by Day</h1>
<Bars data={postsByDay} />
