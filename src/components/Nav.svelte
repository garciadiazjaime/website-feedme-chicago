<script>
	export let segment;
</script>

<style>
	nav {
		border-bottom: 1px solid rgba(255,62,0,0.1);
		font-weight: 300;
		padding: 0 1em;
	}

	ul {
		margin: 0;
		padding: 0;
	}

	/* clearfix */
	ul::after {
		content: '';
		display: block;
		clear: both;
	}

	li {
		display: block;
		float: left;
	}

	[aria-current] {
		position: relative;
		display: inline-block;
	}

	[aria-current]::after {
		position: absolute;
		content: '';
		width: calc(100% - 1em);
		height: 2px;
		background-color: rgb(255,62,0);
		display: block;
		bottom: -1px;
	}

	a {
		text-decoration: none;
		padding: 1em 0.5em;
		display: block;
	}
</style>

<nav>
	<ul>
		<li><a aria-current="{segment === undefined ? 'page' : undefined}" href=".">home</a></li>
		<li><a aria-current="{segment === 'stats' ? 'page' : undefined}" href="stats">stats</a></li>
		<li><a aria-current="{segment === 'classification' ? 'page' : undefined}" href="classification">classification</a></li>
		<li><a aria-current="{segment === 'topics' ? 'page' : undefined}" href="topics">topics</a></li>
		<li><a aria-current="{segment === 'hashtags' ? 'page' : undefined}" href="hashtags">hashtags</a></li>
		<li><a aria-current="{segment === 'users' ? 'page' : undefined}" href="users">users</a></li>
		<li><a aria-current="{segment === 'likes' ? 'page' : undefined}" href="likes">likes</a></li>
		<li><a aria-current="{segment === 'preview' ? 'page' : undefined}" href="preview">preview</a></li>
	</ul>
</nav>
