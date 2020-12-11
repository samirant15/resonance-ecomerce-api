import { parseFields } from '../graphql/furniture';

var nodemailer = require('nodemailer');
const { getFurniture } = require('../airtable/furnitureService');

var mailService = null;
const getMailService = () => {
    if (mailService == null) {
        const transporter = nodemailer.createTransport({
            port: process.env.SMTP_PORT,
            host: process.env.SMTP_HOST,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
            secure: true,
        });
        mailService = transporter;
    }

    return mailService;
}

export const sendFurnitureMail = async (id, email) => {
    const res = await getFurniture(id);
    const data = { id: res.id, ...res.fields };
    const furniture = parseFields(data);

    const mailData = {
        from: 'not-reply@gmail.com',
        to: email,
        subject: 'Information of Furniture ' + furniture.name,
        html: `
        <div>
            <div>
                <div>
                    <h4>${furniture.name}</h4>
                    <span>${furniture.inStock ? 'In Stock' : 'Out of Stock'}</span>
                </div>
                <div>
                    <h5 style="font-weight:bold;float:right">$${furniture.unitCost}</h5>
                </div>
            </div>
            <div>
                <a href="${furniture.link}" style="color:#00A6ED">${furniture.link}</a>
            </div>
            <div role="separator"></div>
            <div>
                <div>
                    <h5>Materials and Finishes:</h5>
                    <ul>
                        ${furniture.materialsAndFinishes.map((txt, i) => (
            `<li><span>${txt}</span></li>`
        ))
            }
                    </ul>
                    
                    <span>Dark Wood</span>
                    <h5>Settings:</h5>
                    <ul>
                        ${furniture.settings.map((txt, i) => (
                `<li><span>${txt}</span></li>`
            ))
            }
                    </ul>
                </div>
                <div>
                    <h5>Size:</h5>
                    <span>${furniture.size}</span>
                </div>
            </div>
            <div role="separator"></div>
            <div>
                <h5>Description:</h5>
                <p>
                ${furniture.description}
                </p>
            </div>
        </div>
        `,
    };

    const mailer = getMailService();
    await mailer.sendMail(mailData);
}