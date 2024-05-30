# Node.js의 공식 이미지 중 하나를 기반 이미지로 사용합니다.
FROM node:latest

# 작업 디렉토리를 설정합니다.
WORKDIR /app

# 애플리케이션의 package.json과 package-lock.json 파일을 컨테이너로 복사합니다.
COPY package*.json ./

# 기존 node_modules를 삭제하고 깨끗한 상태에서 의존성을 설치합니다.
RUN rm -rf node_modules && npm install

# 소스 코드를 컨테이너로 복사합니다.
COPY . .

# 애플리케이션이 바인딩할 포트를 명시합니다.
EXPOSE 3001

# 애플리케이션을 실행합니다.
CMD ["node", "main.js"]
