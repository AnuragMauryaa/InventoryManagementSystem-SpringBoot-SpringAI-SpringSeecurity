import { useEffect } from "react";

export default function Modal({
  title,
  onClose,
  children,
  footer,
}) {
  useEffect(() => {
    if (!onClose) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [onClose]);

  const handleBackdropClick = () => {
    if (onClose) {
      onClose();
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <div
      className="modal-backdrop"
      onClick={handleBackdropClick}
    >
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <div className="modal-head">
          <h2>{title}</h2>

          {onClose && (
            <button
              type="button"
              className="icon-btn secondary"
              aria-label="Close"
              onClick={handleClose}
            >
              ✕
            </button>
          )}
        </div>

        <div className="modal-body">
          {children}
        </div>

        {footer && (
          <div className="modal-foot">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
