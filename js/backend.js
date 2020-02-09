(function (exports) {

    'use strict';

    const api = "${VUE_APP_BACKEND_HOST}";

    const options = {
        mode: "cors", // no-cors, cors, *same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        redirect: "follow", // manual, *follow, error
        referrer: "no-referrer", // no-referrer, *client
    };

    exports.backend = {
        async create(todo) {
            const post_options = Object.assign(options, {
                method: "POST", 
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(todo), // body data type must match "Content-Type" header
            });
            const response = await fetch(api, post_options);
            var contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                var createdTodo = await response.json();
                // replace temporary todo with persisted instance
                var elementPos = app.todos.map(function (x) {
                    return x.title;
                }).indexOf(createdTodo.title);
                // console.log('create  replace todo @ index:', elementPos);
                app.todos.splice(elementPos, 1, createdTodo);
                todoStorage.save(app.todos);
                return;
            }
            throw new TypeError("Oops, PATCH request failed! We haven't got any JSON!");
        },
        async read() {
            const response = await fetch(api);
            // response.headers.forEach(function(val, key) { console.log(key + ' -> ' + val); });
            var contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                app.todos = await response.json();
                todoStorage.save(app.todos);
                return;
            }
            throw new TypeError("Oops, GET request failed! We haven't got any JSON!");
        },
        async update(todo) {
            const patch = JSON.stringify({
                completed: todo.completed,
                title: todo.title
            });
            const patch_options = Object.assign(options, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: patch
            });
            const response = await fetch(todo.url, patch_options);
            if (response && response.ok) {
                return;
            }
            throw Error('PATCH request failed!');
        },
        async delete(todo) {
            const deloptions = Object.assign(options, {
                method: "DELETE"
            });
            const response = await fetch(todo.url, deloptions);
            if (response && response.ok) {
                return;
            }
            throw Error('DELETE request failed!');
        }
    }
})(window);