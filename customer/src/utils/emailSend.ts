import nodemailer from 'nodemailer';


export const sendMail = async(email:string,subject:string,text:string)=>{
    try {
        const smtpTransport = nodemailer.createTransport({
            host: process.env.HOST,
            service:process.env.SERVICE,
            port: 587,
            secure: true,
            auth: {
              user:process.env.USER_NAME,
              pass:process.env.PASS ,
            },
        });

        await smtpTransport.sendMail({
            // from: process.env.USER_NAME,
            from: 'no-reply@netfli.com',
            to: email,
            subject:subject,
            html:`
            <html>
                <body>
                    <div style="width: 70%; margin: 0 auto; font-family: 'Poppins', sans-serif;">
                        <img src="https://res.cloudinary.com/dbb0ncoht/image/upload/v1710834317/Brown_Wood_Minimalist_Profile_LinkedIn_Banner_jrbiz0.png" alt="Rescue Dogs" style="width: 100%; display: block;">
                        <p style="font-size: 16px; line-height: 1.5; color: black;">Dear Friend,</p>
                        <p style="font-size: 16px; line-height: 1.5; color: black;">We are reaching out to ask for your support in our mission to rescue and care for dogs in need. Your donation will directly contribute to providing shelter, food, medical care, and love to dogs who deserve a second chance at happiness.</p>
                        <p style="font-size: 16px; line-height: 1.5; color: black;">Every contribution, no matter how small, makes a meaningful difference in the lives of these animals. Join us in saving dogs' lives by donating today.</p>
                        <a href="https://your_website.com/donate" style="background-color: #4CAF50; color: white; padding: 15px 25px; text-align: center; display: inline-block; text-decoration: none; border-radius: 5px; font-size: 16px; line-height: 1.5;">Donate Now</a>
                        <p style="font-size: 16px; line-height: 1.5; color: black;">Thank you for your generosity.</p>
                        <p style="font-size: 16px; line-height: 1.5; color: black;">Sincerely,<br>Your Name</p>
                    </div>
                </body>
            </html>`,  
        })

        console.log("email sent successfully");
        
    } catch (error) {
        console.log("email not sented");
        console.log(error);
    }
}