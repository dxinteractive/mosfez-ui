import { vec2 } from "gl-matrix";

function getPointerEventPos(e: PointerEvent): vec2 {
  return vec2.fromValues(e.clientX, e.clientY);
}

export type OnUpdate = () => void;

export class Touch {
  private _removePointerEventListeners: () => void;
  private _activePointers = new Map<number, PointerEvent>();
  private _currentDragStart: vec2[] = [];
  private _updateCallbacks = new Set<OnUpdate>();

  private _viewportWidth = -1;
  private _viewportHeight = -1;

  // spatial state
  // public panX = 0;
  // public panY = 0;
  // public scaleX = 1;
  // public scaleY = 1;
  // public rotation = 0;

  // // configuration
  // public interact = true;
  public preventHTMLEventsWhileInteract = true;
  // public allowPanX = true;
  // public allowPanY = true;
  // public allowScaleX = true;
  // public allowScaleY = true;
  // public allowRotation = true;
  // public panXAnchorOnViewportResize = 0.5;
  // public panYAnchorOnViewportResize = 0.5;
  // public scaleXOnViewportResize = false;
  // public scaleYOnViewportResize = false;
  // public usePhysics = false;

  constructor(element: HTMLElement) {
    element.style.touchAction = "none";
    this._removePointerEventListeners = this._addPointerEventListeners(element);
    this._addResizeObserver(element);
  }

  private _setViewportSize(width: number, height: number) {
    const prevWidth = this._viewportWidth;
    const prevHeight = this._viewportHeight;
    this._viewportWidth = width;
    this._viewportHeight = height;

    if ((prevWidth === width && prevHeight === height) || prevWidth === -1) {
      return;
    }

    // todo - reposition pan and scale according to viewport size change
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

  private _addPointerEventListeners(element: HTMLElement) {
    const pointerdown = (e: PointerEvent) => {
      this._preventDefault(e);
      this._activePointers.set(e.pointerId, e);
      this._startStopDrag();
    };

    const pointermove = (e: PointerEvent) => {
      this._preventDefault(e);
      if (this._activePointers.has(e.pointerId)) {
        this._activePointers.set(e.pointerId, e);
        this._updateCameraFromDrag();
      }
    };

    const pointerup = (e: PointerEvent) => {
      this._preventDefault(e);
      this._activePointers.delete(e.pointerId);
      this._startStopDrag();
    };

    element.addEventListener("pointerdown", pointerdown);
    element.addEventListener("pointermove", pointermove);
    element.addEventListener("pointerup", pointerup);
    element.addEventListener("pointercancel", pointerup);
    element.addEventListener("pointerout", pointerup);
    element.addEventListener("pointerleave", pointerup);

    return () => {
      element.removeEventListener("pointerdown", pointerdown);
      element.removeEventListener("pointermove", pointermove);
      element.removeEventListener("pointerup", pointerup);
      element.removeEventListener("pointercancel", pointerup);
      element.removeEventListener("pointerout", pointerup);
      element.removeEventListener("pointerleave", pointerup);
    };
  }

  private _startStopDrag() {
    const events = Array.from(this._activePointers.values());
    this._currentDragStart = events.map((e) => getPointerEventPos(e));
  }

  private _updateCameraFromDrag() {
    const pointerCount = this._currentDragStart.length;
    if (pointerCount === 0) return;

    // todo - transform start and end points through screenToWorld matrix from start of drag

    // if(pointerCount === 1) {
    // } else if(pointerCount > 1) {
    // }
    console.log("_currentDragStart", this._currentDragStart);
    // this._updateCallbacks.forEach((fn) => fn());
  }

  public dispose() {
    this._removePointerEventListeners();
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
