export class Touch {
  private _element;

  constructor(element: HTMLElement) {
    this._element = element;
    console.log("touch", this._element);
  }

  dispose() {
    console.log("dispose");
  }
}
