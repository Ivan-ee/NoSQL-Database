const schema = require('./schema.json');
const val_ex_1 = require('./example/valid/ex.json');
const val_ex_2 = require('./example/valid/ex_2.json');
const inval_ex_1 = require('./example/invalid/ex.json');
const inval_ex_2 = require('./example/invalid/ex_2.json');

const Ajv = require("ajv");
const addFormats = require("ajv-formats");


const ajv = new Ajv();
addFormats(ajv)

const validData = [
    val_ex_1, val_ex_2
];
const invalidData = [
    inval_ex_1, inval_ex_2
];
const validate = ajv.compile(schema);

validData.forEach((data, index) => {
    const valid = validate(data);
    console.log(`Валидные данные ${index + 1}: ${valid ? "Верно" : "Неверно"}`);
});

invalidData.forEach((data, index) => {
    const valid = validate(data);
    console.log(`Невалидные данные ${index + 1}: ${valid ? "Неверно" : "Верно"}`);
});