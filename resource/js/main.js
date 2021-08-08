(function () {
    // initial vscode api
    console.log(_.VERSION);
    console.log('Initial webview vscode api');
    const vscode = acquireVsCodeApi();

    // update Note
    function updateNote(note) {
        // Send message back to the extension
        vscode.postMessage({
            command: 'UpdateNote',
            content: note
        });
    }

    function addNote(message) {
        console.log(message);
    }

    /**
     * Handle messages sent from the extension to the webview
     * Provide APIs:
     * Update:
     * Add:
     * Remove:
     */
    window.addEventListener('message', event => {
        const message = event.data; // The json data that the extension sent
        switch (message.command) {
            case 'Update':
                // Update Notes
                console.log(`update ${message.content}`);
                break;
            case 'Add':
                // Add a Note
                // parentContainer.insertBefor(newItem, child)
                console.log(`add notes`, message.content);
                break;
        }
    });
}());