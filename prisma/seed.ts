import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({
  url: "file:./prisma/dev.db",
});

const prisma = new PrismaClient({ adapter });

const professionalNames = [
  { firstName: "Dr. Aman", lastName: "Singh", specialization: "Diet Specialist", bio: "15+ years helping clients achieve optimal health through personalized nutrition plans." },
  { firstName: "Dr. Priya", lastName: "Sharma", specialization: "Sports Nutritionist", bio: "Expert in athletic performance and recovery nutrition. Former Olympic team consultant." },
  { firstName: "Dr. Rahul", lastName: "Verma", specialization: "Weight Loss Expert", bio: "Helped 1000+ clients lose weight sustainably. Evidence-based approach." },
  { firstName: "Dr. Anjali", lastName: "Patel", specialization: "Diabetes Specialist", bio: "Specialized in diabetes management through diet. 12 years experience." },
  { firstName: "Dr. Vikram", lastName: "Reddy", specialization: "Heart Health", bio: "Cardiologist & nutritionist. Preventing heart disease through lifestyle changes." },
  { firstName: "Dr. Neha", lastName: "Gupta", specialization: "Vegan Nutrition", bio: "Plant-based nutrition advocate. Helping clients thrive on vegan diets." },
  { firstName: "Dr. Arjun", lastName: "Mehta", specialization: "Gut Health", bio: "Microbiome specialist. Healing through gut-brain connection." },
  { firstName: "Dr. Kavita", lastName: "Joshi", specialization: "Pediatric Nutrition", bio: "Children's nutrition expert. Making healthy eating fun for kids." },
  { firstName: "Dr. Sanjay", lastName: "Kumar", specialization: "Fitness Coach", bio: "Personal trainer + nutritionist. Complete body transformation specialist." },
  { firstName: "Dr. Meera", lastName: "Nair", specialization: "Ayurvedic Nutrition", bio: "Blending ancient Ayurveda with modern nutrition science." },
  { firstName: "Dr. Rohan", lastName: "Das", specialization: "Keto Expert", bio: "Ketogenic diet specialist. Certified keto coach with proven results." },
  { firstName: "Dr. Pooja", lastName: "Iyer", specialization: "Pregnancy Nutrition", bio: "Supporting mothers through pregnancy and postpartum nutrition." },
  { firstName: "Dr. Amit", lastName: "Shah", specialization: "Mental Health & Diet", bio: "Psychiatrist exploring the food-mood connection." },
  { firstName: "Dr. Ritu", lastName: "Bansal", specialization: "Skin & Beauty", bio: "Dermatologist. Achieving beautiful skin from within through nutrition." },
  { firstName: "Dr. Karan", lastName: "Chopra", specialization: "Anti-Aging", bio: "Longevity expert. Nutrition for healthy aging and vitality." },
  { firstName: "Dr. Shreya", lastName: "Rao", specialization: "PCOS Specialist", bio: "Helping women manage PCOS through diet and lifestyle changes." },
  { firstName: "Dr. Nikhil", lastName: "Desai", specialization: "Bodybuilding", bio: "Competitive bodybuilder & nutrition coach. Build muscle, lose fat." },
  { firstName: "Dr. Divya", lastName: "Krishnan", specialization: "Holistic Health", bio: "Integrative approach to wellness. Mind, body, and nutrition harmony." },
  { firstName: "Dr. Aditya", lastName: "Menon", specialization: "Intermittent Fasting", bio: "IF expert. Optimizing metabolic health through strategic fasting." },
  { firstName: "Dr. Simran", lastName: "Kaur", specialization: "Food Allergies", bio: "Allergist helping clients navigate food sensitivities safely." },
];

const userNames = [
  { firstName: "Rajesh", lastName: "Kumar" },
  { firstName: "Sneha", lastName: "Patel" },
  { firstName: "Arun", lastName: "Menon" },
  { firstName: "Priya", lastName: "Reddy" },
  { firstName: "Suresh", lastName: "Singh" },
  { firstName: "Anita", lastName: "Sharma" },
  { firstName: "Vivek", lastName: "Gupta" },
  { firstName: "Deepa", lastName: "Nair" },
  { firstName: "Manish", lastName: "Joshi" },
  { firstName: "Kavita", lastName: "Das" },
  { firstName: "Ravi", lastName: "Mehta" },
  { firstName: "Sunita", lastName: "Iyer" },
  { firstName: "Ajay", lastName: "Shah" },
  { firstName: "Nisha", lastName: "Bansal" },
  { firstName: "Ramesh", lastName: "Verma" },
  { firstName: "Geeta", lastName: "Rao" },
  { firstName: "Sandeep", lastName: "Desai" },
  { firstName: "Asha", lastName: "Krishnan" },
  { firstName: "Vijay", lastName: "Chopra" },
  { firstName: "Lata", lastName: "Kaur" },
  { firstName: "Mahesh", lastName: "Agarwal" },
  { firstName: "Rekha", lastName: "Bose" },
  { firstName: "Harish", lastName: "Saxena" },
  { firstName: "Usha", lastName: "Malhotra" },
  { firstName: "Dinesh", lastName: "Pandey" },
  { firstName: "Shalini", lastName: "Sinha" },
  { firstName: "Prakash", lastName: "Thakur" },
  { firstName: "Madhuri", lastName: "Mishra" },
  { firstName: "Ashok", lastName: "Yadav" },
  { firstName: "Bharti", lastName: "Jain" },
];

const postContents = [
  { content: "5 superfoods you should eat daily for optimal health! 🥗", image: "/post1.jpg" },
  { content: "The truth about intermittent fasting - my experience and research 🕐", image: null },
  { content: "Quick protein-packed breakfast ideas for busy mornings 🍳", image: "/post2.jpg" },
  { content: "Why you should stop counting calories and focus on nutrients instead 📊", image: null },
  { content: "My client lost 20kg in 3 months! Here's how we did it 💪", image: "/post3.jpg" },
  { content: "Understanding macros: A beginner's guide to protein, carbs, and fats 🔬", image: null },
  { content: "Plant-based protein sources that actually work! 🌱", image: "/post4.jpg" },
  { content: "The science behind keto: Does it really work? 🧪", image: null },
  { content: "Meal prep ideas for the entire week - save time and money! 🍱", image: "/post5.jpg" },
  { content: "Debunking common nutrition myths - what science really says 🔍", image: null },
  { content: "Pre-workout vs post-workout nutrition - timing matters! ⏰", image: "/post6.jpg" },
  { content: "How to eat healthy while traveling - my top tips ✈️", image: null },
  { content: "The gut-brain connection: How your diet affects your mood 🧠", image: "/post7.jpg" },
  { content: "Healthy snack alternatives that actually taste good! 🍎", image: null },
  { content: "Common signs of nutrient deficiencies and how to fix them 💊", image: "/post8.jpg" },
];

async function main() {
  console.log("🌱 Seeding database...");

  // Create professionals
  const professionals = [];
  for (let i = 0; i < professionalNames.length; i++) {
    const prof = professionalNames[i];
    const price = i % 3 === 0 ? null : Math.floor(Math.random() * 3000) + 500;
    
    const user = await prisma.user.create({
      data: {
        email: `${prof.firstName.toLowerCase()}.${prof.lastName.toLowerCase()}@mealdoctor.com`,
        password: "password123", // In real app, this would be hashed
        firstName: prof.firstName,
        lastName: prof.lastName,
        username: `${prof.firstName.toLowerCase()}${prof.lastName.toLowerCase()}`,
        role: "professional",
        bio: prof.bio,
        photo: `/avatar-prof-${i + 1}.jpg`,
        specialization: prof.specialization,
        consultationPrice: price,
        isLive: i % 7 === 0, // Some professionals are live
      },
    });
    professionals.push(user);
    console.log(`✅ Created professional: ${user.firstName} ${user.lastName}`);
  }

  // Create regular users
  const users = [];
  for (let i = 0; i < userNames.length; i++) {
    const userName = userNames[i];
    const user = await prisma.user.create({
      data: {
        email: `${userName.firstName.toLowerCase()}.${userName.lastName.toLowerCase()}@example.com`,
        password: "password123",
        firstName: userName.firstName,
        lastName: userName.lastName,
        username: `${userName.firstName.toLowerCase()}${i}`,
        role: "user",
        bio: `Health enthusiast looking to improve my lifestyle!`,
        photo: `/avatar-user-${i + 1}.jpg`,
      },
    });
    users.push(user);
    console.log(`✅ Created user: ${user.firstName} ${user.lastName}`);
  }

  // Create follows (users follow random professionals)
  console.log("\n👥 Creating follow relationships...");
  for (const user of users) {
    const numFollows = Math.floor(Math.random() * 8) + 3; // Follow 3-10 professionals
    const followedProfessionals = professionals
      .sort(() => 0.5 - Math.random())
      .slice(0, numFollows);

    for (const prof of followedProfessionals) {
      await prisma.follow.create({
        data: {
          followerId: user.id,
          followingId: prof.id,
        },
      });
    }
  }

  // Create posts from professionals
  console.log("\n📝 Creating posts...");
  for (const prof of professionals) {
    const numPosts = Math.floor(Math.random() * 5) + 2; // 2-6 posts per professional
    
    for (let i = 0; i < numPosts; i++) {
      const postContent = postContents[Math.floor(Math.random() * postContents.length)];
      const post = await prisma.post.create({
        data: {
          content: postContent.content,
          image: postContent.image,
          authorId: prof.id,
          createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within last 30 days
        },
      });

      // Add random likes
      const numLikes = Math.floor(Math.random() * 20) + 5;
      const likers = users.sort(() => 0.5 - Math.random()).slice(0, numLikes);
      
      for (const liker of likers) {
        await prisma.like.create({
          data: {
            postId: post.id,
            userId: liker.id,
          },
        });
      }

      // Add random comments
      const numComments = Math.floor(Math.random() * 8);
      const commenters = users.sort(() => 0.5 - Math.random()).slice(0, numComments);
      
      for (const commenter of commenters) {
        await prisma.comment.create({
          data: {
            content: [
              "Great advice! Thank you for sharing 🙏",
              "This really helped me!",
              "Can you share more about this topic?",
              "Amazing content as always!",
              "I tried this and it works!",
              "This is exactly what I needed to hear",
              "Could you make a video about this?",
              "Thank you doctor! Very informative 💚",
            ][Math.floor(Math.random() * 8)],
            postId: post.id,
            authorId: commenter.id,
          },
        });
      }
    }
  }

  // Create some messages
  console.log("\n💬 Creating messages...");
  for (let i = 0; i < 50; i++) {
    const user = users[Math.floor(Math.random() * users.length)];
    const prof = professionals[Math.floor(Math.random() * professionals.length)];
    
    await prisma.message.create({
      data: {
        content: [
          "Hi, I'd like to book a consultation with you.",
          "Thank you for your advice on my diet plan!",
          "Can you help me with weight loss?",
          "I have some questions about keto diet.",
          "Your recent post was very helpful!",
          "What's your availability this week?",
          "I've been following your meal plan and seeing great results!",
        ][Math.floor(Math.random() * 7)],
        senderId: Math.random() > 0.5 ? user.id : prof.id,
        receiverId: Math.random() > 0.5 ? prof.id : user.id,
        read: Math.random() > 0.3,
        createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      },
    });
  }

  // Create some live sessions
  console.log("\n🎥 Creating live sessions...");
  for (let i = 0; i < 5; i++) {
    const prof = professionals[i];
    await prisma.liveSession.create({
      data: {
        title: [
          "Q&A: Ask Me Anything About Nutrition",
          "Live Cooking Demo: Healthy Breakfast Ideas",
          "Understanding Macros for Beginners",
          "Weight Loss Myths Debunked",
          "Building Muscle: Nutrition Essentials",
        ][i],
        description: "Join me for an interactive session!",
        isActive: i === 0, // First one is active
        hostId: prof.id,
        participants: "",
        startedAt: i === 0 ? new Date() : null,
        createdAt: new Date(Date.now() - Math.random() * 2 * 24 * 60 * 60 * 1000),
      },
    });
  }

  console.log("\n✨ Seeding completed successfully!");
  console.log(`📊 Stats:`);
  console.log(`   - ${professionals.length} professionals created`);
  console.log(`   - ${users.length} users created`);
  console.log(`   - Follow relationships established`);
  console.log(`   - Posts, likes, and comments generated`);
  console.log(`   - Messages and live sessions created`);
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
