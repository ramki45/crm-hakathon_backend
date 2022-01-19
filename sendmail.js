var nodemailer = require('nodemailer');
var sender = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: 'ramkimarichamy9@gmail.com',
        pass: 'Vallalar5!'
    }
});
var composemail = {
    from: "ramkimarichamy9@gmail.com",
    to: "mpramki1994@gmail.com",
    subject: 'send mail using node js',
    text: "hello "
};

sender.sendMail(composemail,function(err,info){
if(err){
    console.log('mailerror')
}
else{
    console.log('mail sent successfully')
}

})