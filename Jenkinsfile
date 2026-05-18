pipeline {

    agent any

    environment {
        IMAGE_NAME = "ismailkachanchery/cicd-demo"
    }

    stages {

        stage('Clone Repository') {
            steps {
                git 'https://github.com/ismail1199/cicd-project.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $IMAGE_NAME .'
            }
        }

        stage('Push Docker Image') {
            steps {

                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub',
                    usernameVariable: 'ismailkachanchery',
                    passwordVariable: 'Mims@2310284'
                )]) {

                    sh 'echo $PASSWORD | docker login -u $USERNAME --password-stdin'

                    sh 'docker push $IMAGE_NAME'
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh 'kubectl apply -f k8s/deployment.yaml'
                sh 'kubectl apply -f k8s/service.yaml'
            }
        }
    }
}
