
export function Header() {
  return (
    <header className="app-header">
      <div className="logo-area">
        <svg className="heartbeat-logo" viewBox="0 0 150 50" xmlns="http://www.w3.org/2000/svg">
          <path 
            className="pulse-line" 
            d="M 0,25 L 30,25 L 35,15 L 40,35 L 45,25 L 50,25 L 55,5 L 60,45 L 65,25 L 70,25 L 150,25" 
            fill="none" 
            stroke="var(--accent-cyan)" 
            strokeWidth="3" 
            strokeLinecap="round"
          />
        </svg>
        <div className="logo-text">
          <h1>OmniDoc</h1>
          <span>AI Medical Consultation</span>
        </div>
      </div>
      <div className="status-badge">
        <span className="pulse-dot"></span>
        <span>Intake Active</span>
      </div>
    </header>
  );
}
export default Header;
