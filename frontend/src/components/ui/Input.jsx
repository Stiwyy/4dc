import React from 'react';

export function Input({ label, ...props }) {
    return (
        <div className="space-y-1">
            {label && <label className="text-xs font-mono text-neutral-500 uppercase">{label}</label>}
            <input
                className="w-full rounded-md border border-neutral-800 bg-neutral-900/50 px-3 py-2 text-sm text-white placeholder-neutral-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                {...props}
            />
        </div>
    );
}