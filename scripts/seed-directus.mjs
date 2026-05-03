import { createDirectus, staticToken, rest, createItems } from '@directus/sdk';

const DIRECTUS_URL = 'http://localhost:8055';
const TOKEN = 'qf2MjhlatMAW1-VPhrWBDS-Ice1dVuMu';

const client = createDirectus(DIRECTUS_URL)
  .with(staticToken(TOKEN))
  .with(rest());

const sampleData = {
  services: [
    {
      title: "Student Pay",
      slug: "student-pay",
      description: "Гадаадад суралцаж буй оюутнуудад зориулсан хялбар, найдвартай мөнгөн шилжүүлэг. Сургалтын төлбөр, байрны түрээс, хувийн хэрэглээний зардлаа шилжүүлэх боломжтой.",
      features: ["Сургалтын төлбөр", "Байрны түрээс", "Хувийн хэрэглээний зардал"],
      icon: "school",
      telegram_link: "https://t.me/oyunsaio_bot",
      category: "client",
      sort: 1,
      status: "published"
    },
    {
      title: "Business Pro",
      slug: "business-pro",
      description: "Байгууллагуудад зориулсан олон улсын төлбөр тооцооны цогц шийдэл. Бараа материалын татан авалт, үйлчилгээний төлбөр.",
      features: ["Импортын төлбөр", "Бараа татан авалт", "Тогтмол шилжүүлэг"],
      icon: "business_center",
      telegram_link: "https://t.me/oyunsaio_bot",
      category: "business",
      sort: 2,
      status: "published"
    }
  ],
  blog_posts: [
    {
      title: "FinTech гэж юу вэ?",
      slug: "what-is-fintech",
      excerpt: "FinTech буюу санхүүгийн технологи нь уламжлалт санхүүгийн үйлчилгээг технологийн тусламжтайгаар илүү хялбар, хямд, хүртээмжтэй болгож буй салбар юм.",
      content: "<p>FinTech (Financial Technology) нь санхүү болон технологийг хослуулсан нэр томьёо юм...</p>",
      author: "OYUNS All-In-One Team",
      published_date: new Date().toISOString(),
      category: "Education",
      tags: ["fintech", "technology", "finance"],
      status: "published"
    }
  ],
  testimonials: [
    {
      author: "Б. Бат-Эрдэнэ",
      content: "Оюутан байхдаа сургалтын төлбөрөө шилжүүлэх гэж их зовдог байсан. OYUNS All-In-One гарч ирснээр бүх зүйл маш хялбар болсон.",
      rating: 5,
      status: "published"
    },
    {
      author: "Г. Саруул",
      content: "Бизнесийн бараа татан авалтын төлбөрөө хийхэд хурдан бөгөөд найдвартай. Ханш нь ч боломжийн.",
      rating: 4,
      status: "published"
    }
  ],
  site_settings: [
    {
      key: "contact_info",
      value: {
        phone: "+976 7777-1234",
        email: "info@oyuns.mn",
        address: "Ulaanbaatar, Mongolia"
      }
    }
  ]
};

async function seed() {
  console.log('🌱 Seeding Directus at ' + DIRECTUS_URL);

  for (const [collection, items] of Object.entries(sampleData)) {
    try {
      console.log(`\nInserting ${items.length} items into '${collection}'...`);
      await client.request(createItems(collection, items));
      console.log(`   ✅ Success.`);
    } catch (error) {
      console.error(`   ❌ Failed to seed '${collection}':`, error.message);
      if (error.response?.data) {
        console.error('     Details:', JSON.stringify(error.response.data, null, 2));
      }
    }
  }

  console.log('\n✨ Seeding complete.');
}

seed().catch(err => console.error(err));
