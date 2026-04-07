import { Where } from 'payload'

export interface CommonFilterOptions {
    categorySlug?: string;
    q?: string;
    city?: string;
    attributes?: Record<string, string>;
    searchFields: string[];
    cityFields: string[];
    isPoland?: boolean;
}

export const buildCommonWhere = (options: CommonFilterOptions): Where => {
    const { categorySlug, q, city, attributes, searchFields, cityFields, isPoland } = options;

    const and: Where[] = [
        {
            _status: {
                equals: 'published',
            },
        }
    ];

    if (isPoland !== undefined) {
        and.push({ isPoland: { equals: isPoland } });
    }

    if (categorySlug) {
        and.push({ 'category.slug': { equals: categorySlug } });
    }

    if (q && searchFields.length > 0) {
        and.push({
            or: searchFields.map(field => ({
                [field]: { contains: q }
            }))
        });
    }

    if (city && cityFields.length > 0) {
        and.push({
            or: cityFields.map(field => ({
                [field]: { contains: city }
            }))
        });
    }

    if (attributes && Object.keys(attributes).length > 0) {
        const attrConditions = Object.entries(attributes).map(([slug, value]): Where => ({
            and: [
                { 'features.attribute.slug': { equals: slug } },
                { 'features.value': { equals: value } }
            ]
        }));

        // Attributes must all match (AND of all attribute conditions)
        and.push(...attrConditions);
    }

    return { and };
};
