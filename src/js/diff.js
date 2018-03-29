import Type from './static-params';
import ListDiff from './list-diff'; 

class Diff {
    constructor() {

    }
    compare(oldTree, newTree) {
        const index = 0;
        const diff = {};
        this.deepMap(oldTree, newTree, index, diff);
        return diff;
    }
    deepMap(oldTree, newTree, index, diff) {
        const currentDiff = [];
        if (!newTree) {
            if (isStringNode(oldTree) && isStringNode(newTree)) {
                // 两个都是字符类
                currentDiff.push({ type: Type.TEXT, content: newTree });
            } else {
                if (oldTree.tagName === newTree.tagName && oldTree.key === newTree.key) {
                    // 两个视为同个节点，但是还是要比较props以及children
                    const propsDiff = this.diffProps(oldTree.props, newTree.props);
                    if (propsDiff) {
                        currentDiff.push({ type: Type.PROPS, content: propsDiff })
                    }
                    // 子节点比较分为顺序改动以及内容改动
                    const childrenDiff = this.diffChildren(oldTree.children, newTree.children);
                    if (childrenDiff && childrenDiff.type === 0) {
                        // 顺序改动
                        currentDiff.push({ type: Type.MOVE, content: childrenDiff.move })
                    } else if (childrenDiff && childrenDiff.type === 1) {
                        // 内容改动
                        let node = null;
                        oldTree.children.map((child, i) => {
                            let currentIndex = (node && node.count) ? (index + node.childrenCount + 1) : (index + 1);
                            this.deepMap(child, childrenDiff.newChild, index, diff);
                            node = child;
                        })
                    }
                } else {
                    currentDiff.push({ type: patch.REPLACE, node: newNode })
                }
            }
        }
        if (currentDiff.length) {
            diffs[index] = currentDiff;
        }
    }
    diffProps(oldProps, newProps) {
        let propsDiff = {};
        let count = 0;
        for (const key in oldProps) {
            if (oldProps.hasOwnProperty(key)) {
                const value = oldProps[key];
                if (newProps[key] !== value) {
                    count ++;
                    propsDiff[key] = newProps[key];
                }
            }
        }
        for (const key in newProps) {
            if (newProps.hasOwnProperty(key)) {
                const element = object[key];
                if (!oldProps.hasOwnProperty(key)) {
                    count ++;
                    propsDiff[key] = newProps[key];
                }
            }
        }
        return count === 0 ? null : propsDiff;
    }
    diffChildren(oldChildren, newChildren) {
        const diffs = ListDiff(oldChildren, newChildren, 'key');
        newChildren = diffs.children;
        return diffs.moves.length ? { type: 0, move: diffs.moves } : { type: 1, newChild: newChildren }
    }
}

const isStringNode = (node) => {
    return typeof node === 'string' || typeof node === 'number';
}

export default Diff;
