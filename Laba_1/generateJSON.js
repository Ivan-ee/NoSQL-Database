function generateRandomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function generateRandomString() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';

    let length = Math.floor((Math.random() * 10) + 1);

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomString += characters.charAt(randomIndex);
    }

    return randomString;
}

function generateRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomData() {

    const startDate = new Date(2000, 0, 1);
    const endDate = new Date();

    const userId = generateRandomNumber(1, 100000);

    function generateRandomEmails() {
        const numEmails = generateRandomNumber(1, 4);
        const emails = [];
        for (let i = 0; i < numEmails; i++) {
            emails.push(`user${generateRandomString()}@gmail.com`);
        }
        return emails;
    }

    function generateRandomPublications() {
        const numPublications = generateRandomNumber(1, 4);
        const publications = [];

        for (let i = 0; i < numPublications; i++) {
            let description = '';
            const descriptionLength = Math.floor((Math.random() * 10) + 50);

            for (let j = 0; j < descriptionLength; j++) {
                description += generateRandomString();

                if (j < descriptionLength - 1) {
                    description += ' ';
                }
            }

            function generateRandomReviews() {
                const reviews = [];
                const reviewCount = Math.floor((Math.random() * 10));

                for (let d = 0; d < reviewCount; d++) {
                    let reviewDescription = '';
                    const reviewsLength = Math.floor((Math.random() * 10) + 30);

                    for (let k = 0; k < reviewsLength; k++) {
                        reviewDescription += generateRandomString();

                        if (k < reviewsLength - 1) {
                            reviewDescription += ' ';
                        }
                    }

                    reviews.push({
                        userID: generateRandomNumber(1, 100000),
                        description: reviewDescription,
                    });
                }

                return reviews;
            }

            publications.push({
                name: `Publication ${generateRandomString()}`,
                description: `${description}`,
                pages: generateRandomNumber(1, 100),
                category: `Category ${generateRandomNumber(1, 5)}`,
                date: generateRandomDate(startDate, endDate).toLocaleDateString(),
                reviews: generateRandomReviews(),
            });
        }
        return publications;
    }

    return {
        userId: userId,
        userName: `User${userId}`,
        emails: generateRandomEmails(),
        registrationDate: generateRandomDate(startDate, endDate).toLocaleDateString(),
        lastLoginDate: generateRandomDate(startDate, endDate).toLocaleDateString(),
        accountStatus: generateRandomNumber(0, 2) === 0 ? 'Confirmed' : 'Not Confirmed',
        publications: generateRandomPublications(),
        birthDate: generateRandomDate(new Date(1970, 0, 1), endDate).toLocaleDateString(),
        gender: generateRandomNumber(0, 2) === 0 ? 'Male' : 'Female',
    };
}

function generateDataset(numRecords) {
    const dataset = [];
    for (let i = 0; i < numRecords; i++) {
        dataset.push(generateRandomData());
    }
    return dataset;
}

const jsonDataset = generateDataset(1000);

const fs = require('fs');

fs.writeFileSync('jsonDataset.json', JSON.stringify(jsonDataset, null, 2));
