document.addEventListener('DOMContentLoaded', function () {
    function traverseDOM(node, callback, history = []) {
        if (!node || node.nodeType !== Node.ELEMENT_NODE) return;

        history.push(node); // Зберігаємо вузол в історії

        // Викликаємо callback для поточного вузла
        callback(node, history, function (action) {
            if (action === 'next') {
                // Переходимо до наступного вузла
                const nextNode = getNextNode(node);
                if (nextNode) {
                    traverseDOM(nextNode, callback, history);
                } else {
                    // Якщо немає наступного вузла
                    callback(null, history, function (lastAction) {
                        if (lastAction === 'back' && history.length > 1) {
                            history.pop(); // Видаляємо поточний вузол з історії
                            const previousNode = history.pop(); // Повертаємо попередній вузол
                            traverseDOM(previousNode, callback, history);
                        } else {
                            alert('Обхід завершено.');
                        }
                    });
                }
            } else if (action === 'back' && history.length > 1) {
                // Повертаємося назад
                history.pop(); // Видаляємо поточний вузол з історії
                const previousNode = history.pop(); // Повертаємо попередній вузол
                traverseDOM(previousNode, callback, history);
            } else {
                // Завершуємо обхід
                alert('Обхід завершено.');
            }
        });
    }

    // Функція для отримання наступного вузла
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

    // Callback для обробки кожного вузла
    function nodeHandler(node, history, callback) {
        if (!node) {
            const lastAction = confirm(
                'Досягнуто останнього вузла дерева. Що ви хочете зробити?\n' +
                'ОК - Повернутися назад\n' +
                'Отмена - Вийти'
            );
            callback(lastAction ? 'back' : 'end');
            return;
        }

        const isAtStart = history.length === 1; // Якщо це перший вузол
        const message = `Вузол: ${node.tagName}\n` +
            `HTML: ${node.outerHTML.replace(/\s+/g, ' ').substring(0, 500)}\n\n` +
            `Оберіть дію:\n` +
            `ОК - Перейти до наступного вузла\n` +
            `Отмена - ${isAtStart ? 'Завершити обхід' : 'Повернутись назад'}`;

        const proceed = confirm(message);
        callback(proceed ? 'next' : (isAtStart ? 'end' : 'back'));
    }

    // Запускаємо обхід дерева з <body>
    traverseDOM(document.body.firstElementChild, nodeHandler);
});
