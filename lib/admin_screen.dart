if (data["role"] == "admin") {
  Navigator.pushReplacement(
    context,
    MaterialPageRoute(builder: (_) => const AdminScreen()),
  );
} else {
  Navigator.pushReplacement(
    context,
    MaterialPageRoute(builder: (_) => const HomeScreen()),
  );
}