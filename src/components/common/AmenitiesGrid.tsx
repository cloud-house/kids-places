import React from 'react';
import { Attribute, Place } from '@/payload-types';
import { Wifi, ParkingSquare, Coffee, ShieldCheck, Baby, Snowflake, Accessibility, Utensils, Zap, Users, Music, Sun, Banknote } from 'lucide-react';

type Feature = NonNullable<Place['features']>[number];

interface AmenitiesGridProps {
    features: Feature[];
}

// Map slugs to lucide icons (extended)
const iconMap: Record<string, React.ReactNode> = {
    'wifi': <Wifi size={24} />,
    'parking': <ParkingSquare size={24} />,
    'kawa': <Coffee size={24} />,
    'bezpieczenstwo': <ShieldCheck size={24} />,
    'dla-maluchow': <Baby size={24} />,
    'klimatyzacja': <Snowflake size={24} />,
    'dostepnosc': <Accessibility size={24} />,
    'gastronomia': <Utensils size={24} />,
    'animacje': <Music size={24} />,
    'na-zewnatrz': <Sun size={24} />,
    'grupy': <Users size={24} />,
    'energia': <Zap size={24} />,
    'cena': <Banknote size={24} />,
    'wiek': <Baby size={24} />,
};

export const AmenitiesGrid: React.FC<AmenitiesGridProps> = ({ features }) => {
    if (!features || features.length === 0) return null;

    // Group features by attribute group -> attribute name
    const groupedFeatures: Record<string, {
        groupName: string;
        attributes: Record<string, {
            attributeName: string;
            features: Feature[];
            slug: string;
            type: string;
        }>
    }> = {};

    features.forEach(feature => {
        const attr = feature.attribute as Attribute;
        if (!attr) return;

        // Determine group
        let groupName = 'Inne';

        if (attr.group && typeof attr.group === 'object') {
            groupName = attr.group.name;
        }

        if (!groupedFeatures[groupName]) {
            groupedFeatures[groupName] = { groupName, attributes: {} };
        }

        const attrName = attr.name;
        if (!groupedFeatures[groupName].attributes[attrName]) {
            groupedFeatures[groupName].attributes[attrName] = {
                attributeName: attrName,
                features: [],
                slug: attr.slug || '',
                type: attr.type
            };
        }
        groupedFeatures[groupName].attributes[attrName].features.push(feature);
    });

    // Sort groups
    const sortedGroups = Object.values(groupedFeatures).sort((a, b) => {
        if (a.groupName === 'Inne') return 1;
        if (b.groupName === 'Inne') return -1;
        return a.groupName.localeCompare(b.groupName);
    });

    return (
        <div className="space-y-12">
            {sortedGroups.map((group) => {
                const attrGroups = Object.values(group.attributes);
                if (attrGroups.length === 0) return null;

                return (
                    <div key={group.groupName}>
                        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                            {group.groupName}
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {attrGroups.map((attrGroup) => {
                                const { attributeName, features, slug, type } = attrGroup;

                                // Determine Value AND Icon
                                let displayValue = '';

                                if (type === 'boolean') {
                                    // For boolean, usually if it's in the list, it's true.
                                    displayValue = 'Dostępne';
                                    if (slug === 'wifi') displayValue = 'Darmowe';
                                    if (slug === 'klimatyzacja') displayValue = 'Tak';
                                    if (slug === 'parking') displayValue = 'Dostępny';
                                } else if (type === 'range') {
                                    const val = String(features[0].value).trim();
                                    const [min, max] = val.split('-');
                                    if (min && max) displayValue = `${min} - ${max} lat`;
                                    else if (min) displayValue = `od ${min} lat`;
                                    else if (max) displayValue = `do ${max} lat`;
                                    else displayValue = val;
                                } else {
                                    // Multi options or text
                                    // Map values to labels if options exist
                                    const values = features.map(f => {
                                        const val = String(f.value).trim();
                                        const attr = f.attribute as Attribute;
                                        const option = attr.options?.find(opt => String(opt.value).trim().toLowerCase() === val.toLowerCase());
                                        return option ? option.label : val;
                                    });
                                    displayValue = values.join(', ');
                                }

                                const Icon = iconMap[slug] || <ShieldCheck size={24} />;

                                return (
                                    <div key={slug || attributeName} className="bg-white border border-gray-100 rounded-3xl p-4 flex items-center gap-4 shadow-sm hover:border-rose-100 transition-all group">
                                        <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-rose-50 group-hover:text-rose-500 transition-colors shrink-0">
                                            {Icon}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">{attributeName}</span>
                                            <span className="text-base font-bold text-gray-900 leading-tight">{displayValue}</span>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
