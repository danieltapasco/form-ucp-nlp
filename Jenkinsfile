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
                sh 'npx playwright install'  // asegúrate de instalar navegadores en Jenkins
            }
        }

        stage('Tests Unitarios') {
            steps {
                script {
                    try {
                        sh 'npm test -- --watchAll=false --ci --reporters=jest-junit'
                        junit 'junit.xml'
                    } catch (err) {
                        echo "Tests unitarios fallaron: ${err}"
                        currentBuild.result = 'UNSTABLE'
                    }
                }
            }
        }

        stage('E2E en Paralelo') {
            parallel {
                stage('Playwright Chromium') {
                    steps {
                        script {
                            try {
                                sh 'npx playwright test --project=chromium --reporter=junit > junit-chromium.xml'
                                junit 'junit-chromium.xml'
                            } catch (err) {
                                echo "Playwright Chromium falló: ${err}"
                                currentBuild.result = 'UNSTABLE'
                            }
                        }
                    }
                }

                stage('Playwright Firefox') {
                    steps {
                        script {
                            try {
                                sh 'npx playwright test --project=firefox --reporter=junit > junit-firefox.xml'
                                junit 'junit-firefox.xml'
                            } catch (err) {
                                echo "Playwright Firefox falló: ${err}"
                                currentBuild.result = 'UNSTABLE'
                            }
                        }
                    }
                }
            }
        }

        stage('Deploy a Producción (Simulado)') {
            steps {
                script {
                    sh 'mkdir -p prod && cp -r .next/* prod/'
                    echo "Deploy simulado exitoso"
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}
