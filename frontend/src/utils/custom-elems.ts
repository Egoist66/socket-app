
/**
 * Defines a custom HTML element with the specified tag name, component, and optional styles.
 *
 * @template T - A generic type that extends a record with string keys and any values, representing the properties of the component.
 * @param {string} tagName - The name of the custom element. Must contain a hyphen.
 * @param {(props: T) => string} component - A function that takes the element's properties and returns an HTML string to render.
 * @param {string} [styles] - Optional CSS styles to be applied to the custom element.
 * @throws {Error} Throws an error if the tag name does not contain a hyphen.
 */

export function defineCustomTag<T extends Record<string, any>>(
  tagName: string,
  component: (props: T) => string,
  styles?: string
) {
  if (!tagName.includes("-")) {
    throw new Error(
      "Custom tag name must contain a hyphen (e.g. 'my-element')"
    );
  }

  class CustomTag extends HTMLElement {
    private _props: T;

    constructor() {
      super();
      this._props = this.getAttributeNames().reduce(
        (acc, name) => ({ ...acc, [name]: this.getAttribute(name) }),
        {}
      ) as T;
      this.attachShadow({ mode: "open" });
    }

    static get observedAttributes() {
      return Object.keys(component({} as T));
    }

    connectedCallback() {
      this.render();
    }

    attributeChangedCallback(
      name: string,
      _oldValue: string,
      newValue: string
    ) {
      this._props = {
        ...this._props,
        [name]: newValue,
      };

      this.render();
    }

    private render() {
      if (!this.shadowRoot) return;

      const styleTag = styles ? `<style id="${crypto.randomUUID()}">${styles}</style>` : "";

      this.shadowRoot.innerHTML = `
        ${styleTag}
        ${component(this._props)}
      `;
    }
  }

  customElements.define(tagName, CustomTag);
}


 //@example
 
  //  defineCustomTag<{ name: string }>(
  //     "user-card",
  //     (props) => `
  //    <div>${props.name}</div>
    
  //   `,
  //     `
  //    div {
  //       color: red;
  //    }
    
  //   `
  //   );