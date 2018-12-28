const runDedup = document.getElementById('runDedup');
const page = document.getElementById('removed');

let dedupMap = {};

const processNode = node => {
    if (node.children) {
        node.children.forEach(n => {
            return processNode(n);
        });
    } 

    if (node.parentId === "0") return;

    if (dedupMap[node.url]) {
        chrome.bookmarks.remove(node.id, () => {
            const nodeElem = document.createElement('p');
            nodeElem.textContent = node.title;
            page.appendChild(nodeElem);
        });
    }

    dedupMap[node.url] = true;
}

runDedup.onclick = _ => {
    dedupMap = {};

    while (page.firstChild) {
        page.removeChild(page.firstChild);
    }

    chrome.bookmarks.getTree(nodes => {
        nodes.forEach(processNode);
    });
}