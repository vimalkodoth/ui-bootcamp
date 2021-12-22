import "./style.scss";

class Model {
  constructor(searchTerm, values) {
    this.state = {
      searchTerms: values,
      searchTerm: searchTerm,
    };
  }

  setSearchTerm(term) {
    this.state.searchTerm = term;
  }

  getFilteredTerms() {
    if (!this.state.searchTerm) return [];
    return this.state.searchTerms.filter((term) =>
      term.toLowerCase().startsWith(this.state.searchTerm.toLowerCase())
    );
  }
}

class View {
  constructor() {
    this.input = document.querySelector("#search");
    this.searchResults = document.querySelector("#search-results");
    this.onInputChange = this.onInputChange.bind(this);
    this.renderResults = this.renderResults.bind(this);
  }

  onInputChange(callback) {
    this.input.addEventListener("input", function (e) {
      callback(e.target.value);
    });
  }

  renderResults(results) {
    const fragment = document.createDocumentFragment();
    results.forEach((item) => {
      let element = document.createElement("li");
      element.textContent = item;
      fragment.append(element);
    });
    this.searchResults.innerHTML = "";
    this.searchResults.append(fragment);
  }
}

(function () {
  const view = new View();
  const model = new Model("", [
    "Cat",
    "Bat",
    "Rat",
    "Balloon",
    "Juice",
    "Jasper",
  ]);

  view.onInputChange(function (term) {
    model.setSearchTerm(term);
    const terms = model.getFilteredTerms();
    view.renderResults(terms);
  });
})();
