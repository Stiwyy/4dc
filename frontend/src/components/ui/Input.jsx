import React from 'react';

export function Input({ label, className, ...props }) {
    return (
        <div className="space-y-1 w-full">
            {label && <label className="text-xs font-mono text-neutral-500 uppercase">{label}</label>}
            <input
                className={`
                    w-full 
                    rounded-md 
                    border border-neutral-800 
                    bg-[#151515]           
                    text-white              
                    placeholder-neutral-600 
                    px-3 py-2 
                    text-sm 
                    focus:border-emerald-500 
                    focus:outline-none 
                    focus:ring-1 
                    focus:ring-emerald-500
                    transition-colors
                    ${className || ''}    
                `}
                {...props}
            />
        </div>
    );
}