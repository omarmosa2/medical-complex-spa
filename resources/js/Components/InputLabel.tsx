export default function InputLabel({
    value,
    className = '',
    children,
    ...props
}: {
    value?: string;
    className?: string;
    children?: React.ReactNode;
    [key: string]: any;
}) {
    return (
        <label
            {...props}
            className={
                `block text-sm font-medium text-gray-700 ` +
                className
            }
        >
            {value ? value : children}
        </label>
    );
}
