const todos = []; // آرایه برای ذخیره همه وظایف

// انتخاب عناصر از DOM
const todoInput = document.querySelector("#todo-input");
const todoForm = document.querySelector("#todo-form");
const todoList = document.querySelector("#todolist");
const selectFilter = document.querySelector("#filter-todos");

// اضافه کردن رویداد به فرم
todoForm.addEventListener("submit" , addNewTodo);
selectFilter.addEventListener("change" , filterTodos);

function addNewTodo(event){
    event.preventDefault();

    // بررسی مقدار ورودی
    if (!todoInput.value.trim()) return;

    // ایجاد شیء جدید
    const newTodo = {
        id: Date.now(),
        createdAt: new Date().toISOString(),
        title: todoInput.value,
        isCompleted: false,
    };

    todos.push(newTodo); // اضافه کردن به آرایه
    creatTodos(todos);
    
};
function creatTodos(todos){
    let result = "";
    todos.forEach((todo) => {
        result += `
            <li class="bg-white flex justify-between items-center px-3 py-2 rounded-lg mb-4">
                <p class="text-purple-700">${todo.title}</p>
                <span class="text-gray-900">${new Date(todo.createdAt).toLocaleString()}</span>
                <button data-todo-id=${todo.id} class="block text-lg cursor-pointer bg-transparent p-2 text-green-600">
                    <i class="far fa-check-square"></i>
                </button>
                <button data-todo-id=${todo.id} class="block text-lg cursor-pointer bg-transparent p-2 text-red-600">
                    <i class="far fa-trash-alt"></i>
                </button>  
            </li>
        `;
    });
    todoList.innerHTML = result; // مقدار جدید را در لیست قرار می‌دهیم
    todoInput.value = ""; // پاک کردن مقدار input بعد از اضافه شدن
};
function filterTodos(event){
    const filter = event.target.value;
    switch(filter){
        case "all" : {
            creatTodos(todos);
            break;
        };
        case "completed" : {
            const filteredTodos = todos.filter((todo)=> todo.isCompleted);
            creatTodos(filteredTodos);
            break;
        };
        case "uncompleted" : {
            const filteredTodos = todos.filter((todo)=> !todo.isCompleted);
            creatTodos(filteredTodos);
            break;
        };
        default : 
        creatTodos(todos);
    };
};