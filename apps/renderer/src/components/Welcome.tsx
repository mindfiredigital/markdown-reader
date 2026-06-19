import { WelcomeProps } from '../types/component-types';
import { formatRelativeTime } from '../utils/helpers/time-helper';
import { Icons } from '../utils/constants/icon-contants';


// welcome screen
export function Welcome({onOpen,recentFiles,onOpenRecent}:WelcomeProps){
  const hasRecent = recentFiles.length > 0;
  return (
    <div className="welcome-bg flex flex-1 overflow-hidden h-full">
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden h-full">
      <div className={`flex flex-col justify-start md:justify-center items-center px-8 md:px-12 lg:px-16 pt-20 md:pt-10 pb-10 overflow-y-auto ${hasRecent ? 'w-full md:w-1/2 border-r border-border-theme bg-surface/10' : 'w-full'}`}>
          <div className="w-full max-w-md flex flex-col gap-6">
            <div className="flex flex-col gap-2.5 w-full">
              <h1 className="welcome-title text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-wrap wrap-break-word">
                Markdown Reader
              </h1>
              <p className="text-xs sm:text-[14px] text-text-muted leading-relaxed font-normal text-wrap">
                A distraction-free reading environment for your Markdown files.
              </p>
            </div>

            <div className="w-full flex justify-center">
              <button
                onClick={onOpen}
                className="btn-primary px-5 py-2.5 rounded-xl text-sm font-semibold shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all duration-200"
              >
                <Icons.FileIcon />
                Open File
              </button>
            </div>

            {/* Drag & Drop Area */}
            <div
              onClick={onOpen}
              className="w-full border-2 border-dashed border-border-theme bg-surface/20 hover:bg-surface/30 hover:border-accent/40 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 group"
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-accent-bg/40 text-accent mb-3 group-hover:scale-105 transition-transform duration-200">
                <Icons.CloudUploadIcon />
              </div>
              <span className="block text-sm font-semibold text-text-base">
                Drop a markdown file here
              </span>
              <span className="block text-xs text-text-muted mt-0.5">
                or click to browse
              </span>
              <span className="block text-[10px] text-text-muted/60 mt-2 font-medium">
                Supports .md, .markdown
              </span>
            </div>

            {/* Quick Features Row */}
            <div className="grid grid-cols-5 gap-2 w-full">
              <div className="flex flex-col items-center p-2 rounded-xl border border-border-theme/40 bg-surface/30 text-center">
                <Icons.LightningIcon />
                <span className="text-[10px] font-bold text-text-base mt-2">Fast</span>
                <span className="text-[8px] text-text-muted mt-0.5 leading-tight">Instant preview</span>
              </div>
              <div className="flex flex-col items-center p-2 rounded-xl border border-border-theme/40 bg-surface/30 text-center">
                <Icons.MermaidIcon />
                <span className="text-[10px] font-bold text-text-base mt-2">Mermaid</span>
                <span className="text-[8px] text-text-muted mt-0.5 leading-tight">Diagrams</span>
              </div>
              <div className="flex flex-col items-center p-2 rounded-xl border border-border-theme/40 bg-surface/30 text-center">
                <Icons.SigmaIcon />
                <span className="text-[10px] font-bold text-text-base mt-2">KaTeX</span>
                <span className="text-[8px] text-text-muted mt-0.5 leading-tight">Math support</span>
              </div>
              <div className="flex flex-col items-center p-2 rounded-xl border border-border-theme/40 bg-surface/30 text-center">
                <Icons.PaletteIcon />
                <span className="text-[10px] font-bold text-text-base mt-2">Themes</span>
                <span className="text-[8px] text-text-muted mt-0.5 leading-tight">Beautiful UI</span>
              </div>
              <div className="flex flex-col items-center p-2 rounded-xl border border-border-theme/40 bg-surface/30 text-center">
                <Icons.SyncIcon />
                <span className="text-[10px] font-bold text-text-base mt-2">Live Sync</span>
                <span className="text-[8px] text-text-muted mt-0.5 leading-tight">Auto reload</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right-Recent files */}
        {hasRecent && (
          <div className="w-full md:w-1/2 flex flex-col bg-surface/30 px-8 md:px-10 py-10 overflow-y-auto">
            <div className="w-full max-w-md mx-auto flex flex-col">

              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2 text-text-base font-semibold text-sm">
                  <div className="text-accent flex items-center justify-center">
                    <Icons.ClockIcon />
                  </div>
                  <span>Recent Files</span>
                </div>
              </div>

              {/* Recent Files List */}
              <div className="flex flex-col gap-2.5">
                {recentFiles.slice(0, 8).map((file) => (
                  <div
                    key={file.path}
                    className="welcome-card group flex items-center justify-between p-3 rounded-2xl bg-surface/50 border border-border-theme/40 hover:border-accent/30 shadow-xs hover:shadow-md transition-all duration-200"
                  >
                    <button
                      onClick={() => onOpenRecent?.(file.path)}
                      className="flex items-center gap-3.5 min-w-0 flex-1 text-left bg-transparent border-none p-0 cursor-pointer"
                    >
                      <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-accent-bg/40 text-accent border border-accent/5 shrink-0 transition-colors group-hover:bg-accent-bg">
                        <Icons.FileIcon />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="block text-sm text-text-base font-semibold group-hover:text-accent transition-colors truncate">
                          {file.name}
                        </span>
                        <span className="block text-[11px] text-text-muted/80 truncate mt-0.5">
                          {file.path}
                        </span>
                      </div>
                    </button>
                    <div className="flex items-center gap-3 shrink-0 ml-4">
                      <div className="flex flex-col items-end gap-0.5 text-[10px] text-text-muted">
                        <span>{formatRelativeTime(file.openedAt)}</span>
                        <span className="font-semibold text-text-muted/70">{file.size || '12 KB'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
