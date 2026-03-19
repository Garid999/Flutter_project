import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

class AdminScreen extends StatefulWidget {
  const AdminScreen({super.key});

  @override
  State<AdminScreen> createState() => _AdminScreenState();
}

class _AdminScreenState extends State<AdminScreen> {

  List users = [];
  bool isLoading = true;

  // GET USERS FROM DATABASE
  Future<void> fetchUsers() async {
    try {
      var response = await http.get(
        Uri.parse("http://10.0.2.2:3000/users"),
      );

      var data = jsonDecode(response.body);

      setState(() {
        users = data;
        isLoading = false;
      });

    } catch (e) {
      setState(() {
        isLoading = false;
      });
    }
  }

  // DELETE USER
  Future<void> deleteUser(int id) async {

    await http.delete(
      Uri.parse("http://10.0.2.2:3000/delete/$id"),
    );

    fetchUsers();
  }

  @override
  void initState() {
    super.initState();
    fetchUsers();
  }

  @override
  Widget build(BuildContext context) {

    return Scaffold(
      appBar: AppBar(
        title: const Text("Admin Panel"),
        centerTitle: true,
      ),

      body: isLoading
          ? const Center(child: CircularProgressIndicator())
          : ListView.builder(
              itemCount: users.length,
              itemBuilder: (context, index) {

                final user = users[index];

                return Card(
                  margin: const EdgeInsets.all(10),
                  child: ListTile(

                    leading: CircleAvatar(
                      child: Text(user["id"].toString()),
                    ),

                    title: Text(user["username"]),

                    subtitle: Text("Role: ${user["role"]}"),

                    trailing: IconButton(
                      icon: const Icon(Icons.delete, color: Colors.red),
                      onPressed: () {
                        deleteUser(user["id"]);
                      },
                    ),
                  ),
                );
              },
            ),

      floatingActionButton: FloatingActionButton(
        onPressed: fetchUsers,
        child: const Icon(Icons.refresh),
      ),
    );
  }
}