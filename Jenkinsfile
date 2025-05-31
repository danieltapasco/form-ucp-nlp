pipeline {
    agent any

    tools {
        nodejs 'Node_24'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/danieltapasco/form-ucp-nlp.git'
            }
        }

        stage('Build') {
            steps {
                sh 'npm install'
                sh 'npm run build'
            }
        }

        stage('Pruebas en Paralelo') {
            parallel {
                stage('Pruebas Chrome') {
                    steps {
                        script {
                            try {
                                sh 'npx playwright test --project=chromium --reporter=junit > junit-chrome.xml'
                                junit 'junit-chrome.xml'
                            } catch (err) {
                                echo "Pruebas en Chrome fallaron: ${err}"
                                currentBuild.result = 'UNSTABLE'
                            }
                        }
                    }
                }

                stage('Pruebas Firefox') {
                    steps {
                        script {
                            try {
                                sh 'npx playwright test --project=firefox --reporter=junit > junit-firefox.xml'
                                junit 'junit-firefox.xml'
                            } catch (err) {
                                echo "Pruebas en Firefox fallaron: ${err}"
                                currentBuild.result = 'UNSTABLE'
                            }
                        }
                    }
                }
            }
        }

        stage('Deploy a Producción (Simulado)') {
            steps {
                sh 'mkdir -p prod && cp -r .next/* prod/'
                echo "¡Deploy simulado exitoso! Archivos copiados a /prod"
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
