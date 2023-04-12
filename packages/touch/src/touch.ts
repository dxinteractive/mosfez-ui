export class Touch {
  private _element;
  private _onEvent;

  private _handlers = {
    mousedown: (ev: MouseEvent) => {
      this.lastEventType = "mousedown";
      this.lastEvent = ev;
      this._onEvent();
    },
    mousemove: (ev: MouseEvent) => {
      this.lastEvent = ev;
      this.lastEventType = "mousemove";
      this._onEvent();
    },
    mouseup: (ev: MouseEvent) => {
      this.lastEventType = "mouseup";
      this.lastEvent = ev;
      this._onEvent();
    },
    touchstart: (ev: MouseEvent) => {
      this.lastEventType = "touchstart";
      this.lastEvent = ev;
      this._onEvent();
    },
    touchmove: (ev: MouseEvent) => {
      this.lastEventType = "touchmove";
      this.lastEvent = ev;
      this._onEvent();
    },
    touchend: (ev: MouseEvent) => {
      this.lastEventType = "touchend";
      this.lastEvent = ev;
      this._onEvent();
    },
    touchcancel: (ev: MouseEvent) => {
      this.lastEventType = "touchcancel";
      this.lastEvent = ev;
      this._onEvent();
    },
  };

  public lastEvent: Event | undefined;
  public lastEventType = "none";

  constructor(element: HTMLElement, onEvent: () => void) {
    this._element = element;
    this._onEvent = onEvent;
    this.attach();
  }

  private attach() {
    Object.entries(this._handlers).forEach(([name, handler]) => {
      this._element.addEventListener(
        name as keyof HTMLElementEventMap,
        handler as any
      );
    });
  }

  dispose() {
    Object.entries(this._handlers).forEach(([name, handler]) => {
      this._element.removeEventListener(
        name as keyof HTMLElementEventMap,
        handler as any
      );
    });
  }
}
