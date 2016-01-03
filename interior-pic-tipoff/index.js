/**
 * Created by Lawrence Ahn on 2015. 12. 29..
 */
var fs = require("fs");
var nodemailer = require('nodemailer');
var ses = require('nodemailer-ses-transport');
var configFile = fs.readFileSync("./config.json");
var config = JSON.parse(configFile);

exports.handler = function (event, context) {
    var sendSesMail = function (htmlMessage, callback) {
        var transporter = nodemailer.createTransport(ses({
            accessKeyId: config.aws.accessKeyId,
            secretAccessKey: config.aws.secretAccessKey,
            region: config.aws.region,
            rateLimit: 1
        }));
        transporter.sendMail({
            from: config.mail.from,
            to: config.mail.to,
            cc: config.mail.cc,
            subject: config.mail.subject,
            html: htmlMessage
        }, function (err, resStatus) {
            if (err) {
                context.fail('Mail Sending Error!');
                callback(err);
            } else {
                context.succeed('Mail Sending Complete!');
                callback('Success');
            }
        });
    }

    sendSesMail(event.htmlMessage, function (result) {
        console.log(result);
        console.log('htmlMessage =', event.htmlMessage);
    });
};