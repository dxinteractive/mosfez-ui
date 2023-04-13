export type XY = [number, number];

function getPointerEventPos(e: PointerEvent): XY {
  return [e.clientX, e.clientY];
}

export type OnUpdate = () => void;

export type Camera = {
  x: number;
  y: number;
  scaleX: number;
  scaleY: number;
  rotation: number;
};

function createCamera(): Camera {
  return {
    x: 0,
    y: 0,
    scaleX: 1,
    scaleY: 1,
    rotation: 0,
  };
}

export class Touch {
  private _removePointerEventListeners: () => void;
  private _activePointers = new Map<number, PointerEvent>();
  private _cameraAtDragStart = createCamera();
  private _pointersAtDragStart: XY[] = [];
  private _updateCallbacks = new Set<OnUpdate>();

  // spatial state
  public camera: Camera;

  public viewportWidth = -1;
  public viewportHeight = -1;

  // // configuration
  // public interact = true;
  public preventHTMLEventsWhileInteract = true;
  // public allowPanX = true;
  // public allowPanY = true;
  // public allowScaleX = true;
  // public allowScaleY = true;
  // public allowRotation = true;
  // public xAnchorOnViewportResize = 0.5;
  // public yAnchorOnViewportResize = 0.5;
  // public scaleXOnViewportResize = false;
  // public scaleYOnViewportResize = false;
  // public usePhysics = false;

  constructor(element: HTMLElement) {
    this.camera = createCamera();

    element.style.touchAction = "none";
    this._removePointerEventListeners = this._addPointerEventListeners(element);
    this._addResizeObserver(element);
  }

  private _callUpdate() {
    this._updateCallbacks.forEach((fn) => fn());
  }

  private _setViewportSize(width: number, height: number) {
    const prevWidth = this.viewportWidth;
    const prevHeight = this.viewportHeight;
    this.viewportWidth = width;
    this.viewportHeight = height;

    if (prevWidth === width && prevHeight === height) {
      return;
    }

    this._callUpdate();

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

  private _getActivePointersArray() {
    return Array.from(this._activePointers.values());
  }

  private _startStopDrag() {
    const pointers = this._getActivePointersArray();
    this._cameraAtDragStart = { ...this.camera };
    this._pointersAtDragStart = pointers.map((e) => getPointerEventPos(e));
  }

  private _updateCameraFromDrag() {
    const pointerCount = this._pointersAtDragStart.length;
    if (!this._cameraAtDragStart || pointerCount === 0) return;

    const pointers = this._getActivePointersArray();
    const diff = this._pointersAtDragStart.map((oldPos, i) => {
      const newPos = getPointerEventPos(pointers[i]);
      return [newPos[0] - oldPos[0], newPos[1] - oldPos[1]];
    });

    this.camera.x = this._cameraAtDragStart.x - diff[0][0];
    this.camera.y = this._cameraAtDragStart.y - diff[0][1];

    console.log("this.camera", this.camera);
    this._callUpdate();

    // todo - transform start and end points through viewToWorld matrix from start of drag

    // if(pointerCount === 1) {
    // } else if(pointerCount > 1) {
    // }
    // this._callUpdate();
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

  public worldToView(x: number, y: number): XY {
    x -= this.camera.x;
    y -= this.camera.y;
    return [x, y];
  }

  public viewToWorld(x: number, y: number): XY {
    x += this.camera.x;
    y += this.camera.y;
    return [x, y];
  }
}
