<script lang="ts">
	import type { PageData } from './$types';

	const { data } = $props<{ data: PageData }>();

	const isSuccess = data.approvalStatus === 'success';
	const isError = data.approvalStatus === 'error';
</script>

<svelte:head>
	<title>Agent Approval</title>
</svelte:head>

<div class="approval-page">
	<div class="container">
		{#if isSuccess}
			<div class="icon success">✓</div>
			<h2>Success!</h2>
			<p>{data.message}</p>
			<a href="/" class="btn">Go to Homepage</a>
		{:else if isError}
			<div class="icon error">✗</div>
			<h2>Error</h2>
			<p>{data.message}</p>
			<a href="/" class="btn">Go to Homepage</a>
		{:else}
			<div class="spinner"></div>
			<h2>Processing...</h2>
			<p>Please wait while we process the agent approval.</p>
		{/if}
	</div>
</div>

<style>
	.approval-page {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 80vh;
		text-align: center;
	}
	.container {
		max-width: 500px;
		padding: 2rem;
	}
	.spinner {
		display: inline-block;
		width: 50px;
		height: 50px;
		border: 3px solid rgba(0, 0, 0, 0.3);
		border-radius: 50%;
		border-top-color: #333;
		animation: spin 1s ease-in-out infinite;
		margin-bottom: 1rem;
	}
	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
	h2 {
		font-size: 2rem;
		font-weight: bold;
		margin-bottom: 0.5rem;
	}
	p {
		color: #666;
		margin-bottom: 2rem;
	}
	.icon {
		font-size: 3rem;
		line-height: 1;
		margin-bottom: 1rem;
	}
	.icon.success {
		color: green;
	}
	.icon.error {
		color: red;
	}
	.btn {
		display: inline-block;
		background-color: #333;
		color: white;
		padding: 0.75rem 1.5rem;
		border-radius: 5px;
		text-decoration: none;
	}
</style>
