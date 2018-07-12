# Scraping with Mongoose

## Instructions

This app is already fully-functional, but because it is so similar to your homework assignment, it's important to understand how it works. With a partner, do the following:

* Look at the dependencies in the `package.json` file. What does each one do? If you don't know, look up the documentation!

* Go to <http://www.echojs.com> and use the dev tools to verify the data that we are trying to scrape on `server.js` line 46.

* Open the Article model and explain the three fields/properties that we are declaring here. How does this relate to the Note model?

* Looking at the POST `/articles/:id` route in `server.js`, how are we able to put the ID of the new note into the Article collection?

* Follow the full-stack trail of clicking on an article to see the corresponding note. First, open the network tab in your Chrome dev tools and look at the GET request being made. Find the code that makes that GET request in `public/app.js`, then compare it to the back-end route in `server.js`. *Make sure you both understand how the FE and BE are communicating here!*

Once you are comfortable with the existing codebase, attempt the following improvements:

* Scrape an entirely different website.

* Prevent duplicate entries from being inserted into your database.

* Add a regular expression to your Article model to prevent articles with certain keywords from getting into your database.

* Add a scrape button to the UI so you don't have to go to a separate `/scrape` route.

* Add a "delete note" button to easily delete notes from articles. Remember, though: if you delete a note, its ID might still be referenced in another collection.