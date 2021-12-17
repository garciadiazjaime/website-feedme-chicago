<script>
	import Bars from '../components/BarsAnimated.svelte'

	export let postsByDay;
</script>

<script context="module">
	export async function preload() {
		const response = await this.fetch('/posts-by-day.json');
		const postsByDay = await response.json();
		const blockUsers = [
			'manu___mg',
			'tboxbarcrawls',
			'jana_berlin.food',
			'wilmasfoodandnature',
			'nataliesfoodgallery',
			'chicagofoodauthority',
		]
		const postsByDayCleaned = postsByDay
			.map(items =>
				items.filter(post => 
					!blockUsers.includes(post.username)
				)
			)

		return {
			postsByDay: postsByDayCleaned
		}
	}
</script>

<svelte:head>
	<title>Chicago Food Posts</title>
</svelte:head>

<h1>Top 10 Accounts with more Interaction</h1>
<div>With the hashtag #chicagofood in the last 30 days</div>
<Bars postsByDay={postsByDay} />
