const fs = require('fs');

const jsonData = fs.readFileSync('jsonChangedDataset.json', 'utf-8');
const data = JSON.parse(jsonData);

function toDsv(data) {
    let text = "userId\tuserName\temails\tregistrationDate\tlastLoginDate\taccountStatus\tpublicationName\tpublicationDescription\tpublicationPages\tpublicationCategory\tpublicationDate\treviewUserId\treviewDescription\tbirthDate\tgender\n";

    for (const user of data) {
        const numEmails = user.emails.length;
        const numPublications = user.publications.length;

        if (numEmails > 0 && numPublications > 0) {
            for (const email of user.emails) {
                for (const publication of user.publications) {

                    for (const reviews of publication.reviews) {
                        text += `${user.userId  || ''}\t${user.userName  || ''}\t${user.email  || ''}\t${user.registrationDate  || ''}\t${user.lastLoginDate  || ''}\t${user.accountStatus  || ''}\t`;
                        text += `${publication.name  || ''}\t${publication.description}\t${publication.pages || ''}\t${publication.category || ''}\t${publication.date || ''}\t`;
                        text += `${reviews.userID || ''}\t${reviews.description || ''}\t`
                        text += `${user.birthDate  || ''}\t${user.gender  || ''}\n`;
                    }
                }
            }
        } else {
            text += `${user.userId}\t${user.userName}\t\t${user.registrationDate}\t${user.lastLoginDate}\t${user.accountStatus}\t\t\t\t\t\t${user.birthDate}\t${user.gender}\n`;
        }
    }

    return text;
}

const dsvData = toDsv(data);
fs.writeFileSync('output_data.dsv', dsvData, 'utf-8');
