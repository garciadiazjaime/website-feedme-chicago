<script>
	import { onMount } from 'svelte'

	let preview = {};
	let quotes = {}
	let msgs = {}
	const API_URL = process.env.API_URL
	
	async function getPreview() {
		const response = await fetch(`${API_URL}/posts/preview`)
    return await response.json()
	}

	async function getQuote(post, i) {
		quotes[i] = '...'

		const query = post.classification[0].className.split(',')[0]

		const response = await fetch(`${API_URL}/quote?query=${encodeURIComponent(query)}`)

		const data = await response.json()
		if (data.text){
			quotes[i] = `${data.text} -${data.author}- | 📷 @${post.user.username}`
		} else {
			quotes[i] = 'no quote :('
		}
	}

	async function schedule(post, i) {
		msgs[i] = 'scheduling...'
		if (!quotes[i]) {
			msgs[i] = 'quote empty'
			return null
		}

		const data = {
			id: post.id,
			username: post.user.username,
			caption: quotes[i],
			imageURL: post.imageUrl,
		}

		const response = await fetch(`${API_URL}/posts/schedule`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data)
		})

		const result = await response.json()
		console.log(result)
		msgs[i] = 'scheduled'
	}

	onMount(async() => {
		preview = await getPreview()
	})
</script>

<style>
	img {
		width: 400px;
		height: auto;
	}
</style>

<svelte:head>
	<title>Chicago Food Posts | Preview</title>
</svelte:head>

{#if preview && preview.user}
	<h2><a href={`https://instagram.com/${preview.user.username}/`} target="_blank">{preview.user.username} [{preview.user.total}]</a></h2>

	<table>
		<tr>
			<th></th>
			<th>caption</th>
			<th>likeCount</th>
			<th>commentsCount</th>
			<th>classification</th>
			<th>topics</th>
			<th>location</th>
			<th>quote</th>
			<th>schedule</th>
		</tr>
		{#each preview.posts as post, i}
			<tr>
				<td>
					<a href={post.permalink} target="_blank">
						<img src={post.imageUrl} alt="">
					</a>
				</td>
				<td>
					{post.caption}
				</td>
				<td>
					{post.likeCount}
				</td>
				<td>
					{post.commentsCount}
				</td>
				<td>
					{#if post.classification}
						{#each post.classification as classification}
							<span>{classification.className}</span> <br />
						{/each}
					{/if}
				</td>
				<td>
					{#if post.topics}
						{#each post.topics as topic}
							<span>{topic.className}</span> <br />
						{/each}
					{/if}
				</td>
				<td>
					{#if post.location}
						<a href={`https://www.instagram.com/explore/locations/${post.location.id}/`} target="_blank">
							{post.location.name}
						</a>
					{/if}
				</td>
				<td>
					<button on:click={() => getQuote(post, i)}>Get Quote</button>
					<br />
					{quotes[i] || ''}
				</td>
				<th>
					<button on:click={() => schedule(post, i)}>Schedule</button>
					<br />
					{msgs[i] || ''}
				</th>
			</tr>
		{/each}
	</table>
{:else}
loading...
{/if}
