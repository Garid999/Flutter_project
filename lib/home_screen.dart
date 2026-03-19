import 'package:flutter/material.dart';
import 'main.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {

    List products = [
      {
        "name": "Black Jacket",
        "price": "\$120",
        "image": "assets/images/outfit.jpg"
      },
      {
        "name": "Men Hoodie",
        "price": "\$80",
        "image": "assets/images/outfit.jpg"
      },
      {
        "name": "Casual Shirt",
        "price": "\$60",
        "image": "assets/images/outfit.jpg"
      },
      {
        "name": "Denim Jacket",
        "price": "\$150",
        "image": "assets/images/outfit.jpg"
      },
    ];

    return Scaffold(
      appBar: AppBar(
        title: const Text("OutfitHub"),
        centerTitle: true,

        actions: [

          IconButton(
            icon: const Icon(Icons.shopping_cart),
            onPressed: () {},
          ),

          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () {

              Navigator.pushAndRemoveUntil(
                context,
                MaterialPageRoute(builder: (_) => const WelcomeScreen()),
                (route) => false,
              );

            },
          )
        ],
      ),

      body: Padding(
        padding: const EdgeInsets.all(16),

        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [

            const Text(
              "Welcome 👋",
              style: TextStyle(
                fontSize: 26,
                fontWeight: FontWeight.bold,
              ),
            ),

            const SizedBox(height: 5),

            const Text(
              "Find your best outfit today",
              style: TextStyle(
                color: Colors.grey,
              ),
            ),

            const SizedBox(height: 20),

            /// SEARCH BAR
            TextField(
              decoration: InputDecoration(
                hintText: "Search clothes...",
                prefixIcon: const Icon(Icons.search),

                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
            ),

            const SizedBox(height: 25),

            const Text(
              "Popular Products",
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),

            const SizedBox(height: 15),

            /// PRODUCT LIST
            Expanded(
              child: GridView.builder(

                itemCount: products.length,

                gridDelegate:
                    const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2,
                  crossAxisSpacing: 15,
                  mainAxisSpacing: 15,
                  childAspectRatio: 0.75,
                ),

                itemBuilder: (context, index) {

                  final product = products[index];

                  return Container(
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(15),
                      color: Colors.grey.shade100,
                    ),

                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [

                        /// PRODUCT IMAGE
                        Expanded(
                          child: ClipRRect(
                            borderRadius: const BorderRadius.vertical(
                                top: Radius.circular(15)),

                            child: Image.asset(
                              product["image"],
                              width: double.infinity,
                              fit: BoxFit.cover,
                            ),
                          ),
                        ),

                        Padding(
                          padding: const EdgeInsets.all(10),

                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [

                              Text(
                                product["name"],
                                style: const TextStyle(
                                  fontWeight: FontWeight.bold,
                                ),
                              ),

                              const SizedBox(height: 5),

                              Text(
                                product["price"],
                                style: const TextStyle(
                                  color: Colors.grey,
                                ),
                              ),

                              const SizedBox(height: 5),

                              Row(
                                mainAxisAlignment:
                                    MainAxisAlignment.spaceBetween,
                                children: [

                                  const Icon(Icons.favorite_border),

                                  IconButton(
                                    icon: const Icon(Icons.add_shopping_cart),
                                    onPressed: () {},
                                  )
                                ],
                              )
                            ],
                          ),
                        )
                      ],
                    ),
                  );
                },
              ),
            )
          ],
        ),
      ),
    );
  }
}