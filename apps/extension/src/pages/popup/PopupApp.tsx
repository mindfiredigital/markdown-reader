export function PopupApp() {
  const openViewer = () => {
    const url =
      typeof chrome !== 'undefined' && chrome.runtime
        ? chrome.runtime.getURL('viewer.html')
        : '/src/pages/viewer/index.html';

    if (typeof chrome !== 'undefined' && chrome.tabs) {
      chrome.tabs.create({ url });
      return;
    }

    window.open(url, '_blank', 'noopener,noreferrer');
  };
  return (
    <main className="popup">
      <div>
        <h1>Markdown Reader</h1>
        <p>Open a local markdown file in a full reader tab.</p>
      </div>
      <button type="button" onClick={openViewer}>
        Open Reader
      </button>
    </main>
  );
}
