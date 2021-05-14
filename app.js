const express = require("express");
const bodyparse = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

// so that static file is also Show
app.use(express.static("Public"));
app.use(bodyparse.urlencoded({ extended: true }));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {

    const firstname = req.body.fname;
    const lastname = req.body.lname;
    const email = req.body.email;

    const data = {
        members: [{
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstname,
                LNAME: lastname
            }
        }]
    };

    const jsonData = JSON.stringify(data);

    const url = "https://us1.api.mailchimp.com/3.0/lists/1d4dff2ce8"

    const options = {
        method: "POST",
        auth: "sahil1:4ffcd5e707bc1469410c5052e3d287dd-us1"
    }

    const request = https.request(url, options, function(response) {

        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }



        response.on("data", function(data) {
            console.log(JSON.parse(data));
        });
    });

    request.write(jsonData);
    request.end();

});



app.post("/failure", function(req, res) {
    res.redirect("/");
})

app.listen(process.env.PORT || 3000, function() {
    console.log("Server is running on port 3000. ");
});

// api key
// 4ffcd5e707bc1469410c5052e3d287dd-us1

// unique id
// 1d4dff2ce8