import { ButtonHTMLAttributes } from 'react';

export default function PrimaryButton({
    className = '',
    disabled,
    children,
    ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center rounded-md border border-transparent  px-4 py-2 text-xs font-semibold uppercase tracking-widest  transition duration-150 ease-in-out text-white bg-blue-600 hover:bg-blue-700 focus:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:bg-blue-900 dark:bg-gray-200 dark:text-gray-800 dark:hover:bg-white dark:focus:bg-white dark:focus:ring-offset-gray-800 dark:active:bg-gray-300 ${
                    disabled && 'opacity-25'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
