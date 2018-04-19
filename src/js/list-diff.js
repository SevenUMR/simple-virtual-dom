let moves = [];

const listDiff = (oldList, newList, key) => {
    // 设置key和free
    let oldMap = setKeyIndexAndFree(oldList, key);
    let newMap = setKeyIndexAndFree(newList, key);
    // 为新数组没有key的对象
    let newFree = newMap.free;

    // 取keyIndex对象
    var oldKeyIndex = oldMap.keyIndex
    var newKeyIndex = newMap.keyIndex
    
    let children = [];
    let item, itemKey;
    let freeIndex = 0;
    // 第一次循环，删除
    oldList.map((oldItem, index) => {
        item = oldItem;
        itemKey = getItemKey(oldItem, key);
        if (itemKey) {
            if (!newKeyIndex.hasOwnProperty(itemKey)) {
                // 新的数组不存在此对象，设为null
                children.push(null);
            } else {
                // 新数组存在此对象
                const newItemIndex = newKeyIndex[itemKey]
                children.push(newList[newItemIndex])
            }
        } else {
            const freeItem = newFree[freeIndex++]
            children.push(freeItem || null)
        }
    })
    let final = children.slice(0);
    let i = 0;
    while (i < final.length) {
        if (final[i] === null) {
            remove(i);
            removeTemp(final, i);
        } else {
            i ++;
        }
    }
    // 第二次循环，此时的final是old与new的交集新增
    let m = 0, n = 0;
    while (m < newList.length) {
        let item = newList[m];
        let itemKey = getItemKey(newList[m], key);
        let finalItem = final[n];
        let finalItemKey = getItemKey(final[n], key);
        if (finalItem) {
            if (itemKey === finalItemKey) {
                n ++;
            } else {
                if (!oldKeyIndex.hasOwnProperty(itemKey)) {
                    insert(m, item);
                } else {
                    // 如果老数组内有该元素，判断下一个是否相等
                    var nextItemKey = getItemKey(final[n + 1], key)
                    if (nextItemKey === itemKey) {
                        remove(m);
                        removeTemp(final, n);
                        n ++;
                    } else {
                        insert(m, item);
                    }

                }
            }
        } else {
            insert(m, item);
        }
        m ++;
    }
    var k = final.length - n;
    while (n++ < final.length) {
        k--
        remove(k + m);
    }

    return {
        moves: moves,
        children: children,
    }
}

// 从临时数组中删除
const removeTemp = (tempArr, index) => {
    tempArr.splice(index, 1);
}

// 删除
const remove = (index) => {
    const move = { index: index, type: 0 };
    moves.push(move);
}

const insert = (index, item) => {
    const move = { index: index, item: item, type: 1 };
    moves.push(move);
}

const setKeyIndexAndFree = (list, key) => {
    let keyIndex = {};
    let free = [];
    list.map((item, index) => {
        const itemKey = getItemKey(item, key);
        if (itemKey) {
            keyIndex[itemKey] = index;
        } else {
            free.push(item);
        }
    })
    return {
        keyIndex: keyIndex,
        free: free,
    }
}

const getItemKey = (item, key) => {
    if (!item || !key) return;
    return typeof key === 'string' ? item[key]: key(item);
}

export default listDiff;