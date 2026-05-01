const express = require("express");
const connectDB = require("./config/database");

const User = require("./models/user");
const { ReturnDocument } = require("mongodb");

const app = express();

app.use(express.json());

//signup api


app.post("/signup", async (req, res) => {
    // creating a new instance if usermodel 
    const user = new User(req.body);

    try {
        await user.save();
        res.send("user added successfully");
    } catch (err) {
        res.status(400).send("error saving the user: " + (err.message || err));
    }


});


// get user by email
app.get("/user", async (req, res) => {
    const useremail = req.body.email;
    try {
        const users = await User.findOne({ email: useremail });

        if (users.length === 0) {
            res.status(400).send("user not found ||please enter correct email");

        }
        else {
            res.send(users);
        }

    } catch (err) {
        res.status(400).send("something went wrong");
    }

});

// feed api//which access all data of user
app.get("/feed", async (req, res) => {
    try {
        const users = await User.find({});
        res.send(users)

    }
    catch (err) {
        res.status(400).send("something went wrong");
    }
});


// delete api
app.delete("/user", async (req, res) => {
    const userId = req.body.userId;

    try {
        const user = await User.findByIdAndDelete(userId);// this is short hand  to delete user by using id
        res.send("user deleted successfully")
    }
    catch (err) {
        res.status(400).send("something went wrong");
    }

});


// update api
app.patch("/user", async (req, res) => {

    const data = req.body.userId;

    try {

        const user = await User.findByIdAndUpdate({ _id: userId }, data, {

        });

        console.log(user);

        res.send("user update successfully")

    }
    catch (err) {
        res.status(400).send("update failed :" + err.massage);
    }

})


connectDB()

    .then(() => {
        console.log("database connection established ...........")
        app.listen(5555, () => {
            console.log("server is successfully listing on port 5555 ...........")
        })
    }).catch(err => {
        console.log("database connction can't established")
    })
