export function Spinner({ className = "" }: { className?: string }) {
  return (
    <div className={`inline-block animate-spin rounded-full border-4 border-solid border-current border-r-transparent h-8 w-8 ${className}`} role="status">
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export function LoadingScreen({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <Spinner className="h-12 w-12 text-blue-500" />
      <p className="text-slate-400">{message}</p>
    </div>
  );
}

export default Spinner;
