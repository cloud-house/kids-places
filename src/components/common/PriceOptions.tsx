import React from 'react';
import { CreditCard, Ticket } from 'lucide-react';

export interface PriceOption {
    name: string;
    price: number;
    entries?: number | null;
    validityValue?: number | null;
    validityUnit?: ('days' | 'months') | null;
}

interface PriceOptionsProps {
    options: PriceOption[];
    isPremium?: boolean;
}

export const PriceOptions: React.FC<PriceOptionsProps> = ({ options }) => {
    if (!options || options.length === 0) return null;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {options.map((option, idx) => (
                <div key={idx} className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100 hover:border-rose-100 hover:bg-rose-50/30 transition-all group h-full flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-2">
                            {option.entries && option.entries > 1 ? (
                                <CreditCard className="text-rose-500" size={18} />
                            ) : (
                                <Ticket className="text-rose-500" size={18} />
                            )}
                            <h3 className="font-bold text-gray-900 line-clamp-2">{option.name}</h3>
                        </div>
                        <div className="text-xl font-black text-gray-900 whitespace-nowrap ml-2">
                            {option.price} PLN
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-auto">
                        {option.entries && (
                            <span className="px-3 py-1 bg-white rounded-full text-[10px] font-bold text-gray-600 border border-gray-100 shadow-sm">
                                {option.entries > 1 ? `Pakiety: ${option.entries} wejść` : 'Wejście jednorazowe'}
                            </span>
                        )}
                        {option.validityValue && (
                            <span className="px-3 py-1 bg-white rounded-full text-[10px] font-bold text-gray-600 border border-gray-100 shadow-sm">
                                Ważność: {option.validityValue} {option.validityUnit === 'months'
                                    ? (option.validityValue === 1 ? 'miesiąc' : option.validityValue < 5 ? 'miesiące' : 'miesięcy')
                                    : (option.validityValue === 1 ? 'dzień' : 'dni')}
                            </span>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};
