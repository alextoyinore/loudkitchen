
export const mockData = {
  siteSettings: {
    heroVideoUrl: "", // Empty string to trigger fallback to local video
    contactEmail: "reservations@loudkitchen.com",
    address: "131B, Ahmadu Bello way Victoria island",
    phone: "+234 (0) 810 539 7355",
    socials: {
      instagram: "#",
      facebook: "#",
      twitter: "#"
    }
  },
  menuItems: [
    {
      id: 1,
      category: "Starters",
      name: "Truffle Arancini",
      description: "Crispy risotto balls with black truffle and mozzarella.",
      price: 14,
      image: "https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&q=80&w=800",
      available: true
    },
    {
      id: 2,
      category: "Starters",
      name: "Burrata & Heirloom Tomato",
      description: "Fresh burrata, basil pesto, balsamic glaze.",
      price: 18,
      image: "https://images.unsplash.com/photo-1608039829572-78524f79c4c7?auto=format&fit=crop&q=80&w=800",
      available: true
    },
    {
      id: 3,
      category: "Mains",
      name: "Wagyu Beef Burger",
      description: "Brioche bun, aged cheddar, caramelized onions, truffle mayo.",
      price: 28,
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800",
      available: true
    },
    {
      id: 4,
      category: "Mains",
      name: "Pan-Seared Scallops",
      description: "Cauliflower purée, crispy pancetta, lemon butter sauce.",
      price: 32,
      image: "https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?auto=format&fit=crop&q=80&w=800",
      available: true
    },
    {
      id: 5,
      category: "Desserts",
      name: "Dark Chocolate Fondant",
      description: "Molten center, vanilla bean ice cream.",
      price: 12,
      image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&q=80&w=800",
      available: true
    }
  ],
  blogPosts: [
    {
      id: 1,
      title: "The Art of Plating",
      excerpt: "Why visual appeal is just as important as taste. Discover the secrets behind our most instagrammable dishes.",
      content: "Plating is an art form that transforms a simple dish into a masterpiece. At Loudkitchen, we believe that we eat with our eyes first. Our chefs spend hours perfecting the placement of every element on the plate, ensuring a balance of color, texture, and negative space. From the vibrant green of a basil oil drizzle to the stark contrast of a charcoal-infused tuile, every detail is intentional. \n\n In this post, we explore the principles of design that guide our culinary team. We discuss the importance of color theory, the rule of thirds, and the use of height to create interest. Whether you're a home cook looking to impress your guests or a foodie who appreciates the finer details, this guide will give you a new appreciation for the art of plating.",
      date: "2023-10-15",
      image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800",
      author: "Chef Michael"
    },
    {
      id: 2,
      title: "Sourcing Local Ingredients",
      excerpt: "Our commitment to farm-to-table freshness and supporting local producers.",
      content: "Freshness is the cornerstone of great flavor. That's why we work closely with local farmers and artisans to source the best ingredients for our menu. By shortening the distance between the farm and your fork, we ensure that every bite is bursting with natural flavor and nutrition. \n\n Our partnerships with local suppliers allow us to access seasonal produce that is picked at the peak of ripeness. From heirloom tomatoes grown just a few miles away to artisan cheeses crafted by passionate cheesemakers, our ingredients tell a story of our region's rich agricultural heritage. Join us as we celebrate the bounty of our land and the dedicated individuals who make it possible.",
      date: "2023-11-02",
      image: "https://images.unsplash.com/photo-1466637574441-749b8f19452f?auto=format&fit=crop&q=80&w=800",
      author: "Sarah Jenkins"
    },
    {
      id: 3,
      title: "The Perfect Playlist",
      excerpt: "How we curate the sound of Loudkitchen. It's more than just background noise.",
      content: "Music is the heartbeat of Loudkitchen. It sets the tempo for the evening, influencing the energy in the room and the rhythm of service. Our playlists are carefully curated to take you on a journey, starting with mellow, soulful tunes during dinner and gradually picking up the pace as the night progresses. \n\n We believe that the right song can enhance the flavor of food and elevate the dining experience. In this post, we share our philosophy on music curation, our favorite genres, and how we discover new artists. We also reveal some of the tracks that have become anthems of our kitchen.",
      date: "2023-11-20",
      image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800",
      author: "DJ K-Loud"
    },
    {
      id: 4,
      title: "Mixology 101: Signature Cocktails",
      excerpt: "A deep dive into our most popular drinks and the stories behind them.",
      content: "Our bar is a laboratory of flavor, where spirits, herbs, and fruits come together to create liquid magic. Our mixologists are constantly experimenting with new techniques and ingredients to push the boundaries of cocktail culture. \n\n From smoke-infused Old Fashioneds to refreshing botanical gin fizzes, our cocktail menu is designed to surprise and delight. In this article, we share the recipes for three of our signature drinks, along with tips on how to recreate them at home. Get ready to shake, stir, and sip your way through the world of Loudkitchen mixology.",
      date: "2023-12-05",
      image: "https://images.unsplash.com/photo-1514362545857-3bc16549766b?auto=format&fit=crop&q=80&w=800",
      author: "Jessica Lee"
    },
    {
      id: 5,
      title: "Hosting the Perfect Dinner Party",
      excerpt: "Tips and tricks from our staff for entertaining at home.",
      content: "Hosting a dinner party can be daunting, but it doesn't have to be. With a little planning and some insider tips from our pros, you can throw a memorable event without the stress. \n\n We cover everything from setting the mood with lighting and music to planning a menu that allows you to spend time with your guests instead of being stuck in the kitchen. Learn how to create a welcoming atmosphere, handle dietary restrictions with grace, and ensure that your glasses are never empty. Let's make your next gathering a resounding success.",
      date: "2024-01-10",
      image: "https://images.unsplash.com/photo-1530103043960-ef3db4ea9006?auto=format&fit=crop&q=80&w=800",
      author: "Event Team"
    }
  ],
  staffMembers: [
    {
      id: 1,
      name: "Michael Ross",
      role: "Head Chef",
      bio: "20 years of culinary excellence.",
      image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: 2,
      name: "Jessica Lee",
      role: "Restaurant Manager",
      bio: "Ensuring the perfect dining experience.",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800"
    }
  ],
  bookings: [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      date: "2023-12-25",
      time: "19:00",
      guests: 2,
      status: "confirmed"
    }
  ]
};
