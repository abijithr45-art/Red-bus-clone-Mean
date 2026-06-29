const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');

// 👇 ഇത് ADD ചെയ്യുക
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const mongoose = require('mongoose');

const app = express();

app.use(cors());
app.use(bodyparser.json());

const customerroutes = require("./routes/customer");
const routesroute = require("./routes/route");
const bookingroute = require("./routes/booking");
const communityRoutes = require("./routes/community");
const notificationRoutes = require("./routes/notification");


app.use(bookingroute);
app.use(routesroute);
app.use(customerroutes);
app.use(communityRoutes);
app.use(notificationRoutes);


const DBURL = "mongodb+srv://admin:tedbus123@cluster0.5ncq0jj.mongodb.net/tedbus?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(DBURL)
.then(() => console.log("✅ Mongodb connected"))
.catch(err => console.error("❌ Mongodb connection error:", err));

app.get('/', (req, res) => {
    res.send('Hello, Ted bus is working');
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});