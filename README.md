## Website Name: RoomIntel
A dynamic website for booking rooms with detailed information and price range filters, featuring multiple routes and user authentication. Users can book their favorite room.

## Credential:
**Email:** user@user.com
**Password:** User1234

## Live Site URL:
Visit the live site at [RoomIntel Live](https://room-intel.netlify.app/)

## Features and Characteristics:

- **Interactive Home Slider:** Engage visitors with a dynamic image slider in the Home section, complete with intuitive navigation arrows for a seamless browsing experience.
- **Detailed Room Cards:** Highlight available rooms with detailed cards in the Featured section, each showcasing essential information and a "Details" button for more in-depth insights.
- **Effortless Room Booking:** Allow users to easily book rooms and have their reservations added to the All About Information section for convenient tracking and management.
- **Secure User Authentication:** Enhance security and user experience with robust registration, login, and logout functionality integrated into the Navbar.
- **Personalized Profile Page:** Provide users with a dedicated Profile page where they can view and update their name and image URL, creating a personalized touch.
- **Comprehensive Price Range Filter:** Enable users to find rooms that fit their budget by utilizing an efficient price range filter, ensuring a tailored search experience.
- **Extensive Routing:** Offer a diverse array of services across more than 7 routes, ensuring users can navigate and access various functionalities with ease.

## How to Start This Application:
1. **Clone the Repositories:**
    ```sh
    # Client Side:
    git clone https://github.com/DeveloperImran1/Assignment-11-Client.git
    cd Assignment-11-Client
    ```
    ```sh
    # Server Side:
    git clone https://github.com/DeveloperImran1/Assignment-11-server.git
    cd Assignment-11-server
    ```
2. **Install Dependencies:**
    ```sh
    npm install
    ```
3. **Start the Development Server:**
    ```sh
    nodemon index.js
    ```
4. **Build for Production:**
    ```sh
    npm run build
    ```
5. **Deploy to Firebase:**
    ```sh
    firebase deploy
    ```

## Client Side Github link:

<a href="https://github.com/DeveloperImran1/Assignment-11-client">Server Code<a/>


## Dependencies

- **Frontend:**
  - React: A JavaScript library for building user interfaces.
  - React Router: Declarative routing for React applications.
  - Axios: Promise-based HTTP client for the browser and Node.js.
  - React Query: Hooks for fetching, caching, and updating asynchronous data in React.
  - SweetAlert2: Beautiful, responsive, customizable replacement for JavaScript's popup boxes.
  - React-Hot-Toast: Beautiful, responsive, customizable replacement for JavaScript's notification/alert.
  - Tailwind CSS: A utility-first CSS framework for rapid UI development.
  - Headless UI: Unstyled, fully accessible UI components for React.

- **Backend:**
  - Express: Fast, unopinionated, minimalist web framework for Node.js.
  - MongoDB: NoSQL database for storing application data.
  - Mongoose: Elegant MongoDB object modeling for Node.js.
  - Cors: Middleware for enabling Cross-Origin Resource Sharing.
  - Dotenv: Module to load environment variables from a `.env` file.

## Additional Information

- **Environment Variables:**
  - Create a `.env.local` file in the root of your client project and add the following variables:
    ```plaintext
    VITE_APIKEY=Your firebase config file
    VITE_AUTHDOMAIN=Your firebase config file
    VITE_PROJECTID=Your firebase config file
    VITE_STORAGEBUCKET=Your firebase config file
    VITE_MESSAGINGSENDERID=Your firebase config file
    VITE_APPID=Your firebase config file
    VITE_SERVER='http://localhost:5000'
    VITE_IMG_KEY= your imageBB Api key
    ```
  - Create a `.env` file in the root of your server project and add the following variables:
    ```plaintext
    DB_USER=your database username in MongoDB
    DB_PASS=your database password in MongoDB
    ```

- **Folder Structure:**
  - `client/`: Contains the React frontend code.
  - `server/`: Contains the Express backend code.

## Contributing

If you'd like to contribute to this project, please fork the repository and use a feature branch. Pull requests are welcome.

## License

This project is open-source and available under the [MIT License](LICENSE).
