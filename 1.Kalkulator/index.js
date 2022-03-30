var express = require('express');
var app = express();
app.get('/', function (req, res) {
    if (req.query.operation != undefined && req.query.num1 != undefined && req.query.num2 != undefined) {
        var num1 = parseInt(req.query.num1);
        var num2 = parseInt(req.query.num2);
        if (req.query.operation == 'dodaj') {
            var result = num1 + num2;
            res.status(200).send('Wynik dodawania to: ' + result);
        }
        else if (req.query.operation == 'usun') {
            var result = num1 - num2;
            res.status(200).send('Wynik odejmowania to: ' + result);
        }
        else if (req.query.operation == 'podziel') {
            var result = num1 / num2;
            res.status(200).send('Wynik dzielenia to: ' + result);
        }
        else if (req.query.operation == 'pomnoz') {
            var result = num1 * num2;
            res.status(200).send('Wynik mnozenia to: ' + result);
        }
    }
    else
        res.status(400).send('Podano błędne dane!');
});
app.get('/:operation/:num1/:num2', function (req, res) {
    if (req.params.operation != undefined && req.params.num1 != undefined && req.params.num2 != undefined) {
        var num1 = parseInt(req.params.num1);
        var num2 = parseInt(req.params.num2);
        if (req.params.operation == 'dodaj') {
            var result = num1 + num2;
            res.status(200).send('Wynik dodawania to: ' + result);
        }
        else if (req.params.operation == 'usun') {
            var result = num1 - num2;
            res.status(200).send('Wynik odejmowania to: ' + result);
        }
        else if (req.params.operation == 'podziel') {
            var result = num1 / num2;
            res.status(200).send('Wynik dzielenia to: ' + result);
        }
        else if (req.params.operation == 'pomnoz') {
            var result = num1 * num2;
            res.status(200).send('Wynik mnozenia to: ' + result);
        }
    }
    else
        res.status(400).send('Podano błędne dane!');
});
app.listen(3000);
