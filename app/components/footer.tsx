export default function Footer() {
  return (
    <footer className="bg-green-800 text-white p-4 text-center font-bold">
      <p>&copy; {new Date().getFullYear()} Meal Doctor. All rights reserved.</p>
    </footer>
  );
}