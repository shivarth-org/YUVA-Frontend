import {customScanner } from 'sonarqube-scanner';
// import process from 'process';

const sonarqubeUrl = process.env.SONARQUBE_URL;
const sonarqubeToken = 'sqp_094003dc6dae7b9939efafefa766520330bb0ead';

(function () {
    customScanner({
        serverUrl: sonarqubeUrl,
        token: sonarqubeToken,
        options: {
            'sonar.projectName': 'yuva_portal',
            'sonar.projectDescription': 'Description for "My App" project...',
            'sonar.sources': './src',
            'sonar.tests': './test',
            'sonar.host.url': 'http://localhost:9000/',
        },
    }, (error) => {
        if (error) {
            console.error('Error:', error);
        } else {
            console.log('SonarQube scan completed successfully.');
        }
        process.exit();
    })
})()