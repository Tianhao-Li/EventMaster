# EventMaster
Java Web Service Development: Geo-based Event Search and Recommendation



- This project's outcome is a dynamic web page which allows users to login and see nearby recreation events. They can mark events as "favorites", check their favaorite events, and get recommendations based on their favorite events

- This project involves the following tech stacks:

  - Front End:

    AJAX (HTML, CSS, JavaScript)

  - Back End:

    Java, Java Servlet, REST API, SQL(MySQL), NoSQL(MongoDB), Amazon EC2

- Some of the challenges I encountered:

  - Learning Design Patterns to solve some application design problems
  - Fixing mysql-server authentication problem on Amazon EC2
  - Synchronization of server testing settings and local testing settings

- Some future improvement:
  - Migrate the project to more advanced framework
  - Implement user registration feature



> A demo

1. The "Nearby" navigation button for nearby events![Nearby](https://github.com/Tianhao-Li/EventMaster/blob/main/NearByEvents.jpg)

2. The "My Favorites" navigation button for displaying my favorite events ![My Favorites](https://github.com/Tianhao-Li/EventMaster/blob/main/MyFavorites.jpg)

3. The "Recommendation" navigation button for recommending events ![Recommendation](https://github.com/Tianhao-Li/EventMaster/blob/main/Recommendation.jpg)



## Project Structure

- `index.html` -- the HTML file for the page
- `styles`
  - `main.css` -- CSS file for HTML style

- `WEB-INF`
  - `classes`
    - `GeoRecommendation` -- package for the recommendation system part
    -  `db` -- database part, including `DBConnection` Interface, `DBConnectionFactory`, `mongodb`and `mysql` implementation
    - `entity` -- define `Item` class for data storage in Java
    - `external` -- communication with external APIs part, including `TicketMasterAPI` class for communicating with Ticketmaster API and `GeoHash` for location formatting when communicating with Ticketmaster API 
    - `rpc` -- Java servlets for each web service endpoint
