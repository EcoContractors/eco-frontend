import type { PageServerLoad } from './$types';
import { serverApi } from '$lib/server/api';

export const load: PageServerLoad = async ({ url }) => {
    const token = url.searchParams.get('token');
    const action = url.searchParams.get('action');

    if (!token || !action) {
        return {
            approvalStatus: 'error' as const,
            message: 'Invalid approval link. Missing token or action.'
        };
    }

    try {
        const result = await serverApi.get<{
            message: string;
            success: boolean;
            status?: 'approved' | 'declined';
        }>(`/auth/agent-approval?token=${token}&action=${action}`);

        if (result.success) {
            return {
                approvalStatus: 'success' as const,
                message: result.message
            };
        }

        return {
            approvalStatus: 'error' as const,
            message: result.message || 'An unknown error occurred while processing the approval.'
        };
    } catch (e) {
        let message = 'An unexpected error occurred while processing the request.';

        if (e instanceof Error) {
            message = e.message;
        }

        return {
            approvalStatus: 'error' as const,
            message
        };
    }
};
