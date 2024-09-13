## How to Run the Project on Your System

### Run the Frontend

1. Navigate to the `Axios.ts` file located in `/frontend/utils`.
2. Update the `baseURL` to point to your backend localhost URL (e.g., `http://localhost:3005`).

Then, follow these steps to run the frontend:
-   Open a terminal and run the following commands:
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

### Run the Backend

1. Create a `.env` file in the root of your backend folder and add the following environment variables:
   - `MONGO_URI`: Provide your MongoDB connection string (e.g., `mongodb://127.0.0.1:27017/hd`).
   - `JWT_SECRET`: Provide a random string for the JWT secret.
   - `EMAIL_USER`: Your email address.
   - `EMAIL_PASS`: The passkey or password for your email.

Then, follow these steps to run the backend:
-   Open a terminal and run the following commands:
    ```bash
    cd backend
    npm install
    npm run build
    npm start
    ```

