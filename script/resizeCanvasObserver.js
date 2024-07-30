export const createResizeCanvasObserver = (canvasContainer, aspectRatio) => {
  return new ResizeObserver(() => {
    if (!canvasContainer) return;

    if (document.body.offsetWidth / document.body.offsetHeight < aspectRatio) {
      if (!canvasContainer.classList.contains("horizontal")) {
        canvasContainer.classList.add("horizontal");
        canvasContainer.classList.remove("vertical");
      }
    } else {
      if (!canvasContainer.classList.contains("vertical")) {
        canvasContainer.classList.remove("horizontal");
        canvasContainer.classList.add("vertical");
      }
    }
  });
};
