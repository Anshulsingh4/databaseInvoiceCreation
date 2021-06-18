require('dotenv').config({ path: '.env' });

const express = require('express')
const app = express()
const mongoose = require('mongoose');
const User = require('./models/user')
const cors = require('cors')
const bcrypt = require('bcrypt')
const invoiceModel = require('./models/invoice');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const dbUrl = process.env.DB_URL

app.use(cors({
    credentials: true,
    origin: ['http://localhost:4000', 'http://localhost:4200']
}))

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});


/* AUTH ROUTES */
app.post('/registerUser', async (req, res) => {
    try {
        const { name, email, contactNumber, department, role, password } = req.body;
        const hash = await bcrypt.hash(password, 12);
        const user = new User({
            name, email, contactNumber, department, role,
            password: hash
        });
        const result = await user.save();
        res.send(true)
    } catch (error) {
        response.status(500).send(error);
    }
});

app.post('/login', async (req, res) => {
    const { password, email } = req.body;
    const user = await User.findOne({ email: email })

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (isValidPassword) {
        const token = await user.generateToken();
        res.status(200).json({
            user: user,
            data: true,
            token: token
        })
    }
    else {
        res.send({
            data: false,
            message: "Invalid credentials given"
        })
    }
});

/* INVOICE CREATION ROUTES */

app.post('/createinvoice', async (req, res) => {
    console.log(req.body);
    const { createdBy, data, products, total } = req.body
    const { invoiceNumber, customerName, invoiceDate, address, contactNumber, currency, state, email, pointToRemember } = data;
    const user = new invoiceModel({ createdBy, invoiceNumber, customerName, invoiceDate, address, contactNumber, currency, state, email, pointToRemember, total })
    for (let pro of products) {
        user.productDetails.push({
            productName: pro.Description,
            quantity: pro.Quantity,
            price: pro.Price,
            amount: pro.Amount
        })
    }
    await user.save()
    console.log(data)
    console.log(email)
})



/* MANAGE INVOICE ROUTES */

app.get('/manageInvoice', async (req, res) => {
    const invoices = await invoiceModel.find({ deleted: false })
    const userId = invoices[0].createdBy;
    const user = await User.findById(userId)
    username = user.name;
    res.send({ invoices, username })
})

app.get('/deleteInvoice/:id', async (req, res) => {
    const id = req.params.id
    console.log(id)
    const invoice = await invoiceModel.findById(id)
    invoice.deleted = true;
    await invoice.save()
    res.send(true)
})

app.get('/manageinvoice/:id', async (req, res) => {
    console.log("hello")
    const invoices = await invoiceModel.findById(req.params.id)
    console.log(invoices)
    res.send(invoices)
})


app.post('/editinvoice/:id', async (req, res) => {
    const id = req.params.id;
    console.log(req.body)
    const { data, products, total } = req.body

    const invoiceupdate = await invoiceModel.findByIdAndUpdate(id, req.body.data);
    console.log(invoiceupdate)
    invoiceupdate.productDetails = []
    for (let pro of products) {
        invoiceupdate.productDetails.push({
            productName: pro.Description,
            quantity: pro.Quantity,
            price: pro.Price,
            amount: pro.Amount
        })
    }
    console.log("after", invoiceupdate)
    await invoiceupdate.save()
})


app.post('/updatestatus', async (req, res) => {
    console.log(req.body)
    const { ids, status } = req.body
    for (let i of ids) {
        await invoiceModel.findByIdAndUpdate(i, { status: status })
    }
})


/* ADD CREATOR ROUTES */

app.get('/getUser', async (req, res) => {
    const users = await User.find({})
    res.send(users)
})

app.get('/getUser/:id', async (req, res) => {
    const id = req.params.id
    const user = await User.findById(id)
    res.send(user)
})

app.post('/getUser/:id', async (req, res) => {
    const id = req.params.id;
    const user = await User.findByIdAndUpdate(id, req.body)
    await user.save()
    res.send(true)
})

app.get('/deleteUser/:id', async (req, res) => {
    const id = req.params.id
    await User.findByIdAndDelete(id)
    res.send(true)
})



app.listen(4000, function () {
    console.log('Listening at 4000!');
});


