const fs = require('fs');
const moment = require('moment');

fs.readFile('jsonDataset.json', 'utf8', (err, data) => {

    const usersData = JSON.parse(data);

    usersData.forEach((userData, index) => {
        const currentDate = moment();
        const userBirthDate = moment(userData.birthDate, 'DD.MM.YYYY');
        const age = currentDate.diff(userBirthDate, 'years');

        if (age < 14) {
            console.log(`Пользователь ${userData.userName} младше 14 лет.`);
            userData.birthDate += '***';
        } else {
            console.log(`Пользователь ${userData.userName} старше или равен 14 годам.`);
        }
    });

    fs.writeFileSync('jsonChangedDataset.json', JSON.stringify(usersData, null, 2));
});
