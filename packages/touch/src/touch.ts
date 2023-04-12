export type OnUpdate = () => void;

export class Touch {
  private _removeMouseEventListeners: () => void;

  private _mouseDown = false;
  private _mouseDownX: number | undefined;
  private _mouseDownY: number | undefined;

  private _viewportWidth = 0;
  private _viewportHeight = 0;

  private _updateCallbacks = new Set<OnUpdate>();

  // spatial state
  public panX = 0;
  public panY = 0;
  public scaleX = 1;
  public scaleY = 1;
  public rotation = 0;

  // configuration
  public interact = true;
  public preventHTMLEventsWhileInteract = true;
  public allowPanX = true;
  public allowPanY = true;
  public allowScaleX = true;
  public allowScaleY = true;
  public allowRotation = true;
  public panXAnchorOnViewportResize = 0.5;
  public panYAnchorOnViewportResize = 0.5;
  public scaleXOnViewportResize = false;
  public scaleYOnViewportResize = false;
  public usePhysics = false;

  constructor(element: HTMLElement) {
    this._removeMouseEventListeners = this._addMouseEventListeners(element);
    this._setInitialViewportSize(element);
    this._addResizeObserver(element);
  }

  private _setViewportSize(width: number, height: number) {
    this._viewportWidth = width;
    this._viewportHeight = height;
  }

  private _setInitialViewportSize(element: HTMLElement) {
    const rect = element.getBoundingClientRect();
    this._setViewportSize(rect.width, rect.height);
  }

  private _addResizeObserver(element: HTMLElement) {
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === element) {
          const { width, height } = entry.contentRect;
          this._setViewportSize(width, height);
        }
      }
    });
    observer.observe(element);
    return () => observer.disconnect();
  }

  private _preventDefault(e: MouseEvent) {
    if (this.preventHTMLEventsWhileInteract) {
      e.preventDefault();
    }
  }

  private _addMouseEventListeners(element: HTMLElement) {
    const mousedown = (e: MouseEvent) => {
      this._preventDefault(e);
      this._mouseDown = true;
      const x = e.clientX;
      const y = e.clientY;
      this._mouseDownX = x;
      this._mouseDownY = y;

      console.log(x, y);

      // onSurfaceEvent({
      //   type: "start",
      //   x,
      //   y,
      //   pointerId: "mouse",
      //   force: 1,
      // });
    };

    const mousemove = (e: MouseEvent) => {
      this._preventDefault(e);
      if (!this._mouseDown) return;

      // onSurfaceEvent({
      //   type: "move",
      //   x,
      //   y,
      //   pointerId: "mouse",
      //   force: 1,
      // });
    };

    const mouseup = () => {
      this._mouseDown = false;
    };

    element.addEventListener("mousedown", mousedown);
    element.addEventListener("mousemove", mousemove);
    window.addEventListener("mouseup", mouseup);

    return () => {
      element.removeEventListener("mousedown", mousedown);
      element.removeEventListener("mousemove", mousemove);
      window.removeEventListener("mouseup", mouseup);
    };
  }

  public dispose() {
    this._removeMouseEventListeners();
  }

  public onUpdate(callback: OnUpdate) {
    this._updateCallbacks.add(callback);
    return () => {
      this._updateCallbacks.delete(callback);
    };
  }

  public screenToWorld(x: number, y: number): [number, number] {
    return [x, y];
  }
}
