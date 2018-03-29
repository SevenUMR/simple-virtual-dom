class Element {
    constructor(tagName, props, children) {
        this.tagName = tagName;
        this.props = props;
        this.children = children;

        this.key = props ? props.key : void 2333;
    
        let childrenCount = 0
    
        this.children.map((child, i) => {
            if (child instanceof Element) {
                childrenCount += child.childrenCount
            } else {
                children[i] = '' + child
            }
            childrenCount ++
        });
        
        this.childrenCount = childrenCount
    }
    render() {
        // 创建元素
        const el = document.createElement(this.tagName);
        const props = this.props;
        // 遍历传入的props
        for (const propName in props) {
            if (props.hasOwnProperty(propName)) {
                const propValue = props[propName];
                el.setAttribute(propName, propValue) // 设置元素的属性。
            }
        }
        const children = this.children || [];
        children.map(child => {
            const isElemennt = child instanceof Element // 判断child是否为Elemet
            // 若child是元素，则递归调用。否则就是创界文本节点
            const childEl = isElemennt ? child.render() : document.createTextNode(child);
            el.append(childEl); // 将child节点并入
        })
        return el;
    }
}

export default Element;