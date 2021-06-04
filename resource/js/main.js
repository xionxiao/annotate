(function () {
    const vscode = acquireVsCodeApi();

    const oldState = vscode.getState();

    let currentCount = (oldState && oldState.count) || 0;

    console.log('Initial state', oldState);

    // Update state
    vscode.setState({ count: currentCount });

    // Send a message back to the extension
    vscode.postMessage({
        command: 'alert',
        text: '🐛  on line ' + currentCount
    });

    // Handle messages sent from the extension to the webview
    window.addEventListener('message', event => {
        const message = event.data; // The json data that the extension sent
        switch (message.command) {
            case 'refactor':
                currentCount = Math.ceil(currentCount * 0.5);
                counter.textContent = currentCount;
                break;
        }
    });
}());