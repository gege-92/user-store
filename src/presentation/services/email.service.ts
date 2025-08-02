import nodemailer, { Transporter } from 'nodemailer';


export interface SendMailOptions {
    to: string | string[],
    subject: string,
    htmlBody: string,
    attachments?: Attachments[]
}


export interface Attachments {
    filename: string,
    path: string
}



export class EmailService {

    private transporter: Transporter;

    //DI
    constructor(
        mailerService: string,
        mailerEmail: string,
        mailerSecretKey: string,
        private readonly postToProvider: boolean
    ){
        this.transporter = nodemailer.createTransport({
            service: mailerService,
            auth: {
                user: mailerEmail,
                pass: mailerSecretKey
            }
        });
    }


    async sendEmail( options: SendMailOptions ): Promise<boolean> {

        const { to, subject, htmlBody, attachments = [] } = options;

        try {

            if( !this.postToProvider) return true;

            const sentInformation = await this.transporter.sendMail({
                to: to,
                subject: subject,
                html: htmlBody,
                attachments: attachments
            })

            //console.log( sentInformation );
            
            return true;
        } catch (error) {
            
            return false;
        }

    }

}