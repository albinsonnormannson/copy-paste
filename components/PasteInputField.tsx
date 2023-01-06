export const PasteInputField = ({...props}: React.InputHTMLAttributes<HTMLInputElement>) => {
    return (
        <div className="flex-1 border-2 px-2 py-1 rounded-md text-sm border-gray-300">
            <input minLength={1} type="text" className="outline-none w-full" {...props} />
        </div>
    );
}