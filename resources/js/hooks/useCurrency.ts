import { usePage } from '@inertiajs/react';

export function useCurrency() {
    const { props } = usePage();
    const currency = (props.settings as any)?.currency || 'USD';

    const format = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
        }).format(amount);
    };

    return { format, currency };
}