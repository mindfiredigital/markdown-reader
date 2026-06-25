import { WelcomeProps } from '../types/component-types';
import { usePlatformAPI } from '../hooks/usePlatform';
import { Icons } from '../utils/constants/icon-contants';
import { formatBytes,formatDaysAgo } from '../utils/helpers/size-helper';
import logoTcon from '../../../../assets/icon.png'
import fileIcon from '../../../../assets/file.png'

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
  <div className="flex flex-col items-center justify-center flex-1 w-full max-w-4xl mx-auto px-6 py-12 select-none">
    <div className="text-center mb-8">
      <h1 className="text-xl font-bold text-text-base tracking-tight">Welcome to Markdown Reader</h1>
      <p className="text-xs text-text-muted mt-1">Get started by loading a local file or picking up your progress.</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full items-stretch">
      <div className={`md:col-span-5 flex ${recentFiles.length === 0 ? 'md:col-span-12' : ''}`}>
        <button
          type="button"
          onClick={onOpen}
          className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-border-theme hover:border-accent bg-surface/60 hover:bg-accent-bg/20 transition-all duration-200 rounded-2xl w-full min-h-80 cursor-pointer group relative overflow-hidden"
        >
          <div className="p-3  text-accent rounded-xl mb-3 group-hover:scale-105 transition-all duration-200">
            <img
              src={fileIcon}
              alt=""
              aria-hidden="true"
              className="w-10 h-10 object-contain"
            />
          </div>
          <p className="text-sm font-semibold text-text-base mb-1">Load Markdown File</p>
          <p className="text-xs text-text-muted">
            Drop your Markdown file here or <span className="text-accent font-medium underline underline-offset-2">click to browse</span>
          </p>
        </button>
      </div>
      {recentFiles.length > 0 && (
        <div className="md:col-span-7 flex flex-col p-5 bg-surface border border-border-theme rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-3 px-1">
            <p className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
              Recent Documents
            </p>
          </div>
          <ul className="space-y-2 overflow-y-auto flex-1 max-h-65 pr-1">
            {recentFiles.slice(0, 5).map((file) => (
              <li key={file.path}>
                <button
                  type="button"
                  onClick={() => onOpenRecent?.(file.path)}
                  className="w-full text-left px-3.5 py-2.5 rounded-xl border border-border-theme/60 bg-surface/40 hover:bg-accent-bg/40 hover:border-accent/40 transition-all duration-150 group flex items-center justify-between gap-4"
                >
                  <div className="min-w-0 flex-1 flex items-center gap-3">
                    <Icons.FileText size={16} className="text-text-muted group-hover:text-accent shrink-0 transition-colors" />
                    <div className="min-w-0">
                      <span className="block text-sm text-text-base font-medium group-hover:text-accent truncate transition-colors">
                        {file.name}
                      </span>
                      <span className="block text-[11px] text-text-muted/80 truncate mt-0.5" title={file.path}>
                        {file.path}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 text-[11px] text-text-muted font-medium">
                    <span>{formatDaysAgo(file.openedAt)}</span>
                    {file.size !== undefined && (
                      <span className="bg-text-muted/5 text-[10px] px-2 py-0.5 rounded border border-border-theme/40 font-mono">
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
  </div>
);
}