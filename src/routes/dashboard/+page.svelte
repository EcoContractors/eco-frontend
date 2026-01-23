<script lang="ts">
	import Dashboard from '../../components/dashboard/Dashboard.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<Dashboard user={data.user} />
