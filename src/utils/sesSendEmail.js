const { SendEmailCommand } = require("@aws-sdk/client-ses");
const { sesClient } = require("./sesClient");

const TO_EMAIL = "kumar.prabhat23343@jeckukas.org.in";
const FROM_EMAIL = "rockprabhat1@gmail.com"; // must be verified in SES

const createSendEmailCommand = () => {
    return new SendEmailCommand({
        Destination: {
            ToAddresses: [TO_EMAIL],
        },
        Message: {
            Subject: {
                Charset: "UTF-8",
                Data: "Connection Request",
            },
            Body: {
                Text: {
                    Charset: "UTF-8",
                    Data: "You received a connection request.",
                },
                Html: {
                    Charset: "UTF-8",
                    Data: "<p>You received a <b>connection request</b>.</p>",
                },
            },
        },
        Source: FROM_EMAIL,
    });
};

const run = async () => {
    try {
        return await sesClient.send(createSendEmailCommand());
    } catch (error) {
        if (error.name === "MessageRejected") {
            console.error("SES rejected email:", error.message);
            return error;
        }
        throw error;
    }
};

module.exports = { run };
