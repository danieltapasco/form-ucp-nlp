pipeline {
    agent any

    tools {
        nodejs 'Node_24'
    }

    stages {
        stage('Build y Test en Docker') {
            steps {
                script {
                    docker.image('mcr.microsoft.com/playwright:v1.43.1-jammy').inside {
                        sh 'npm install'
                        sh 'npx playwright install'
                        sh 'npm run build'

                        try {
                            sh 'npx playwright test --project=chromium --reporter=junit > junit-chrome.xml'
                            junit 'junit-chrome.xml'
                        } catch (err) {
                            echo "Pruebas Chrome fallaron: ${err}"
                            currentBuild.result = 'UNSTABLE'
                        }

                        try {
                            sh 'npx playwright test --project=firefox --reporter=junit > junit-firefox.xml'
                            junit 'junit-firefox.xml'
                        } catch (err) {
                            echo "Pruebas Firefox fallaron: ${err}"
                            currentBuild.result = 'UNSTABLE'
                        }

                        sh 'mkdir -p prod && cp -r .next/* prod/'
                    }
                }
            }
        }
    }

    post {
        always {
            publishHTML target: [
                allowMissing: true,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: 'prod',
                reportFiles: 'index.html',
                reportName: 'Demo Deploy'
            ]

            mail(
                subject: "Pipeline ${currentBuild.result}: ${env.JOB_NAME}",
                body: """
                    <h2>Resultado: ${currentBuild.result}</h2>
                    <p><b>URL del Build:</b> <a href="${env.BUILD_URL}">${env.BUILD_URL}</a></p>
                    <p><b>Consola:</b> <a href="${env.BUILD_URL}console">Ver logs</a></p>
                """,
                to: 'daniel.tapasco@ucp.edu.co',
                mimeType: 'text/html'
            )

            cleanWs()
        }
    }
}