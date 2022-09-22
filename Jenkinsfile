pipeline {
  agent any

  environment {
    PF_PROFILE = '-Dspring.profiles.active='
    PROFILE = 'production'

    PF_DB_ADDRESS = '-Dcom.ssafy.db.address_and_port='
    DB_ADDRESS = credentials('db.address_and_port')

    PF_DB_PASSWORD = '-Dcom.ssafy.db.password='
    DB_PASSWORD = credentials('db.password')

    PF_JWT_SECRET = '-Dcom.ssafy.jwt.secret='
    JWT_SECRET = credentials('jwt.secret')

    PF_KAKAO_CLIENT_ID = '-Dcom.ssafy.kakao.client_id='
    KAKAO_CLIENT_ID = credentials('kakao.client_id')

    PF_KAKAO_LOGIN_REDIRECT_URI = '-Dcom.ssafy.kakao.redirect_uri='
    KAKAO_LOGIN_REDIRECT_URI = 'https://j7b106.p.ssafy.io/loginresult'

    BACKEND_IMAGE = 'sp7333/backend'
    BACKEND_CONTAINER = 'backend'
    FRONTEND_IMAGE = 'sp7333/frontend'
    FRONTEND_CONTAINER = 'frontend'
  }

  stages {
    stage('mattermost_send_start') {
      steps {
        catchError {
          mattermostSend(message: "Deploying frontend and backend start\nBuild <${RUN_DISPLAY_URL}|#${BUILD_NUMBER}>")
        }
      }
    }

    stage('stop_running_containers') {
      steps {
        catchError {
          sh 'docker stop ${BACKEND_CONTAINER} ${FRONTEND_CONTAINER}'
        }
      }
    }

    stage('remove_container') {
      steps {
        catchError {
          sh 'docker rm ${BACKEND_CONTAINER} ${FRONTEND_CONTAINER}'
        }
      }
    }

    stage('remove_image') {
      steps {
        catchError {
          sh 'docker image rm ${BACKEND_IMAGE} ${FRONTEND_IMAGE}'
        }
      }
    }

    stage('prune_images') {
      steps {
        catchError {
          sh 'docker image prune --force'
        }
      }
    }

    stage('deploy') {
      parallel {
        stage('frontend') {
          stages {
            stage('frontend_docker_image') {
              steps {
                dir('frontend') {
                  sh 'docker build --tag ${FRONTEND_IMAGE} .'
                }
              }
            }

            stage('frontend_docker_container') {
              steps {
                sh 'docker run -d --name ${FRONTEND_CONTAINER} -p 8081:80 ${FRONTEND_IMAGE}'
              }
            }

            stage('mattermost_send_frontend_complete') {
              steps {
                catchError {
                  mattermostSend(message: "Deploying frontend complete\nBuild <${RUN_DISPLAY_URL}|#${BUILD_NUMBER}>")
                }
              }
            }
          }
        }

        stage('backend') {
          stages {
            stage('backend_build') {
              steps {
                dir('backend') {
                  sh './gradlew clean bootJar ${PF_PROFILE}${PROFILE} ${PF_DB_ADDRESS}${DB_ADDRESS} ${PF_DB_PASSWORD}${DB_PASSWORD} ${PF_JWT_SECRET}${JWT_SECRET} ${PF_KAKAO_CLIENT_ID}${KAKAO_CLIENT_ID} ${PF_KAKAO_LOGIN_REDIRECT_URI}${KAKAO_LOGIN_REDIRECT_URI}'
                }
              }
            }

            stage('backend_docker_image') {
              steps {
                dir('backend') {
                  sh 'docker build --build-arg JAR_FILE=build/libs/*.jar --tag ${BACKEND_IMAGE} .'
                }
              }
            }

            stage('backend_docker_container') {
              steps {
                sh 'docker run -d --name ${BACKEND_CONTAINER} -p 8080:8080 ${BACKEND_IMAGE} java ${PF_PROFILE}${PROFILE} ${PF_DB_ADDRESS}${DB_ADDRESS} ${PF_DB_PASSWORD}${DB_PASSWORD} ${PF_JWT_SECRET}${JWT_SECRET} ${PF_KAKAO_CLIENT_ID}${KAKAO_CLIENT_ID} ${PF_KAKAO_LOGIN_REDIRECT_URI}${KAKAO_LOGIN_REDIRECT_URI} -jar app.jar'
              }
            }

            stage('mattermost_send_backend_complete') {
              steps {
                catchError {
                  mattermostSend(message: "Deploying backend complete\nBuild <${RUN_DISPLAY_URL}|#${BUILD_NUMBER}>")
                }
              }
            }
          }
        }
      }
    }
  }
}
