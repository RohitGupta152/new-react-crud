import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';

const modalStack = [];
const BASE_Z = 100;

function pushModal(instance) {
  modalStack.push(instance);
  document.body.style.overflow = 'hidden';
}

function popModal(instance) {
  const idx = modalStack.indexOf(instance);
  if (idx !== -1) modalStack.splice(idx, 1);
  if (modalStack.length === 0) {
    document.body.style.overflow = '';
  }
}

function isTop(instance) {
  return modalStack[modalStack.length - 1] === instance;
}

/**
 * Accessible, animated modal with a simple stacking/focus-trap implementation.
 * Supports top modals while keeping underlying modals intact.
 */
function Modal({
  isOpen,
  onClose,
  titleId,
  children,
  maxWidth = 'max-w-lg',
  bottomSheet = false,
  className = '',
}) {
  const [render, setRender] = useState(false);
  const [visible, setVisible] = useState(false);
  const panelRef = useRef(null);
  const instanceRef = useRef({ zIndex: BASE_Z });
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      setRender(true);
      const raf = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(raf);
    }
    return undefined;
  }, [isOpen]);

  useEffect(() => {
    if (render && !isOpen) {
      const t = setTimeout(() => setRender(false), 220);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [render, isOpen]);

  useEffect(() => {
    if (!render) return undefined;
    const instance = instanceRef.current;
    pushModal(instance);
    instance.zIndex = BASE_Z + (modalStack.length - 1) * 10;

    const panel = panelRef.current;
    const previouslyFocused = document.activeElement;

    const autoFocusEl = panel?.querySelector('[data-autofocus]');
    const frame = requestAnimationFrame(() => {
      if (autoFocusEl) autoFocusEl.focus();
      else panel?.focus();
    });

    const getFocusable = () => {
      if (!panel) return [];
      return Array.from(
        panel.querySelectorAll(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => el.offsetParent !== null || el === document.activeElement);
    };

    const handleKeyDown = (e) => {
      if (!isTop(instance)) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        onCloseRef.current();
      } else if (e.key === 'Tab') {
        const focusables = getFocusable();
        if (focusables.length === 0) {
          e.preventDefault();
          panel?.focus();
          return;
        }
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement;
        if (e.shiftKey) {
          if (active === first || active === panel) {
            e.preventDefault();
            last.focus();
          }
        } else if (active === last || active === panel) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown, true);

    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
      cancelAnimationFrame(frame);
      popModal(instance);
      if (previouslyFocused && typeof previouslyFocused.focus === 'function') {
        previouslyFocused.focus();
      }
    };
  }, [render]);

  if (!render) return null;

  const placement = bottomSheet
    ? 'items-end sm:items-center justify-center'
    : 'items-center justify-center';
  const hidden = visible
    ? 'opacity-100 translate-y-0 scale-100'
    : 'opacity-0 translate-y-4 sm:translate-y-2 scale-[0.97]';

  return (
    <div
      className={`fixed inset-0 flex ${placement} p-0 sm:p-6`}
      style={{ zIndex: instanceRef.current.zIndex }}
    >
      <div
        className={`absolute inset-0 bg-app-overlay backdrop-blur-[2px] transition-opacity duration-200 ${
          visible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={`relative w-full border border-app-border bg-app-surface shadow-card outline-none backdrop-blur-xl transition-all duration-200 ease-out ${hidden} ${bottomSheet ? 'rounded-t-3xl sm:rounded-3xl' : 'rounded-3xl'} ${bottomSheet ? `sm:${maxWidth}` : maxWidth} ${className}`}
      >
        {children}
      </div>
    </div>
  );
}

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  titleId: PropTypes.string,
  children: PropTypes.node.isRequired,
  maxWidth: PropTypes.string,
  bottomSheet: PropTypes.bool,
  className: PropTypes.string,
};

export default Modal;
