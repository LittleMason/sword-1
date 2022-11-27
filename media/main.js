(function(){
    const vscode = acquireVsCodeApi();
    function postFormMessage() {
        const datas = {
            url: document.getElementById('url').value,
            name: document.getElementById('name').value,
        }
        vscode.postMessage(datas)
    }
    document.getElementById("btn").addEventListener("click",function(){
        postFormMessage()
    })
}())
