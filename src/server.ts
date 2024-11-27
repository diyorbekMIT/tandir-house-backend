import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import app from "./app";

console.log(process.env.PORT);

mongoose.connect(process.env.MONGO_URL as string,{})
  .then((data) => {
    console.log("MongoDB conncection succeed");
    const PORT = process.env.PORT ?? 3003;
    app.listen(PORT, function () {
        console.log(`Server is running on port ${PORT}`);
    })
  })
  .catch((err) => console.error("ERROR on connection MongoDB" ,err)); ;
