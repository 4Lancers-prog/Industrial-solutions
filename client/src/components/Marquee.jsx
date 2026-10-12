const ITEMS = ['Hydraulic Trainers', 'Pneumatic Kits', 'Electrical Machines', 'Motor-Generator Sets', 'Control Panels', 'ITI Lab Setups', 'Installation', 'Testing & Commissioning', 'Technical Support'];

export default function Marquee() {
  const row = (hidden) => (
    <ul className="marquee__row" aria-hidden={hidden || undefined}>
      {ITEMS.map((t) => <li key={t}>{t}</li>)}
    </ul>
  );
  return (
    <div className="marquee" role="presentation">
      <div className="marquee__track">{row(false)}{row(true)}</div>
    </div>
  );
}
