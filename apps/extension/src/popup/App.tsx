export function App(){
    const openViewer=()=>{
        window.open('./viewer.html')
    };
    return(
        <main>
            <h1>Markdown Reader Viewer</h1>
            <p>Viewer Page setup successful.</p>
            <button type="button" onClick={openViewer}>Open Viewer</button>
        </main>
    )
}