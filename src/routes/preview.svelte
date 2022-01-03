<script>
	import { onMount } from 'svelte'

	let preview = {}
	let quotes = {}
	let msgs = {}
	const API_URL = process.env.API_URL
	
	async function getPreview() {
		const response = await fetch(`${API_URL}/posts/preview`)
    return await response.json()
	}

	function getQuery(value) {
		return value.split(',')[0].toLowerCase().replace(/\s/g,'+')
	}

	async function getQuote(post, classification) {
		const { _id: key } = classification
		quotes[key] = '...'
		
		const query = getQuery(classification.className)
		const response = await fetch(`${API_URL}/quote?query=${encodeURIComponent(query)}`)
		const data = await response.json()

		if (data.text){
			quotes[key] = `${data.text} -${data.author}- | 📷 @${post.user.username}`
		} else {
			quotes[key] = 'no quote :('
		}
	}

	async function schedule(post, classification) {
		const { _id: key } = classification

		msgs[key] = 'scheduling...'
		if (!quotes[key]) {
			msgs[key] = 'quote empty'
			return null
		}

		const data = {
			id: post.id,
			username: post.user.username,
			imageURL: post.imageUrl,
			caption: quotes[key],
		}

		const response = await fetch(`${API_URL}/posts/schedule`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data)
		})

		await response.json()
		msgs[key] = 'scheduled'
	}

	onMount(async() => {
		preview = await getPreview()
	})
</script>

<style>
	img {
		width: 300px;
		height: auto;
	}
	table table {
		border-collapse: collapse;
	}
	table table, table table td {
		border: 1px solid black;
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
			<th>likes</th>
			<th>comments</th>
			<th>location</th>
			<th>classification</th>
			<th>topics</th>
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
					{#if post.location}
						<a href={`https://www.instagram.com/explore/locations/${post.location.id}/`} target="_blank">
							{post.location.name}
						</a>
					{/if}
				</td>
				<td>
					{#if post.classification}
						<table>
							{#each post.classification as classification}
								<tr>
									<td>
										{classification.className}
									</td>
									<td>
										{Math.round(classification.probability * 100, 2)}%
									</td>
									<td>
										<button on:click={() => getQuote(post, classification)}>Get Quote</button>
									</td>
									<td>
										{quotes[classification._id] || ''}
									</td>
									<td>
										<button on:click={() => schedule(post, classification)}>Schedule</button>
										<br />
										{msgs[classification._id] || ''}
									</td>
								</tr>
							{/each}
						</table>
					{/if}
				</td>
				<td>
					{#if post.topics}
						<table>
							{#each post.topics as topic}
								<tr>
									<td>
										{topic.className}
									</td>
									<td>
										{Math.round(topic.probability, 2)}%
									</td>
									<td>
										<button on:click={() => getQuote(post, topic)}>Get Quote</button>
									</td>
									<td>
										{quotes[topic._id] || ''}
									</td>
									<td>
										<button on:click={() => schedule(post, topic)}>Schedule</button>
										<br />
										{msgs[topic._id] || ''}
									</td>
								</tr>
							{/each}
						</table>
					{/if}
				</td>
			</tr>
		{/each}
	</table>
{:else}
loading...
{/if}
