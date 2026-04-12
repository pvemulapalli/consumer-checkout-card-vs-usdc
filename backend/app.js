const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const indexRouter = require('./routes/index');

const cybersourceRestApi = require('cybersource-rest-client');
const configuration = require('./config/Configuration.local');

const app = express();

// ✅ ENABLE CORS (VERY IMPORTANT)
app.use(cors({
  origin: "http://localhost:3000"
}));

// view engine setup (we keep it, but won’t use it for API)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// ======================================================
// 🔥 API ROUTE (PLACE BEFORE ALL ROUTERS)
// ======================================================
app.get('/api/card/setup', function (req, res) {
  try {
    console.log("➡️ API HIT: /api/card/setup");

    const configObject = new configuration();
    const apiClient = new cybersourceRestApi.ApiClient();
    const requestObj = new cybersourceRestApi.GenerateCaptureContextRequest();

    requestObj.clientVersion = 'v2';
    requestObj.targetOrigins = ["http://localhost:3000"];
    requestObj.allowedCardNetworks = ["VISA", "MASTERCARD", "AMEX"];
    requestObj.allowedPaymentTypes = ["CARD"];

    requestObj.captureMandate = {
      type: "ONE_TIME"
    };

    const instance = new cybersourceRestApi.MicroformIntegrationApi(
      configObject,
      apiClient
    );

    instance.generateCaptureContext(requestObj, function (error, data) {
      if (error) {
        console.error("❌ Visa Error:", error);
        return res.status(500).json({ error });
      }

      console.log("✅ Capture Context Generated");

        const decoded = JSON.parse(
            Buffer.from(data.split(".")[1], "base64").toString()
        );

        res.json({
            captureContext: data,
            clientLibrary: decoded.ctx[0].data.clientLibrary,
            clientLibraryIntegrity: decoded.ctx[0].data.clientLibraryIntegrity
        });
    });

  } catch (err) {
    console.error("❌ Exception:", err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/card/pay', function (req, res) {
  try {
    console.log("🧾 Raw body:", req.body);

    const tokenResponse = req.body.transientToken;

    const configObject = new configuration();
    const instance = new cybersourceRestApi.PaymentsApi(configObject);

    const clientReferenceInformation = new cybersourceRestApi.Ptsv2paymentsClientReferenceInformation();
    clientReferenceInformation.code = 'demo_payment';

    const processingInformation = new cybersourceRestApi.Ptsv2paymentsProcessingInformation();
    processingInformation.commerceIndicator = 'internet';

    const amountDetails = new cybersourceRestApi.Ptsv2paymentsOrderInformationAmountDetails();
    amountDetails.totalAmount = '82.73';
    amountDetails.currency = 'USD';

    const billTo = new cybersourceRestApi.Ptsv2paymentsOrderInformationBillTo();
    billTo.firstName = 'April';
    billTo.lastName = 'Summers';
    billTo.address1 = '4812 Willow Creek Lane';
    billTo.locality = 'Frisco';
    billTo.administrativeArea = 'TX';
    billTo.postalCode = '75034';
    billTo.country = 'US';
    billTo.email = 'april@example.com';

    const orderInformation = new cybersourceRestApi.Ptsv2paymentsOrderInformation();
    orderInformation.amountDetails = amountDetails;
    orderInformation.billTo = billTo;

    const tokenInformation = new cybersourceRestApi.Ptsv2paymentsTokenInformation();
    tokenInformation.transientTokenJwt = tokenResponse;

    const request = new cybersourceRestApi.CreatePaymentRequest();
    request.clientReferenceInformation = clientReferenceInformation;
    request.processingInformation = processingInformation;
    request.orderInformation = orderInformation;
    request.tokenInformation = tokenInformation;

    console.log("Incoming token:", tokenResponse?.substring(0, 20));

    const instancePayment = new cybersourceRestApi.PaymentsApi(configObject);

    instancePayment.createPayment(request, function (error, data) {
      if (error) {
        console.error("Payment Error:", error);
        return res.status(500).json({ error });
      }

      console.log("Payment Success:", data);

      res.json({
        status: "success",
        data
      });
    });

  } catch (err) {
    console.error("Exception:", err);
    res.status(500).json({ error: err.message });
  }
});


// ======================================================
// ⚠️ ROUTERS (KEEP AFTER API)
// ======================================================
app.use('/api', indexRouter);


// ======================================================
// ❌ REMOVE UNNECESSARY ROUTES (TOKEN + RECEIPT)
// (they interfere and you don’t need them now)
// ======================================================


// ======================================================
// ERROR HANDLING
// ======================================================
app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.json({ error: err.message });
});

module.exports = app;