export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer>
      <span>SHRIKANT BHAMA · DELHI, IN</span>
      <span>© {year}</span>
    </footer>
  );
}
