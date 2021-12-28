import "./style.scss";

export const loadApp = () => {
  class View {
    constructor(options = {}) {
      this.options = Object.assign({}, options);
      this.addBtn = document.querySelector("#add-task");
      this.taskTemplate = document.querySelector("#task");
      this.form = document.querySelector("form");
      this.sidePanel = document.querySelector("#side-panel");
      this.board = document.querySelector("#board");
      this.toggleSidePanel = this.toggleSidePanel.bind(this);
      this.addTask = this.addTask.bind(this);
      this.onDropped = this.onDropped.bind(this);
      this.initialize();
    }

    initialize() {
      this.addBtn.addEventListener("click", this.toggleSidePanel);
      this.form.addEventListener("submit", this.addTask);
      this.renderAllTasks();
      this.initializeDrag();
    }

    initializeDrag() {
      this.board.addEventListener("dragover", (e) => {
        e.preventDefault();
      });
      this.board.addEventListener("dragend", (e) => {
        e.preventDefault();
        e.target.classList.remove("dragging");
      });
      this.board.addEventListener("dragstart", (e) => {
        e.target.classList.add("dragging");
      });
      this.board.addEventListener("drop", this.onDropped);
    }

    onDropped(e) {
      const { onDropped } = this.options;
      let id = -1,
        stateIndex = -1;
      e.preventDefault();
      if (e.target.classList.contains("droppable")) {
        const temp = this.board.querySelector(".dragging");
        this.board.querySelector(".dragging").parentNode.removeChild(temp);
        e.target.append(temp);
        stateIndex = [...this.board.children].indexOf(e.target);
        id = temp.id || -1;
      }
      task.classList.remove("dragging");
      onDropped && onDropped(id, stateIndex);
    }

    renderAllTasks() {
      const { state } = this.options || [];
      if (!state.length) return;
      state.forEach((task, index) => {
        this.appendTask(task, task.state);
      });
    }

    generateRandomNumber() {
      return Math.floor(Math.random() * 5746346);
    }

    addTask(e) {
      const { onAddTask } = this.options;
      e.preventDefault();
      const formData = new FormData(this.form);
      const data = {
        id: this.generateRandomNumber(),
        state: 0,
      };
      for (let [key, value] of formData) {
        data[key] = value;
      }
      onAddTask && onAddTask(data);
      this.toggleSidePanel();
      this.appendTask(data, 0);
    }

    appendTask(data, state = 0) {
      const states = [...this.board.children];
      const taskView = this.createTask(data);
      states[state].append(taskView);
    }

    createTask(data) {
      const div = document.createElement("div");
      div.innerHTML = this.taskTemplate.text;
      const task = div.querySelector(".task");
      task.id = data.id;
      task.querySelector(".tname").innerText = data.tname;
      task.querySelector(".tdesc").innerText = data.tdesc;
      return task;
    }

    toggleSidePanel() {
      this.sidePanel.classList.toggle("visible");
    }
  }

  class State {
    constructor() {
      this.store = window.localStorage;
      this.state = {
        tasks: this.getFromStore("tasks"),
      };
    }

    patchTask(id, state) {
      this.state.tasks = this.state.tasks.map((task) => {
        if (task.id === +id) {
          return {
            ...task,
            state,
          };
        }
        return task;
      });
      this.store.setItem("tasks", JSON.stringify(this.state.tasks));
    }

    getFromStore(key) {
      const tasks = this.store.getItem(key);
      return tasks ? JSON.parse(tasks) : [];
    }

    addTask(task) {
      this.state.tasks.push(task);
      this.store.setItem("tasks", JSON.stringify(this.state.tasks));
    }

    getAllTasks() {
      return this.state.tasks || [];
    }
  }

  const state = new State();

  const view = new View({
    onAddTask: onAddTask,
    state: state.getAllTasks(),
    onDropped: onDropped,
  });

  function onAddTask(data) {
    state.addTask(data);
  }

  function onDropped(id, newState) {
    state.patchTask(id, newState);
  }
};

loadApp();
