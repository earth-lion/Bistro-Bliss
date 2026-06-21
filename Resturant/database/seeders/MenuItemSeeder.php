<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\MenuItem;
use Illuminate\Database\Seeder;

class MenuItemSeeder extends Seeder
{
    public function run(): void
    {
        $pizza = Category::where('name', 'Pizza')->first();
        $burgers = Category::where('name', 'Burgers')->first();
        $pasta = Category::where('name', 'Pasta')->first();
        $desserts = Category::where('name', 'Desserts')->first();
        $drinks = Category::where('name', 'Drinks')->first();

        $items = [
            // PIZZA
            [
                'category_id' => $pizza->id,
                'name' => 'Pizza Margherita',
                'description' => 'Classic Italian pizza with fresh tomatoes, sliced mozzarella, sweet basil, and extra virgin olive oil.',
                'price' => 12.99,
                'image' => 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=600&q=80',
            ],
            [
                'category_id' => $pizza->id,
                'name' => 'Pepperoni Supreme',
                'description' => 'Loaded with premium cured pepperoni slices, rich marinara sauce, and a double layer of melted mozzarella cheese.',
                'price' => 14.99,
                'image' => 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=600&q=80',
            ],
            [
                'category_id' => $pizza->id,
                'name' => 'BBQ Chicken Pizza',
                'description' => 'Grilled chicken strips, smoky BBQ sauce, red onions, sweet bell peppers, and fresh cilantro over melted cheddar & mozzarella.',
                'price' => 15.49,
                'image' => 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
            ],
            [
                'category_id' => $pizza->id,
                'name' => 'Vegetarian Feast',
                'description' => 'A colorful mix of roasted mushrooms, sweet bell peppers, black olives, sweet corn, red onions, and fresh cherry tomatoes.',
                'price' => 13.49,
                'image' => 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&w=600&q=80',
            ],

            // BURGERS
            [
                'category_id' => $burgers->id,
                'name' => 'Classic Cheeseburger',
                'description' => 'Juicy prime beef patty, melted cheddar cheese, crisp lettuce, fresh tomato slices, pickles, and our signature bistro sauce on a toasted brioche bun.',
                'price' => 10.99,
                'image' => 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
            ],
            [
                'category_id' => $burgers->id,
                'name' => 'Spicy Jalapeno Burger',
                'description' => 'Flame-grilled beef patty, spicy jalapeno slices, pepper jack cheese, crispy onions, and fiery chipotle aioli.',
                'price' => 11.99,
                'image' => 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=600&q=80',
            ],
            [
                'category_id' => $burgers->id,
                'name' => 'Crispy Chicken Burger',
                'description' => 'Golden-fried buttermilk chicken breast, creamy coleslaw, dill pickles, and sweet honey mustard sauce on a toasted brioche bun.',
                'price' => 11.49,
                'image' => 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=600&q=80',
            ],
            [
                'category_id' => $burgers->id,
                'name' => 'Bacon Swiss Mushroom',
                'description' => 'Succulent beef patty topped with sautéed wild mushrooms, crispy smoked bacon, melted Swiss cheese, and garlic herb mayonnaise.',
                'price' => 12.99,
                'image' => 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?auto=format&fit=crop&w=600&q=80',
            ],

            // PASTA
            [
                'category_id' => $pasta->id,
                'name' => 'Spaghetti Bolognese',
                'description' => 'Classic Italian pasta tossed in a rich, slow-simmered beef ragù, topped with freshly grated Parmesan and fresh basil leaves.',
                'price' => 13.99,
                'image' => 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
            ],
            [
                'category_id' => $pasta->id,
                'name' => 'Fettuccine Alfredo',
                'description' => 'Creamy, rich parmesan garlic butter sauce tossed with fettuccine pasta, topped with tender grilled chicken breast.',
                'price' => 14.99,
                'image' => 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=600&q=80',
            ],
            [
                'category_id' => $pasta->id,
                'name' => 'Spicy Arrabbiata',
                'description' => 'Penne pasta tossed in a fiery, garlic-rich tomato sauce with crushed red pepper flakes, black olives, and fresh parsley.',
                'price' => 11.99,
                'image' => 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=600&q=80',
            ],

            // DESSERTS
            [
                'category_id' => $desserts->id,
                'name' => 'Chocolate Lava Cake',
                'description' => 'Warm, decadent chocolate cake with a rich molten liquid chocolate center, served with premium vanilla bean ice cream.',
                'price' => 7.99,
                'image' => 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80',
            ],
            [
                'category_id' => $desserts->id,
                'name' => 'NY Style Cheesecake',
                'description' => 'Creamy, velvety New York style cheesecake on a buttery graham cracker crust, topped with fresh strawberry compote.',
                'price' => 6.99,
                'image' => 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=600&q=80',
            ],
            [
                'category_id' => $desserts->id,
                'name' => 'Classic Tiramisu',
                'description' => 'Layers of espresso-soaked ladyfingers, velvety mascarpone cream, and a generous dusting of rich cocoa powder.',
                'price' => 7.49,
                'image' => 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=600&q=80',
            ],

            // DRINKS
            [
                'category_id' => $drinks->id,
                'name' => 'Strawberry Mojito',
                'description' => 'A refreshing, ice-cold blend of fresh muddled strawberries, mint leaves, lime juice, white sugar, and sparkling soda.',
                'price' => 4.99,
                'image' => 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80',
            ],
            [
                'category_id' => $drinks->id,
                'name' => 'Iced Matcha Latte',
                'description' => 'High-grade organic Japanese Uji matcha whisked with cold milk and sweet vanilla syrup, served over crushed ice.',
                'price' => 5.49,
                'image' => 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=600&q=80',
            ],
            [
                'category_id' => $drinks->id,
                'name' => 'Fresh Squeezed Orange Juice',
                'description' => '100% natural, freshly squeezed orange juice, served chilled and packed with daily essential Vitamin C.',
                'price' => 3.99,
                'image' => 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&w=600&q=80',
            ],
            // Additional items
            // Pizza extra
            [
                'category_id' => $pizza->id,
                'name' => 'Four Seasons',
                'description' => 'Tomato, mozzarella, ham, mushrooms, artichokes, and olives – a season for every taste.',
                'price' => 16.99,
                'image' => 'https://images.unsplash.com/photo-1582450316470-acd0ba1afc33?auto=format&fit=crop&w=600&q=80',
            ],
            [
                'category_id' => $pizza->id,
                'name' => 'Hawaiian Delight',
                'description' => 'Sweet pineapple, savory ham, mozzarella, and a hint of BBQ sauce.',
                'price' => 14.49,
                'image' => 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=600&q=80',
            ],
            // Burgers extra
            [
                'category_id' => $burgers->id,
                'name' => 'Mushroom Swiss Burger',
                'description' => 'Beef patty, sautéed mushrooms, Swiss cheese, and garlic aioli.',
                'price' => 12.49,
                'image' => 'https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=600&q=80',
            ],
            [
                'category_id' => $burgers->id,
                'name' => 'BBQ Bacon Burger',
                'description' => 'Beef patty, crispy bacon, cheddar, BBQ sauce, and pickles.',
                'price' => 13.99,
                'image' => 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
            ],
            // Pasta extra
            [
                'category_id' => $pasta->id,
                'name' => 'Linguine Pesto',
                'description' => 'Linguine tossed in fresh basil pesto, cherry tomatoes, and pine nuts.',
                'price' => 13.99,
                'image' => 'https://images.unsplash.com/photo-1516684702072-2c9b2cfc4b28?auto=format&fit=crop&w=600&q=80',
            ],
            [
                'category_id' => $pasta->id,
                'name' => 'Spinach Ricotta Ravioli',
                'description' => 'Homemade ravioli filled with ricotta and spinach, served in a light butter sauce.',
                'price' => 15.49,
                'image' => 'https://images.unsplash.com/photo-1516974415479-3c46e98424f5?auto=format&fit=crop&w=600&q=80',
            ],
            // Desserts extra
            [
                'category_id' => $desserts->id,
                'name' => 'Lemon Tart',
                'description' => 'Tangy lemon curd in a buttery crust, topped with whipped cream.',
                'price' => 5.99,
                'image' => 'https://images.unsplash.com/photo-1542038784451-587b70bd7c35?auto=format&fit=crop&w=600&q=80',
            ],
            [
                'category_id' => $desserts->id,
                'name' => 'Fruit Parfait',
                'description' => 'Layers of fresh berries, yogurt, granola, and honey.',
                'price' => 6.49,
                'image' => 'https://images.unsplash.com/photo-1498654896293-37aacf113fd5?auto=format&fit=crop&w=600&q=80',
            ],
            // Drinks extra
            [
                'category_id' => $drinks->id,
                'name' => 'Classic Lemonade',
                'description' => 'Freshly squeezed lemons, sugar, and sparkling water.',
                'price' => 3.49,
                'image' => 'https://images.unsplash.com/photo-1504674900247-3a19edc45c03?auto=format&fit=crop&w=600&q=80',
            ],
            [
                'category_id' => $drinks->id,
                'name' => 'Espresso Martini',
                'description' => 'Vodka, espresso, coffee liqueur, and a coffee bean garnish.',
                'price' => 7.99,
                'image' => 'https://images.unsplash.com/photo-1514790193030-c89d266d5a9d?auto=format&fit=crop&w=600&q=80',
            ],
        ];

        foreach ($items as $item) {
            MenuItem::create($item);
        }
    }
}
