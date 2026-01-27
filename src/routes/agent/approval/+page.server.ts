import type { PageServerLoad } from './$types';
import { serverApi } from '$lib/server/api';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ url }) => {
    let status: 'loading' | 'success' | 'error' = 'loading';
    let message = '';

    const token = url.searchParams.get('token');
    const action = url.searchParams.get('action');

    if (!token || !action) {
        status = 'error';
        message = 'Invalid approval link. Missing token or action.';
        return { status, message };
    }

    try {
        const result = await serverApi.get<{ message: string; success: boolean }>(
            `/auth/agent-approval?token=${token}&action=${action}`
        );

        if (result.success) {
            status = 'success';
            message = result.message;
        } else {
            status = 'error';
            message = result.message || 'An unknown error occurred.';
        }
    } catch (e) {
        status = 'error';
        if (e instanceof Error) {
            message = e.message;
        } else {
            message = 'An unexpected error occurred while processing the request.';
        }
    }

    return { status, message };
};
