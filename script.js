// todo input
const taskInput = document.querySelector("#taskInput");
const addBtn = document.querySelector(".addBtn");

// loader
const loader = document.getElementById("loader");

// todo list
const todoContainer = document.querySelector(".todoContainer");
const todoText = document.querySelector(".todotext");

// api
let api = "https://6884ac65745306380a390353.mockapi.io/asyncPranav/todos";

addBtn.addEventListener("click", postData);

// fetch data
async function fetchData() {
  // loader.style.display = "block";

  let response = await fetch(api);
  let data = await response.json();
  // console.log(data);
  if (data) {
    // clear old data first
    todoContainer.innerHTML = "";

    // display todo on web page
    data.forEach((todo) => {
      const newTodo = document.createElement("div");
      newTodo.innerHTML = `
                <p class="todoText ${todo.completed ? "completed" : ""}">${
        todo.text
      }</p>
                <input type="text" name="editInput" id="editInput" value="${
                  todo.text
                }">
                <div>
                    <button class="editBtn"><i class="fa-solid fa-pen"></i></button>
                    <button class="saveBtn"><i class="fa-solid fa-check"></i></button>
                    <button class="deleteBtn"><i class="fa-solid fa-trash"></i></button>
                </div>
            `;
      newTodo.className = "todo";
      todoContainer.prepend(newTodo);

      // select deleteBtn to add delete functionality on click
      let deleteBtn = newTodo.querySelector(".deleteBtn");
      deleteBtn.addEventListener("click", () => {
        // console.log(todo.id);
        deleteData(todo.id);
      });

      // select editBtn & saveBtn to add edit and save functionality on click
      let editBtn = newTodo.querySelector(".editBtn");
      let saveBtn = newTodo.querySelector(".saveBtn");
      let editInput = newTodo.querySelector("#editInput");
      let todoText = newTodo.querySelector(".todoText");

      editBtn.addEventListener("click", () => {
        // console.log(todo.id);

        saveBtn.style.display = "inline";
        editBtn.style.display = "none";
        editInput.style.display = "inline";
        todoText.style.display = "none";
      });

      saveBtn.addEventListener("click", async () => {
        // console.log(todo.id);

        let editValue = editInput.value;
        await updateData(todo.id, editValue, todo.completed);

        saveBtn.style.display = "none";
        editBtn.style.display = "inline";
        editInput.style.display = "none";
        todoText.style.display = "inline";

        console.log(`${todo.text}`);
      });

      // mark complete on clicking todo
      newTodo.addEventListener("click", async (e) => {
        // avoid mark complete when clicked on button
        if (e.target.closest("button") || e.target.closest("#editInput")) {
          return;
        }
        const isNowCompleted = !todo.completed;
        todo.completed = isNowCompleted;

        await updateData(todo.id, todo.text, isNowCompleted); // Send new completed state

        todoText.classList.toggle("completed", isNowCompleted);
      });
    });
  }

  // loader.style.display = "none";
  taskInput.value = "";
}

fetchData();

// post data
async function postData() {
  let value = taskInput.value;

  // prevent adding empty todo
  if (!value) {
    alert("Can't add empty Todo.");
    return;
  }

  let objData = {
    text: value.trim(),
    completed: false,
  };

  let response = await fetch(api, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(objData),
  });

  // console.log(response);

  // if data has been successfully created
  if (response.status === 201) {
    fetchData();
  }
}

// delete data
async function deleteData(id) {
  let response = await fetch(`${api}/${id}`, {
    method: "DELETE",
  });
  // console.log(response);

  // if data has been deleted
  if (response.status === 200) {
    fetchData();
  }
}

// edit data
async function updateData(id, value, completed) {
  // prevent adding empty todo
  if (!value) {
    alert("Can't add empty Todo.");
    return;
  }

  let objData = {
    text: value.trim(),
    completed: completed,
  };

  let response = await fetch(`${api}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(objData),
  });

  // console.log(response);

  // if successfully updated data
  if (response.status === 200) {
    fetchData();
  }
}

// enter key to add todo functionality
taskInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") postData();
});
