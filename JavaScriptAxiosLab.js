import * as Carousel from "./Carousel.js";

// import axios from "axios";

// The breed selection input element.
const breedSelect = document.getElementById("breedSelect");
// The information section div element.
const infoDump = document.getElementById("infoDump");
// The progress bar div element.
const progressBar = document.getElementById("progressBar");
// The get favourites button element.
const getFavouritesBtn = document.getElementById("getFavouritesBtn");

// Step 0: Store your API key here for reference and easy access.
const API_KEY = "live_bQoDd1X9QVK1t1ddpGfcOSPbssO6WXEuBiggR5bITIT0chDUMb71X25p2tJfyRDT";

/**
 * 3. Fork your own sandbox, creating a new one named "JavaScript Axios Lab."
*/
/**
 * 4. Change all of your fetch() functions to axios!
 * - axios has already been imported for you within index.js.
 * - If you've done everything correctly up to this point, this should be simple.
 * - If it is not simple, take a moment to re-evaluate your original code.
 * - Hint: Axios has the ability to set default headers. Use this to your advantage
 *   by setting a default header with your API key so that you do not have to
 *   send it manually with all of your requests! You can also set a default base URL!
*/
// Part 4: Using Axios instead of fetch for Part 1 code
async function initialLoad() {
    try {
        let response = await axios.get("https://api.thecatapi.com/v1/breeds");
        let breeds = response.data;

        for (let breed of breeds) {
            let option = document.createElement("option");
            option.setAttribute("value", breed.id)
            option.innerText = breed.name;

            breedSelect.appendChild(option);
            console.log(breed);
        }
    } catch (error) {
        console.log(error)
    }
}
initialLoad();

// Part 4: Using Axios instead of fetch for Part 2 code
breedSelect.addEventListener("change", async (e) => {
    Carousel.clear()
    console.log("Now viewing breed:", e.target.value);
    let url = `https://api.thecatapi.com/v1/images/search?limit=10&breed_ids=${e.target.value}&api_key=${API_KEY}`

    try {

        let response = await axios.get(url, {
            onDownloadProgress: updateProgress
        })
        let data = response.data

        for (let item of data) {

            let src = item.url
            let alt = item.breeds[0].name
            let id = item.id


            let carouselItem = Carousel.createCarouselItem(src, alt, id)
            Carousel.appendCarousel(carouselItem)

        }

        let info = data[0].breeds[0].description
        let description = document.createElement("info");
        description.setAttribute("innerText", info)
        description.innerText = info

        infoDump.appendChild(description)

        console.log(data)

    } catch (error) {
        console.log(error)
    }

})
/**
 * 5. Add axios interceptors to log the time between request and response to the console.
 * - Hint: you already have access to code that does this!
 * - Add a console.log statement to indicate when requests begin.
 * - As an added challenge, try to do this on your own without referencing the lesson material.
*/
axios.interceptors.request.use(function (config) {
    document.body.style.cursor = 'progress';

    progressBar.style.width = '0%'

    config.metadata = config.metadata || {};
    config.metadata.startTime = new Date().getTime();
    console.log('Request has begun')
    return config;
});

axios.interceptors.response.use(function (config) {

    document.body.style.cursor = 'default';

    config.config.metadata.endTime = new Date().getTime();
    config.config.metadata.durationInMS = config.config.metadata.endTime - config.config.metadata.startTime;

    console.log(`Request completed in: ${config.config.metadata.durationInMS} milliseconds.`)
    return config;

}, function (error) {
    error.config.metadata.endTime = new Date().getTime();
    error.config.metadata.durationInMS = error.config.metadata.endTime - error.config.metadata.startTime;

    console.log(`Request completed in: ${error.config.metadata.durationInMS} milliseconds.`)
    throw error;
});
/**
 * 6. Next, we'll create a progress bar to indicate the request is in progress.
 * - The progressBar element has already been created for you.
 *  - You need only to modify its "width" style property to align with the request progress.
 * - In your request interceptor, set the width of the progressBar element to 0%.
 *  - This is to reset the progress with each request.
 * - Research the axios onDownloadProgress config option.
 * - Create a function "updateProgress" that receives a ProgressEvent object.
 *  - Pass this function to the axios onDownloadProgress config option in your event handler.
 * - console.log your ProgressEvent object within updateProgess, and familiarize yourself with its structure.
 *  - Update the progress of the request using the properties you are given.
 * - Note that we are not downloading a lot of data, so onDownloadProgress will likely only fire
 *   once or twice per request to this API. This is still a concept worth familiarizing yourself
 *   with for future projects.
*/
function updateProgress(progressEvent) {
    console.log(progressEvent);

    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);

    progressBar.style.width = `${percentCompleted}%`;

}

/**
 * 7. As a final element of progress indication, add the following to your axios interceptors:
 * - In your request interceptor, set the body element's cursor style to "progress."
 * - In your response interceptor, remove the progress cursor style from the body element.
 */

/**
 * 8. To practice posting data, we'll create a system to "favourite" certain images.
 * - The skeleton of this function has already been created for you.
 * - This function is used within Carousel.js to add the event listener as items are created.
 *  - This is why we use the export keyword for this function.
 * - Post to the cat API's favourites endpoint with the given ID.
 * - The API documentation gives examples of this functionality using fetch(); use Axios!
 * - Add additional logic to this function such that if the image is already favourited,
 *   you delete that favourite using the API, giving this function "toggle" functionality.
 * - You can call this function by clicking on the heart at the top right of any image.
 */
export async function favourite(imgId) {
    // your code here
    try {
        await axios.post("https://api.thecatapi.com/v1/favourites", { image_id: imgId }, {
            headers: {
                'x-api-key': API_KEY
            }
        })

        console.log(`Favorited img: ${imgId}`)

    } catch (error) {
        console.log(error);
    }
}

/**
 * 9. Test your favourite() function by creating a getFavourites() function.
 * - Use Axios to get all of your favourites from the cat API.
 * - Clear the carousel and display your favourites when the button is clicked.
 *  - You will have to bind this event listener to getFavouritesBtn yourself.
 *  - Hint: you already have all of the logic built for building a carousel.
 *    If that isn't in its own function, maybe it should be so you don't have to
 *    repeat yourself in this section.
 */

/**
 * 10. Test your site, thoroughly!
 * - What happens when you try to load the Malayan breed?
 *  - If this is working, good job! If not, look for the reason why and fix it!
 * - Test other breeds as well. Not every breed has the same data available, so
 *   your code should account for this.
 */
