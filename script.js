let allTasks = JSON.parse(localStorage.getItem("tasks")) || [];
let valueInput = "";
let input = null;
let indexEdit = -1;
let tempEdit = "";

window.onload = async function init() {
  input = document.getElementById("add-tasks");
  input.addEventListener("change", updateValue);
  input.addEventListener("keyup", updateValue1);
//объеденим to-do лист с запросами на сервер, получение задач
  const resp = await fetch('http://localhost:8000/allTasks', {
    method: 'GET'
  });
  let result = await resp.json();
  allTasks = result.data;//выводит задачи, которые есть на сервере 
  render();
};

//------Добавление Tasks
updateValue1 = (event) => {
  if (event.key === "Enter") {
    onClickButton();
  }
  localStorage.setItem("tasks", JSON.stringify(allTasks));
  render();
};

updateValue2 = (e) => {
  if (e.key === "Enter") {
    onClickSvgDone();
    localStorage.setItem("tasks", JSON.stringify(allTasks));
    render();
  } else {
    tempEdit = e.target.value;
  }
};

onClickButton = async () => {
  if (valueInput === "") return alert(" Введите текст");
  allTasks.push({
    text: valueInput,
    isCheck: false,
  });
  //создание задач 
  const resp = await fetch('http://localhost:8000/createTask', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      'Access-Cantrol-Allow-Origin': '*'
    },
    body: JSON.stringify({
      text: valueInput,
      isCheck: false,
    })
  });
  let result = await resp.json();
  allTasks = result.data;

  valueInput = ""; //обнуление input
  input.value = "";
  localStorage.setItem("tasks", JSON.stringify(allTasks));
  render();
};

onClickDelete = async () => {
  // allTasks = [];
  // удаление все Tasks
  await allTasks.forEach( async (element) => {
    const resp = await fetch(`http://localhost:8000/deleteTask?id=${element.id}`, {
      method: 'DELETE',
    });
    let result = await resp.json();
    allTasks = result.data;
    render();
  });

  localStorage.setItem("tasks", JSON.stringify(allTasks));
};

updateValue = (event) => {
  valueInput = event.target.value;
};

onChangeCheckbox = async (index) => {
  // allTasks[index].isCheck = !allTasks[index].isCheck;
  //обновление существующих данных Checkbox
  const resp = await fetch('http://localhost:8000/updateTask', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      'Access-Cantrol-Allow-Origin': '*'
    },
    body: JSON.stringify({
      isCheck: !(allTasks[index].isCheck),
      id: allTasks[index].id,
    })
  });
  let result = await resp.json();
  allTasks = result.data;

  localStorage.setItem("tasks", JSON.stringify(allTasks));
  render();
};

onClickSvgEdit = async (index) => {
  indexEdit = index;
  render();
};

onClickSvgDone = async (index) => {
  if (tempEdit === "") return alert(" Введите текст");
  // allTasks[indexEdit].text = tempEdit;
  //обновление существующих данных Input(text)
  const resp = await fetch('http://localhost:8000/updateTask', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      'Access-Cantrol-Allow-Origin': '*'
    },
    body: JSON.stringify({
      text: tempEdit,
      id: allTasks[index].id,
    })
  });
  let result = await resp.json();
  allTasks = result.data;

  indexEdit = -1;
  localStorage.setItem("tasks", JSON.stringify(allTasks));
  render();
};

onClickSvgCancel = (index) => {
  indexEdit = -1;
  render();
};

onClickSvgDelete = async (index) => {
  // allTasks.splice(index, 1);
  // удаление одного task
  const resp = await fetch(`http://localhost:8000/deleteTask?id=${allTasks[index].id}`, {
    method: 'DELETE',
  });
  let result = await resp.json();
  allTasks = result.data;
  // localStorage.setItem("tasks", JSON.stringify(allTasks));
  render();
};

textArea = (editInput) => {
  editInput.rows = Math.ceil(tempEdit.length / 16);
};

render = () => {
  const content = document.getElementById("content-page");

  allTasks.sort((task1, task2) =>
    task1.isCheck > task2.isCheck ? 1 : task1.isCheck < task2.isCheck ? -1 : 0
  );

  while (content.firstChild) {
    content.removeChild(content.firstChild);
  } //удаляем старые элементы, чтобы не было повторений

  allTasks.map((item, index) => {
    const container = document.createElement("div");
    container.id = `task-${index}`;
    container.className = "task-container";

    //-------Checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "check";
    checkbox.checked = item.isCheck;
    checkbox.onchange = () => {
      onChangeCheckbox(index);
    };
    container.appendChild(checkbox);

    if (indexEdit === index) {
      const editInput = document.createElement("textarea");
      editInput.className = "edit-text";
      editInput.value = tempEdit;
      editInput.rows = Math.ceil(tempEdit.length / 16);
      editInput.onkeyup = (e) => updateValue2(e);
      editInput.oninput = () => textArea(editInput);

      //--------Done
      const svgDone = document.createElement("i");
      svgDone.className = "far fa-check-circle svg-icon";
      svgDone.onclick = () => {
        onClickSvgDone(index);
      };
      container.appendChild(editInput);
      container.appendChild(svgDone);

      //--------Cancel
      const svgCancel = document.createElement("i");
      svgCancel.className = "far fa-window-close svg-icon";
      svgCancel.onclick = () => {
        onClickSvgCancel(index);
      };
      container.appendChild(svgCancel);
      checkbox.disabled = true; //свойство инпута(отключить галочку)
    } else {
      const text = document.createElement("p");
      text.innerText = item.text;
      text.className = item.isCheck ? "text-task done-text" : "text-task";
      container.appendChild(text);

      //--------Edit
      const svgEdit = document.createElement("i");
      svgEdit.className = "far fa-edit svg-icon";
      svgEdit.onclick = () => {
        tempEdit = item.text;
        onClickSvgEdit(index);
      };
      container.appendChild(svgEdit);
      svgEdit.style.display = item.isCheck ? "none" : "flex";

      //-------Delete
      const svgDelete = document.createElement("i");
      svgDelete.className = "far fa-trash-alt svg-icon";
      svgDelete.onclick = () => {
        onClickSvgDelete(index);
      };
      container.appendChild(svgDelete);
    }

    content.appendChild(container);
  });
};
