import { useEffect, useCallback } from 'react';

export default function Lightbox({ images, index, onClose, onChange }) {
  const total = images.length;

  const prev = useCallback(() => onChange((index - 1 + total) % total), [index, total, onChange]);
  const next = useCallback(() => onChange((index + 1) % total), [index, total, onChange]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowLeft' && total > 1) prev();
      else if (e.key === 'ArrowRight' && total > 1) next();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose, prev, next, total]);

  if (!images[index]) return null;

  return (
    <div className="lightbox" onClick={onClose}>
      <button className="lb-close" onClick={onClose}>close ×</button>
      {total > 1 && (
        <>
          <button className="lb-prev" onClick={(e) => { e.stopPropagation(); prev(); }}>‹</button>
          <button className="lb-next" onClick={(e) => { e.stopPropagation(); next(); }}>›</button>
          <div className="lb-count">{index + 1} / {total}</div>
        </>
      )}
      <img src={images[index]} alt="" onClick={(e) => e.stopPropagation()} />
    </div>
  );
}
