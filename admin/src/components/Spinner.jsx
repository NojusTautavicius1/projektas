import { Spinner as MTSpinner } from "@material-tailwind/react";

export function Spinner({ size = "large", className = "" }) {
  return (
    <div className={`flex justify-center items-center ${className}`}>
      <MTSpinner 
        className="h-12 w-12 text-blue-500" 
        color="blue"
      />
    </div>
  );
}

export function LoadingScreen({ message = "Kraunama..." }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <MTSpinner className="h-12 w-12 text-blue-500" color="blue" />
      <p className="text-slate-400">{message}</p>
    </div>
  );
}

export default Spinner;
