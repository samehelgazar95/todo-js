let todoInput = document.querySelector('main form input');
let todoSubmit = document.querySelector('main form button');
let todosSection = document.querySelector('main .todos');
let deleteAll = document.querySelector('main .delete-all button');
let filter = document.querySelector('main .filter');

// Todos Objects
let allTodosObjects = [];

// Load from the local storage and update
window.onload = () => {
  todoInput.focus();
  for (let i = 0; i < localStorage.length; i++) {
    let key = localStorage.key(i);
    let todoObjLocally = localStorage.getItem(key);
    allTodosObjects.push(JSON.parse(todoObjLocally));
  }

  for (let todo of allTodosObjects) {
    let currentTodo = createTodo(todo.content);
    if (todo.completed) {
      currentTodo.children[0].children[0].checked = true;
      currentTodo.children[0].children[1].classList.add('done');
    }
    todosSection.prepend(currentTodo);
  }
};

// Create Element with more features
function advancedCreateElement({
  eleName = 'div',
  eleClass,
  eleText,
  eleType,
  eleValue,
}) {
  let ele = document.createElement(eleName);
  ele.className = eleClass;
  ele.textContent = eleText;
  ele.type = eleType;
  ele.value = eleValue;
  return ele;
}

// Create Todo Component
function createTodo(inputContent) {
  // CREATE todo component
  let todo = advancedCreateElement({ eleName: 'div', eleClass: 'todo' });
  let todoContainer = advancedCreateElement({
    eleName: 'div',
    eleClass: 'todo-container',
  });
  let todoCheckbox = advancedCreateElement({
    eleName: 'input',
    eleClass: 'checker',
    eleType: 'checkbox',
  });
  let todoPara = advancedCreateElement({
    eleName: 'p',
    eleText: inputContent,
  });
  let todoBtns = advancedCreateElement({ eleName: 'div', eleClass: 'btns' });
  let updateBtn = advancedCreateElement({
    eleName: 'button',
    eleClass: 'update',
    eleText: 'Update',
  });
  let deleteBtn = advancedCreateElement({
    eleName: 'button',
    eleClass: 'delete',
    eleText: 'Delete',
  });

  todoBtns.append(updateBtn);
  todoBtns.append(deleteBtn);
  todoContainer.append(todoCheckbox);
  todoContainer.append(todoPara);
  todoContainer.append(todoBtns);
  todo.append(todoContainer);

  return todo;
}

function createTodoObj(content) {
  let todoObj = {
    id: Date.now(),
    content: content,
    completed: false,
  };

  return todoObj;
}

// Update the local storage
function updateLocalStorage(todoObjects) {
  if (obj) {
    localStorage.clear();
    for (let i = 0; i < todoObjects.length; i++)
      localStorage.setItem(i, todoObjects[i]);
  }
}

// CREATE Todo
todoSubmit.addEventListener('click', (e) => {
  e.preventDefault();
  if (!todoInput.value) {
    todoInput.placeholder = 'Please Type Something!';
    return;
  }
  let todo = createTodo(todoInput.value);
  todosSection.prepend(todo);

  let todoObj = createTodoObj(todoInput.value);
  allTodosObjects.push(todoObj);
  localStorage.setItem(todoObj.id, JSON.stringify(todoObj));
  todoInput.value = '';
  todoInput.focus();
});

// DELETE Todo
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('delete')) {
    let currentTodo = e.target.parentElement.parentElement.parentElement;
    if (confirm('Are u sure?')) {
      let deletedContent =
        e.target.parentElement.parentElement.children[1].textContent;
      let deletedTodoIndex = allTodosObjects.findIndex(
        (e) => e.content == deletedContent
      );
      localStorage.removeItem(
        JSON.stringify(allTodosObjects[deletedTodoIndex].id)
      );
      allTodosObjects.splice(deletedTodoIndex, 1);
      currentTodo.remove();
      todoInput.focus();
    }
  }
});

// UPDATE Todo
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('update')) {
    let todo = e.target.parentElement.parentElement.parentElement;
    let updatedContent =
      e.target.parentElement.parentElement.children[1].textContent;
    let updatedTodoIndex = allTodosObjects.findIndex(
      (e) => e.content == updatedContent
    );
    let todoContainer = e.target.parentElement.parentElement;
    todoContainer.classList.add('hide');
    let todoPara = e.target.parentElement.parentElement.children[1].textContent;

    // Create Update form
    let updateContainer = advancedCreateElement({
      eleName: 'div',
      eleClass: 'update-container',
    });
    let updateForm = advancedCreateElement({
      eleName: 'form',
      eleClass: 'update-input',
    });
    let updateInput = advancedCreateElement({
      eleName: 'input',
      eleType: 'text',
      eleValue: todoPara,
    });
    let updateBtn = advancedCreateElement({
      eleName: 'button',
      eleType: 'submit',
      eleClass: 'update-submit',
      eleText: 'Update',
    });
    updateForm.append(updateInput);
    updateForm.append(updateBtn);
    updateContainer.append(updateForm);
    todo.append(updateContainer);
    updateInput.focus();

    // UPDATE SUBMIT
    updateBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (!updateInput.value) {
        updateInput.placeholder = 'Please Type Something!';
        return;
      }

      let todoIndex = allTodosObjects.findIndex(
        (ele) => ele.content == todoContainer.children[1].textContent
      );
      let todoKey = allTodosObjects[todoIndex].id;
      let todoLocally = JSON.parse(
        localStorage.getItem(JSON.stringify(todoKey))
      );
      todoLocally.content = updateInput.value;
      localStorage.setItem(
        JSON.stringify(todoKey),
        JSON.stringify(todoLocally)
      );

      todoContainer.children[1].textContent = updateInput.value;
      allTodosObjects[updatedTodoIndex].content = updateInput.value;
      todoContainer.classList.remove('hide');
      updateContainer.classList.add('hide');
    });
  }
});

// FINISH Todo
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('checker')) {
    let currentTodo = e.target.parentElement.parentElement;
    let todoContainer = e.target.parentElement;
    let todoPara = todoContainer.children[1];
    let todoIndex = allTodosObjects.findIndex(
      (ele) => ele.content == todoContainer.children[1].textContent
    );
    let todoKey = allTodosObjects[todoIndex].id;
    let todoLocally = JSON.parse(localStorage.getItem(JSON.stringify(todoKey)));

    if (e.target.checked) {
      allTodosObjects[todoIndex].completed = true;
      todoLocally.completed = true;
      localStorage.setItem(
        JSON.stringify(todoKey),
        JSON.stringify(todoLocally)
      );
      todoPara.classList.add('done');
    } else {
      allTodosObjects[todoIndex].completed = false;
      todoLocally.completed = false;
      localStorage.setItem(
        JSON.stringify(todoKey),
        JSON.stringify(todoLocally)
      );
      todoPara.classList.remove('done');
    }
  }
});

// FILTER
filter.addEventListener('change', (e) => {
  let status = e.target.value;
  let filteredTodosObjects;
  switch (status) {
    case 'done':
      filteredTodosObjects = allTodosObjects.filter((e) => e.completed == true);
      break;
    case 'not-done':
      filteredTodosObjects = allTodosObjects.filter(
        (e) => e.completed == false
      );
      break;
    case 'all':
      filteredTodosObjects = allTodosObjects;
      break;
  }

  todosSection.innerHTML = '';
  filteredTodosObjects.sort((a, b) => a.id - b.id);
  for (let todo of filteredTodosObjects) {
    let filteredTodo = createTodo(todo.content);
    if (todo.completed == true) {
      filteredTodo.children[0].children[1].classList.add('done');
      filteredTodo.children[0].children[0].checked = true;
    }
    todosSection.append(filteredTodo);
  }
});

// DELETE ALL
deleteAll.addEventListener('click', (e) => {
  todosSection.innerHTML = '';
  allTodosObjects = [];
  localStorage.clear();
});
