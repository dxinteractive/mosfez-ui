export type XY = [number, number];

export type CameraData = {
  x: number;
  y: number;
  scaleX: number;
  scaleY: number;
  rotation: number;
};

export function scaleAt(x: number, scaleAtX: number, scale: number) {
  return (x - scaleAtX) * scale + scaleAtX;
}

function getPointerEventPos(e: PointerEvent): XY {
  return [e.offsetX, e.offsetY];
}

function createCameraData() {
  return {
    x: 0,
    y: 0,
    scaleX: 1,
    scaleY: 1,
  };
}

export type OnUpdate = () => void;

export class Touch {
  private _camera = createCameraData();
  private _cameraAtDragStart = createCameraData();

  private _dragPointsMap = new Map<number, [XY, XY]>(); // <id, [start pos, current pos]>

  private _removePointerEventListeners: () => void;
  private _updateCallbacks = new Set<OnUpdate>();

  public viewportWidth = -1;
  public viewportHeight = -1;

  // // configuration
  // public interact = true;
  public preventHTMLEventsWhileInteract = true;
  public allowPanX = true;
  public allowPanY = true;
  public allowScaleX = true;
  public allowScaleY = true;
  // public allowRotation = true;
  // public xAnchorOnViewportResize = 0.5;
  // public yAnchorOnViewportResize = 0.5;
  // public scaleXOnViewportResize = false;
  // public scaleYOnViewportResize = false;
  // public usePhysics = false;

  constructor(element: HTMLElement) {
    this._removePointerEventListeners = this._addPointerEventListeners(element);
    this._addResizeObserver(element);

    element.style.touchAction = "none";
  }

  private _callUpdateCallbacks() {
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

    this._callUpdateCallbacks();

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

  private _startDrag(id: number, pos: XY) {
    this._dragPointsMap.set(id, [pos, pos]);
    const otherPos: XY = [400, 400];
    this._dragPointsMap.set(-1, [otherPos, otherPos]);
    this._cameraAtDragStart = { ...this._camera };
  }

  private _updateDrag(id: number, pos: XY) {
    const dragItem = this._dragPointsMap.get(id);
    const dragItem2 = this._dragPointsMap.get(-1);
    if (!dragItem || !dragItem2) return;
    // if (!dragItem) return;
    dragItem[1] = pos;
    const otherPos: XY = [400, 400];
    dragItem2[1] = otherPos;
    this._updateCameraFromDrag();
  }

  private _stopDrag(id: number) {
    this._dragPointsMap.delete(id);
    this._dragPointsMap.delete(-1);
  }

  private _addPointerEventListeners(element: HTMLElement) {
    const pointerdown = (e: PointerEvent) => {
      this._preventDefault(e);
      this._startDrag(e.pointerId, getPointerEventPos(e));
    };

    const pointermove = (e: PointerEvent) => {
      this._preventDefault(e);
      this._updateDrag(e.pointerId, getPointerEventPos(e));
    };

    const pointerup = (e: PointerEvent) => {
      this._preventDefault(e);
      this._stopDrag(e.pointerId);
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

  private _updateCameraFromDrag() {
    const c = this._cameraAtDragStart;
    const dragPoints = Array.from(this._dragPointsMap.values());
    if (!c || dragPoints.length === 0) return;

    const [first] = dragPoints;
    const [firstStart, firstEnd] = first;
    const firstDeltaX = firstEnd[0] - firstStart[0];
    const firstDeltaY = firstEnd[1] - firstStart[1];

    if (dragPoints.length === 1) {
      this._camera.x = c.x - firstDeltaX;
      this._camera.y = c.y - firstDeltaY;
    } else {
      // const [secondStart, secondEnd] = second;
      // const spanStartX = secondStart[0] - firstStart[0];
      // const spanStartY = secondStart[1] - firstStart[1];
      // const spanEndX = secondEnd[0] - firstEnd[0];
      // const spanEndY = secondEnd[1] - firstEnd[1];
      // this._camera.scaleX = c.scaleX + spanEndX / spanStartX;
      // this._camera.scaleY = c.scaleY + spanStartY / spanEndY;
      // const averageStartX = (firstStart[0] + secondStart[0]) / 2;
      // const averageEndX = (firstEnd[0] + secondEnd[0]) / 2;
      // const averageStartY = (firstStart[1] + secondStart[1]) / 2;
      // const averageEndY = (firstEnd[1] + secondEnd[1]) / 2;
      // this._camera.x = c.x - (averageEndX - averageStartX);
      // this._camera.y = c.y - (averageEndY - averageStartY);
    }

    console.log("this._camera", this._camera);

    this._callUpdateCallbacks();
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
    x -= this._camera.x;
    // y -= this._camera.y;
    return [x, y];
  }
}
