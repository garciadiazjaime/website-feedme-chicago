<script>
	import { onMount } from 'svelte'

	export let posts;


	onMount(async() => {
		
	})
</script>
<script context="module">
	export async function preload() {
		const response = await this.fetch('/posts.json');
		const posts = await response.json();

		return {
			posts
		}
	}
</script>

<style>
  .main {

    margin: 0 auto;
  }

  .post {
    border: 1px solid black;
    margin-bottom: 20px;
    display: flex;
  }
  img {
    width: 300px;
    height: auto;
    object-fit: cover;
    border: #CCC solid 1px;
  }
  .content {
    padding: 12px;
    min-width: 0;
  }
  .caption {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
  }
</style>

<section class="main">
  {#each posts.slice(0, 10) as post}
  <div class="post">
    <img src={`http://127.0.0.1:3030/post/${post.id}/image`} alt="">
    <div class="content">
      <h2 class="caption">{post.caption}</h2>
      <p>
        <span>likeCount: {post.likeCount}</span>
        <span>commentsCount: {post.commentsCount}</span>
      </p>
      <p>
        <a href={`https://www.instagram.com/${post.user.username}`} target="_blank">@{post.user.username}</a>
      </p>
      <p>
        <a href={post.permalink} target="_blank">post</a>
      </p>
      <p>
        {#if post.location && post.location.id}
        <a href={`https://www.instagram.com/explore/locations/${post.location.id}/`} target="_blank">location: {post.location.name}</a>
        {/if}
      </p>
      <p>
        {post.updatedAt}
      </p>
    </div>
  </div>
  {/each}
</section>
