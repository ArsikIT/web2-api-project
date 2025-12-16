# 🚀 Web2 API Project: Node.js / Express Backend


## 🎯 Project Goals

The primary objectives of this project were to:

1.  Implement a fully functional REST API following standard CRUD operations.
2.  Adhere to best practices regarding the separation of application logic (Core JS).
3.  Utilize environment variables (`.env`) for secure configuration management.
4.  Provide comprehensive setup and usage documentation.

## ⚙️ Setup and Installation

Follow these steps to get your development environment running locally.

### Prerequisites

You must have the following installed:

* **Node.js**: Recommended version 16.x or newer.
* **npm** or **Yarn** for package management.

### Installation Steps

1.  **Clone the Repository:**
    ```bash
    git clone [https://github.com/ArsikIT/web2-api-project.git](https://github.com/ArsikIT/web2-api-project.git)
    cd web2-api-project
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a file named `.env` in the root of the project to manage sensitive settings.

    | Variable | Description | Example Value |
    | :--- | :--- | :--- |
    | `PORT` | The port the Express server will listen on. | `3000` |
    | `NODE_ENV` | The environment mode (development/production). | `development` |
    | `SECRET_KEY` | (If applicable) A key for token signing or encryption. | `your_long_secret` |

4.  **Run the Server:**
    Start the server using the designated npm script:
    ```bash
    npm start
    # If using nodemon for live reload: npm run dev
    ```



## 🏗️ Architectural Decisions

### 1. Separation of Concerns (The Core JS Rule)

This project adopts a layered architecture to ensure **strict separation of responsibilities**.

* **Logic Layer:** All core implementation details reside in `.js` files (e.g., `server.js`, files within `routes/`, `controllers/`, and `models/`).
* **Presentation Layer:** HTML files, if present, are purely structural and do not contain any server-side or complex business logic. This facilitates easier testing and future migration (e.g., to a separate frontend framework like React).



### 2. File Structure

Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
d-----        16.12.2025     15:35                node_modules
d-----        16.12.2025     15:43                public
-a----        16.12.2025     16:08            226 .env
-a----        16.12.2025     21:25            106 .gitignore
-a----        16.12.2025     15:35          34149 package-lock.json
-a----        16.12.2025     15:35            356 package.json
-a----        16.12.2025     23:15           2232 README.md
-a----        16.12.2025     19:28           6600 server2.js


## 💻 API Usage and Endpoints

All API calls should target the base URL: `http://localhost:[PORT]/api/v1`

### Resource: Users (`/users`)

| Method | Endpoint | Description | Request Body Example | Success Response |
| :---: | :------ | :-------- | :------------------- | :-------------- |
| **GET** | `/api/v1/users` | Retrieve all users. Supports optional query params. | N/A | `200 OK` |
| **POST** | `/api/v1/users` | Create a new user record. | `{ "name": "Alex", "email": "alex@mail.com" }` | `201 Created` |
| **GET** | `/api/v1/users/:id` | Retrieve a user by their unique ID. | N/A | `200 OK` |
| **PUT** | `/api/v1/users/:id` | Fully replace the resource data (full update). | `{ "name": "Alex K." }` | `200 OK` |
| **DELETE** | `/api/v1/users/:id`| Remove the resource from the database. | N/A | `204 No Content` |