const BASE_URL = "http://localhost:3000";

// Function to display the first movie's details
function getFirstMovie() {
    fetch(`${BASE_URL}/films/1`)
        .then(response => response.json())
        .then(movie => {
            displayMovieDetails(movie);
        })
        .catch(error => console.error("Error fetching the first movie:", error));
}

// Function to display a movie's details
function displayMovieDetails(movie) {
    const posterElement = document.getElementById("poster");
    const titleElement = document.getElementById("title");
    const runtimeElement = document.getElementById("runtime");
    const showtimeElement = document.getElementById("showtime");
    const descriptionElement = document.getElementById("description");
    const availableTicketsElement = document.getElementById("available-tickets");
    const buyTicketButton = document.getElementById("buy-ticket");

    posterElement.src = movie.poster;
    titleElement.textContent = movie.title;
    runtimeElement.textContent = `Runtime: ${movie.runtime} minutes`;
    showtimeElement.textContent = `Showtime: ${movie.showtime}`;
    descriptionElement.textContent = movie.description;
    
    const availableTickets = movie.capacity - movie.tickets_sold;
    availableTicketsElement.textContent = `Available Tickets: ${availableTickets}`;

    // Update button state based on availability
    if (availableTickets <= 0) {
        buyTicketButton.disabled = true;
        buyTicketButton.textContent = "Sold Out";
    } else {
        buyTicketButton.disabled = false;
        buyTicketButton.textContent = "Buy Ticket";
    }

    // Set up the Buy Ticket button
    buyTicketButton.onclick = () => buyTicket(movie);
}

// Function to get and display all movies in the list
function getMovies() {
    fetch(`${BASE_URL}/films`)
        .then(response => response.json())
        .then(movies => {
            const filmsList = document.getElementById("films");
            filmsList.innerHTML = ""; // Clear any existing list items

            movies.forEach(movie => {
                const li = document.createElement("li");
                li.textContent = movie.title;
                li.classList.add("film", "item");
                li.dataset.id = movie.id;
                li.onclick = () => displayMovieDetails(movie);
                filmsList.appendChild(li);

                // Add delete button to each movie
                const deleteButton = document.createElement("button");
                deleteButton.textContent = "Delete";
                deleteButton.onclick = (event) => {
                    event.stopPropagation(); // Prevent triggering the li click event
                    deleteMovie(movie.id, li);
                };
                li.appendChild(deleteButton);
            });
        })
        .catch(error => console.error("Error fetching movies:", error));
}

// Function to handle buying a ticket
function buyTicket(movie) {
    const availableTicketsElement = document.getElementById("available-tickets");
    const availableTickets = parseInt(availableTicketsElement.textContent.split(": ")[1]);

    if (availableTickets > 0) {
        const updatedTicketsSold = movie.tickets_sold + 1;

        fetch(`${BASE_URL}/films/${movie.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ tickets_sold: updatedTicketsSold })
        })
        .then(response => response.json())
        .then(updatedMovie => {
            // Update the displayed number of available tickets
            displayMovieDetails(updatedMovie);
        })
        .catch(error => console.error("Error updating tickets:", error));
    }
}

// Function to delete a movie
function deleteMovie(movieId, listItem) {
    fetch(`${BASE_URL}/films/${movieId}`, {
        method: "DELETE"
    })
    .then(() => {
        // Remove the movie list item from the UI
        listItem.remove();
        console.log(`Movie with id ${movieId} has been deleted.`);
    })
    .catch(error => console.error("Error deleting the movie:", error));
}

// Function to create a new movie
function createMovie(movieData) {
    fetch(`${BASE_URL}/films`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(movieData)
    })
    .then(response => response.json())
    .then(newMovie => {
        console.log("New movie added:", newMovie);
        // Add the new movie to the list
        getMovies();
    })
    .catch(error => console.error("Error creating a new movie:", error));
}

// Initialize the app
document.addEventListener("DOMContentLoaded", () => {
    getFirstMovie();
    getMovies();
});