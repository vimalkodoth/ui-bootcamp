import "./style.scss";

class View {
  defaultOptions = {
    content: [1, 2, 3, 4, 5],
  };
  constructor(options) {
    this.container = document.body;
    this.currentDraggable = null;
    this.state = Object.assign(this.defaultOptions, options);
    this.initializeListeners();
  }

  initializeListeners() {
    const draggableTemplate = document.querySelector("#draggable-template");
    const fragment = document.createDocumentFragment();
    this.state.content.forEach((content) => {
      var node = document.createElement("div");
      node.innerHTML = draggableTemplate.text;
      node.querySelector(".draggable").textContent = content;
      fragment.append(node.querySelector(".draggable"));
    });
    this.container.append(fragment);
    this.container.addEventListener("dragstart", this.onDragStart);
    this.container.addEventListener("dragover", this.onDragOver);
    this.container.addEventListener("dragend", this.onDragEnd);
    this.container.addEventListener("drop", this.onDrop);
  }

  onDragStart(e) {
    e.target.classList.add("dragging");
    this.currentDraggable = e.target;
    e.dataTransfer.setData("text/plain", e.target.textContent);
  }

  onDragOver(e) {
    e.preventDefault();
    console.log(e);
  }

  onDragEnd(e) {
    e.preventDefault();
    this.currentDraggable.classList.remove("dragging");
  }

  onDrop(e) {
    e.preventDefault();
    if (!e.target.classList.contains("draggable")) return;
    const value = e.dataTransfer.getData("text/plain");
    const destValue = e.target.textContent;
    this.currentDraggable.textContent = destValue;
    e.target.textContent = value;
  }
}

export const loadApp = () => {
  const view = new View({ content: [1, 2, 3, 4, 5, 6, 7, 8] });
};

loadApp();
