export const formatDate = (dateString: string | Date): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pl-PL', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
};
