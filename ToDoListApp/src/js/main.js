let todos = []; // Array to store all tasks

// Select elements from the DOM
const todoInput = document.querySelector("#todo-input");
const todoForm = document.querySelector("#todo-form");
const todoList = document.querySelector("#todolist");
const selectFilter = document.querySelector("#filter-todos");


// Add event to form
todoForm.addEventListener("submit" , addNewTodo);
selectFilter.addEventListener("change" , filterTodos);

//add new Todo
function addNewTodo(event){
    event.preventDefault();

    // Checking the input value
    if (!todoInput.value.trim()) return;

    // Create a new object
    const newTodo = {
        id: Date.now(),
        createdAt: new Date().toISOString(),
        title: todoInput.value,
        isCompleted: false,
    };

    todos.push(newTodo); // Add to array
    createTodos(todos);
    
};
//create Todo
function createTodos(todos){
    let result = "";
    todos.forEach((todo) => {
        result += `
            <li id="todo" class="bg-white flex justify-between items-center px-3 py-2 rounded-lg mb-4">
                <p class="text-purple-700 ${todo.isCompleted && "completed"}">${todo.title}</p>
                <span id="todo__createdAt" class="text-gray-900">${new Date(todo.createdAt).toLocaleString()}</span>
                <button data-todo-id=${todo.id} class="todo__check block text-lg cursor-pointer bg-transparent p-2 text-green-600">
                    <i class="far fa-check-square"></i>
                </button>
                <button data-todo-id=${todo.id} class="todo__remove block text-lg cursor-pointer bg-transparent p-2 text-red-600">
                    <i class="far fa-trash-alt"></i>
                </button>  
            </li>
        `;
    });
    todoList.innerHTML = result;// We put the new value in the list.
    todoInput.value = ""; // Clear input value after adding

    const removeBtns = [... document.querySelectorAll(".todo__remove")]; // remove a todo
    removeBtns.forEach((button) => button.addEventListener("click" , removeTodo)) //add an Event

    const checkBtns = [... document.querySelectorAll(".todo__check")]; // check a todo
    checkBtns.forEach((button) => button.addEventListener("click" , checkTodo)) //add an Event
};
//filter section Todos
function filterTodos(event){
    const filter = event.target.value;
    switch(filter){
        case "all" : {
            createTodos(todos);
            break;
        };
        case "completed" : {
            const filteredTodos = todos.filter((todo)=> todo.isCompleted);
            createTodos(filteredTodos);
            break;
        };
        case "uncompleted" : {
            const filteredTodos = todos.filter((todo)=> !todo.isCompleted);
            createTodos(filteredTodos);
            break;
        };
        default : 
        createTodos(todos);
    };
};
//delete a Todo
function removeTodo(e){
    const button = e.target.closest("button"); // reach to buttons
    const todoId = Number(button.dataset.todoId);
    todos = todos.filter((t) => t.id !== todoId);
    createTodos(todos);
}

//check a Todo
function checkTodo(e){
    const button = e.target.closest("button"); // reach to buttons
    const todoId = Number(button.dataset.todoId);
    const todo = todos.find((t) => t.id === todoId);
    todo.isCompleted = !todo.isCompleted;
    createTodos(todos);
}