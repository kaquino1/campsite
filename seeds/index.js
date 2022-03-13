if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');
const Review = require('../models/review');

const dbUrl = process.env.MONGODB_URL || 'mongodb://localhost:27017/campsite'

mongoose.connect(dbUrl);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Database Connected');
});

const imgUrls = [
  {
    url: 'https://res.cloudinary.com/do9fhryk5/image/upload/v1646888064/CampSite/zepomnzsivwbifupyz2s.jpg',
    filement: 'CampSite/zepomnzsivwbifupyz2s'
  },
  {
    url: 'https://res.cloudinary.com/do9fhryk5/image/upload/v1646888064/CampSite/si8dvglvymzvvgut3mwx.jpg',
    filement: 'CampSite/si8dvglvymzvvgut3mwx'
  },
  {
    url: 'https://res.cloudinary.com/do9fhryk5/image/upload/v1646888064/CampSite/d6uhx3gwxe70tpvamzyt.jpg',
    filement: 'CampSite/d6uhx3gwxe70tpvamzyt'
  },
  {
    url: 'https://res.cloudinary.com/do9fhryk5/image/upload/v1646888063/CampSite/q5irtuysnksrelppjak1.jpg',
    filement: 'CampSite/q5irtuysnksrelppjak1'
  },
  {
    url: 'https://res.cloudinary.com/do9fhryk5/image/upload/v1646888063/CampSite/ulamgxzd0shgol3nouxo.jpg',
    filement: 'CampSite/ulamgxzd0shgol3nouxo'
  },
  {
    url: 'https://res.cloudinary.com/do9fhryk5/image/upload/v1646888063/CampSite/yin4en2thjl4hpgc7azc.jpg',
    filement: 'CampSite/yin4en2thjl4hpgc7azc'
  }
];

const sample = array => array[Math.floor(Math.random() * array.length)];

const randomNumber = elements => {
  return Math.floor(Math.random() * elements);
};

const seedDB = async () => {
  await Campground.deleteMany({});
  await Review.deleteMany({});
  for (let i = 0; i < 300; i++) {
    const cityIndex = randomNumber(cities.length);
    const price = randomNumber(20) + 10;

    const img1 = randomNumber(6);
    let img2 = randomNumber(6);
    while (img1 == img2) {
      img2 = randomNumber(6);
    }

    const camp = new Campground({
      author: '622d895a391b6e277a7acae8',
      location: `${cities[cityIndex].city}, ${cities[cityIndex].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates similique harum architecto rem, nobis fugiat obcaecati, ea sint iure debitis accusantium optio vitae molestias ullam. Numquam, corrupti! Explicabo iure dolor consectetur doloremque. Maiores quidem voluptatum recusandae libero molestiae perferendis ullam doloremque, autem exercitationem quaerat quia! Labore accusamus repellat dolorum impedit sit, reprehenderit nesciunt reiciendis dolore fuga! Explicabo esse in repellat tenetur quasi ullam repellendus a libero delectus animi natus quibusdam, temporibus, enim aliquam facere, optio dolor.',
      price,
      geometry: { type: 'Point', coordinates: [cities[cityIndex].longitude, cities[cityIndex].latitude] },
      images: [imgUrls[img1], imgUrls[img2]],
      rating: 0
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
