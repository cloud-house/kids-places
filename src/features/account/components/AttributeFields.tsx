'use client';

import React from 'react';
import { Attribute, AttributeGroup } from '@/payload-types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useWatch, UseFormReturn, FieldValues, Path, PathValue } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

type FeatureEntry = {
    attribute: number | Attribute;
    value?: string | null;
};

interface AttributeFieldsProps<T extends FieldValues> {
    attributes: Attribute[];
    categoryId: string | number;
    form: UseFormReturn<T>;
    namePrefix?: Path<T>; // defaults to "features"
}

export const AttributeFields = <T extends FieldValues>({
    attributes,
    categoryId,
    form,
    namePrefix = "features" as Path<T>
}: AttributeFieldsProps<T>) => {
    const existingFeatures = (useWatch({
        control: form.control,
        name: namePrefix,
    }) || []) as unknown as FeatureEntry[];

    if (!categoryId) return null;

    // Filter attributes by category
    const filteredAttributes = attributes.filter(attr => {
        if (!attr.categories) return false;
        return attr.categories.some(cat => {
            const id = typeof cat === 'object' ? cat.id : cat;
            return String(id) === String(categoryId);
        });
    });

    if (filteredAttributes.length === 0) return null;

    // Group by group
    const groups: Record<number, { group: AttributeGroup; attributes: Attribute[] }> = {};
    filteredAttributes.forEach(attr => {
        const group = attr.group as AttributeGroup;
        if (!groups[group.id]) {
            groups[group.id] = { group, attributes: [] };
        }
        groups[group.id].attributes.push(attr);
    });


    const CheckboxIndicator = ({ isSelected }: { isSelected: boolean }) => (
        <div className={cn(
            "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 flex-shrink-0",
            isSelected ? "bg-rose-500 border-rose-500 text-white shadow-sm" : "border-gray-200 bg-white group-hover:border-rose-200"
        )}>
            {isSelected && <Check size={12} strokeWidth={4} />}
        </div>
    );

    const renderAttributeInput = (attr: Attribute) => {


        if (attr.type === 'boolean') {
            const isSelected = existingFeatures.some((f: FeatureEntry) =>
                String(typeof f.attribute === 'object' ? f.attribute.id : f.attribute) === String(attr.id) &&
                f.value === 'true'
            );

            return (
                <div
                    onClick={() => {
                        const current = (form.getValues(namePrefix) || []) as unknown as FeatureEntry[];
                        const filtered = current.filter((f: FeatureEntry) => String(typeof f.attribute === 'object' ? f.attribute.id : f.attribute) !== String(attr.id));
                        if (!isSelected) {
                            form.setValue(namePrefix, [...filtered, { attribute: attr.id, value: 'true' }] as PathValue<T, Path<T>>);
                        } else {
                            form.setValue(namePrefix, filtered as PathValue<T, Path<T>>);
                        }
                    }}
                    className={cn(
                        "flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 group",
                        isSelected
                            ? "bg-rose-50 border-rose-200 text-rose-700"
                            : "bg-white border-gray-100 text-gray-500 hover:border-rose-200 hover:bg-rose-50/50"
                    )}
                >
                    <CheckboxIndicator isSelected={isSelected} />
                    <span className="font-bold text-sm">{attr.name}</span>
                </div>
            );
        }

        if (attr.type === 'select') {
            const currentValue = existingFeatures.find((f: FeatureEntry) =>
                String(typeof f.attribute === 'object' ? f.attribute.id : f.attribute) === String(attr.id)
            )?.value || '';

            const hasNoneOption = attr.options?.some(opt => opt.value === 'none');

            return (
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">{attr.name}</label>
                    <Select
                        value={currentValue}
                        onValueChange={(val) => {
                            const current = (form.getValues(namePrefix) || []) as unknown as FeatureEntry[];
                            const filtered = current.filter((f: FeatureEntry) => String(typeof f.attribute === 'object' ? f.attribute.id : f.attribute) !== String(attr.id));
                            if (val && val !== 'none') {
                                form.setValue(namePrefix, [...filtered, { attribute: attr.id, value: val }] as PathValue<T, Path<T>>);
                            } else {
                                form.setValue(namePrefix, filtered as PathValue<T, Path<T>>);
                            }
                        }}
                    >
                        <SelectTrigger className="rounded-xl h-11 bg-white border-gray-100 shadow-sm focus:ring-rose-500">
                            <SelectValue placeholder={`Wybierz ${attr.name.toLowerCase()}`} />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                            {!hasNoneOption && <SelectItem key="manual-none" value="none" className="text-gray-400 italic">Brak</SelectItem>}
                            {attr.options?.map(opt => (
                                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            );
        }

        if (attr.type === 'multi-select') {
            return (
                <div className="space-y-3">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">{attr.name}</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {attr.options?.map(opt => {
                            const isSelected = existingFeatures.some((f: FeatureEntry) =>
                                String(typeof f.attribute === 'object' ? f.attribute.id : f.attribute) === String(attr.id) &&
                                f.value === opt.value
                            );

                            return (
                                <div
                                    key={opt.value}
                                    onClick={() => {
                                        const current = (form.getValues(namePrefix) || []) as unknown as FeatureEntry[];
                                        if (isSelected) {
                                            form.setValue(namePrefix, current.filter((f: FeatureEntry) =>
                                                !(String(typeof f.attribute === 'object' ? f.attribute.id : f.attribute) === String(attr.id) && f.value === opt.value)
                                            ) as PathValue<T, Path<T>>);
                                        } else {
                                            form.setValue(namePrefix, [...current, { attribute: attr.id, value: opt.value }] as PathValue<T, Path<T>>);
                                        }
                                    }}
                                    className={cn(
                                        "flex items-center gap-3 p-3 rounded-xl border-2 transition-all cursor-pointer group",
                                        isSelected
                                            ? "bg-rose-50 border-rose-200 text-rose-700"
                                            : "bg-white border-gray-100 text-gray-500 hover:border-rose-200 hover:bg-rose-50/50"
                                    )}
                                >
                                    <CheckboxIndicator isSelected={isSelected} />
                                    <span className="text-sm font-medium">{opt.label}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            );
        }

        if (attr.type === 'range') {
            const currentValue = existingFeatures.find((f: FeatureEntry) =>
                String(typeof f.attribute === 'object' ? f.attribute.id : f.attribute) === String(attr.id)
            )?.value || '';

            const [min, max] = currentValue.split('-');

            const updateRange = (newMin: string, newMax: string) => {
                const current = (form.getValues(namePrefix) || []) as unknown as FeatureEntry[];
                const filtered = current.filter((f: FeatureEntry) => String(typeof f.attribute === 'object' ? f.attribute.id : f.attribute) !== String(attr.id));

                if (newMin || newMax) {
                    form.setValue(namePrefix, [...filtered, { attribute: attr.id, value: `${newMin || ''}-${newMax || ''}` }] as PathValue<T, Path<T>>);
                } else {
                    form.setValue(namePrefix, filtered as PathValue<T, Path<T>>);
                }
            };

            return (
                <div className="space-y-3">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">{attr.name}</label>
                    <div className="flex items-center gap-3">
                        <div className="flex-1 relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-300 uppercase">Od</span>
                            <input
                                type="text"
                                placeholder="np. 3"
                                value={min || ''}
                                onChange={(e) => updateRange(e.target.value, max || '')}
                                className="w-full h-11 pl-10 pr-4 rounded-xl border-2 border-gray-100 bg-white focus:border-rose-200 focus:ring-4 focus:ring-rose-50 transition-all font-bold text-gray-700 outline-none"
                            />
                        </div>
                        <div className="w-4 h-0.5 bg-gray-200 rounded-full" />
                        <div className="flex-1 relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-300 uppercase">Do</span>
                            <input
                                type="text"
                                placeholder="np. 12"
                                value={max || ''}
                                onChange={(e) => updateRange(min || '', e.target.value)}
                                className="w-full h-11 pl-10 pr-4 rounded-xl border-2 border-gray-100 bg-white focus:border-rose-200 focus:ring-4 focus:ring-rose-50 transition-all font-bold text-gray-700 outline-none"
                            />
                        </div>
                        <span className="text-sm font-bold text-gray-400 pl-1">lat</span>
                    </div>
                </div>
            );
        }

        return null;
    };

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {Object.values(groups).map(({ group, attributes }) => (
                <div key={group.id} className="pt-8 border-t border-gray-50 first:pt-0 first:border-0">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="w-1.5 h-6 bg-rose-500 rounded-full" />
                        <h3 className="text-lg font-bold text-gray-900">{group.name}</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {attributes.map(attr => (
                            <div key={attr.id} className={cn(
                                attr.type === 'multi-select' ? 'md:col-span-2' : ''
                            )}>
                                {renderAttributeInput(attr)}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};
