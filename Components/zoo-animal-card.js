// components/zoo-animal-card.js
import { toggleAnimalStatus, toggleAnimalHealth } from "../ZooOperations.js";

class ZooAnimalCard extends HTMLElement {
  // If you want to pass data via an attribute:
  static get observedAttributes() { return ["animal"]; }

  constructor() {
    super();
    this.attachShadow({ mode: "open" }); // Shadow DOM = isolated styles/markup
  }

  // Convenience getter/setter for the "animal" data
  get data() {
    const raw = this.getAttribute("animal");
    return raw ? JSON.parse(raw) : null;
  }
  set data(obj) {
    this.setAttribute("animal", JSON.stringify(obj));
  }

  connectedCallback() {
    this.render();
  }
  attributeChangedCallback() {
    this.render();
  }
  disconnectedCallback() {
    // Clean up listeners if you add any on window/document
  }

  render() {
    const a = this.data;
    if (!a) {
      this.shadowRoot.innerHTML = `<em>No animal provided</em>`;
      return;
    }
    this.shadowRoot.innerHTML = `
      <style>
        :host{display:block;font-family:system-ui;border:1px solid #e5e7eb;border-radius:12px;padding:12px;margin:8px;box-shadow:0 2px 10px rgba(0,0,0,.05)}
        h3{margin:.25rem 0;font-size:1.1rem}
        small{color:#6b7280}
        .row{margin:.25rem 0}
        button{margin-right:8px;border:0;padding:.5rem .8rem;border-radius:8px;cursor:pointer;background:#10b981;color:white}
        button.secondary{background:#3b82f6}
      </style>
      <h3>${a.name} <small>(${a.species})</small></h3>
      <div class="row">Status: <b id="status-${a.id}">${a.status}</b></div>
      <div class="row">Health: <b id="health-${a.id}">${a.health}</b></div>
      <div class="row">
        <button id="toggleStatus">Toggle Status</button>
        <button id="toggleHealth" class="secondary">Toggle Health</button>
      </div>
    `;

    // Wire buttons to your existing operations module
    this.shadowRoot.getElementById("toggleStatus").onclick = () => {
      toggleAnimalStatus(a.id, window.animals || []);
      const val = document.getElementById(`status-${a.id}`)?.textContent || a.status;
      a.status = val;
      this.dispatchEvent(new CustomEvent("animal-updated", { bubbles: true, detail: { id: a.id, status: a.status }}));
    };
    this.shadowRoot.getElementById("toggleHealth").onclick = () => {
      toggleAnimalHealth(a.id, window.animals || []);
      const val = document.getElementById(`health-${a.id}`)?.textContent || a.health;
      a.health = val;
      this.dispatchEvent(new CustomEvent("animal-updated", { bubbles: true, detail: { id: a.id, health: a.health }}));
    };
  }
}

customElements.define("zoo-animal-card", ZooAnimalCard);