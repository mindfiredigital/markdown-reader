import { EmptyStateProps } from "../types";

export function EmptyState({ onChooseFile }: EmptyStateProps) {
  return (
    <div className="welcome">
      <h1>Open a markdown file</h1>
      <p>Select a local .md file to render it.</p>
      <button type="button" onClick={onChooseFile}>
        Choose File
      </button>
    </div>
  );
}
