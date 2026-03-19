importScripts("https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js");

async function main() {
    let pyodide = await loadPyodide();
    self.postMessage({ status: "ready" });

    self.onmessage = async (event) => {
        const { id, code } = event.data;
        if (!code) return;
        try {
            await pyodide.runPythonAsync(`
import sys, io
sys.stdout = io.StringIO()
sys.stderr = io.StringIO()
            `);
            await pyodide.loadPackagesFromImports(code);
            await pyodide.runPythonAsync(code);
            let stdout = pyodide.runPython("sys.stdout.getvalue()");
            let stderr = pyodide.runPython("sys.stderr.getvalue()");
            self.postMessage({ id, stdout, stderr });
        } catch (err) {
            self.postMessage({ id, error: err.message });
        }
    };
}

main();
