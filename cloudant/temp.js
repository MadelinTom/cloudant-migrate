// ---------------------------------------------------------------------------------------------
// Setup
// ---------------------------------------------------------------------------------------------
const Cloudant = require("@cloudant/cloudant")

const cloudant = Cloudant("");

const printResponse = (err, resp) => err ? console.error(err) : console.log(resp);

// ---------------------------------------------------------------------------------------------
// Data Generation
// ---------------------------------------------------------------------------------------------

const CREATORS = [
    "dianna_vickers",
    "faze_clan",
    "nari_jaded",
    "selda_soulspace",
    "john_the_blind",
    "anthony_joshua",
    "JM_M_Bronx",
    "dua_lipa",
    "lewis_capaldi",
    "frank_warren"
]

const TAGS = [
    "boxing",
    "sport",
    "gaming",
    "music",
    "arts",
    "news",
    "politics",
    "uk",
    "usa",
    "cats",
    "football",
    "coding",
    "painting",
    "fishing",
    "rugby",
    "gold",
    "trading",
    "activism",
    "education"
]

function randomInt(upperLimit, lowerLimit=0) {
    return Math.floor(lowerLimit + Math.random() * (upperLimit - lowerLimit));
}

function randomIndicies(numberOfIndices, limit) {
    const indicies = [];

    for (let i = 0; i < numberOfIndices; i++) {
        indicies.push(randomInt(limit))
    }

    return indicies;
}

function pick(arr, indicies) {
    const subset = [];
    for (const index of indicies) {
        subset.push(arr[index]);
    }
    return subset;
}

function generatePostDocument(numberofPosts) {
    const examplePosts = [];
    for (let i = 0; i < numberofPosts; i++) {

        const creator = CREATORS[i % CREATORS.length];
        const tags = pick(TAGS, randomIndicies(6, TAGS.length));

        examplePosts.push({
            "creatorId": "d0511334ce66d40dc9393f6af468c195",
            "creatorUsername": creator,
            "title": `Post ${i}`,
            "postedAt": `2020-${randomInt(1, 12)}-${randomInt(1, 28)}T12:00:00.000Z`,
            "tags": tags,
            "thumbnail": {
                "type": "image",
                "imageUri": "thumbnail.png"
            },
            "content": [
                // {
                //     "type": "text",
                //     "text": " Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis egestas euismod eleifend. Aenean tempor mauris varius felis laoreet semper. Mauris eget sagittis enim. Quisque sit amet nisi massa. Mauris egestas ex eget lorem ullamcorper, a varius augue egestas. Donec et ex nisl. Pellentesque ut lorem ac purus sodales convallis in nec massa. Mauris lobortis dolor libero, ut ultricies ligula tincidunt in. "
                // },
                // {
                //     "type": "text",
                //     "text": " Morbi viverra arcu in mattis faucibus. Vivamus condimentum tellus in maximus rutrum. Interdum et malesuada fames ac ante ipsum primis in faucibus. Praesent gravida vestibulum ex feugiat molestie. Nullam justo mauris, iaculis vitae justo id, molestie malesuada enim. In aliquam nisi et nunc facilisis egestas. Nullam mollis lorem dolor, sit amet tempus metus rutrum ut. Maecenas egestas lacinia risus, non dictum ante gravida vel. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. "
                // },
                // {
                //     "type": "text",
                //     "text": " Nunc sed tempor turpis, quis malesuada odio. Nulla facilisi. Pellentesque in scelerisque quam. Phasellus pellentesque, elit lobortis sollicitudin pellentesque, velit ex condimentum justo, ut varius augue leo eu sapien. Pellentesque non mi rhoncus, iaculis odio non, luctus risus. Pellentesque vitae vulputate sem, et tempor tortor. In nec laoreet ipsum. Phasellus a urna ut massa pellentesque volutpat quis sit amet odio. Curabitur justo arcu, bibendum ac libero a, facilisis pulvinar diam. Curabitur pretium, eros id rutrum elementum, sem dolor congue arcu, non sodales magna ante ut nisi. Nulla facilisi. "
                // },
                // {
                //     "type": "text",
                //     "text": " Maecenas eget urna sit amet nisl convallis facilisis. Donec tempus libero nulla, et suscipit sapien commodo id. Ut lobortis libero eu bibendum luctus. Sed eget ante eu risus auctor fermentum. Nullam ante orci, rutrum ac ipsum nec, blandit cursus lorem. Quisque vitae odio faucibus, imperdiet augue fermentum, blandit risus. Phasellus purus augue, efficitur nec enim a, semper elementum nisi. Vestibulum malesuada, mi et bibendum tristique, nisi nibh auctor velit, et porta ex purus sed odio. Morbi molestie mauris sed libero suscipit, vitae fermentum eros pulvinar. "
                // }
            ]
        });
    }

    return examplePosts;
}


// ---------------------------------------------------------------------------------------------
// Do something
// ---------------------------------------------------------------------------------------------

const DATABASE_NAME = "benchmarking";

const postsDB = cloudant.use("benchmarking");

const makeDatabase = name => cloudant.db.create(name, {}, printResponse);
const killDatabase = name => cloudant.db.destroy(name, {}, printResponse);

const insert = doc => postsDB.insert(doc, printResponse);
const insertMany = docs => postsDB.bulk({ docs });
const get = id => postsDB.get(id, printResponse);

async function main() {
    const examplePosts = generatePostDocument(1900);
    await insertMany(examplePosts);

    // await killDatabase(DATABASE_NAME)
    // await makeDatabase(DATABASE_NAME)
}


main();

