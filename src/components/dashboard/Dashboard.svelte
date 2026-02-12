<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { invalidateAll } from '$app/navigation';
	import { Copy, Check, Upload, TrendingUp, Users, Star, DollarSign, RefreshCw, LogOut } from 'lucide-svelte';
	import type { User } from '$lib/types';
	import { AgentStatus } from '$lib/types';
	import ClientsTable from './ClientsTable.svelte';

	interface Props {
		user?: User | null;
		stats?: AgentStats | null;
		clients?: ClientsData | null;
		error?: string | null;
		onClose?: () => void;
	}

	let { user, stats: serverStats = null, clients = null, error: serverError = null, onClose }: Props = $props();

	// API Response type
	interface AgentStats {
		fullName: string;
		rating: number;
		totalReferrals: number;
		totalClosedDeals: number;
		activeBookings: number;
		totalCommissions: number;
		pendingCommissions: number;
		paidCommissions: number;
		conversionRate: number;
		referralLink: string;
	}

	interface ClientsData {
		total: number;
		requests: Array<{
			id: string;
			quoteNumber: string;
			clientName: string;
			companyName: string;
			jobScope: string;
			equipment: string;
			duration: string;
			totalAmount: number;
			status: string;
		}>;
	}

	// Default stats object
	const defaultStats: AgentStats = {
		fullName: '',
		rating: 0,
		totalReferrals: 0,
		totalClosedDeals: 0,
		activeBookings: 0,
		totalCommissions: 0,
		pendingCommissions: 0,
		paidCommissions: 0,
		conversionRate: 0,
		referralLink: ''
	};
	 
	function toNumber(value: unknown, fallback = 0): number {
	const n = Number(value);
	return Number.isFinite(n) ? n : fallback;
}
	// Derived values
	let displayName = $derived(user ? `${user.firstName} ${user.lastName}` : 'Guest');
	let firstName = $derived(user?.firstName || 'User');
	let userId = $derived(user?.id?.slice(0, 8).toUpperCase() || 'N/A');
	let agentStatus = $derived(user?.agentStatus);
	let isApprovedAgent = $derived(
		user?.role === 'agent' && agentStatus === AgentStatus.approved
	);

	// Use derived to reactively get stats - merges serverStats with defaults
	let stats = $derived(
	serverStats
		? {
				...defaultStats,
				...serverStats,
				rating: toNumber(serverStats.rating),
				totalReferrals: toNumber(serverStats.totalReferrals),
				totalClosedDeals: toNumber(serverStats.totalClosedDeals),
				activeBookings: toNumber(serverStats.activeBookings),
				totalCommissions: toNumber(serverStats.totalCommissions),
				pendingCommissions: toNumber(serverStats.pendingCommissions),
				paidCommissions: toNumber(serverStats.paidCommissions),
				conversionRate: toNumber(serverStats.conversionRate)
		  }
		: defaultStats
);


	let error = $derived(serverError);

	let copied = $state(false);
	let profileImage = $state<string | null>(null);
	let fileInput: HTMLInputElement;
	let refreshing = $state(false);

	// Refetch dashboard data when user returns to this tab, and every 30s
	let refreshInterval: ReturnType<typeof setInterval>;
	onMount(() => {
		const handleFocus = () => invalidateAll();
		window.addEventListener('focus', handleFocus);
		refreshInterval = setInterval(() => invalidateAll(), 30000);
		return () => {
			window.removeEventListener('focus', handleFocus);
			if (refreshInterval) clearInterval(refreshInterval);
		};
	});
	onDestroy(() => {
		if (refreshInterval) clearInterval(refreshInterval);
	});

	async function refreshStats() {
		refreshing = true;
		await invalidateAll();
		refreshing = false;
	}

	function handleLogout() {
		const form = document.createElement('form');
		form.method = 'POST';
		form.action = '/logout';
		document.body.appendChild(form);
		form.submit();
	}

	async function copyToClipboard(text: string) {
		await navigator.clipboard.writeText(text);
		copied = true;
		setTimeout(() => (copied = false), 2000);
	}

	function handleImageChange(event: Event) {
		const input = event.target as HTMLInputElement;
		if (!input.files || !input.files[0]) return;

		const file = input.files[0];

		if (!file.type.startsWith('image/')) {
			alert('Please upload a valid image file');
			return;
		}

		const reader = new FileReader();
		reader.onload = () => {
			profileImage = reader.result as string;
		};
		reader.readAsDataURL(file);
	}

	function formatCurrency(amount: number): string {
		return new Intl.NumberFormat('en-NG', {
			style: 'currency',
			currency: 'NGN',
		}).format(amount);
	}
</script>

<div class="min-h-screen pt-10">
	<section class="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
		<!-- Header Section -->
		<div class="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
			<div>
				<h1 class="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
					Welcome back, {firstName}! 👋
				</h1>
				<p class="text-gray-600 text-sm md:text-base">
					Here's what's happening with your projects today
				</p>
			</div>
			<div class="flex items-center gap-2 shrink-0">
				{#if isApprovedAgent}
					<button
						type="button"
						class="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-60"
						onclick={refreshStats}
						disabled={refreshing}
						title="Refresh stats (e.g. after someone uses your referral link)"
					>
						<RefreshCw class="w-4 h-4 {refreshing ? 'animate-spin' : ''}" />
						{refreshing ? 'Refreshing...' : 'Refresh stats'}
					</button>
				{/if}
				<button
					type="button"
					onclick={handleLogout}
					class="flex items-center gap-2 px-4 py-2 rounded-lg border border-primary bg-white text-gray-700 text-sm font-medium hover:bg-primary/5 transition-colors"
				>
					<LogOut class="w-4 h-4 text-gray-700" />
					Logout
				</button>
			</div>
		</div>

		<!-- Profile Card -->
		<div
			class="bg-white rounded-2xl shadow-sm border border-primary p-6 md:p-8 mb-6 hover:shadow-md transition-shadow"
		>
			<div class="flex flex-col md:flex-row items-start md:items-center gap-6">
				<!-- Avatar -->
				<div class="relative group">
					<button
						type="button"
						class="relative w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-white shadow-lg overflow-hidden bg-linear-to-br from-primary to-green-600 flex items-center justify-center transition-transform hover:scale-105"
						onclick={() => fileInput.click()}
						title="Change profile picture"
					>
						{#if profileImage}
							<img src={profileImage} alt="Profile" class="w-full h-full object-cover" />
						{:else}
							<span class="text-white text-3xl md:text-4xl font-bold">
								{user?.firstName?.[0] || 'U'}{user?.lastName?.[0] || ''}
							</span>
						{/if}

						<!-- Hover overlay -->
						<div
							class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
						>
							<Upload class="w-6 h-6 text-white" />
						</div>
					</button>

					<input
						type="file"
						accept="image/*"
						class="hidden"
						bind:this={fileInput}
						onchange={handleImageChange}
					/>

					<!-- Role Badge -->
					<div
						class="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-linear-to-r from-green-600 to-green-700 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md"
					>
						{user?.role || 'Customer'}
					</div>
				</div>

				<!-- User Info -->
				<div class="flex-1">
					<h2 class="text-xl md:text-2xl font-bold text-gray-900 mb-1">{displayName}</h2>
					<p class="text-gray-600 mb-3 text-sm md:text-base">{user?.email || 'No email'}</p>

					<div class="flex flex-wrap items-center gap-4">
						<!-- User ID -->
						<div class="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg">
							<span class="text-xs text-gray-500 font-medium">ID:</span>
							<span class="text-sm font-semibold text-gray-900">{userId}</span>
						</div>

						{#if isApprovedAgent && stats.rating > 0}
							<!-- Rating from API -->
							<div class="flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-lg">
								<Star class="w-4 h-4 text-amber-500 fill-amber-500" />
								<span class="text-sm font-semibold text-amber-700">
									{stats.rating.toFixed(1)}
								</span>
							</div>
						{/if}
					</div>
				</div>

				<!-- Logout Button -->
				<button
					type="button"
					onclick={handleLogout}
					class="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors text-sm font-medium"
					title="Logout"
				>
					<LogOut class="w-4 h-4" />
					<span>Logout</span>
				</button>
			</div>
		</div>

		
		{#if error}
			<div class="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
				<p class="text-red-800 text-sm font-medium">{error}</p>
			</div>
		{/if}

		<!-- Statistics Cards -->
		{#if isApprovedAgent}
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
				<!-- Total Referrals -->
				<div
					class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all hover:-translate-y-1"
				>
					<div class="flex items-center justify-between mb-4">
						<div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
							<Users class="w-6 h-6 text-blue-600" />
						</div>
						<span class="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded"
							>Total</span
						>
					</div>
					<h3 class="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
						{stats.totalReferrals ?? 0}
					</h3>
					<p class="text-sm text-gray-600">Total Referrals</p>
				</div>

				<!-- Active Bookings -->
				<div
					class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all hover:-translate-y-1"
				>
					<div class="flex items-center justify-between mb-4">
						<div class="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
							<TrendingUp class="w-6 h-6 text-amber-600" />
						</div>
						<span class="text-xs font-medium text-amber-700 bg-amber-100 px-2 py-1 rounded"
							>Active</span
						>
					</div>
					<h3 class="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
						{stats.activeBookings ?? 0}
					</h3>
					<p class="text-sm text-gray-600">Active Bookings</p>
				</div>

				<!-- Closed Deals -->
				<div
					class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all hover:-translate-y-1"
				>
					<div class="flex items-center justify-between mb-4">
						<div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
							<Check class="w-6 h-6 text-green-600" />
						</div>
						<span class="text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded"
							>Done</span
						>
					</div>
					<h3 class="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
						{stats.totalClosedDeals ?? 0}
					</h3>
					<p class="text-sm text-gray-600">Closed Deals</p>
				</div>

				<!-- Total Commissions -->
				<div
					class="bg-linear-to-br from-primary to-green-600 rounded-xl shadow-sm p-6 hover:shadow-md transition-all hover:-translate-y-1 text-white"
				>
					<div class="flex items-center justify-between mb-4">
						<div class="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
							<span class="text-2xl font-bold text-white" aria-hidden="true">₦</span>
						</div>
						<span class="text-xs font-medium bg-white/20 px-2 py-1 rounded">Total</span>
					</div>
					<h3 class="text-2xl md:text-3xl font-bold mb-1">
						{formatCurrency(stats.totalCommissions ?? 0)}
					</h3>
					<p class="text-sm text-white/90">Total Commissions</p>
				</div>
			</div>

			<!-- Commission Breakdown -->
			<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-6">
				<!-- Pending Commissions -->
				<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
					<div class="flex items-center gap-3 mb-3">
						<div class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
							<span class="text-lg font-bold text-orange-600">₦</span>
						</div>
						<div>
							<p class="text-sm text-gray-600">Pending Commissions</p>
							<h4 class="text-xl font-bold text-gray-900">
								{formatCurrency(stats.pendingCommissions ?? 0)}
							</h4>
						</div>
					</div>
				</div>

				<!-- Paid Commissions -->
				<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
					<div class="flex items-center gap-3 mb-3">
						<div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
							<Check class="w-5 h-5 text-green-600" />
						</div>
						<div>
							<p class="text-sm text-gray-600">Paid Commissions</p>
							<h4 class="text-xl font-bold text-gray-900">
								{formatCurrency(stats.paidCommissions ?? 0)}
							</h4>
						</div>
					</div>
				</div>
			</div>

			<div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
				<!-- Performance Overview -->
				<div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
					<h3 class="text-lg font-semibold text-gray-900 mb-6">Performance Overview</h3>

					<div class="space-y-4">
						<!-- Conversion Rate -->
						<div>
							<div class="flex items-center justify-between mb-2">
								<span class="text-sm font-medium text-gray-700">Conversion Rate</span>
								<span class="text-sm font-bold text-green-600">
									{(stats.conversionRate ?? 0).toFixed(1)}%
								</span>
							</div>
							<div class="w-full bg-gray-200 rounded-full h-2">
								<div
									class="bg-primary h-2 rounded-full"
									style="width: {Math.min(stats.conversionRate ?? 0, 100)}%"
								></div>
							</div>
						</div>

						<!-- Completion Rate (calculated from closed deals) -->
						<div>
							<div class="flex items-center justify-between mb-2">
								<span class="text-sm font-medium text-gray-700">Completion Rate</span>
								<span class="text-sm font-bold text-blue-600">
									{stats.totalClosedDeals > 0
										? ((stats.totalClosedDeals / (stats.totalClosedDeals + stats.activeBookings)) * 100).toFixed(1)
										: 0}%
								</span>
							</div>
							<div class="w-full bg-gray-200 rounded-full h-2">
								<div
									class="bg-blue-600 h-2 rounded-full"
									style="width: {stats.totalClosedDeals > 0
										? Math.min((stats.totalClosedDeals / (stats.totalClosedDeals + stats.activeBookings)) * 100, 100)
										: 0}%"
								></div>
							</div>
						</div>

						<div>
							<div class="flex items-center justify-between mb-2">
								<span class="text-sm font-medium text-gray-700">Agent Rating</span>
								<span class="text-sm font-bold text-amber-600">
									{(stats.rating ?? 0).toFixed(1)}/5.0
								</span>
							</div>
							<div class="w-full bg-gray-200 rounded-full h-2">
								<div
									class="bg-amber-500 h-2 rounded-full"
									style="width: {((stats.rating ?? 0) / 5) * 100}%"
								></div>
							</div>
						</div>
					</div>
				</div>

				<div
					class="bg-linear-to-br from-green-600 to-purple-700/50 rounded-2xl shadow-sm p-6 md:p-8 text-white"
				>
					<div class="flex items-center gap-2 mb-4">
						<Users class="w-6 h-6" />
						<h3 class="text-lg font-semibold">Referral Program</h3>
					</div>

					<p class="text-white/90 mb-6 text-sm">
						Share your referral link and earn rewards for every new agent you bring!
					</p>

					<div class="bg-white/10 backdrop-blur rounded-lg p-4 mb-4">
						<p class="text-xs text-white/70 mb-2">Your Referral Link</p>
						<div class="flex items-center justify-between gap-2">
							<span class="text-sm font-mono truncate">
								{stats.referralLink || (typeof window !== 'undefined' ? `${window.location.origin}/signup/${userId}` : `/signup/${userId}`)}
							</span>
							<button
								type="button"
								class="p-2 hover:bg-white/10 rounded-lg transition-colors shrink-0"
								onclick={() =>
									copyToClipboard(stats.referralLink || (typeof window !== 'undefined' ? `${window.location.origin}/signup/${userId}` : `/signup/${userId}`))}
								title="Copy link"
							>
								{#if copied}
									<Check class="w-5 h-5" />
								{:else}
									<Copy class="w-5 h-5" />
								{/if}
							</button>
						</div>
					</div>

					<div class="bg-white/10 backdrop-blur rounded-lg p-4 mb-4">
						<div class="flex items-center justify-between">
							<span class="text-sm text-white/90">Total Referrals</span>
							<span class="text-2xl font-bold">{stats.totalReferrals ?? 0}</span>
						</div>
					</div>

					<a
						href={stats.referralLink || `/signup/${userId}`}
						target="_blank"
						class="block w-full bg-white text-primary text-center font-semibold py-3 rounded-lg hover:bg-purple-50 transition-colors"
					>
						Share Referral Link
					</a>
				</div>
			</div>
		{/if}


{#if isApprovedAgent && clients}
	<div class="mt-6">
		<ClientsTable total={clients.total} requests={clients.requests} />
	</div>
{/if}
	</section>
</div>