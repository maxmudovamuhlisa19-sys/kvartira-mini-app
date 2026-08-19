export const initialHouses = [
  {
    id: 1,
    title: "Shahar markazidagi zamonaviy kvartira",
    address: "Toshkent, Amir Temur ko'chasi 15",
    city: "Toshkent",
    district: "Shayxontohur",
    price: 85000,
    rooms: 3,
    area: 95,
    floor: 5,
    totalFloors: 9,
    type: "sotish",
    status: "yangi",
    description: "Shahar markazida joylashgan, yangidan ta'mirlangan zamonaviy kvartira. Barcha qulayliklar mavjud. Metroya yaqin, parkovka joyi bor.",
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800"
    ],
    features: ["Balkon", "Lift", "Parkovka", " konditsioner", "Internet"],
    phone: "+998 90 123 45 67",
    owner: "Alisher Karimov",
    dateAdded: "2026-06-01",
    userId: 1
  },
  {
    id: 2,
    title: "Oilaviy uy - Olmazor tumanida",
    address: "Toshkent, Olmazor ko'chasi 42",
    city: "Toshkent",
    district: "Olmazor",
    price: 62000,
    rooms: 2,
    area: 68,
    floor: 3,
    totalFloors: 5,
    type: "sotish",
    status: "foydalanilgan",
    description: "Olmazor tumanida joylashgan, shinam kvartira. Maktab va bog'chaga yaqin. Yaxshi holatda ta'mirlangan.",
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
      "https://images.unsplash.com/photo-1560185007-5f0bb1866cab?w=800"
    ],
    features: ["Balkon", "Internet", "Mebel"],
    phone: "+998 91 234 56 78",
    owner: "Nodir Raximov",
    dateAdded: "2026-05-28",
    userId: 2
  },
  {
    id: 3,
    title: "Luksg kvartira - Tinchlik ko'chasi",
    address: "Toshkent, Tinchlik ko'chasi 8",
    city: "Toshkent",
    district: "Yakkasaroy",
    price: 120000,
    rooms: 4,
    area: 130,
    floor: 7,
    totalFloors: 12,
    type: "sotish",
    status: "yangi",
    description: "Tinchlik ko'chasida premium klass kvartira. Panoramik derazalar, yuqori sifatli ta'mir, smart uy tizimi.",
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800"
    ],
    features: ["Balkon", "Lift", "Parkovka", "Konditsioner", "Internet", "Mebel", "Smart uy"],
    phone: "+998 93 345 67 89",
    owner: "Sardor Mirzayev",
    dateAdded: "2026-06-05",
    userId: 3
  },
  {
    id: 4,
    title: "Ijara uchun shinam kvartira",
    address: "Samarqand, Registon ko'chasi 12",
    city: "Samarqand",
    district: "中心",
    price: 450,
    rooms: 2,
    area: 55,
    floor: 2,
    totalFloors: 3,
    type: "ijara",
    status: "foydalanilgan",
    description: "Samarqand shahri markazida, Registonga yaqin. Ijara uchun qulay kvartira. Oylik to'lov.",
    images: [
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800",
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800"
    ],
    features: ["Internet", "Mebel", "Konditsioner"],
    phone: "+998 94 456 78 90",
    owner: "Jamshid Alimov",
    dateAdded: "2026-06-08",
    userId: 4
  },
  {
    id: 5,
    title: "Yangi qurilish - Buxoro",
    address: "Buxoro, Al-Buxoriy ko'chasi 25",
    city: "Buxoro",
    district: "Al-Buxoriy",
    price: 45000,
    rooms: 3,
    area: 82,
    floor: 4,
    totalFloors: 5,
    type: "sotish",
    status: "qurilayotgan",
    description: "Yangi qurilayotgan uyda kvartira. Sotuvdan oldin bron qilish mumkin. Zamonaviy loyiha.",
    images: [
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800"
    ],
    features: ["Lift", "Parkovka", "Balkon"],
    phone: "+998 95 567 89 01",
    owner: "Baxtiyor Nazarov",
    dateAdded: "2026-06-10",
    userId: 5
  },
  {
    id: 6,
    title: "Hovlida uy - Qarshi",
    address: "Qarshi, Navoiy ko'chasi 18",
    city: "Qarshi",
    district: "Navoiy",
    price: 35000,
    rooms: 4,
    area: 150,
    floor: 1,
    totalFloors: 1,
    type: "sotish",
    status: "foydalanilgan",
    description: "Qarshi shahrida hovlida uy. Katta hovli, garaj, issiqxona. Shahardan uzoq emas.",
    images: [
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800"
    ],
    features: ["Garaj", "Hovli", "Issiqxona", "Suv"],
    phone: "+998 97 678 90 12",
    owner: "Otabek Shodiyev",
    dateAdded: "2026-05-25",
    userId: 6
  }
];

export const cities = [
  "Toshkent", "Samarqand", "Buxoro", "Qarshi", "Namangan", "Andijon",
  "Farg'ona", "Nukus", "Marg'ilon", "Termiz"
];
