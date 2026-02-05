<script lang="ts">
	import { FileText, Search } from 'lucide-svelte';

	interface ClientRequest {
		id: string;
		quoteNumber: string;
		clientName: string;
		companyName: string;
		jobScope: string;
		equipment: string;
		duration: string;
		totalAmount: number;
		status: string;
	}

	interface Props {
		total: number;
		requests: ClientRequest[];
	}

	let { total = 0, requests = [] }: Props = $props();

	let searchQuery = $state('');

	
	let filteredRequests = $derived(
		requests.filter((request) => {
			const query = searchQuery.toLowerCase();
			return (
				request.clientName.toLowerCase().includes(query) ||
				request.companyName.toLowerCase().includes(query) ||
				request.quoteNumber.toLowerCase().includes(query) ||
				request.equipment.toLowerCase().includes(query) ||
				request.status.toLowerCase().includes(query)
			);
		})
	);

	function getStatusColor(status: string): string {
		const statusLower = status.toLowerCase();
		if (statusLower.includes('pending')) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
		if (statusLower.includes('approved') || statusLower.includes('completed'))
			return 'bg-green-100 text-green-800 border-green-200';
		if (statusLower.includes('rejected') || statusLower.includes('cancelled'))
			return 'bg-red-100 text-red-800 border-red-200';
		if (statusLower.includes('in progress') || statusLower.includes('active'))
			return 'bg-blue-100 text-blue-800 border-blue-200';
		return 'bg-gray-100 text-gray-800 border-gray-200';
	}

	function formatCurrency(amount: number): string {
		return new Intl.NumberFormat('en-NG', {
			style: 'currency',
			currency: 'NGN',
			minimumFractionDigits: 0
		}).format(amount);
	}
</script>

<div class="bg-white rounded-2xl shadow-sm border border-primary overflow-hidden">
	
	<div class="p-6 border-b border-gray-200">
		<div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
			<div>
				<h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
					<FileText class="w-5 h-5 text-primary" />
					Client Requests
				</h3>
				<p class="text-sm text-gray-600 mt-1">Total: {total} request{total !== 1 ? 's' : ''}</p>
			</div>

			<div class="relative w-full md:w-64">
				<Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
				<input
					type="text"
					placeholder="Search clients..."
					bind:value={searchQuery}
					class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
				/>
			</div>
		</div>
	</div>


	{#if filteredRequests.length === 0}
		<div class="p-12 text-center">
			<FileText class="w-12 h-12 text-gray-300 mx-auto mb-3" />
			<p class="text-gray-600 font-medium">
				{searchQuery ? 'No clients found matching your search' : 'No client requests yet'}
			</p>
			<p class="text-sm text-gray-500 mt-1">
				{searchQuery ? 'Try adjusting your search terms' : 'Clients who use your referral link will appear here'}
			</p>
		</div>
	{:else}
		<div class="overflow-x-auto">
			<table class="w-full">
				<thead class="bg-gray-50 border-b border-gray-200">
					<tr>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Quote #
						</th>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Client
						</th>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Equipment
						</th>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Duration
						</th>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Amount
						</th>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Status
						</th>
					</tr>
				</thead>
				<tbody class="bg-white divide-y divide-gray-200">
					{#each filteredRequests as request (request.id)}
						<tr class="hover:bg-gray-50 transition-colors">
							<td class="px-6 py-4 whitespace-nowrap">
								<div class="text-sm font-medium text-gray-900">{request.quoteNumber}</div>
							</td>
							<td class="px-6 py-4">
								<div class="text-sm font-medium text-gray-900">{request.clientName}</div>
								<div class="text-sm text-gray-500">{request.companyName}</div>
							</td>
							<td class="px-6 py-4">
								<div class="text-sm text-gray-900">{request.equipment}</div>
								<div class="text-xs text-gray-500 mt-1 max-w-xs truncate" title={request.jobScope}>
									{request.jobScope}
								</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<div class="text-sm text-gray-900">{request.duration}</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<div class="text-sm font-semibold text-gray-900">
									{formatCurrency(request.totalAmount)}
								</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<span
									class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border {getStatusColor(
										request.status
									)}"
								>
									{request.status}
								</span>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>