const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const { dirname } = require("path");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
})

app.post("/", function (req, res) {
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    const data = {
        members: [{
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName
            }
        }
        ]
    };
    const jsonData = JSON.stringify(data);
    console.log(jsonData);

    const url = "https://us17.api.mailchimp.com/3.0/lists/48e02e3bf1";

    const options = {
        method: "POST",
        auth: "clauro97:432b1482fc1769e01fbf834913db47b3"
    };

    const request = https.request(url, options, function (response) {
        response.on("data", function (data) {
            console.log(JSON.parse(data), response.statusCode);
        })
        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html")
        }
        else {
            res.sendFile(__dirname + "/failure.html")
        }
    });

    request.write(jsonData);
    request.end();


})
app.post("/failure", function (request, response) {
    response.redirect("/");
});
app.listen(process.env.PORT || 3000, function () {
    console.log("Server is running on port 3000.")
})

// Api Key 432b1482fc1769e01fbf834913db47b3-us17
// ad2d552eca88ceda331188f7c0751bbe-us17
// audience list id 48e02e3bf1