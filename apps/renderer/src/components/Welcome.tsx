import { WelcomeProps } from '../types/component-types';
import { usePlatformAPI } from '../hooks/usePlatform';
import { Icons } from '../utils/constants/icon-contants';
import { formatBytes,formatDaysAgo } from '../utils/helpers/size-helper';

export function Welcome({onOpen,recentFiles,onOpenRecent}:WelcomeProps){
  const api = usePlatformAPI();
  const isExtension = api.kind === 'chrome';

  if (isExtension) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 gap-4 max-w-sm mx-auto text-center px-5 py-6">
        <div className="space-y-1.5">
          <div className="inline-flex p-2.5 bg-accent-bg rounded-lg text-accent">
            <Icons.FileText size={20} />
          </div>
          <h1 className="text-lg font-bold tracking-tight text-text-base">
            Markdown Reader
          </h1>
          <p className="text-xs text-text-muted leading-relaxed">
            A distraction free environment for reading your markdowns
          </p>
        </div>

        <button
          onClick={onOpen}
          className="px-5 py-2 rounded-lg text-sm font-semibold bg-accent text-white hover:bg-accent/90 shadow-sm transition-all duration-200 flex items-center gap-1.5 hover:scale-[1.02]"
        >
          <Icons.Plus size={14} />
          Open File
        </button>
      </div>
    );
  }

  // Desktop welcome screen
  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-5 max-w-xl mx-auto px-6 py-8">
      {/* Drag & Drop Area */}
        <div
          onClick={onOpen}
          onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') onOpen();
          }}
          role="button"
          tabIndex={0}
          className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-border-theme hover:border-accent bg-surface hover:bg-accent-bg/30 transition-all duration-250 rounded-xl max-w-sm w-full cursor-pointer group"
      >
        <div className="p-2.5 bg-accent-bg text-accent rounded-full mb-2.5 group-hover:scale-110 transition-transform">
          <Icons.Folder size={20} />
        </div>
        <p className="text-sm font-semibold text-text-base mb-0.5">Drop your Markdown file here</p>
        <p className="text-xs text-text-muted mb-3">or click to browse</p>
        <button
          type="button"
          className="px-4 py-1.5 bg-accent text-white text-xs font-semibold rounded-lg shadow-sm hover:bg-accent/95 transition-colors"
        >
          Open File
        </button>
      </div>

      {/* Recent Files */}
      {recentFiles.length > 0 && (
        <div className="w-full max-w-sm">
          <p className="text-[11px] font-bold uppercase tracking-wider text-text-muted mb-2 text-left">
            Recent
          </p>
          <ul className="space-y-1.5">
            {recentFiles.slice(0, 5).map((file) => (
              <li key={file.path}>
                <button
                  onClick={() => onOpenRecent?.(file.path)}
                  className="w-full text-left px-3 py-2 rounded-lg border border-border-theme bg-surface hover:bg-accent-bg hover:border-accent transition-all duration-200 group flex items-center justify-between gap-3"
                >
                  <div className="min-w-0 flex-1">
                    <span className="block text-sm text-text-base font-medium group-hover:text-accent truncate transition-colors">
                      {file.name}
                    </span>
                    <span className="block text-[11px] text-text-muted truncate" title={file.path}>
                      {file.path}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 text-[11px] text-text-muted">
                    <span>{formatDaysAgo(file.openedAt)}</span>
                    {file.size !== undefined && (
                      <span className="bg-border-theme/40 text-[10px] px-1.5 py-0.5 rounded font-mono">
                        {formatBytes(file.size)}
                      </span>
                    )}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
