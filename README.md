# Weather App Project

## Overview

This project aims to create a responsive weather application with a user-friendly interface. The main features include implementing a Bootstrap navbar for the header, a search functionality to retrieve weather details for a specific location, and managing a favorites screen with the ability to add or remove locations. The project emphasizes state management, responsive design with CSS grid, and effective error handling using a notify service.

## Features

1. **Header with Navigation:**
   - Implement a Bootstrap navbar for the header with links/icons for the main and favorites screens.

2. **Main Screen (Weather Details):**
   - Display a search field to search for a location's weather by city name.
   - Show the current weather and a 5-day forecast for the searched location.
   - Provide an indication if a location is already saved in favorites.
   - Include a button to add/remove the location from favorites (single toggle button).

3. **Favorites Screen:**
   - List favorite locations.
   - Clicking on a favorite location navigates to the main screen with details for that location.

4. **Search Limitation:**
   - Enable searching in English letters only.

5. **State Management:**
   - Implement robust state management to ensure a smooth user experience.

6. **Responsive Design:**
   - Prioritize responsive design with CSS grid.

7. **Error Handling:**
   - Implement effective error handling using a notify service to provide feedback on errors.

## Development Mode

In development mode, the application simulates data fetching to avoid exceeding API request limits. This is achieved by loading mock data from local JSON files instead of making actual API requests. The relevant code is enclosed in a conditional statement that checks if the application is running in development mode.

To run the project in development mode, follow these steps:

1. Clone the repository.
2. Install dependencies using `npm install` or `yarn install`.
3. Run the development server with `npm start` or `yarn start`.

Keep in mind that the simulation is for development purposes only, and in a production environment, the application will make actual API requests for weather data.
