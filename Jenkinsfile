pipeline {
    agent any

    tools {
        nodejs 'Node_24' // Configurado en Global Tools
    }

    stages {
        // Etapa 1: Checkout del repositorio
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/danieltapasco/form-ucp-nlp.git'
            }
        }

        // Etapa 2: Build del proyecto
        stage('Build') {
            steps {
                sh 'npm install'
                sh 'npm run build'
            }
        }

        // Etapa 3: Pruebas en paralelo
        stage('Pruebas en Paralelo') {
            parallel {
                stage('Pruebas Chrome') {
                    steps {
                        script {
                            try {
                                sh 'npm test -- --browser=chrome --watchAll=false --ci --reporters=jest-junit'
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
                                sh 'npm test -- --browser=firefox --watchAll=false --ci --reporters=jest-junit'
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

        // Etapa 4: Simulación de Deploy
        stage('Deploy a Producción (Simulado)') {
            steps {
                script {
                    // Cambia 'build' por '.next' o 'out' según tu configuración
                    sh 'mkdir -p prod && cp -r .next/* prod/'
                    echo "¡Deploy simulado exitoso! Archivos copiados a /prod"
                }
            }
        }
    }

    post {
        always {
            // Publicar reportes HTML (opcional)
            publishHTML target: [
                allowMissing: true,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: 'prod',
                reportFiles: 'index.html',
                reportName: 'Demo Deploy'
            ]

            // Notificación por email ante fallos
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

            // Limpiar workspace
            cleanWs()
        }
    }
}