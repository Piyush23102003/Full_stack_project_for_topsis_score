import nodemailer from "nodemailer"
function email_send(email,paths){
    return new Promise((resolve, reject) => {
        const transporter = nodemailer.createTransport({
            service:"gmail", 
          
            auth: {
              user: 'piyushsingla8003@gmail.com', 
              pass: '//your app password'
            }
          });
          const mailOptions = {
            from: 'noreply@topsis.com', // Set the "noreply" email address
            to: email,
            subject: 'Topsis Score',
            text: 'Thanks for using the service. Your file is attached herewith.',
            attachments:[
                {
                    path:paths
                }
            ]
          };
          transporter.sendMail(mailOptions,function(error,info){
            if(error){
                console.log(error);
                return reject({message:"an error ocuured"})
            }
            return resolve({message:"email sent succesfully"})
          })
    })

}
export {email_send}