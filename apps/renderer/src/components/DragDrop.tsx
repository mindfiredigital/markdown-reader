
/*drag drop component to get displayed on Screen ,
when a file is dragged and dropped on the application */

export function DragDrop() {
  return (
    <div className='pointer-events-none fixed inset-0 z-50 flex items-center justify-center border-2 border-dashed border-accent bg-bg/80ntext-text-base'>
      <div className='rounded-xl border border-border-theme bg-surface px-6 py-4 text-sm font-medium shadow-lg'>
        Drop Markdown file to open
      </div>
    </div>
  );
}