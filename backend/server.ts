    import dotenv from "dotenv";
    import app from "./app";
    import connectDB from "./src/config/db";

    dotenv.config();

    const PORT = process.env.PORT || 8000;

    connectDB();

    app.listen(PORT, () =>
    console.log(`Server is running on Port: ${PORT} successfully`),
    );
