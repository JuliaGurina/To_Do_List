let allTasks = [];
let valueInput = "";
let input = null;
let indexEdit = -1;
let tempEdit = "";

window.onload = async function init() {
  input = document.getElementById("add-tasks");
  input.addEventListener("change", updateValue);
  input.addEventListener("keyup", updateValue1);
  const resp = await fetch("http://localhost:4000/allTasks", {
    method: "GET",
  });
  let result = await resp.json();
  allTasks = result.data;
  render();
};

//------Добавление Tasks
updateValue1 = (event) => {
  if (event.key === "Enter") {
    onClickButton();
  }
  render();
};

updateValue2 = (e, index) => {
  if (e.key === "Enter") {
    onClickSvgDone(index);
    render();
  } else {
    tempEdit = e.target.value;
  }
};

onClickButton = async () => {
  if (valueInput === "") return alert(" Введите текст");
  {
    const resp = await fetch("http://localhost:4000/createTask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        "Access-Control-Allow_origin": "*",
      },
      body: JSON.stringify({
        text: valueInput,
        isCheck: false,
      }),
    });
    let result = await resp.json();
    allTasks.push(result.data);

    valueInput = ""; //обнуление input
    input.value = "";
  }
  render();
};

onClickDelete = async () => {
  const resp = await fetch(`http://localhost:4000/deleteTasks`, {
    method: "DELETE",
  });
  let result = await resp.json();
  allTasks = [];
  render();
};

updateValue = (event) => {
  valueInput = event.target.value;
};

onChangeCheckbox = async (index) => {
  let { _id, isCheck } = allTasks[index];

  const resp = await fetch("http://localhost:4000/updateTask", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      "Access-Control-Allow_origin": "*",
    },
    body: JSON.stringify({ _id, isCheck: !isCheck }),
  });

  let result = await resp.json();
  allTasks = result.data;

  render();
};

onClickSvgEdit = (index) => {
  indexEdit = index;
  render();
};

onClickSvgDone = async (index) => {
  if (tempEdit === "") return alert("Введите текст");
  indexEdit = -1;
  const { _id } = allTasks[index];
  const resp = await fetch("http://localhost:4000/updateTask", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      "Access-Control-Allow_origin": "*",
    },
    body: JSON.stringify({ _id, text: tempEdit }),
  });
  let result = await resp.json();
  allTasks = result.data;
  render();
};

onClickSvgCancel = (index) => {
  indexEdit = -1;
  render();
};

onClickSvgDelete = async (index) => {
  const resp = await fetch(
    `http://localhost:4000/deleteTask?_id=${allTasks[index]._id}`,
    {
      method: "DELETE",
    }
  );
  let result = await resp.json();
  allTasks = result.data;
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
    checkbox.onchange = function () {
      onChangeCheckbox(index);
    };
    container.appendChild(checkbox);

    if (indexEdit === index) {
      const editInput = document.createElement("textarea");
      editInput.className = "edit-text";
      editInput.value = tempEdit;
      editInput.rows = Math.ceil(tempEdit.length / 16);
      editInput.onkeyup = (e) => updateValue2(e, index);
      editInput.oninput = () => textArea(editInput);

      //--------Done
      const svgDone = document.createElement("i");
      svgDone.className = "far fa-check-circle svg-icon";
      svgDone.onclick = function () {
        onClickSvgDone(index);
      };
      container.appendChild(editInput);
      container.appendChild(svgDone);

      //--------Cancel
      const svgCancel = document.createElement("i");
      svgCancel.className = "far fa-window-close svg-icon";
      svgCancel.onclick = function () {
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
      svgEdit.onclick = function () {
        tempEdit = item.text;
        onClickSvgEdit(index);
      };
      container.appendChild(svgEdit);
      svgEdit.style.display = item.isCheck ? "none" : "flex";

      //-------Delete
      const svgDelete = document.createElement("i");
      svgDelete.className = "far fa-trash-alt svg-icon";
      svgDelete.onclick = function () {
        onClickSvgDelete(index);
      };
      container.appendChild(svgDelete);
    }

    content.appendChild(container);
  });
};
