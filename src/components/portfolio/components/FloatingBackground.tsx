export const FloatingBackground = () => {
  return (
    <div className="floating-background">
      {[1, 2, 3].map((i) => (
        <div key={i} className={`floating-element floating-element-${i}`} />
      ))}
    </div>
  );
}; 