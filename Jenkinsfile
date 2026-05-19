pipeline {

    agent any

    stages {

        stage('Debug Workspace') {
            steps {
                sh '''
                echo "========== DEBUG =========="
                echo "WORKSPACE=$WORKSPACE"
                pwd

                echo ""
                echo "ROOT CONTENTS:"
                ls -la

                echo ""
                echo "BACKEND CONTENTS:"
                ls -la backend

                echo ""
                echo "POM FILE:"
                find . -name pom.xml
                '''
            }
        }

        stage('Build Backend') {
    steps {
        sh 'cd backend && mvn clean package'
    }
    }

        stage('Build Frontend Image') {
            steps {
                sh '''
                docker build -t ismailkachanchery/devops-frontend:latest frontend
                '''
            }
        }

        stage('Build Backend Image') {
            steps {
                sh '''
                docker build -t ismailkachanchery/devops-backend:latest backend
                '''
            }
        }

        stage('Push Images') {
            steps {

                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub',
                        usernameVariable: 'USERNAME',
                        passwordVariable: 'PASSWORD'
                    )
                ]) {

                    sh '''
                    echo $PASSWORD | docker login -u $USERNAME --password-stdin

                    docker push ismailkachanchery/devops-frontend:latest
                    docker push ismailkachanchery/devops-backend:latest
                    '''
                }
            }
        }

        stage('Deploy To Kubernetes') {
            steps {

                sh '''
                kubectl apply -f k8s/
                '''

                sh '''
                kubectl rollout restart deployment/frontend
                '''

                sh '''
                kubectl rollout restart deployment/backend
                '''
            }
        }
    }
}
