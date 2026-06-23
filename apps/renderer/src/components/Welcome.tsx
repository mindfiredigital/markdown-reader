import { WelcomeProps } from '../types/component-types';
import { usePlatformAPI } from '../hooks/usePlatform';
import { Icons } from '../utils/constants/icon-contants';
import { formatBytes,formatDaysAgo } from '../utils/helpers/size-helper';
import logoTcon from '../../../../assets/icon.png'

export function Welcome({onOpen,recentFiles,onOpenRecent}:WelcomeProps){
  const api = usePlatformAPI();
  const isExtension = api.kind === 'chrome';

  if (isExtension) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 gap-5 max-w-md mx-auto text-center px-6 py-8">
        <div className="space-y-2">
          <div className="inline-flex p-2 bg-accent-bg rounded-xl shadow-sm">
            <img
              src={logoTcon} 
              alt="Markdown Reader Logo"
              className="w-10 h-10 object-contain"
            />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-text-base md:text-3xl">
            Markdown Reader
          </h1>
          <p className="text-sm text-text-muted leading-relaxed max-w-xs mx-auto">
            A distraction free environment for reading your markdown documentation smoothly.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpen}
          className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-accent text-white hover:bg-accent/90 shadow-md transition-all duration-200 flex items-center gap-2 hover:scale-[1.02] mt-2"
        >
          <Icons.Plus size={16} />
          Open File
        </button>

        {/* Recent Files for extension */}
        {recentFiles.length > 0 && (
          <div className="w-full max-w-sm mt-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-text-muted mb-2 text-left">
              Recent
            </p>
            <ul className="space-y-1.5">
              {recentFiles.slice(0, 5).map((file) => (
                <li key={file.path}>
                  <button
                    type="button"
                    onClick={() => onOpenRecent?.(file.path)}
                    className="w-full text-left px-3 py-2 rounded-lg border border-border-theme bg-surface hover:bg-accent-bg hover:border-accent transition-all duration-200 group flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0 flex-1">
                      <span className="block text-sm text-text-base font-medium group-hover:text-accent truncate transition-colors">
                        {file.name}
                      </span>
                      <span
                        className="block text-[11px] text-text-muted truncate"
                        title={file.path}
                      >
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

  // Desktop welcome screen
  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-5 max-w-xl mx-auto px-6 py-8">
      {/* Drag & Drop Area */}
      <button
        type="button"
        onClick={onOpen}
        className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-border-theme hover:border-accent bg-surface hover:bg-accent-bg/30 transition-all duration-250 rounded-xl max-w-sm w-full cursor-pointer group"
      >
        <div className="p-2.5 bg-accent-bg text-accent rounded-full mb-2.5 group-hover:scale-110 transition-transform">
          <Icons.Folder size={20} />
        </div>
        <p className="text-sm font-semibold text-text-base mb-0.5">Drop your Markdown file here</p>
        <p className="text-xs text-text-muted mb-3">or click to browse</p>
        <span
          className="px-4 py-1.5 bg-accent text-white text-xs font-semibold rounded-lg shadow-sm hover:bg-accent/95 transition-colors"
        >
          Open File
        </span>
      </button>

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