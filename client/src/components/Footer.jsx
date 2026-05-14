export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer>
      <span>shrikant bhama — delhi, in</span>
      <span>© {year}</span>
    </footer>
  );
}
