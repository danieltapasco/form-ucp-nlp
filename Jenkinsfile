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

    stage('Instalar navegadores Playwright') {
      steps {
        // Opcional: puedes comentar esta línea si no quieres instalar navegadores reales
        // sh 'npx playwright install'
        echo 'Se omite instalación de navegadores para simulación'
      }
    }

    stage('Pruebas en Paralelo (Simuladas)') {
      parallel {
        stage('Pruebas Chrome (Simulado)') {
          steps {
            echo 'Simulando pruebas en Chrome...'
            sh 'sleep 2' // simula duración de pruebas
            echo 'Pruebas Chrome OK'
          }
        }

        stage('Pruebas Firefox (Simulado)') {
          steps {
            echo 'Simulando pruebas en Firefox...'
            sh 'sleep 2' // simula duración de pruebas
            echo 'Pruebas Firefox OK'
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
