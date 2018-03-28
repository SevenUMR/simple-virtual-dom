import Type from './static-params';

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
                        currentDiff.push({ type: Type.CHILDRENMOVE, content: childrenDiff.move })
                    } else if (childrenDiff && childrenDiff.type === 1) {
                        // 内容改动这里不做调整，放到childrenDiff中做处理
                    }
                }
            }
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
}

const isStringNode = (node) => {
    return typeof node === 'string' || typeof node === 'number';
}