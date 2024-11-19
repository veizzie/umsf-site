document.addEventListener('DOMContentLoaded', function() {
    function traverseDOM(node, history = []) {
        if (!node || node.nodeType !== Node.ELEMENT_NODE) return;

        history.push(node);

        const proceed = confirm(
            `Вузол: ${node.tagName}\n` +
            `HTML: ${node.outerHTML.replace(/\s+/g, ' ').substring(0, 500)}\n\n` +
            `Оберіть дію:\n` +
            `ОК - Перейти до наступного вузла\n` +
            `Отмена - ${history.length > 1 ? 'Повернутись назад' : 'Вийти'}`
        );

        if (proceed) {
            const nextNode = getNextNode(node);
            if (nextNode) {
                traverseDOM(nextNode, history);
            } else {
                const backConfirm = confirm(
                    'Досягнуто останнього вузла. Обхід завершено.\n' +
                    'Натисність ОК для повернення на попередній вузол.'
                );
                
                if (backConfirm && history.length > 1) {
                    history.pop(); 
                    const previousNode = history.pop(); 
                    traverseDOM(previousNode, history);
                }
            }
        } else {
            if (history.length > 1) {
                history.pop(); 
                const previousNode = history.pop(); 
                traverseDOM(previousNode, history);
            } else {
                alert('Обхід перервано');
            }
        }
    }

    function getNextNode(node) {
        if (node.firstElementChild) return node.firstElementChild;
        if (node.nextElementSibling) return node.nextElementSibling;
        
        let parent = node.parentElement;
        while (parent) {
            if (parent.nextElementSibling) return parent.nextElementSibling;
            parent = parent.parentElement;
        }
        
        return null;
    }

    traverseDOM(document.body.firstElementChild);
});