import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function Button({ className, variant = 'primary', ...props }) {
    const baseStyles = "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 disabled:pointer-events-none";

    const variants = {
        primary: "bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-900/20",
        ghost: "bg-transparent text-neutral-400 hover:text-white hover:bg-white/5",
        danger: "bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20"
    };

    return (
        <button
            className={twMerge(clsx(baseStyles, variants[variant], className))}
            {...props}
        />
    );
}