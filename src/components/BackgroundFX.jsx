export default function BackgroundFX() {
  return (
    <div
      aria-hidden="true"
      className="bg-fx pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <div className="fx-blob fx-blob--1 animate-aurora-1" />
      <div className="fx-blob fx-blob--2 animate-aurora-2" />
      <div className="fx-blob fx-blob--3 animate-aurora-3" />
      <div className="fx-grid" />
      <div className="fx-ray" />
      <div className="fx-vignette" />
    </div>
  );
}
