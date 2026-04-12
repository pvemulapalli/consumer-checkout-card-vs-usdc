'use strict';

// ===== REQUIRED CONFIG =====

const AuthenticationType = 'jwt';
const RunEnvironment = 'apitest.cybersource.com';

const MerchantId = 'YOUR_MERCHANT_ID';

// JWT CONFIG
const KeysDirectory = 'resource';
const KeyFileName = 'YOUR_P12_FILENAME';
const KeyAlias = 'YOUR_KEY_ALIAS';
const KeyPass = 'YOUR_KEY_PASSWORD';

// ===== LOGGING (optional but useful) =====

const EnableLog = true;
const LogFileName = 'cybs';
const LogDirectory = 'log';
const LogfileMaxSize = '5242880';

// ===== CONFIG OBJECT =====

function Configuration() {
    return {
        authenticationType: AuthenticationType,
        runEnvironment: RunEnvironment,

        merchantID: MerchantId,

        keyAlias: KeyAlias,
        keyPass: KeyPass,
        keyFileName: KeyFileName,
        keysDirectory: KeysDirectory,

        logConfiguration: {
            enableLog: EnableLog,
            logFileName: LogFileName,
            logDirectory: LogDirectory,
            logFileMaxSize: LogfileMaxSize,
            loggingLevel: 'debug',
            enableMasking: true
        }
    };
}

module.exports = Configuration;