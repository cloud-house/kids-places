export const formatSlug = (val: string): string =>
    val
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[łŁ]/g, 'l')
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '')
        .toLowerCase();
