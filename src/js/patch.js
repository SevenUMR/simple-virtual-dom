import Type from './static-params';

const Patch = (node, diffs) => {
    const nowNode = { index: 0 };
    deep(node, nowNode, diffs);
}

const deep = (node, nowNode, diffs) => {
    let currentDiff = diffs[nowNode.index];
    let len = node.childNodes ? node.childNodes.length : 0;
    // 递归
    for (let index = 0; index < len; index++) {
        const element = node.childNodes[index];
        nowNode.index ++;
        deep(element, nowNode, diffs);
    }
    if (currentDiff) {
        applyDiffToDom(node, currentDiff);
    }
}

const applyDiffToDom = (node, diff) => {
    diff.map(item => {
        switch (item.type) {
            case REPLACE:
                let newNode = (typeof item.node === 'string') ? document.createTextNode(item.node) : item.node.render()
                node.parentNode.replaceChild(newNode, node)
                break;
            case MOVE:
                reOrderNode(node, item.content);
                break;
            case TEXT:
                node.innerHTML = item.content;
                break;
            case PROPS:
                setProps(node, item.content);
                break;
        }
    })
}

const setProps = (node, props) => {
    for (const key in props) {
        if (props.hasOwnProperty(key)) {
            const value = props[key];
            node.setAttribute(key, value);
        } else {
            node.removeAttribute(key);
        }
    }
}

const reOrderNode = (node, moves) => {
    let nodeList = Array.from(node.childNodes);
    moves.map(move => {
        const index = move.index;
        if (move.type === 0) {
            // 删除
            node.removeChild(node.childNodes[index]);
            nodeList.splice(index, 1);
        } else {
            // 新增
            const insertNode = typeof move.item === 'object' ? move.item.render() : document.createTextNode(move.item);
            nodeList.splice(index, 0, insertNode);
            node.insertBefore(insertNode, node.childNodes[index] || null);
        }
    })
}

export default Patch;
