import { ErrorProps } from "../types/component-types"

//error message display function
export function Error({message,onRetry}:ErrorProps){
  return (
   <div role="alert" className="m-6 max-w-md mx-auto p-5 rounded-xl bg-error-bg border border-error-border shadow-sm">
      <p className="text-sm font-medium text-error leading-relaxed">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-4 px-4 py-1.5 text-sm font-medium rounded-lg bg-error text-white hover:opacity-90 transition-opacity"
      >
        Try another file
      </button>
    </div>
  )
}