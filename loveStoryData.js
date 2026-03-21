// Love Story Milestones - Junchi & Eugene
// Complete timeline with ACTUAL dates from The Knot website

const loveStoryData = [
  {
    "id": 1,
    "title": "We met up for the first time at SPYSCAPE",
    "date": "November 25, 2023",
    "description": "We met up for the first time at SPYSCAPE. I found out that Junchi is a Special Operations Officer. Love at first sight. Beautiful and smart. I won the lottery!",
    "image": "https://www.theknot.com/tk-media/images/c8942bac-1ffb-4d92-92c3-cb25baef6f87",
    "location": "SPYSCAPE, NYC",
    "coordinates": {
      "lat": 40.7614,
      "lng": -73.9776
    }
  },
  {
    "id": 2,
    "title": "Little did I know Junchi is a Harry Potter fan,...",
    "date": "January 14, 2024",
    "description": "Little did I know Junchi is a Harry Potter fan, so I invited her to take the train to NYC to visit the Wizarding World of Harry Potter to experience the magic.",
    "image": "https://www.theknot.com/tk-media/images/202600ff-1f47-4db2-84dd-613cbbd83e2e",
    "location": "Wizarding World, NYC",
    "coordinates": {
      "lat": 40.758,
      "lng": -73.9855
    }
  },
  {
    "id": 3,
    "title": "Then we watched Moulin Rouge! on Broadway since...",
    "date": "January 21, 2024",
    "description": "Then we watched Moulin Rouge! on Broadway since we both enjoyed the Baz Luhrmann movie. Junchi liked Santiago the Argentinean dancer. I was jealous!\n\nAs the confetti of hearts showered from the stage, Junchi saved a pair and put them in her phone case, symbolizing us both ❤️",
    "image": "https://www.theknot.com/tk-media/images/41fd920e-77d7-4368-a3ef-5cb7a9ca6c7b",
    "location": "Broadway, NYC",
    "coordinates": {
      "lat": 40.7589,
      "lng": -73.9851
    }
  },
  {
    "id": 4,
    "title": "We spent the day exploring the Metropolitan in ...",
    "date": "February 11, 2024",
    "description": "We spent the day exploring the Metropolitan in the Asian wing of the museum. Junchi dressed in a qipao. We had our picture taken at the Astor Chinese Garden Court where Junchi received a compliment about her dress. Junchi explained to me the Three Perfections of Chinese culture: poetry, painting, and calligraphy.",
    "image": "https://www.theknot.com/tk-media/images/3938d83d-1ab2-48d1-b461-a80a7adb0a74",
    "location": "The Met, NYC",
    "coordinates": {
      "lat": 40.7794,
      "lng": -73.9632
    }
  },
  {
    "id": 5,
    "title": "We continued to museum hop and go to the MoMA o...",
    "date": "March 09, 2024",
    "description": "We continued to museum hop and go to the MoMA on our next date. As typical of MoMA, there was abstract art. One peculiar picture, we thought looked like a gradient field and convolutions. Junchi is always thinking about physics! And look at her fashionable bag! Definitely MoMA material.",
    "image": "https://www.theknot.com/tk-media/images/8d741376-db5e-4a4e-a853-4067397f53ff",
    "location": "MoMA, NYC",
    "coordinates": {
      "lat": 40.7614,
      "lng": -73.9776
    }
  },
  {
    "id": 6,
    "title": "Here at the cafeteria at the MoMA, Junchi prese...",
    "date": "March 09, 2024",
    "description": "Here at the cafeteria at the MoMA, Junchi presents me an offer that I cannot refuse. There are 2 friends: a watermelon and an onion (note, it is not a celery). Who am I? I choose the red pill: the watermelon. Also I like fruits. Junchi knows me so well. They squeak if you squeeze very hard. Are they laughing 😂 or crying 😭?",
    "image": "https://www.theknot.com/tk-media/images/ec061321-a1b3-4bb6-802c-ef0c87994440",
    "location": "MoMA, NYC",
    "coordinates": {
      "lat": 40.7614,
      "lng": -73.9776
    }
  },
  {
    "id": 7,
    "title": "We went to explore Central Park as the flowers ...",
    "date": "March 31, 2024",
    "description": "We went to explore Central Park as the flowers were blooming. Again Junchi got complimented on her outfit. We walked up the Belvedere Castle as well as watched a group of people learn a folk dance.",
    "image": "https://www.theknot.com/tk-media/images/67da39cd-c021-453d-a494-f51836d9735f",
    "location": "Central Park, NYC",
    "coordinates": {
      "lat": 40.7829,
      "lng": -73.9654
    }
  },
  {
    "id": 8,
    "title": "I went to her neck of the woods in New Jersey",
    "date": "April 07, 2024",
    "description": "I went to her neck of the woods in New Jersey. We visited Princeton University, ate nice food and ice cream (at the Bent Spoon). The school kind of looks like Hogarts, especially at night. There's even a set of life sized zodiac statues, which looks like a satanic ritual after dark. Junchi avoided those statues. I guess that joining a cabal was out of the picture that night.",
    "image": "https://www.theknot.com/tk-media/images/8cd922a3-39f4-4f59-bee9-f974e0ee8012",
    "location": "Princeton, NJ",
    "coordinates": {
      "lat": 40.3433,
      "lng": -74.6551
    }
  },
  {
    "id": 9,
    "title": "Museum hopping again",
    "date": "April 13, 2024",
    "description": "Museum hopping again. This time at the Museum of Natural History where we watched leafcutter ants haul their goodies back to the nest. We also saw so many butterflies (at the exhibit at the end of this picture). One landed on a woman's nose and didn't want to leave.",
    "image": "https://www.theknot.com/tk-media/images/e321a911-3b4f-4e64-a20d-e12a226c5b2e",
    "location": "Natural History Museum, NYC",
    "coordinates": {
      "lat": 40.7813,
      "lng": -73.974
    }
  },
  {
    "id": 10,
    "title": "Later that day we walked around Central Park an...",
    "date": "April 13, 2024",
    "description": "Later that day we walked around Central Park and saw a couple that was getting married. Then an elder woman asked us: \"are you two in love?\" \"Yes!\" we replied. Then she inquired further \"then show me.\" Thus we kissed. It's as if I found a perfect collaborator in that old woman. Bless her heart.",
    "image": "https://www.theknot.com/tk-media/images/6c406e6f-f451-43c7-83c8-086c64224183",
    "location": "Central Park, NYC",
    "coordinates": {
      "lat": 40.7829,
      "lng": -73.9654
    }
  },
  {
    "id": 11,
    "title": "We went to Princeton again (also the Bent Spoon...",
    "date": "April 21, 2024",
    "description": "We went to Princeton again (also the Bent Spoon for ice cream). As you can see, Junchi is practicing her KPop debut. Here we were at the eponymously named Pink Table.",
    "image": "https://www.theknot.com/tk-media/images/ec0185be-ea06-456d-ac08-055ff459e8e8",
    "location": "Princeton, NJ",
    "coordinates": {
      "lat": 40.3433,
      "lng": -74.6551
    }
  },
  {
    "id": 12,
    "title": "We walked around the High Line",
    "date": "April 28, 2024",
    "description": "We walked around the High Line. As usual, I have to show her the quintessential NYC where there's an elderly Chinese man playing the erhu at the the High Line's endpoint.",
    "image": "https://www.theknot.com/tk-media/images/ee2fe281-d9a7-490d-808d-a5a96a10cc90",
    "location": "The High Line, NYC",
    "coordinates": {
      "lat": 40.748,
      "lng": -74.0048
    }
  },
  {
    "id": 13,
    "title": "After the High Line, we went to Hudson Yards ma...",
    "date": "April 28, 2024",
    "description": "After the High Line, we went to Hudson Yards mall where we took this photo. Just imagine this is the Tardis; it's more spacious than it looks. Who, or rather What, is the Tardis? Haven't you heard of the Doctor? Never mind...",
    "image": "https://www.theknot.com/tk-media/images/3ce75c42-6514-401e-99a0-f10f6323132e",
    "location": "The High Line, NYC",
    "coordinates": {
      "lat": 40.748,
      "lng": -74.0048
    }
  },
  {
    "id": 14,
    "title": "We went to BLOOMTANICA, a floral arrangements w...",
    "date": "May 05, 2024",
    "description": "We went to BLOOMTANICA, a floral arrangements with virtual and real flowers and video installations inspired by Korean garden design. The complimentary art installation was at Genesis House, which is really a  Hyundai dealership. We enjoyed our time there so much that the staff gently escorted us out after we spent more than our allocated time there.",
    "image": "https://www.theknot.com/tk-media/images/3892dc84-ba13-4a8d-bb92-6b52dadd8080",
    "location": "Genesis House, NYC",
    "coordinates": {
      "lat": 40.7618,
      "lng": -73.9778
    }
  },
  {
    "id": 15,
    "title": "We went to the American Dream mall, which is th...",
    "date": "May 12, 2024",
    "description": "We went to the American Dream mall, which is the second largest mall in America. Ironically the mall is in a city called East Rutherford, which is actually west of a city called West New York, which is even more confusing since that city is in New Jersey. We went to a thematic restaurant called Szechuan Opera. The food was spicy and we even got the heart-shaped balloon since it was around Mother's Day.",
    "image": "https://www.theknot.com/tk-media/images/ca1330da-8c1f-4d4d-b1cd-05bb096a4b2c",
    "location": "American Dream Mall, NJ",
    "coordinates": {
      "lat": 40.8139,
      "lng": -74.0669
    }
  },
  {
    "id": 16,
    "title": "On Memorial Day, we went to Asbury Park Boardwa...",
    "date": "May 27, 2024",
    "description": "On Memorial Day, we went to Asbury Park Boardwalk where Junchi hung on to the bar for more than 1 minute. She outlasted the other person. I am better as a spectator and a cheerleader and a photographer.",
    "image": "https://www.theknot.com/tk-media/images/497f3688-a4a0-4c9b-a1b6-10c4aecf9737",
    "location": "Asbury Park, NJ",
    "coordinates": {
      "lat": 40.2204,
      "lng": -74.0121
    }
  },
  {
    "id": 17,
    "title": "Look at a victorious Junchi! Here she holds her...",
    "date": "May 27, 2024",
    "description": "Look at a victorious Junchi! Here she holds her prizes: a seagull eating fries from local tourists and a charmander, which Junchi oddly didn't know about.\nDon't worry. I did my boyfriend duties and won her a carnival prize at Six Flags.",
    "image": "https://www.theknot.com/tk-media/images/09b39d33-7283-4695-95e8-35c573c312ea",
    "location": "Six Flags, NJ",
    "coordinates": {
      "lat": 40.1502,
      "lng": -74.4416
    }
  },
  {
    "id": 18,
    "title": "We visited Swaminarayan Akshardham, the largest...",
    "date": "June 01, 2024",
    "description": "We visited Swaminarayan Akshardham, the largest Indian temple in America, surprisingly located in New Jersey city called Robbinsville. We were amazed at the thousands of hand curved sculptures. I just can't imagine curving that many sculptures.",
    "image": "https://www.theknot.com/tk-media/images/a491b2c3-8d1b-4996-99d5-e49968bee8e5",
    "location": "Akshardham Temple, NJ",
    "coordinates": {
      "lat": 40.7127,
      "lng": -73.9681
    }
  },
  {
    "id": 19,
    "title": "We went to Six Flags",
    "date": "June 08, 2024",
    "description": "We went to Six Flags. Junchi has a season pass, as she loves roller coasters (just not the drop tower). We arrived in the morning while the carnival games were being set up. I thought those things were unbeatable scams, so one of the fellas said it's easy and showed me how to win. By my pure skill, I managed to win an oversized ball painted with watermelon colors. Junchi called it Water Bounce. Unbeknownst to everybody else, I carried Water Bounce around Six Flags for the rest of the day.",
    "image": "https://www.theknot.com/tk-media/images/9d8cdebe-4d03-4d37-a4c1-a85c4f59244b",
    "location": "Six Flags, NJ",
    "coordinates": {
      "lat": 40.1502,
      "lng": -74.4416
    }
  },
  {
    "id": 20,
    "title": "At Brooklyn Botanic Garden, here we are specifi...",
    "date": "June 15, 2024",
    "description": "At Brooklyn Botanic Garden, here we are specifically at the Rose Garden. The place was so large that we got lost for a bit. Then it got hot, so we were parched and came indoors to drink some lemonade. Lemonade tastes better when you're thirsty.",
    "image": "https://www.theknot.com/tk-media/images/508feeac-11ca-44f2-a989-20c4ec4fb8c0",
    "location": "Brooklyn Botanic Garden, NYC",
    "coordinates": {
      "lat": 40.6691,
      "lng": -73.963
    }
  },
  {
    "id": 21,
    "title": "Here's another picture of Junchi, probably clos...",
    "date": "June 15, 2024",
    "description": "Here's another picture of Junchi, probably closer to the entrance of the botanical garden. As you can tell, she is a fashionista and always likes to dress thematically. I on the other hand... let's just say that Junchi helped revitalize my wardrobe with some new outfits.",
    "image": "https://www.theknot.com/tk-media/images/2e9f2ba1-6cb4-4735-91b7-6f2753c6a844",
    "location": "New York City",
    "coordinates": {
      "lat": 40.763000000000005,
      "lng": -73.9805
    }
  },
  {
    "id": 22,
    "title": "Since Junchi is a Harry Potter fan, we attended...",
    "date": "July 13, 2024",
    "description": "Since Junchi is a Harry Potter fan, we attended Harry Potter and the Cursed Child on Broadway. It's a story surprisingly not about Harry Potter (who is all grown up, is a dad, and groaning about being the \"boy who lived\", basically having a mid-life crisis). The show was definitely better than both our expectations. The flying Dementors were very cool and ghoulish.",
    "image": "https://www.theknot.com/tk-media/images/1ba210f6-47a5-46d0-b085-d2814f4a67c8",
    "location": "Wizarding World, NYC",
    "coordinates": {
      "lat": 40.758,
      "lng": -73.9855
    }
  },
  {
    "id": 23,
    "title": "As with all Harry Potter events, Junchi has to ...",
    "date": "July 13, 2024",
    "description": "As with all Harry Potter events, Junchi has to collect Harry Potter memorabilia. It's time to believe in magic again. She got a cool Harry Potter themed cup. Just like my comic books, the cup is only for looking and not actually using ;)",
    "image": "https://www.theknot.com/tk-media/images/b5af1343-a2e0-4800-ade2-a68216f8f96a",
    "location": "Wizarding World, NYC",
    "coordinates": {
      "lat": 40.758,
      "lng": -73.9855
    }
  },
  {
    "id": 24,
    "title": "We went to a limited time exhibit called Balloo...",
    "date": "August 03, 2024",
    "description": "We went to a limited time exhibit called Balloon Story located in a large building called The Armory. We saw a million balloons, which took months to create the installation. At the end, we even played some balloon-themed games, which were fun.",
    "image": "https://www.theknot.com/tk-media/images/90a41852-a171-421f-bc34-8b8f05662973",
    "location": "Balloon Story, NYC",
    "coordinates": {
      "lat": 40.7589,
      "lng": -73.9851
    }
  },
  {
    "id": 25,
    "title": "At Balloon Story, imagine if it was Legoland bu...",
    "date": "August 03, 2024",
    "description": "At Balloon Story, imagine if it was Legoland but with balloons. And just like Legoland, there were a lot of rowdy kids climbing on everything. And just like kids at Legoland, we stayed longer than the suggested 70 minutes. As outstanding adults, we are extra patient--just like at BLOOMTANICA.",
    "image": "https://www.theknot.com/tk-media/images/bd0cfb16-a013-4eb8-a5d8-773a015c7f5f",
    "location": "Genesis House, NYC",
    "coordinates": {
      "lat": 40.7618,
      "lng": -73.9778
    }
  },
  {
    "id": 26,
    "title": "We went to Terhune Orchards for fruit picking",
    "date": "August 10, 2024",
    "description": "We went to Terhune Orchards for fruit picking. Although Junchi is holding blackberries here, they are known for their variety of peaches. Since pricing is based on the peach weight that you bring home, we decided to try \"samples\" of peaches inside the orchard to know which ones are worthy to bring home.\n\nAcross the street is their farm with farm animals. We saw cute goats. There were 2 little girls, who had food to feed the goats. The goats wisely knew that whoever has food is their new best friend. But the little girls are even wiser, as one shouted \"no, not you. The cute one.\" Wow, even little kids have favorites.",
    "image": "https://www.theknot.com/tk-media/images/27298061-9c1e-47e3-a1f2-8a7fb299c8ac",
    "location": "Terhune Orchards, NJ",
    "coordinates": {
      "lat": 40.3155,
      "lng": -74.7282
    }
  },
  {
    "id": 27,
    "title": "We had a quick trip back home to the Bay Area",
    "date": "August 22, 2024",
    "description": "We had a quick trip back home to the Bay Area. Here we Pebble Beach, Carmel, and Monterey. Notice that Junchi is wearing a \"Harry Otter\" sweater, which she saw and had to purchase. This time, she received a compliment from a dad who was probably interested in getting the same sweater for his daughter.",
    "image": "https://www.theknot.com/tk-media/images/d7668e79-5e5e-40e5-bd83-ba7c3d180964",
    "location": "Pebble Beach, CA",
    "coordinates": {
      "lat": 36.5685,
      "lng": -121.9513
    }
  },
  {
    "id": 28,
    "title": "Here we are at The Lodge, a fancy golf course a...",
    "date": "August 22, 2024",
    "description": "Here we are at The Lodge, a fancy golf course at Pebble Beach. Rather than playing golf like the posh bourgeois that we are, we did the next best thing, which is to look at fancy homes along the beach... for free. We also visited a tourist destination called Lovers Point where we stood on a precarious rock overlooking the ocean. Also a complimentary experience.",
    "image": "https://www.theknot.com/tk-media/images/e891b30b-530c-498f-a2c4-d38d31a5ae20",
    "location": "Pebble Beach, CA",
    "coordinates": {
      "lat": 36.5685,
      "lng": -121.9513
    }
  },
  {
    "id": 29,
    "title": "Here we are at Sayen Garden, yes the Sayen Gard...",
    "date": "September 08, 2024",
    "description": "Here we are at Sayen Garden, yes the Sayen Garden that you will come share the moment at our wedding. Little did I know that where we gifted each other little flowers is where we will say \"I do\".",
    "image": "https://www.theknot.com/tk-media/images/84eb4f49-8d08-422b-b7fb-25a462873548",
    "location": "Sayen Gardens, NJ",
    "coordinates": {
      "lat": 40.2129,
      "lng": -74.7154
    }
  },
  {
    "id": 30,
    "title": "Junchi offering me a token of her love",
    "date": "September 08, 2024",
    "description": "Junchi offering me a token of her love. That means the background must be very lovely.",
    "image": "https://www.theknot.com/tk-media/images/5ad625a3-637b-44cb-92a7-e6e6e9193f41",
    "location": "New York City",
    "coordinates": {
      "lat": 40.768,
      "lng": -73.9755
    }
  },
  {
    "id": 31,
    "title": "We move in together! I move in from NYC carryin...",
    "date": "September 13, 2024",
    "description": "We move in together! I move in from NYC carrying only 3 suitcase loads worth of stuff. My room in NYC was very small, but Junchi hired a moving company. She had 40 boxes of \"essential possessions\", hint lots and lots of dresses). She got these cute keyrings for us, each letter of our initials. Junchi said the \"H\" is appropriate for me, since I talk a lot. If that's true, then \"J\" is also right since Junchi loves to dance.",
    "image": "https://www.theknot.com/tk-media/images/b4c6fb7a-f907-4304-bef6-a087f7f4ffca",
    "location": "Our Home, NJ",
    "coordinates": {
      "lat": 40.3433,
      "lng": -74.6551
    }
  },
  {
    "id": 32,
    "title": "We took our first long vacation to Hawaii",
    "date": "December 25, 2024",
    "description": "We took our first long vacation to Hawaii. It was my second time there and Junchi's first! That day, we learned that the Hawaii's King Kamehameha actually conquered all the islands with western weapons. We also learned to identify a ripe pineapple 🍍",
    "image": "https://www.theknot.com/tk-media/images/98aad09b-48d0-4690-98eb-f4e0257bfda9",
    "location": "Hawaii",
    "coordinates": {
      "lat": 20.7984,
      "lng": -156.3319
    }
  },
  {
    "id": 33,
    "title": "The day I proposed to Junchi! I devised a craft...",
    "date": "May 03, 2025",
    "description": "The day I proposed to Junchi! I devised a crafty subterfuge. I suggested that we go to Central Park to fly a kite. Unbeknownst to her, I hid her ring box in a sock, which I was constantly checking throughout the day to see if I still had it. After I showed Junchi how to fly the kite, she ran wild trying to get the kite to ascend. While I popped out the ring and asked if she would marry me. Yep, it was that cheesy!",
    "image": "https://www.theknot.com/tk-media/images/2f29ee9a-30df-4228-a123-a9c80c958cb5",
    "location": "Central Park, NYC",
    "coordinates": {
      "lat": 40.7829,
      "lng": -73.9654
    }
  },
  {
    "id": 34,
    "title": "Technically the day we got married",
    "date": "May 07, 2025",
    "description": "Technically the day we got married. It was basically just the 2 of us at a public park with the wedding minister who read her favorite poem to us:\n Footprints in the Sand by Mary Stevenson\n\nOne night I dreamed I was walking along the beach with the Lord.\nMany scenes from my life flashed across the sky.\nIn each scene I noticed footprints in the sand.\nSometimes there were two sets of footprints,\nother times there were one set of footprints.\nThis bothered me because I noticed\nthat during the low periods of my life,\nwhen I was suffering from\nanguish, sorrow or defeat,\nI could see only one set of footprints.\n\nSo I said to the Lord,\n“You promised me Lord,\nthat if I followed you,\nyou would walk with me always.\nBut I have noticed that during\nthe most trying periods of my life\nthere have only been one\nset of footprints in the sand.\nWhy, when I needed you most,\nyou have not been there for me?”\n\nThe Lord replied,\n“The times when you have\nseen only one set of footprints,\nis when I carried you.”",
    "image": "https://www.theknot.com/tk-media/images/a396d16b-40b3-4ba9-9e7b-c68ecf0d612c",
    "location": "Courthouse, NJ",
    "coordinates": {
      "lat": 40.3433,
      "lng": -74.6551
    }
  },
  {
    "id": 35,
    "title": "We decided to have a long weekend in upstate Ne...",
    "date": "June 28, 2025",
    "description": "We decided to have a long weekend in upstate New York in Tarrytown for Junchi's birthday celebration. We went to Lyndhurst Mansion, which told us about a rich New Yorker from the 1800s who built his vacation home and bequeathed it down multiple generations (like a real-life version of East of Eden where each generation had an interesting story). Apparently the dude was so rich that the \"rolling hills\" were actually originally just flat land, so he hiring a bunch of people to move dirt around. Imagine making hills before bulldozers. Rich man indeed!",
    "image": "https://www.theknot.com/tk-media/images/621cb0d4-b9f3-4f7c-8bf0-65f6554ed355",
    "location": "Tarrytown, NY",
    "coordinates": {
      "lat": 41.0765,
      "lng": -73.8582
    }
  },
  {
    "id": 36,
    "title": "We went skydiving",
    "date": "July 04, 2025",
    "description": "We went skydiving. It was Junchi's best friend Ola (pictured here) first time. At the same time, my friend Yichen, ever the data scientist, scoured the interest for skydiving accident statistics and shared them to us all along the drive there.\nNo joke, there was an accident that weekend, and my mom and sister got so nervous since they hadn't heard from us for a few hours that they literally called the nearby hospital to see if we were members of a skydiving accident. But we were quite safe and had fun here thanks to Alina (Junchi's friend and colleague) and her skydiving team!",
    "image": "https://www.theknot.com/tk-media/images/3b29f3ac-5fe6-4dd0-b4ea-df8554090753",
    "location": "Skydiving, NJ",
    "coordinates": {
      "lat": 40.3433,
      "lng": -74.6551
    }
  },
  {
    "id": 37,
    "title": "This was our first time camping together in a t...",
    "date": "September 01, 2025",
    "description": "This was our first time camping together in a tent and having a real camp fire. As you can see, I brought watermelon 🍉, as I love fruits. Our friend's dog named Doodle decided to photobomb us.",
    "image": "https://www.theknot.com/tk-media/images/27ae53c7-5999-4bdf-bf11-389bc565214b",
    "location": "Camping Trip",
    "coordinates": {
      "lat": 40.8,
      "lng": -74.5
    }
  },
  {
    "id": 38,
    "title": "Junchi is a passionate and inspiring volunteer ...",
    "date": "September 27, 2025",
    "description": "Junchi is a passionate and inspiring volunteer at SAPA (Sino-American Pharmaceutical Association). Apparently New Jersey is the base for many pharmaceutical companies. She gave a great talk on AI tools, and naturally I was her best TA. Later Junchi interviewed a CEO.",
    "image": "https://www.theknot.com/tk-media/images/6fd9a135-b1bc-44c1-8d8a-10a68dd4109c",
    "location": "SAPA, NYC",
    "coordinates": {
      "lat": 40.7589,
      "lng": -73.9851
    }
  },
  {
    "id": 39,
    "title": "Snug Harbor at Staten Island was a potential we...",
    "date": "October 04, 2025",
    "description": "Snug Harbor at Staten Island was a potential wedding location. Specifically we wanted to have the Chinese Scholar Garden be the venue. Coincidentally, it was also the Mid-Autumn Festival, so we joined the celebration with lanterns, mooncakes, qipao dances, and later a dragon dance.",
    "image": "https://www.theknot.com/tk-media/images/889fbb48-f9f3-4e06-9058-67bcc2498e3b",
    "location": "Snug Harbor, Staten Island",
    "coordinates": {
      "lat": 40.6436,
      "lng": -74.1013
    }
  },
  {
    "id": 40,
    "title": "We are at The Met again",
    "date": "October 19, 2025",
    "description": "We are at The Met again. We are by the Egyptian wing of the museum by the Temple of Dendur. Suppose we met each other in past lives and find each other again. China has \"yinyuan\" (因缘/因緣) and Korean has \"inyun\" (인연/因緣), which is fate bringing us together. Past Lives (2023) is a good romance movie we watched together that embraces this theme. Surprisingly Junchi didn't even cry while watching this movie 🥺",
    "image": "https://www.theknot.com/tk-media/images/ee414b04-bdbb-4040-9f9b-beab7be1a4ba",
    "location": "The Met, NYC",
    "coordinates": {
      "lat": 40.7794,
      "lng": -73.9632
    }
  },
  {
    "id": 41,
    "title": "For a Halloween party, Junchi and I dressed up ...",
    "date": "October 30, 2025",
    "description": "For a Halloween party, Junchi and I dressed up as characters from KPop Demon Hunters. Junchi dressed up as Zoey, and I as a Saja boy who shall not be named. Junchi originally thought about dressing up as a Saja boy. Rather than gender swapping, I suggested that she can dress up as a Huntrix. I blew her mind! 🤯",
    "image": "https://www.theknot.com/tk-media/images/b292a1e1-7c99-4e8a-9fed-5fbb25b18cc3",
    "location": "Halloween Party, NYC",
    "coordinates": {
      "lat": 40.7589,
      "lng": -73.9851
    }
  },
  {
    "id": 42,
    "title": "At Universal Studios, we went to Jurassic Park",
    "date": "December 18, 2025",
    "description": "At Universal Studios, we went to Jurassic Park. The ranger told us that the dinosaur is friendly. Little did we know that it would attack us seconds later. Apparently the dinosaur can sense fear. Unfortunately the dinosaur didn't come from Nemo and didn't believe in: humans are friends, not food.",
    "image": "https://www.theknot.com/tk-media/images/0511e2a8-ced3-4a83-b229-dc3c78d9837f",
    "location": "Universal Studios, FL",
    "coordinates": {
      "lat": 28.4744,
      "lng": -81.4673
    }
  },
  {
    "id": 43,
    "title": "We went to Disneyworld and yes, we waited a lon...",
    "date": "December 21, 2025",
    "description": "We went to Disneyworld and yes, we waited a long time to ride the Avatar ride  Flight of Passage. The new Avatar movie (Fire and Ash) also came out that week, and we watched it too. Junchi said that the ride was so beautiful.\n\nWe also went to the Zootopia experience. Zootopia 2 had come out the month before. Just imagine Shakira singing \"zoo ooh ooh\"! BTW I had totally predicted the plot twist, which Junchi said was unlikely due to it being a Disney movie. Mind blown again 🤯",
    "image": "https://www.theknot.com/tk-media/images/dca03074-87c7-42bd-b194-d329fa97a93f",
    "location": "Disney World, FL",
    "coordinates": {
      "lat": 28.3772,
      "lng": -81.5707
    }
  },
  {
    "id": 44,
    "title": "At Disneyland Animal Kingdom, we took a picture...",
    "date": "December 21, 2025",
    "description": "At Disneyland Animal Kingdom, we took a picture at the Merry Menagerie. The photographer took many shots. He was a professional. It was a nice reprieve from a hot day and lots of walking.",
    "image": "https://www.theknot.com/tk-media/images/908702bf-6928-4ea4-a6de-122d9b3dff22",
    "location": "Disney World, FL",
    "coordinates": {
      "lat": 28.3772,
      "lng": -81.5707
    }
  },
  {
    "id": 45,
    "title": "Cute stuff always attracts Junchi's attention",
    "date": "December 21, 2025",
    "description": "Cute stuff always attracts Junchi's attention. We saw this red panda named Mei from Turning Red. Capitalism at its finest. Junchi gladly pays the Pink Tax on cute merch 🦊",
    "image": "https://www.theknot.com/tk-media/images/fda17e5a-a1de-4c5e-bcc6-69b1f20e82a3",
    "location": "New York City",
    "coordinates": {
      "lat": 40.773,
      "lng": -73.9705
    }
  },
  {
    "id": 46,
    "title": "At Treetop Trekking Adventures, we went climbin...",
    "date": "December 26, 2025",
    "description": "At Treetop Trekking Adventures, we went climbing on a zipline obstacle course. Most things were not ziplining. Two French girls ahead of us chickened out after the first obstacle.\nAfterwards, we visited the Jungle Island where we saw  a family of capybaras and lots of flamingos.",
    "image": "https://www.theknot.com/tk-media/images/9f9447d9-4cf4-461a-a901-a06f777ad039",
    "location": "Treetop Adventures, Toronto",
    "coordinates": {
      "lat": 43.6532,
      "lng": -79.3832
    }
  },
  {
    "id": 47,
    "title": "Here we are with my mom at Carmel beach at sunset",
    "date": "December 28, 2025",
    "description": "Here we are with my mom at Carmel beach at sunset. We tried to go to the Mystery Point but all the tickets were sold out. So we did the next best thing, which is to watch the sunset after climbing a long set of staircases to get to the benches at the top. Look at our smiles! ",
    "image": "https://www.theknot.com/tk-media/images/9b955ad2-187b-4a3f-b66a-28b66be2cabd",
    "location": "Carmel Beach, CA",
    "coordinates": {
      "lat": 36.5553,
      "lng": -121.9233
    }
  }
];
