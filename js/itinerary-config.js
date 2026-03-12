/**
 * Date Itinerary Builder Configuration
 * Define sections and their available products here.
 */

const ITINERARY_CONFIG = {
    currency: "RM",
    sections: [
        {
            id: "flowers",
            title: "Flowers for starters",
            startTime: "9AM",
            endTime: "12PM",
            maxSelection: 2,
            subtitle: "Start the day with some of nature's finest crafts",
            products: [
                {
                    id: "f1-roses",
                    name: "Red Roses",
                    price: 120.00,
                    image: "media/roses-stock.jpg",
                    description: "A timeless bouquet of premium long-stemmed red roses.",
                    inStock: true
                },
                {
                    id: "f2-gerbera",
                    name: "Gerbera",
                    price: 45.00,
                    image: "media/gerbera-stock.jpg",
                    description: "A bouquet of gerbera. Gerberas are vibrant, daisy-like flowers known for their large, 3 to 5 inch, single or double blooms with a prominent central disk, often in contrasting colors.",
                    inStock: true
                },
                {
                    id: "f3-tulips",
                    name: "Tulips",
                    price: 80.00,
                    image: "media/tulips-stock.jpg",
                    description: "A bouquet of tulips. Tulips have long symbolized love, hope, renewal, and beauty.",
                    inStock: false
                },
                {
                    id: "f3-lily",
                    name: "Lilies",
                    price: 60.00,
                    image: "media/lily-stock.jpg",
                    description: "Lilies are tall, bulbous perennials known for their large, showy, six-petaled, trumpet-shaped flowers, blooming in summer in shades of white, pink, red, yellow, and orange. Ranging from 1 to 6 feet tall, they are hardy, fragrant, and popular in gardens or as cut flowers, preferring well-drained soil and sun.",
                    inStock: false
                }
            ]
        },
        {
            id: "activity",
            title: "Make the most out of the day",
            startTime: "12PM",
            endTime: "7PM",
            maxSelection: 3,
            subtitle: "Own the day by going big on the main activities",
            products: [
                {
                    id: "activity-1",
                    name: "Manicure Session",
                    price: 180.00,
                    image: "media/manicure-stock.jpg",
                    description: "A relaxing, and quality manicure at a nail salon of your choice.",
                    inStock: true
                },
                {
                    id: "activity-2",
                    name: "Dessert Delight",
                    price: 60.00,
                    image: "media/dessert-stock.webp",
                    description: "Take a short break to enjoy the sweet, refreshing taste of a variety of desserts at Cheevit Cheeva KL",
                    inStock: true
                },
                {
                    id: "activity-5",
                    name: "Shopping Spree",
                    price: 800.00,
                    image: "media/shopping-stock.webp",
                    description: "Shop til you drop at the outlets of your choice like Sephora.",
                    inStock: true
                },
                {
                    id: "activity-6",
                    name: "Karaoke Session",
                    price: 85.00,
                    image: "media/karaoke-stock.jpg",
                    description: "Sing your heart out to your favorite songs at a karaoke bar of your choice.",
                    inStock: false
                },
                {
                    id: "activity-3",
                    name: "Hair-do Session",
                    price: 380.00,
                    image: "media/hairdo-stock.webp",
                    description: "Change your look however you'd like in a split second during this relaxing and calming session.",
                    inStock: false
                },
                {
                    id: "activity-4",
                    name: "Ice Skating Session",
                    price: 90.00,
                    image: "media/ice-skating-stock.jpg",
                    description: "Immerse yourself in a unique experience, where you can glide across the rink, feeling free.",
                    inStock: false
                }
            ]
        },
        {
            id: "dinner",
            title: "Conclude the beautiful evening",
            startTime: "7PM",
            endTime: "10PM",
            maxSelection: 1,
            subtitle: "A perfect end to a perfect day",
            products: [
                {
                    id: "dinner-1",
                    name: "A Trusted Chinese Classic",
                    shortName: "Fei Fan Hot Pot",
                    price: 150.00,
                    image: "media/hot-pot-stock.webp",
                    description: "The soothing, heartwarming taste of a classic Chinese hot pot @ Fei Fan Hotpot, which keeps the soul warm, and the tummy happy.",
                    inStock: true
                },
                {
                    id: "dinner-2",
                    name: "An Italian Classic",
                    price: 250.00,
                    image: "media/italian-cuisine-stock.jpg",
                    description: "Indulge in the authentic flavors invented by the Italians. Pastas, pizzas, desserts, and more. at locations like Botega, Marco",
                    inStock: false
                },
                {
                    id: "dinner-3",
                    name: "Japanese Ramen",
                    price: 150.00,
                    image: "media/ramen-stock.jpg",
                    description: "Take a virtual trip to Japan with the widely-known and praised Kanbe Ramen @ TRX, where they bring a true Japanese experience right to the table",
                    inStock: false
                }
            ]
        },
        {
            id: "afterhours",
            title: "After Hours",
            startTime: "10PM",
            endTime: "12AM",
            maxSelection: 1,
            subtitle: "Optionally extend the day and go the extra mile",
            products: [
                {
                    id: "afterhours-1",
                    name: "Embrace Aging",
                    shortName: "Cake cutting",
                    price: 150.00,
                    image: "media/birthday-cake-stock.jpg",
                    description: "Spend some time with friends and have a light cake cutting session.",
                    inStock: true
                },
                {
                    id: "afterhours-2",
                    name: "Night Drinks",
                    price: 200.00,
                    image: "media/bar-drink-stock.jpg",
                    description: "Have some drinks with your friends at a bar of your choice.",
                    inStock: false
                },
            ]
        }
    ]
};
